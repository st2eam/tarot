# 🔮 AI Tarot

AI 驱动的在线塔罗牌解读应用，支持多种牌阵与流式 AI 解读。

**在线体验** → [st2eam.github.io/tarot](https://st2eam.github.io/tarot)

![AI Tarot](public/cards/classical/high-priestess.jpg)

---

## 功能特性

- **4 种牌阵**：单张、三张、凯尔特十字、关系牌阵
- **78 张塔罗牌**：22 张大阿卡纳 + 56 张小阿卡纳，含 AI 插画
- **逐张翻牌**：抽牌后逐张点击翻开，仪式感更强
- **问题引导**：抽牌前可输入问题，让 AI 解读更有针对性
- **流式 AI 解读**：接入 OpenAI / Anthropic / DeepSeek，实时逐字输出；5 种解读风格（简洁 / 详细 / 故事 / 毒舌 / 疗愈）自由切换
- **追问功能**：解读完成后可追问感情、事业等不同角度
- **自选牌模式**：支持手动选牌，不限随机抽取
- **8 套视觉主题**：古典插画 / 新艺术运动 / 水彩插画 / 暗黑奇幻 / 极简主义 / 日式浮世绘 / 赛博朋克 / 油画写实
- **牌库浏览**：78 张牌网格展示，支持搜索和按花色筛选
- **解读历史**：最近 20 次解读记录随时回顾
- **导出分享**：预览后一键导出精美解读 PNG / PDF
- **浮动对话**：右下角 AI 对话助手，随时提问塔罗相关问题
- **完全私密**：API Key 存储在本地浏览器，不经任何服务器

---

## 快速开始

### 前置条件

- Node.js >= 20.9（推荐使用 `nvm use v22`）
- 任意 LLM 服务的 API Key（OpenAI / Anthropic / DeepSeek 三选一）

### 本地运行

```bash
git clone https://github.com/st2eam/tarot.git
cd tarot
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

### 配置 API Key

访问应用内的 **设置页面**，选择 LLM 提供商并填入 API Key：

| 提供商 | 获取 Key | 推荐模型 |
|--------|----------|----------|
| OpenAI | [platform.openai.com](https://platform.openai.com/api-keys) | `gpt-4o-mini` |
| Anthropic | [console.anthropic.com](https://console.anthropic.com/) | `claude-sonnet-4-6` |
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com/) | `deepseek-v4-pro` |

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16 App Router + TypeScript |
| 样式 | Tailwind CSS v4 |
| 动画 | Framer Motion |
| 状态 | Zustand（localStorage 持久化） |
| AI | 流式 SSE，直接对接 OpenAI / Anthropic / DeepSeek |

---

## 项目结构

```
src/
├── app/
│   ├── api/interpret/        # LLM 代理接口（自托管时使用）
│   ├── card/[id]/            # 塔罗牌详情页（前后导航）
│   ├── cards/                # 牌库浏览页（搜索+筛选）
│   ├── history/              # 解读历史页
│   ├── settings/             # API Key 设置
│   └── spread/[type]/        # 牌阵解读主页面
├── components/
│   ├── card/                 # 卡牌组件（翻转动画、图片、详情弹窗）
│   ├── chat/                 # 对话面板（浮动FAB+滑出面板）
│   ├── home/                 # 首页（每日牌、牌阵选择、月相）
│   ├── layout/               # 布局、导航、主题、Toast、Canvas背景
│   └── spread/               # 牌阵交互（抽牌、选牌、导出）
├── data/
│   ├── spreads.ts            # 4 种牌阵定义
│   └── tarot-cards.ts        # 78 张塔罗牌数据
├── lib/
│   ├── card-images.ts        # 卡牌图片路径（多风格+降级）
│   ├── chat-prompts.ts       # 对话系统提示词
│   ├── deck.ts               # 洗牌 & 抽牌逻辑
│   ├── llm-providers.ts      # LLM 提供商统一配置
│   ├── llm-stream.ts         # 客户端 LLM 流式调用
│   ├── markdown.tsx          # Markdown 渲染器
│   ├── moon.ts               # 月相计算
│   ├── prompts.ts            # AI 解读提示词模板（5 风格）
│   ├── reading-context.ts    # 解读历史上下文
│   ├── sounds.ts             # Web Audio 轻量音效
│   └── themes.ts             # 8 套视觉主题定义
├── store/
│   ├── useTarotStore.ts      # 主状态（牌阵、卡牌、设置）
│   └── useChatStore.ts       # 对话状态
└── types/
    └── index.ts              # TypeScript 类型定义

public/cards/classical/       # 78 张 AI 生成的古典风塔罗图片
scripts/
└── generate-card-images.py   # 火山引擎 Seedream API 图片生成脚本
```

---

## 生成塔罗牌图片

项目使用[火山引擎 Seedream 5.0](https://www.volcengine.com/product/imagex) 生成塔罗牌插图：

```bash
# 安装依赖
pip install volcengine-python-sdk[ark] rich

# 生成指定牌
ARK_API_KEY=your_key python scripts/generate-card-images.py \
  --style classical \
  --cards fool,magician,high-priestess

# 生成所有大阿卡纳
ARK_API_KEY=your_key python scripts/generate-card-images.py \
  --style classical \
  --cards major

# 查看所有风格
python scripts/generate-card-images.py --list-styles
```

---

## 部署

### GitHub Pages（静态站点）

推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

### Vercel（推荐，支持完整功能）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/st2eam/tarot)

---

## License

MIT
