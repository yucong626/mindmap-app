import { useEffect } from 'react';
import { useMindMapStore } from '../stores/mindMapStore';

export function useKeyboardShortcuts() {
  const {
    selectedNodeId,
    addNode,
    deleteNode,
    undo,
    redo,
    nodes,
  } = useMindMapStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const node = selectedNodeId ? nodes.get(selectedNodeId) : null;

      // Tab: Add child node
      if (e.key === 'Tab' && selectedNodeId) {
        e.preventDefault();
        const current = nodes.get(selectedNodeId);
        if (current) {
          const childCount = current.children.length;
          addNode(selectedNodeId, {
            x: current.position.x + 200,
            y: current.position.y + (childCount - 1) * 60,
          });
        }
      }

      // Enter: Add sibling node
      if (e.key === 'Enter' && !e.shiftKey && selectedNodeId && node?.parentId) {
        e.preventDefault();
        addNode(node.parentId, {
          x: node.position.x,
          y: node.position.y + 80,
        });
      }

      // Delete: Delete selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        deleteNode(selectedNodeId);
      }

      // Ctrl+Z: Undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }

      // Ctrl+Y: Redo
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }

      // Arrow keys: Navigate between nodes
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        // Simple navigation - could be enhanced
        const allNodes = Array.from(nodes.values());
        const currentIndex = allNodes.findIndex(n => n.id === selectedNodeId);
        if (e.key === 'ArrowUp' && currentIndex > 0) {
          useMindMapStore.getState().selectNode(allNodes[currentIndex - 1].id);
        } else if (e.key === 'ArrowDown' && currentIndex < allNodes.length - 1) {
          useMindMapStore.getState().selectNode(allNodes[currentIndex + 1].id);
        }
      }

      // F2: Edit node
      if (e.key === 'F2' && selectedNodeId) {
        e.preventDefault();
        const input = document.getElementById('node-input') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, nodes, addNode, deleteNode, undo, redo]);
}
