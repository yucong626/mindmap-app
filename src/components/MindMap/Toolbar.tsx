import React, { useRef, useState } from 'react';
import { useMindMapStore } from '../../stores/mindMapStore';
import { Plus, Undo, Redo, ImageDown, FileInput, FileOutput, Palette } from 'lucide-react';
import { toPng } from 'html-to-image';

const PRESET_COLORS = [
  { name: '浅灰', value: '#f3f4f6' },
  { name: '米白', value: '#fef7ed' },
  { name: '淡蓝', value: '#eff6ff' },
  { name: '淡绿', value: '#f0fdf4' },
  { name: '淡紫', value: '#faf5ff' },
  { name: '深色', value: '#1f2937' },
  { name: '粉红', value: '#fdf2f8' },
  { name: '天蓝', value: '#e0f2fe' },
];

export const Toolbar: React.FC = () => {
  const { rootId, setRoot, undo, redo, canUndo, canRedo, exportToJSON, importFromJSON, setBackgroundColor } = useMindMapStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleCreateRoot = () => {
    if (rootId) {
      // 已有思维导图时，先确认是否要覆盖
      if (!confirm('确定要新建思维导图吗？当前的内容将会丢失！')) {
        return;
      }
    }
    const root = {
      id: `root_${Date.now()}`,
      text: '中心主题',
      children: [],
      parentId: null,
      position: { x: 400, y: 300 },
      collapsed: false,
    };
    setRoot(root);
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const handleExportJSON = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = async () => {
    try {
      const element = document.getElementById('mindmap-canvas');
      if (!element) return;

      const dataUrl = await toPng(element, {
        backgroundColor: '#f9fafb',
        quality: 1.0,
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `mindmap-${Date.now()}.png`;
      a.click();
    } catch (error) {
      console.error('导出 PNG 失败:', error);
      alert('导出 PNG 失败，请重试');
    }
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      importFromJSON(json);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!rootId) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
        <button
          onClick={handleCreateRoot}
          className="toolbar-btn bg-blue-500 text-white hover:bg-blue-600"
        >
          <Plus size={18} />
          创建思维导图
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white px-3 py-2 rounded-lg shadow-lg">
      <button onClick={handleUndo} disabled={!canUndo()} className="toolbar-btn" title="撤销 (Ctrl+Z)">
        <Undo size={18} />
      </button>
      <button onClick={handleRedo} disabled={!canRedo()} className="toolbar-btn" title="重做 (Ctrl+Y)">
        <Redo size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button onClick={handleExportJSON} className="toolbar-btn" title="导出 JSON">
        <FileOutput size={18} />
      </button>
      <button onClick={handleExportPNG} className="toolbar-btn" title="导出 PNG">
        <ImageDown size={18} />
      </button>
      <button onClick={handleImportJSON} className="toolbar-btn" title="导入 JSON">
        <FileInput size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <div className="relative">
        <button onClick={() => setShowColorPicker(!showColorPicker)} className="toolbar-btn" title="背景颜色">
          <Palette size={18} />
        </button>
        {showColorPicker && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '8px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
              padding: '12px',
              zIndex: 50,
              minWidth: '200px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setBackgroundColor(color.value);
                    setShowColorPicker(false);
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    backgroundColor: color.value,
                    cursor: 'pointer',
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button onClick={handleCreateRoot} className="toolbar-btn text-red-500 hover:bg-red-50" title="新建">
        <Plus size={18} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
