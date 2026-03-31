import { useState, useCallback, useEffect } from 'react';

interface UseCanvasPanProps {
  disabled?: boolean;
}

export function useCanvasPan({ disabled = false }: UseCanvasPanProps = {}) {
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 检查点击的是否是节点或按钮，如果是则不拖动画布
    const target = e.target as HTMLElement;
    if (target.closest('.mindmap-node') || target.closest('button')) {
      return;
    }

    setIsPanning(true);
    setStartPos({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  }, [panOffset]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();

    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    setPanOffset({ x: newX, y: newY });
  }, [isPanning, startPos]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (disabled) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [disabled]);

  return { isPanning, panOffset, handleMouseDown };
}
