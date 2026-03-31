import { useState, useCallback } from 'react';
import { useMindMapStore } from '../stores/mindMapStore';

export function useNodeDrag(nodeId: string) {
  const [isDragging, setIsDragging] = useState(false);
  const { moveNode, nodes } = useMindMapStore();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);

    const node = nodes.get(nodeId);
    if (!node) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...node.position };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      moveNode(nodeId, {
        x: startPos.x + deltaX,
        y: startPos.y + deltaY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [nodeId, moveNode, nodes]);

  return { isDragging, handleMouseDown };
}
