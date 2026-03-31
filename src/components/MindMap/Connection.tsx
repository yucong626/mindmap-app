import React, { useMemo } from 'react';
import { useMindMapStore } from '../../stores/mindMapStore';

interface ConnectionProps {
  fromNodeId: string;
  toNodeId: string;
}

export const Connection: React.FC<ConnectionProps> = ({ fromNodeId, toNodeId }) => {
  const nodes = useMindMapStore((state) => state.nodes);

  const fromNode = nodes.get(fromNodeId);
  const toNode = nodes.get(toNodeId);

  const path = useMemo(() => {
    if (!fromNode || !toNode) return '';

    // Calculate start and end points (from right side of parent to left side of child)
    const nodeWidth = 140;
    const nodeHeight = 50;
    const startX = fromNode.position.x + nodeWidth;
    const startY = fromNode.position.y + nodeHeight / 2;
    const endX = toNode.position.x;
    const endY = toNode.position.y + nodeHeight / 2;

    // Create bezier curve
    const controlPoint1X = startX + (endX - startX) / 2;
    const controlPoint1Y = startY;
    const controlPoint2X = endX - (endX - startX) / 2;
    const controlPoint2Y = endY;

    return `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;
  }, [fromNode?.position.x, fromNode?.position.y, toNode?.position.x, toNode?.position.y]);

  if (!path) return null;

  return <path d={path} className="connection-line" />;
};
