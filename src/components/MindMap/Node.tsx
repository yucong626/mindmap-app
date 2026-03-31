import React, { useRef, useState } from 'react';
import { useMindMapStore } from '../../stores/mindMapStore';
import { useNodeDrag } from '../../hooks/useNodeDrag';
import { Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';

interface NodeProps {
  nodeId: string;
  depth: number;
}

export const Node: React.FC<NodeProps> = ({ nodeId, depth }) => {
  const { nodes, selectedNodeId, selectNode, toggleCollapse, addNode, updateNode } = useMindMapStore();
  const node = nodes.get(nodeId);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isDragging, handleMouseDown: dragHandle } = useNodeDrag(nodeId);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡到画布
    dragHandle(e);
  };

  if (!node) return null;

  const isSelected = selectedNodeId === nodeId;
  const isRoot = depth === 0;
  const hasChildren = node.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(nodeId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(nodeId, { text: e.target.value });
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    const childCount = node.children.length;
    addNode(nodeId, {
      x: node.position.x + 200,
      y: node.position.y + (childCount - 1) * 60,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCollapse(nodeId);
  };

  return (
    <div
      className={`
        mindmap-node absolute
        ${isRoot ? 'root text-lg font-bold px-6 py-3' : ''}
        ${isSelected ? 'selected' : ''}
        ${isDragging ? 'opacity-75 cursor-grabbing' : 'cursor-grab'}
      `}
      style={{
        left: node.position.x,
        top: node.position.y,
        minWidth: isRoot ? 160 : 120,
        fontSize: isRoot ? 16 : 14 - Math.min(depth, 3),
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-between gap-2">
        {hasChildren && (
          <button
            onClick={handleToggleCollapse}
            className="p-0.5 hover:bg-black/10 rounded transition-colors"
          >
            {node.collapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        )}
        <span className="flex-1" />
        {isSelected && !isRoot && (
          <button
            onClick={(e) => {
              handleDelete(e);
            }}
            className="p-0.5 hover:bg-red-100 rounded text-red-500 transition-colors"
            title="删除节点"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="py-1">
        {isEditing ? (
          <input
            id="node-input"
            ref={inputRef}
            type="text"
            value={node.text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="w-full px-2 py-1 border rounded text-center bg-white"
            autoFocus
          />
        ) : (
          <span>{node.text}</span>
        )}
      </div>

      {isSelected && (
        <button
          onClick={handleAddChild}
          className="absolute -right-3 -top-3 p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow"
          title="添加子节点"
        >
          <Plus size={12} />
        </button>
      )}
    </div>
  );
};
