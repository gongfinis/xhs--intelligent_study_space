// ==================== AI 智能分析服务 ====================
// 收藏分流分析 - 判断笔记内容类型并推荐分流去向

// API 配置（用户稍后提供密钥）
const AI_CONFIG = {
  apiKey: '', // 稍后填入
  baseUrl: 'https://api.openai.com/v1', // 兼容 OpenAI 格式，可替换为其他服务
  model: 'gpt-4o-mini', // 默认模型，可替换
  temperature: 0.3, // 低随机性确保分类稳定
  maxTokens: 500,
}

// ==================== 分析提示词 ====================
const SYSTEM_PROMPT = `你是小红书「智能收藏空间」的内容分流助手。

你的任务是：当用户收藏一篇笔记时，分析该笔记的内容属性，判断它属于哪个收藏清单，并给出分流建议。

## 分流清单定义

1. **稍后学习** - 具备知识性、教程性、技能提升类的内容
   - 特征：有明确的学习目标、步骤化教程、知识点梳理、技能树、书单/课程推荐
   - 示例：编程教程、设计入门、读书笔记、考证攻略、职场技能

2. **灵感收集** - 审美灵感、创意参考、视觉素材类
   - 特征：以图片/视觉为主、配色参考、排版灵感、设计案例、mood board
   - 示例：UI设计灵感、摄影构图、家居装修参考、手账排版

3. **好物清单** - 购物推荐、产品测评、好物分享类
   - 特征：有具体产品名称/品牌、价格信息、使用体验、对比测评
   - 示例：护肤品测评、数码产品推荐、家居好物、穿搭单品推荐

4. **生活参考** - 攻略、食谱、旅行路线等实用信息
   - 特征：有具体地点/步骤/食材、可直接执行的方案
   - 示例：旅行攻略、美食食谱、健身计划、租房指南

5. **随手收藏** - 无法明确归类或纯娱乐/情绪类内容
   - 特征：段子、表情包、纯分享无结构化信息

## 输出格式（严格JSON）

{
  "category": "稍后学习|灵感收集|好物清单|生活参考|随手收藏",
  "confidence": 0.0-1.0,
  "reason": "一句话解释分流原因（不超过20字）",
  "tags": ["标签1", "标签2"],
  "estimated_read_time": null 或 数字(分钟),
  "learning_value": 0-10
}

## 规则
- confidence < 0.6 时归入「随手收藏」
- 同时具备多个类别特征时，选择 learning_value 最高的类别
- estimated_read_time 仅对「稍后学习」类别给出
- 返回纯 JSON，不要任何其他文字`

// ==================== API 调用函数 ====================

/**
 * 调用 AI 分析笔记内容并返回分流结果
 * @param {object} note - 笔记对象 { title, content, author, tags }
 * @returns {Promise<object>} 分流结果
 */
export async function analyzeNote(note) {
  const { apiKey, baseUrl, model, temperature, maxTokens } = AI_CONFIG

  if (!apiKey) {
    console.warn('[AI分析] API Key 未配置，使用本地规则分析')
    return localAnalysis(note)
  }

  const userMessage = buildUserPrompt(note)

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        response_format: { type: 'json_object' }, // 强制JSON输出
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[AI分析] API 请求失败:', response.status, error)
      return localAnalysis(note)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('[AI分析] 响应内容为空')
      return localAnalysis(note)
    }

    const result = JSON.parse(content)
    return {
      ...result,
      source: 'ai',
      model: data.model,
      usage: data.usage,
    }
  } catch (error) {
    console.error('[AI分析] 分析失败，降级到本地规则:', error)
    return localAnalysis(note)
  }
}

/**
 * 构建用户消息（发送给 AI 的笔记内容）
 */
function buildUserPrompt(note) {
  return `请分析以下小红书笔记内容，判断其应该归入哪个收藏清单：

【标题】${note.title}

【正文内容】
${note.content || '（无正文，仅标题）'}

【作者】${note.author || '未知'}

【话题标签】${(note.tags || []).join('、') || '无'}

【互动数据】点赞 ${note.likes || 0} | 收藏 ${note.collects || 0} | 评论 ${note.comments || 0}`
}

// ==================== 本地降级分析（关键词规则） ====================

const CATEGORY_KEYWORDS = {
  '稍后学习': {
    title: ['教程', '入门', '学习', '指南', '攻略', '方法论', '技能', '从零', '必备', '拆解', '干货', '系统', '路径', '实战', '笔记', '总结', '原理', '深度', '核心', '框架'],
    tags: ['学习', '教程', '干货', '技能', '自我提升', '知识', '编程', '设计', '产品'],
  },
  '灵感收集': {
    title: ['灵感', '参考', '配色', '排版', '审美', '素材', '设计风格', 'mood', '氛围'],
    tags: ['灵感', '设计', '摄影', '排版', '审美', '配色'],
  },
  '好物清单': {
    title: ['推荐', '测评', '好物', '分享', '种草', '开箱', '性价比', '平替', '合集'],
    tags: ['好物', '测评', '推荐', '种草', '购物'],
  },
  '生活参考': {
    title: ['攻略', '食谱', '路线', '做法', '计划', '清单', '指南', '步骤'],
    tags: ['攻略', '食谱', '旅行', '健身', '美食', '生活'],
  },
}

function localAnalysis(note) {
  const title = note.title || ''
  const tags = note.tags || []
  const content = note.content || ''
  const fullText = `${title} ${content} ${tags.join(' ')}`

  let bestCategory = '随手收藏'
  let bestScore = 0

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0

    // 标题关键词匹配（权重高）
    for (const kw of keywords.title) {
      if (title.includes(kw)) score += 3
      if (content.includes(kw)) score += 1
    }

    // 标签匹配
    for (const kw of keywords.tags) {
      if (tags.some(t => t.includes(kw))) score += 2
    }

    if (score > bestScore) {
      bestScore = score
      bestCategory = category
    }
  }

  const confidence = Math.min(bestScore / 10, 0.95)

  // 估算阅读时间（仅学习类）
  let estimatedReadTime = null
  if (bestCategory === '稍后学习') {
    const charCount = (content || title).length
    estimatedReadTime = Math.max(3, Math.ceil(charCount / 400))
  }

  return {
    category: confidence >= 0.3 ? bestCategory : '随手收藏',
    confidence: Math.round(confidence * 100) / 100,
    reason: getLocalReason(bestCategory, title),
    tags: extractTags(fullText),
    estimated_read_time: estimatedReadTime,
    learning_value: bestCategory === '稍后学习' ? Math.min(Math.round(bestScore * 1.5), 10) : Math.round(bestScore * 0.5),
    source: 'local',
  }
}

function getLocalReason(category, title) {
  const reasons = {
    '稍后学习': '含知识性/教程性内容',
    '灵感收集': '属于视觉灵感/创意素材',
    '好物清单': '包含产品推荐/测评',
    '生活参考': '属于实用攻略信息',
    '随手收藏': '暂无法明确归类',
  }
  return reasons[category] || '暂无法明确归类'
}

function extractTags(text) {
  const allTags = ['设计', '编程', '产品', 'AI', '技术', '穿搭', '美食', '旅行', '健身', '阅读', '效率', '职场', '摄影', '生活']
  return allTags.filter(t => text.includes(t)).slice(0, 3)
}

// ==================== 配置管理 ====================

/**
 * 设置 API Key
 */
export function setApiKey(key) {
  AI_CONFIG.apiKey = key
  console.log('[AI分析] API Key 已配置')
}

/**
 * 设置 API 基础URL（支持第三方兼容服务）
 */
export function setBaseUrl(url) {
  AI_CONFIG.baseUrl = url.replace(/\/$/, '')
  console.log('[AI分析] API Base URL 已更新:', AI_CONFIG.baseUrl)
}

/**
 * 设置模型
 */
export function setModel(model) {
  AI_CONFIG.model = model
  console.log('[AI分析] 模型已切换:', model)
}

/**
 * 获取当前配置状态
 */
export function getConfigStatus() {
  return {
    hasApiKey: !!AI_CONFIG.apiKey,
    baseUrl: AI_CONFIG.baseUrl,
    model: AI_CONFIG.model,
  }
}

// ==================== 分析结果转换（给UI使用） ====================

/**
 * 将分析结果转为 Toast 展示内容
 */
export function formatToastMessage(result) {
  const categoryMap = {
    '稍后学习': { icon: '📖', label: '稍后学习' },
    '灵感收集': { icon: '💡', label: '灵感收集' },
    '好物清单': { icon: '🛍️', label: '好物清单' },
    '生活参考': { icon: '📋', label: '生活参考' },
    '随手收藏': { icon: '⭐', label: '随手收藏' },
  }

  const info = categoryMap[result.category] || categoryMap['随手收藏']

  return {
    message: `已智能分流至「${info.label}」`,
    icon: info.icon,
    category: result.category,
    confidence: result.confidence,
    readTime: result.estimated_read_time,
  }
}
