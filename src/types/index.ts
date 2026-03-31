export interface MindMapNode {
  id: string;
  text: string;
  children: string[];
  parentId: string | null;
  position: { x: number; y: number };
  collapsed: boolean;
  style?: {
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
  };
}

export interface MindMapState {
  nodes: Map<string, MindMapNode>;
  rootId: string | null;
  selectedNodeId: string | null;
  expandedNodes: Set<string>;
}

export interface MindMapAction {
  type: string;
  payload: any;
  timestamp: number;
}
