import { create } from 'zustand';
import { MindMapNode } from '../types';

interface HistoryEntry {
  nodes: Map<string, MindMapNode>;
  rootId: string | null;
}

interface MindMapStore {
  nodes: Map<string, MindMapNode>;
  rootId: string | null;
  selectedNodeId: string | null;
  backgroundColor: string;
  history: HistoryEntry[];
  historyIndex: number;

  // Actions
  setRoot: (node: MindMapNode) => void;
  addNode: (parentId: string, position?: { x: number; y: number }) => string;
  updateNode: (id: string, updates: Partial<MindMapNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  toggleCollapse: (id: string) => void;
  moveNode: (id: string, position: { x: number; y: number }) => void;
  setBackgroundColor: (color: string) => void;

  // History
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Export
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
}

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function cloneNodes(nodes: Map<string, MindMapNode>): Map<string, MindMapNode> {
  return new Map(nodes);
}

function saveToHistory(
  nodes: Map<string, MindMapNode>,
  rootId: string | null,
  history: HistoryEntry[],
  historyIndex: number
): [HistoryEntry[], number] {
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push({ nodes: cloneNodes(nodes), rootId });
  return [newHistory, newHistory.length - 1];
}

export const useMindMapStore = create<MindMapStore>((set, get) => ({
  nodes: new Map(),
  rootId: null,
  selectedNodeId: null,
  backgroundColor: '#f3f4f6',
  history: [],
  historyIndex: -1,

  setRoot: (node: MindMapNode) => {
    const newNodes = new Map(get().nodes);
    newNodes.set(node.id, node);
    const [newHistory, newIndex] = saveToHistory(newNodes, node.id, get().history, get().historyIndex);
    set({ nodes: newNodes, rootId: node.id, history: newHistory, historyIndex: newIndex });
  },

  addNode: (parentId: string, position) => {
    const { nodes, history, historyIndex } = get();
    const newNode: MindMapNode = {
      id: generateId(),
      text: '新节点',
      children: [],
      parentId,
      position: position || { x: 0, y: 0 },
      collapsed: false,
    };

    const newNodes = cloneNodes(nodes);
    newNodes.set(newNode.id, newNode);

    const parent = newNodes.get(parentId);
    if (parent) {
      // 创建新的 children 数组，避免修改原数组
      parent.children = [...parent.children, newNode.id];
    }

    const [newHistory, newIndex] = saveToHistory(newNodes, get().rootId, history, historyIndex);
    set({ nodes: newNodes, history: newHistory, historyIndex: newIndex, selectedNodeId: newNode.id });

    return newNode.id;
  },

  updateNode: (id: string, updates: Partial<MindMapNode>) => {
    const { nodes, history, historyIndex } = get();
    const node = nodes.get(id);
    if (!node) return;

    const newNodes = cloneNodes(nodes);
    newNodes.set(id, { ...node, ...updates });

    const [newHistory, newIndex] = saveToHistory(newNodes, get().rootId, history, historyIndex);
    set({ nodes: newNodes, history: newHistory, historyIndex: newIndex });
  },

  deleteNode: (id: string) => {
    const { nodes, rootId, history, historyIndex } = get();
    const node = nodes.get(id);
    if (!node || id === rootId) return; // Cannot delete root

    const newNodes = cloneNodes(nodes);

    // Recursively delete node and children
    const deleteRecursive = (nodeId: string) => {
      const n = newNodes.get(nodeId);
      if (n) {
        n.children.forEach(deleteRecursive);
        newNodes.delete(nodeId);
      }
    };

    deleteRecursive(id);

    // Remove from parent
    const parent = node.parentId ? newNodes.get(node.parentId) : null;
    if (parent) {
      parent.children = parent.children.filter(childId => childId !== id);
    }

    const [newHistory, newIndex] = saveToHistory(newNodes, rootId, history, historyIndex);
    set({ nodes: newNodes, history: newHistory, historyIndex: newIndex, selectedNodeId: null });
  },

  selectNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  toggleCollapse: (id: string) => {
    const { nodes, history, historyIndex } = get();
    const node = nodes.get(id);
    if (!node) return;

    const newNodes = cloneNodes(nodes);
    newNodes.set(id, { ...node, collapsed: !node.collapsed });

    const [newHistory, newIndex] = saveToHistory(newNodes, get().rootId, history, historyIndex);
    set({ nodes: newNodes, history: newHistory, historyIndex: newIndex });
  },

  moveNode: (id: string, position: { x: number; y: number }) => {
    const { nodes, history, historyIndex } = get();
    const node = nodes.get(id);
    if (!node) return;

    const newNodes = cloneNodes(nodes);
    newNodes.set(id, { ...node, position });

    const [newHistory, newIndex] = saveToHistory(newNodes, get().rootId, history, historyIndex);
    set({ nodes: newNodes, history: newHistory, historyIndex: newIndex });
  },

  setBackgroundColor: (color: string) => {
    set({ backgroundColor: color });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return false;

    const prevState = history[historyIndex - 1];
    set({
      nodes: cloneNodes(prevState.nodes),
      rootId: prevState.rootId,
      historyIndex: historyIndex - 1,
    });
    return true;
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return false;

    const nextState = history[historyIndex + 1];
    set({
      nodes: cloneNodes(nextState.nodes),
      rootId: nextState.rootId,
      historyIndex: historyIndex + 1,
    });
    return true;
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  exportToJSON: () => {
    const { nodes, rootId } = get();
    const nodeArray = Array.from(nodes.entries()).map(([, value]) => value);
    return JSON.stringify({ rootId, nodes: nodeArray }, null, 2);
  },

  importFromJSON: (json: string) => {
    try {
      const data = JSON.parse(json);
      const newNodes = new Map<string, MindMapNode>(
        data.nodes.map((n: any) => [n.id, n])
      );
      const [newHistory, newIndex] = saveToHistory(newNodes, data.rootId, get().history, get().historyIndex);
      set({ nodes: newNodes, rootId: data.rootId, history: newHistory, historyIndex: newIndex });
    } catch (e) {
      console.error('Failed to import JSON:', e);
    }
  },
}));
