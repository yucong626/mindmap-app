import React from 'react';
import { useMindMapStore } from '../../stores/mindMapStore';
import { Connection } from './Connection';

export const Connections: React.FC = () => {
  const { nodes, rootId } = useMindMapStore();

  const connections: React.ReactNode[] = [];

  const collectConnections = (nodeId: string) => {
    const node = nodes.get(nodeId);
    if (!node || node.collapsed) return;

    node.children.forEach((childId) => {
      const childNode = nodes.get(childId);
      if (childNode) {
        connections.push(
          <Connection key={`${nodeId}-${childId}`} fromNodeId={nodeId} toNodeId={childId} />
        );
        collectConnections(childId);
      }
    });
  };

  if (rootId) {
    collectConnections(rootId);
  }

  return <>{connections}</>;
};
