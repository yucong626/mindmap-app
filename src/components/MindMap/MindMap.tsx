import React from 'react';
import { useMindMapStore } from '../../stores/mindMapStore';
import { Connections } from './Connections';
import { Node } from './Node';
import { useCanvasPan } from '../../hooks/useCanvasPan';

export const MindMap: React.FC = () => {
  const { rootId, nodes, backgroundColor } = useMindMapStore();
  const { isPanning, panOffset, handleMouseDown } = useCanvasPan({ disabled: !rootId });

  // Recursively render nodes
  const renderNodes = (nodeId: string, depth: number): React.ReactNode[] => {
    const node = nodes.get(nodeId);
    if (!node) return [];

    const elements: React.ReactNode[] = [
      <Node key={nodeId} nodeId={nodeId} depth={depth} />,
    ];

    // Render children
    if (!node.collapsed) {
      node.children.forEach((childId) => {
        const childNode = nodes.get(childId);
        if (childNode) {
          elements.push(...renderNodes(childId, depth + 1));
        }
      });
    }

    return elements;
  };

  if (!rootId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">创建新的思维导图</h2>
          <p className="text-gray-500">点击下面的按钮开始</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      style={{ backgroundColor }}
    >
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: '0 0',
        }}
        className="absolute inset-0"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <Connections />
        </svg>
        {renderNodes(rootId, 0)}
      </div>
    </div>
  );
};
