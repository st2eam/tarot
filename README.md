# 🔮 AI Tarot

AI 驱动的在线塔罗牌解读应用，支持多种牌阵与流式 AI 解读。

**在线体验** → [st2eam.github.io/tarot](https://st2eam.github.io/tarot)

![AI Tarot](public/cards/classical/high-priestess.jpg)

---

## 功能特性

- **5 种牌阵**：单张、三张、凯尔特十字、马蹄形、关系牌阵
- **78 张塔罗牌**：22 张大阿卡纳 + 56 张小阿卡纳，含古典风格 AI 插图
- **流式 AI 解读**：接入 OpenAI / Anthropic / DeepSeek，实时逐字输出；5 种解读风格（简洁 / 详细 / 故事 / 毒舌 / 疗愈）自由切换
- **自选牌模式**：支持手动选牌，不限随机抽取
- **导出分享**：一键导出精美解读图片
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

访问应用内的 **设置页面**（右上角齿轮图标），选择 LLM 提供商并填入 API Key：

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
│   ├── api/interpret/     # LLM 代理接口（自托管时使用）
│   ├── card/[id]/         # 塔罗牌详情页
│   ├── settings/          # API Key 设置
│   └── spread/[type]/     # 牌阵解读主页面
├── components/
│   ├── card/              # 卡牌组件（翻转动画、图片、插图）
│   ├── layout/            # 布局、导航、主题
│   └── spread/            # 牌阵交互组件
├── data/
│   ├── spreads.ts         # 5 种牌阵定义
│   └── tarot-cards.ts     # 78 张塔罗牌数据
└── lib/
    ├── deck.ts            # 洗牌 & 抽牌逻辑
    ├── llm-stream.ts      # 客户端 LLM 流式调用
    └── prompts.ts         # AI 解读提示词模板

public/cards/classical/    # 78 张 AI 生成的古典风塔罗图片
scripts/
└── generate-card-images.py  # 火山引擎 Seedream API 图片生成脚本
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
