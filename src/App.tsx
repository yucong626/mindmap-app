import { Toolbar, MindMap } from './components/MindMap';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useMindMapStore } from './stores/mindMapStore';

function App() {
  useKeyboardShortcuts();
  const { rootId } = useMindMapStore();

  return (
    <div id="mindmap-canvas" className="w-full h-full relative overflow-hidden">
      <Toolbar />
      <MindMap />

      {rootId && (
        <div className="absolute bottom-4 right-4 z-10 bg-white/80 px-3 py-2 rounded-lg text-xs text-gray-500 shadow">
          <div><kbd className="px-1 bg-gray-100 rounded">Tab</kbd> 添加子节点</div>
          <div><kbd className="px-1 bg-gray-100 rounded">Enter</kbd> 添加兄弟节点</div>
          <div><kbd className="px-1 bg-gray-100 rounded">Del</kbd> 删除节点</div>
          <div><kbd className="px-1 bg-gray-100 rounded">F2</kbd> 编辑节点</div>
          <div><kbd className="px-1 bg-gray-100 rounded">Ctrl+Z</kbd> 撤销</div>
          <div><kbd className="px-1 bg-gray-100 rounded">Ctrl+Y</kbd> 重做</div>
        </div>
      )}
    </div>
  );
}

export default App;
