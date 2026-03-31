# 思维导图应用

一个使用 React + TypeScript + Vite 构建的思维导图工具。

## 功能特性

### 核心功能
- 创建、编辑、删除节点
- 添加子节点和兄弟节点
- 节点折叠/展开
- 拖拽节点移动

### 进阶功能
- 导出为 JSON 文件
- 导出为 PNG 图片
- 从 JSON 导入
- 撤销/重做操作
- 快捷键支持

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Tab` | 添加子节点 |
| `Enter` | 添加兄弟节点 |
| `Delete` / `Backspace` | 删除节点 |
| `F2` | 编辑节点文本 |
| `Ctrl+Z` | 撤销 |
| `Ctrl+Y` | 重做 |
| `↑` / `↓` | 切换选中节点 |

## 技术栈

- **构建工具**: Vite 6
- **UI 框架**: React 19
- **语言**: TypeScript 5.8
- **状态管理**: Zustand 5
- **样式**: TailwindCSS 3
- **图标**: Lucide React
- **图片导出**: html-to-image

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用说明

1. 点击"创建思维导图"按钮开始
2. 双击节点编辑文本
3. 选中节点后点击 `+` 按钮添加子节点
4. 使用快捷键快速操作
5. 点击工具栏按钮导出或导入

## 项目结构

```
src/
├── components/
│   ├── MindMap/
│   │   ├── MindMap.tsx      # 主容器组件
│   │   ├── Node.tsx         # 节点组件
│   │   ├── Connection.tsx   # 连接线组件
│   │   ├── Connections.tsx  # 连接线集合
│   │   ├── Toolbar.tsx      # 工具栏
│   │   └── index.ts
│   └── ui/
├── stores/
│   └── mindMapStore.ts      # Zustand 状态管理
├── hooks/
│   ├── useKeyboardShortcuts.ts  # 快捷键钩子
│   └── useNodeDrag.ts          # 拖拽钩子
├── utils/
├── types/
│   └── index.ts             # TypeScript 类型定义
├── App.tsx
├── main.tsx
└── index.css
```
"# mindmap-app" 
