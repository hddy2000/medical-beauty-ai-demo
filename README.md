# Medical Beauty AI Analysis Demo

医美视频AI分析演示系统（纯Vercel + MongoDB部署）

## 功能特点

- ✅ 视频分析（使用外部URL，如Pexels）
- ✅ Kimi AI 智能分析
- ✅ MongoDB 数据存储
- ✅ 风险等级评估
- ✅ 医生复核界面

## 部署到 Vercel

### 1. 环境变量

复制 `.env.local.example` 为 `.env.local`，填入：

```bash
KIMI_API_KEY=your_kimi_api_key_here
MONGODB_URI=your_mongodb_uri_here
```

### 2. 一键部署

```bash
npm install
npm run dev
```

### 3. 生产部署

```bash
vercel --prod
```

## 示例视频

默认使用 Pexels 免费视频：
- URL: https://videos.pexels.com/video-files/10677463/10677463-hd_1920_1080_30fps.mp4

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- MongoDB (Mongoose)
- Kimi API (Moonshot)
- Vercel Serverless

## 目录结构

```
app/
  ├── page.tsx          # 首页（视频输入）
  ├── reports/page.tsx  # 报告列表
  └── api/              # API路由
      ├── analyze/      # AI分析
      └── reports/      # 报告CRUD
lib/
  ├── mongodb.ts        # 数据库连接
  ├── kimi.ts           # Kimi API
  └── models/           # 数据模型
```
