// ==================== 真实小红书笔记数据 ====================
// 封面图片存放在 public/covers/ 目录下，确保每次刷新标题与封面对应

export const FEED_DATA = [
  {
    id: 1,
    title: 'Figma（最新版）简易教学，轻松学会Figma',
    content: `回应大家的留言和私信，带来了Figma最新版简易教学，字有点多，请耐心看完哦，希望能给你们带来一些帮助。

教学分为上、中、下三期，帮助大家快速入门，敬请期待🥰🥰🥰

📌 上期内容预告：基础功能
- Frame 和 Group 的区别
- Auto Layout 的基本用法
- 组件（Component）的创建和使用
- 文字样式和颜色样式的管理
- 快捷键大全（提升效率必备）

📌 中期内容预告：进阶技巧
- Auto Layout 嵌套和响应式设计
- 变体（Variants）的高级用法
- 设计系统的搭建思路
- 插件推荐（提升10倍效率）

📌 下期内容预告：实战项目
- 从0到1设计一个完整的App界面
- 设计交付和开发协作
- Figma 的团队协作功能

#设计教程 #UI界面设计 #设计技巧 #设计软件 #UI设计师 #交互 #网页设计 #交互设计 #APP设计`,
    author: 'BOOMB设计',
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' rx='20' fill='%23FF6B6B'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dy='.35em' font-size='16' font-weight='bold' fill='white' font-family='sans-serif'%3EB%3C/text%3E%3C/svg%3E",
    likes: '2.3w',
    collects: 8901,
    comments: 432,
    image: './covers/1-figma.jpg',
    height: 280,
    isLearning: true,
    tags: ['设计教程', 'UI界面设计', '设计技巧', '设计软件', 'UI设计师', '交互', '网页设计', '交互设计', 'APP设计'],
    publishTime: '3天前',
    location: '深圳',
  },
  {
    id: 2,
    title: '原创 | 如何去除设计"AI味"小技巧',
    content: `在研究很多AI 生成的界面，我发现第一眼看起来很完整，但总会有一种"不够高级"的感觉。

其实问题通常出在这些细节上：
很多 AI 设计喜欢乱加阴影，导致画面显得脏、乱、不干净；
Button 和卡片又经常加很多描边，让界面信息变得很重；
还有一个很明显的问题，就是圆角不统一，不同模块的圆角大小不一致，整体看起来就会不协调。

所以想让 AI UI 更像真实产品设计，核心不是继续加效果，而是减少装饰、统一规则、让界面更克制。
越干净，越高级。

🎯 去除"AI味"的核心原则：

1️⃣ 减少阴影
- 不是所有元素都需要阴影
- 如果要加，用非常浅的 shadow（opacity < 5%）
- 避免多层阴影叠加

2️⃣ 统一圆角
- 整个项目定义 2-3 个圆角值
- 外层大圆角，内层小圆角，保持内外间距一致
- 嵌套圆角公式：内圆角 = 外圆角 - padding

3️⃣ 克制用色
- 主色不超过 2 个
- 中性色用好灰度层级（#333/#666/#999/#ccc）
- 避免高饱和度渐变

4️⃣ 留白呼吸感
- 元素之间给足间距
- 不要填满每一寸空间
- 信息密度适中，让视觉有休息的地方

#ui设计 #ux设计 #app设计 #设计技巧 #UI界面设计 #设计干货 #宝藏app #设计有巧思 #flowfit #设计理念`,
    author: 'YANG',
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' rx='20' fill='%234ECDC4'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dy='.35em' font-size='16' font-weight='bold' fill='white' font-family='sans-serif'%3EY%3C/text%3E%3C/svg%3E",
    likes: '1.8w',
    collects: 6540,
    comments: 312,
    image: './covers/2-ai-design.png',
    height: 320,
    isLearning: true,
    tags: ['ui设计', 'ux设计', 'app设计', '设计技巧', 'UI界面设计', '设计干货', '设计理念'],
    publishTime: '2天前',
    location: '上海',
  },
  {
    id: 3,
    title: '抽象谐音梗猜明星',
    content: `这一期谐音梗猜经典港星男星👀

来看看你能猜对几个？评论区见答案！

提示：都是经典港星哦～
第一题已经给你们示范了："这是粥" → "这是____（明星）"

难度指数：⭐⭐⭐
趣味指数：⭐⭐⭐⭐⭐

规则很简单：
看图片里的谐音提示，猜出对应的港星名字
越往后越难哦！

#谐音梗 #冷笑话 #脑筋急转弯 #古希腊掌管抽象的神 #一起来玩梗 #脑洞大开 #你画我猜 #港星`,
    author: '画点冷笑画',
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' rx='20' fill='%23FFB347'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dy='.35em' font-size='14' font-weight='bold' fill='white' font-family='sans-serif'%3E画%3C/text%3E%3C/svg%3E",
    likes: '5.6w',
    collects: 2341,
    comments: 8923,
    image: './covers/3-xieyinmeng.jpg',
    height: 280,
    isLearning: false,
    tags: ['谐音梗', '冷笑话', '脑筋急转弯', '古希腊掌管抽象的神', '一起来玩梗', '脑洞大开', '你画我猜', '港星'],
    publishTime: '1天前',
    location: '广州',
  },
  {
    id: 4,
    title: 'vibe coding 第一步，先换个 mac pro',
    content: `用了 7 年半的 air 退休，换了 pro M5， 24G+1T 的配置，和 gemini 聊的结果，本来想换新款 air，gemini 说 vibe coding 得上这个配置，我信🌚。

air 留着当生活机刷视频看网页完全没问题，pro 就来当生产力工具啦(๑¯◡¯๑)

📦 配置对比：
旧机：MacBook Air 2018
- Intel i5 / 8GB / 256GB
- 用了7年半，电池循环1200+
- 日常卡顿严重，Figma开3个文件就风扇狂转

新机：MacBook Pro M5
- M5 芯片 / 24GB / 1TB
- 续航预计20h+
- 跑本地模型、vibe coding 无压力

💡 为什么选 Pro 不选 Air：
1. vibe coding 需要跑本地 LLM（Ollama + CodeLlama）
2. 24GB 内存是跑 7B 模型的最低门槛
3. 多开 VS Code + Docker + 浏览器不卡
4. 散热好，长时间高负载不降频

🤔 购买建议：
- 如果只是日常办公 + 轻度开发 → Air 足够
- 如果要跑本地模型 / 视频剪辑 / vibe coding → 上 Pro
- 内存一定要选 24G 起步，16G 2026年真的不够用了

#macbook #笔记本电脑推荐 #先进生产力`,
    author: '码农日常',
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' rx='20' fill='%239B59B6'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dy='.35em' font-size='14' font-weight='bold' fill='white' font-family='sans-serif'%3E码%3C/text%3E%3C/svg%3E",
    likes: '3.2k',
    collects: 1567,
    comments: 289,
    image: './covers/4-macbook.jpg',
    height: 190,
    isLearning: false,
    tags: ['macbook', '笔记本电脑推荐', '先进生产力', 'vibe coding', '程序员'],
    publishTime: '昨天',
    location: '杭州',
  },
  {
    id: 5,
    title: '分享一个让 AI 自动出小红书配图的 Skill',
    content: `背景是我做小红书总因为配图而头疼
每次让 AI 帮我做个图，出来的永远是居中标题+渐变背景。发出去数据惨淡。
根本原因是他没调研，也不懂怎么调研，然后想当然地搞出一些 AI 味儿的东西。

所以我花了两周，和 claude 一起从零 Vibecoding 了一个小红书配图的 Skill。翻车了 6 次，补了 14 条规则，最后开源到了 GitHub。

使用方法：和你的 Agent 说：到 github 或者 clawhub 里找到并安装小红书封面生成 skill

首先，一个好的 Skill 要回答 5 件事：
① 这个任务到底要干嘛
② 需要读哪些上下文
③ 按什么步骤走
④ 输出要长什么样
⑤ 哪些边界绝对不能碰
这五件事一旦写清楚，原来不稳定的任务就稳了。

但关键是：v0 一定会翻车所以需要不断地调整
我的配图 Skill 翻了 6 次车，每次翻车我都会记录：

第一次跳过调研直接出方案
→ 补了门禁：调研产出不合格，不许进下一步

第二次调研了但没内化
它看了 40 个作品，记了一堆数据，然后生成的图跟调研完全没关系。
→ 补了规则：调研必须转化成 Design Token（色值、字体、间距），后面所有生成都锁定在这套 Token 上

第三次Logo 全靠编
NotebookLM 的 logo 明明是黑底白弧线，它自信地画了个蓝紫色书页。
→ 补了规则：品牌元素必须搜索确认，搜不到就问用户要截图

第五次画了个裸露大脑当封面
帖子讲"马斯克点赞的 AI 论文"，它画了一个大脑。
我说：你不觉得恐怖吗？
→ 补了规则：封面从"用户情绪"出发，不是从"技术概念"出发。第一个联想如果是最直线的，大概率是错的。

反复修补之后，这个 Skill：
调研→分析→确认→prompt→生成→检查
14 条翻车经验：按 🔴🟡🟢 分级
8 项 prompt 自检：发送前最后一道关卡
否定后快速迭代流程：一次否定→10 分钟内修正

vibecoding skills 的时候，记住这个训练循环：
先跑一次 → 看哪里错了 → 把经验写成规则 → 再跑一次（如此反复）
不要追求一次写对，v0 就是用来翻车的

#黑客松巅峰赛 #vibecoding #skills #独立开发 #AI工具 #小红书配图`,
    author: 'Skill创造者',
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' rx='20' fill='%233498DB'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dy='.35em' font-size='16' font-weight='bold' fill='white' font-family='sans-serif'%3ES%3C/text%3E%3C/svg%3E",
    likes: '4.5w',
    collects: 15600,
    comments: 723,
    image: './covers/5-xhs-skill.jpg',
    height: 280,
    isLearning: true,
    tags: ['黑客松巅峰赛', 'vibecoding', 'skills', '独立开发', 'AI工具', '小红书配图'],
    publishTime: '1周前',
    location: '北京',
  },
  {
    id: 6,
    title: 'Google 推出 DESIGN.md 单文件搞定网页设计',
    content: `Google Stitch 团队近期开源了 DESIGN.md 标准——一种用纯 Markdown 定义完整设计系统的方案，正在引起开发者社区广泛关注。

DESIGN.md 的核心理念是：将色彩系统、字体规则、组件样式、布局原则、响应式策略等 9 大设计模块，全部用自然语言写入一个 Markdown 文件中。放入项目根目录后，AI 编程助手（Claude Code、Cursor、Copilot 等）可直接读取并生成风格一致的 UI 组件。

相较于传统 Figma 导出 + JSON Design Token + Style Dictionary 的工具链方案，DESIGN.md 的优势在于：
· AI 原生可读，无需额外解析层
· 纯文本格式，Git 版本控制友好
· 零工具依赖，任意编辑器可编辑
· 人机共读，设计师与开发者均可直接理解

目前 GitHub 上的 awesome-design-md 仓库已收录 55 个知名网站的设计系统，涵盖 Stripe、Vercel、Notion、Apple、SpaceX、Spotify 等，均已标准化为 DESIGN.md 格式，可直接复制使用。

实际使用流程：
1. 从仓库选择目标设计风格，将 DESIGN.md 复制至项目根目录
2. 向 AI 编程助手描述需求，如"按照 DESIGN.md 规范构建定价页面"
3. AI 自动匹配设计规范，输出风格统一的界面组件

该标准的价值不仅在于技术层面的简化，更在于降低了高质量 UI 的生产门槛。独立开发者无需专业设计背景，即可借助现成的设计系统文件获得专业级界面输出。

仓库地址：github/VoltAgent/awesome-design-md

#DESIGN #GoogleStitch #设计系统 #AI编程 #前端开发 #开发者工具 #ClaudeCode #Cursor #DesignToken #开源项目 #UI设计 #独立开发者 #网站设计 #网页设计`,
    author: 'moodgem',
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' rx='20' fill='%232ECC71'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dy='.35em' font-size='14' font-weight='bold' fill='white' font-family='sans-serif'%3Em%3C/text%3E%3C/svg%3E",
    likes: '6.8w',
    collects: 19800,
    comments: 945,
    image: './covers/6-design-md.jpg',
    height: 300,
    isLearning: true,
    tags: ['DESIGN', 'GoogleStitch', '设计系统', 'AI编程', '前端开发', '开发者工具', 'ClaudeCode', 'Cursor'],
    publishTime: '2天前',
    location: '北京',
  },
]

// 稍后学习看板数据（从 FEED_DATA 中筛选学习类）
export const LEARN_TASKS = [
  {
    id: 1,
    title: 'Figma（最新版）简易教学',
    author: 'BOOMB设计',
    readTime: 8,
    cover: './covers/1-figma.jpg',
    category: '设计',
    progress: 0,
    tags: ['Figma', 'UI设计', '入门'],
  },
  {
    id: 2,
    title: '如何去除设计"AI味"小技巧',
    author: 'YANG',
    readTime: 6,
    cover: './covers/2-ai-design.png',
    category: '设计',
    progress: 30,
    tags: ['UI设计', '设计技巧', 'AI'],
  },
  {
    id: 5,
    title: '让 AI 自动出小红书配图的 Skill',
    author: 'Skill创造者',
    readTime: 10,
    cover: './covers/5-xhs-skill.jpg',
    category: 'AI',
    progress: 0,
    tags: ['vibecoding', 'skills', 'AI工具'],
  },
  {
    id: 6,
    title: 'Google DESIGN.md 搞定网页设计',
    author: 'moodgem',
    readTime: 8,
    cover: './covers/6-design-md.jpg',
    category: '技术',
    progress: 60,
    tags: ['设计系统', 'AI编程', '前端'],
  },
]
