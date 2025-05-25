# 校园AI知识助手

campus-ai-qa-system

基于阿里云Dashscope API开发的智能问答系统，用于回答关于江西财经大学的各类问题。

## 项目结构

项目采用Monorepo结构，包含以下几个子包：

- `packages/common`: 前后端共用的类型定义和接口
- `packages/server`: 基于NestJS的后端服务
- `packages/client`: 基于React的前端应用

## 功能特点

- 💬 智能问答：回答关于江西财经大学的问题，包括学校概况、院系设置、专业信息等
- 🌊 流式响应：支持流式生成回答，实时展示生成过程
- 🧠 本地知识库：内置江西财经大学相关信息的知识库
- 🔌 MCP扩展：支持Model Context Protocol扩展能力，可扩展更多功能
- 💻 用户友好界面：清晰直观的对话界面，支持Markdown渲染

## 技术栈

### 后端
- NestJS框架
- 阿里云Dashscope API
- TypeScript
- RxJS (用于流式响应)

### 前端
- React
- TypeScript
- Ant Design组件库
- Axios
- EventSource API (用于流式响应)

## 快速开始

### 环境要求
- Node.js 20.x 或更高版本
- pnpm 8.x 或更高版本

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

在项目根目录创建 `.env` 文件，配置以下环境变量：

```
DASHSCOPE_API_KEY=your_dashscope_api_key
DASHSCOPE_MODEL=qwen-plus
```

### 启动开发服务器

1. 启动后端服务：

```bash
cd packages/server
pnpm run start:dev
```

2. 在另一个终端启动前端应用：

```bash
cd packages/client
pnpm run dev
```

3. 访问前端应用：http://localhost:5173

## API接口说明

### 问答接口

**POST /qa/question**

请求参数：
```json
{
  "question": "江西财经大学有哪些特色专业？",
  "history": [], // 可选，对话历史
  "stream": false // 可选，是否使用流式响应
}
```

标准响应：
```json
{
  "answer": "江西财经大学拥有6个国家级特色专业：金融学、市场营销、会计学、信息管理与信息系统、财政学、法学。同时还有10个省级特色专业，13个省级一流专业。",
  "sources": [
    {
      "title": "特色专业",
      "content": "..."
    }
  ]
}
```

流式响应使用Server-Sent Events (SSE)协议。

## MCP扩展能力

系统支持以下MCP扩展：

1. web-search：允许AI助手搜索互联网获取最新信息
2. file-processor：允许AI助手处理用户上传的文件
3. campus-navigator：提供校园地图导航功能

## 项目配置

- 默认后端端口：3000
- 默认前端端口：5173
- 默认AI模型：qwen-plus

## 开发注意事项

- 使用流式响应时，确保前端正确处理EventSource连接
- 开发新的MCP扩展时，需要在McpService中注册
- 扩展知识库时，可以修改KnowledgeService中的initializeKnowledgeBase方法

## 联系方式

如有问题，请联系项目维护者。
