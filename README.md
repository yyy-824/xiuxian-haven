# 🏔 修仙洞天

> 一款文字类修仙题材养成游戏，灵感来自《辐射避难所》

![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-5.0-433E38?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-06B6D4?style=flat-square&logo=tailwindcss)

---

## 📖 游戏简介

你是一位初入仙途的修士，在青云山巅发现了一处废弃的洞府遗址。从三名弟子、一座破败的修炼室开始，你将重建这座洞府，招募弟子，探索未知的修仙界，最终成为一方霸主。

游戏融合了**基地建设**、**人物养成**、**探索冒险**、**炼丹锻造**等多种玩法，配合完整的主线剧情和水墨风格 UI，带来沉浸式的修仙体验。

## ✨ 核心玩法

### 🏛 洞府建设
- **12 种建筑**：修炼室、丹房、炼器房、聚灵阵、藏经阁、灵田、灵矿、会客厅、寝殿、练功场、秘境入口、护山大阵
- 建造与升级，分配弟子提升产出效率
- 洞府整体升级（最高 10 级），提升灵气浓度和护山强度

### ⚔ 弟子养成
- **随机生成**：姓名、性别、灵根（金木水火土）、特质、属性全部随机
- **境界体系**：练气 → 筑基 → 金丹 → 元婴 → 化神 → 渡劫 → 大乘 → 真仙
- **属性系统**：悟性、魅力、气运、心志、感知，影响修炼/战斗/探索
- **互动系统**：传功（修为转移）、切磋（双方获经验）

### 🗺 探索冒险
- **5 种任务类型**：探索、讨伐、采集、历练、秘境
- **动态难度**：随游戏时间和洞府等级递进
- **随机事件**：8 种探索事件，属性检定 + 选择分支
- **战斗系统**：回合制自动战斗，HP 消耗，战斗日志
- **法器掉落**：探索中概率获得法器

### 🔥 炼丹锻造
- **6 种丹药配方**：回春丹、聚气丹、凝神丹、运灵丹、破境丹、九转还魂丹
- **8 种法器配方**：从凡品到仙品，材料各异
- 弟子悟性/感知影响成功率，建筑等级提供加成

### 🚪 访客系统
- 会客厅有弟子时，随机访客到访
- **5 种访客**：游方商人、落魄修士、云游仙人、挑战者、丹药贩子
- 可交易、招募、获赠，或选择婉拒

### 📜 主线剧情
- **5 章 15 个任务**，完整叙事文本
- 从破土而出到金丹大道，体验一段修仙传奇
- 手动领取奖励，进度实时追踪

### 🏆 成就系统
- 8 个成就自动解锁
- 涵盖招募、建造、探索、炼丹、锻造等里程碑

## 🎨 界面特色

- **水墨风格**：深色主题 + 金色点缀 + 卷轴纹理
- **流畅动画**：Framer Motion 驱动的过渡效果
- **响应式设计**：适配桌面和移动端
- **消息日志**：三态切换（收起/展开/隐藏），不遮挡游戏内容
- **自动存档**：localStorage 持久化，30 秒自动保存

## 🛠 技术栈

| 层面 | 技术 | 版本 |
|------|------|------|
| 构建工具 | Vite | 8.0 |
| 框架 | React | 19.2 |
| 语言 | TypeScript | 6.0 |
| 状态管理 | Zustand (persist) | 5.0 |
| 样式 | TailwindCSS | 4.3 |
| 动画 | Framer Motion | 12.x |
| 持久化 | localStorage | — |

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/yyy-824/xiuxian-haven.git
cd xiuxian-haven

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可开始游戏。

### 构建部署

```bash
# 类型检查 + 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
xiuxian-haven/
├── src/
│   ├── data/
│   │   ├── types.ts          # 全部游戏类型定义
│   │   └── constants.ts      # 游戏常量、模板、配方、剧情
│   ├── store/
│   │   └── gameStore.ts      # Zustand 全局状态 + 游戏主循环
│   ├── components/
│   │   ├── GameLayout.tsx     # 主布局（标签切换 + 动画）
│   │   ├── TopBar.tsx         # 顶部状态栏
│   │   ├── MessageLog.tsx     # 消息日志（三态切换）
│   │   ├── EventModal.tsx     # 探索事件弹窗
│   │   ├── VisitorModal.tsx   # 访客弹窗
│   │   └── panels/
│   │       ├── HavenPanel.tsx      # 洞府面板（建筑 + 炼丹锻造）
│   │       ├── DisciplesPanel.tsx  # 弟子面板（列表 + 详情 + 互动）
│   │       ├── ExplorePanel.tsx    # 探索面板（任务 + 动态难度）
│   │       └── MainQuestPanel.tsx  # 主线剧情面板
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css             # TailwindCSS 主题 + 动画
├── public/
├── package.json
└── vite.config.ts
```

## 🎮 操作指南

| 操作 | 说明 |
|------|------|
| 建造建筑 | 洞府面板 → 点击「+ 建造」 |
| 分配弟子 | 洞府面板 → 点击建筑展开 → 点击「+ 分配」 |
| 招募弟子 | 弟子面板 → 点击「+ 招募」(💎100) |
| 装备法器 | 弟子面板 → 点击弟子 → 法器装备 |
| 炼丹 | 洞府面板 → 点击丹房展开 → 选择配方 → 开始炼丹 |
| 锻造 | 洞府面板 → 点击炼器房展开 → 选择配方 → 开始锻造 |
| 派遣探索 | 探索面板 → 选择任务 → 选择弟子 → 出发 |
| 升级洞府 | 洞府面板 → 点击「⬆ 升级洞府」 |
| 传功/切磋 | 弟子面板 → 点击弟子 → 弟子互动 |

## 📋 开发命令

```bash
npm run dev          # 启动开发服务器 (localhost:5173)
npm run build        # TypeScript 检查 + Vite 生产构建
npm run lint         # ESLint 代码检查
npm run preview      # 预览生产构建
```

## 📄 许可证

MIT License

---

<div align="center">

**[开始游戏](http://localhost:5173)** · **[报告问题](https://github.com/yyy-824/xiuxian-haven/issues)**

</div>
