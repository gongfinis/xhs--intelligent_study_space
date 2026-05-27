import { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react'
import { FEED_DATA } from './data.js'
import { analyzeNote, formatToastMessage, setApiKey, setBaseUrl, setModel, getConfigStatus } from './ai-service.js'
import AIConfigPanel from './AIConfigPanel.jsx'

// 将 AI 服务暴露到全局
if (typeof window !== 'undefined') {
  window.AI = { setApiKey, setBaseUrl, setModel, getConfigStatus }
}

// ==================== 全局收藏状态 Context ====================
const CollectionContext = createContext()

function CollectionProvider({ children }) {
  const [collections, setCollections] = useState([]) // 普通收藏
  const [learnList, setLearnList] = useState([]) // 待学习列表

  const addToCollection = useCallback((note, category) => {
    if (category === '稍后学习') {
      setLearnList(prev => {
        if (prev.find(n => n.id === note.id)) return prev
        return [...prev, { ...note, progress: 0, addedAt: Date.now() }]
      })
    } else {
      setCollections(prev => {
        if (prev.find(n => n.id === note.id)) return prev
        return [...prev, { ...note, category, addedAt: Date.now() }]
      })
    }
  }, [])

  const removeFromLearn = useCallback((noteId) => {
    setLearnList(prev => prev.filter(n => n.id !== noteId))
  }, [])

  // 兜底策略：从普通收藏移入待学习
  const moveToLearn = useCallback((noteId) => {
    setCollections(prev => {
      const note = prev.find(n => n.id === noteId)
      if (note) {
        setLearnList(learn => {
          if (learn.find(n => n.id === noteId)) return learn
          return [...learn, { ...note, progress: 0, addedAt: Date.now() }]
        })
        return prev.filter(n => n.id !== noteId)
      }
      return prev
    })
  }, [])

  return (
    <CollectionContext.Provider value={{ collections, learnList, addToCollection, removeFromLearn, moveToLearn }}>
      {children}
    </CollectionContext.Provider>
  )
}

function useCollection() {
  return useContext(CollectionContext)
}

// ==================== SVG 图标组件 ====================
const Icons = {
  Back: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Heart: ({ filled }) => filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#FE2C55">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Star: ({ filled }) => filled ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#FBBF24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Comment: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Share: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Book: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#FE2C55" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="#FE2C55" fillOpacity="0.1" stroke="#FE2C55" strokeWidth="1.5"/>
      <path d="M8 7h8M8 11h5" stroke="#FE2C55" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Home: ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#333' : 'none'} stroke={active ? 'none' : '#999'} strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      {!active && <path d="M9 22V12h6v10" stroke="#999" strokeWidth="1.5"/>}
    </svg>
  ),
  Shop: ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#333' : '#999'} strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  Message: ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#333' : '#999'} strokeWidth="1.5">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  Me: ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#333' : '#999'} strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Filter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h16M6 12h12M8 18h8" strokeLinecap="round"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2" strokeLinecap="round"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Lock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
}

// ==================== Toast 组件 ====================
function Toast({ message, visible, onHide, action, onAction, secondaryAction, onSecondaryAction }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (visible) {
      setExiting(false)
      const timer = setTimeout(() => {
        setExiting(true)
        setTimeout(onHide, 250)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [visible, onHide])

  if (!visible) return null

  return (
    <div className={`fixed top-14 left-4 right-4 z-[100] ${exiting ? 'toast-exit' : 'toast-enter'}`}>
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FE2C55] to-[#FF6B8A] flex items-center justify-center flex-shrink-0">
            <Icons.Book />
          </div>
          <span className="text-[13px] text-[#333] leading-tight truncate">{message}</span>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {secondaryAction && (
            <button onClick={onSecondaryAction} className="text-[12px] font-medium text-[#4AADF7] whitespace-nowrap active:opacity-70 border border-[#4AADF7]/30 rounded-full px-2.5 py-1">
              {secondaryAction}
            </button>
          )}
          {action && (
            <button onClick={onAction} className="text-[13px] font-semibold text-[#FE2C55] whitespace-nowrap active:opacity-70">
              {action} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== 底部导航栏 ====================
function BottomNav({ active, onNavigate }) {
  const items = [
    { id: 'home', label: '首页' },
    { id: 'shop', label: '市集' },
    { id: 'create', label: '' },
    { id: 'message', label: '消息' },
    { id: 'me', label: '我' },
  ]

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] z-40">
      <div className="flex items-center justify-around px-4 pt-3 pb-7">
        {items.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className="flex items-center justify-center active:scale-90 transition-transform">
            {item.id === 'create' ? (
              <div className="w-[36px] h-[36px] bg-[#FE2C55] rounded-[10px] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
            ) : (
              <span className={`text-[16px] ${
                active === item.id ? 'text-[#333] font-semibold' : 'text-[#666] font-normal'
              }`}>
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ==================== 场景一：首页瀑布流 ====================
function HomePage({ onNoteClick }) {
  const [activeTab, setActiveTab] = useState('发现')
  const [activeCategory, setActiveCategory] = useState('学习')
  const tabs = ['关注', '发现', '深圳']
  const categories = ['家装', '科学科普', '学习', '彩妆', '头像', '读书', '美食', '旅行']

  const leftCol = useMemo(() => FEED_DATA.filter((_, i) => i % 2 === 0), [])
  const rightCol = useMemo(() => FEED_DATA.filter((_, i) => i % 2 === 1), [])

  return (
    <div className="h-full flex flex-col bg-[#F5F5F5]">
      {/* 状态栏占位 */}
      <div className="h-11 flex-shrink-0 bg-white" />

      {/* 顶部导航栏：聊天图标 + Tab + 搜索图标 */}
      <div className="flex-shrink-0 bg-white px-4 pb-0">
        <div className="flex items-center justify-between h-[44px]">
          {/* 左侧聊天图标 */}
          <button className="w-9 h-9 flex items-center justify-center active:opacity-60">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
          </button>

          {/* 中间 Tab 切换 */}
          <div className="flex items-center gap-5">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className="relative py-2">
                <span className={`text-[17px] transition-all duration-200 ${
                  activeTab === tab 
                    ? 'text-[#222] font-bold' 
                    : 'text-[#999] font-normal'
                }`}>{tab}</span>
                {tab === '关注' && (
                  <div className="absolute -top-0.5 -right-2 w-[6px] h-[6px] bg-[#FE2C55] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* 右侧搜索图标 */}
          <button className="w-9 h-9 flex items-center justify-center active:opacity-60">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 分类标签栏 */}
      <div className="flex-shrink-0 bg-white border-b border-[#f0f0f0]">
        <div className="relative flex items-center">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4 px-4 py-2.5">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[14px] whitespace-nowrap transition-all duration-150 ${
                    activeCategory === cat 
                      ? 'text-[#333] font-semibold' 
                      : 'text-[#666] font-normal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {/* 右侧渐变遮罩 + 更多箭头 */}
          <div className="absolute right-0 top-0 bottom-0 flex items-center">
            <div className="w-10 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
            <button className="w-8 h-full flex items-center justify-center bg-white pr-2 active:opacity-60">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 瀑布流内容 */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-[6px] px-[6px] pt-[6px] pb-24">
          <div className="flex-1 flex flex-col gap-[6px]">
            {leftCol.map((item, i) => (
              <FeedCard key={item.id} item={item} delay={i * 60} onClick={() => onNoteClick(item)} />
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            {rightCol.map((item, i) => (
              <FeedCard key={item.id} item={item} delay={i * 60 + 30} onClick={() => onNoteClick(item)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedCard({ item, delay, onClick }) {
  return (
    <div
      className="bg-white rounded-[6px] overflow-hidden feed-card-enter active:scale-[0.98] transition-transform duration-150"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      {/* 封面图 */}
      <div className="relative w-full" style={{ height: item.height }}>
        <img src={item.image} alt="" className="w-full h-full object-cover bg-[#f0f0f0]" loading="lazy" />
      </div>
      {/* 内容区 */}
      <div className="px-2.5 pt-2 pb-2.5">
        <h3 className="text-[13px] font-semibold text-[#333] leading-[1.4] line-clamp-2">{item.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <img src={item.avatar} alt="" className="w-[18px] h-[18px] rounded-full object-cover flex-shrink-0" />
            <span className="text-[11px] text-[#999] truncate">{item.author}</span>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="text-[11px] text-[#999]">{item.likes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== 场景二：笔记详情页 ====================
function NoteDetail({ note, onBack, onGoToLearn }) {
  const { addToCollection, moveToLearn } = useCollection()
  const [liked, setLiked] = useState(false)
  const [collected, setCollected] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [toastData, setToastData] = useState({ message: '', action: '', secondaryAction: '' })
  const [showBubble, setShowBubble] = useState(false)
  const [preAnalysisResult, setPreAnalysisResult] = useState(null)
  const dwellTimerRef = useRef(null)
  const enteredAtRef = useRef(Date.now())
  const currentNoteRef = useRef(note)

  // 10秒停留 → 预分析 → 学习类弹气泡
  useEffect(() => {
    currentNoteRef.current = note
    enteredAtRef.current = Date.now()
    dwellTimerRef.current = setTimeout(async () => {
      if (collected) return
      try {
        const result = await analyzeNote(note)
        setPreAnalysisResult(result)
        if (result.category === '稍后学习') {
          setShowBubble(true)
          // 气泡 5 秒后自动消失
          setTimeout(() => setShowBubble(false), 5000)
        }
      } catch (e) {
        // 静默处理
      }
    }, 10000)

    return () => {
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current)
    }
  }, [note, collected])

  const handleCollect = async () => {
    if (collected || analyzing) return
    setAnimating(true)
    setCollected(true)
    setAnalyzing(true)
    setShowBubble(false)

    if (navigator.vibrate) navigator.vibrate(10)

    try {
      // 如果已有预分析结果就直接用
      const result = preAnalysisResult || await analyzeNote(note)
      setAnalysisResult(result)
      const toastInfo = formatToastMessage(result)

      // 添加到对应收藏列表
      addToCollection(note, result.category)

      setToastData({
        message: toastInfo.message,
        action: result.category === '稍后学习' ? '查看' : null,
        // 场景A兜底：非学习类收藏 → 显示"加入待学习"按钮
        secondaryAction: result.category !== '稍后学习' ? '加入待学习' : null,
      })
    } catch (e) {
      addToCollection(note, '随手收藏')
      setToastData({ message: '已收藏', action: null, secondaryAction: '加入待学习' })
    } finally {
      setAnalyzing(false)
      setTimeout(() => {
        setAnimating(false)
        setShowToast(true)
      }, 400)
    }
  }

  // 兜底：用户点击 Toast 的"加入待学习"
  const handleMoveToLearn = () => {
    setShowToast(false)
    // 将当前笔记从普通收藏移入待学习
    moveToLearn(note.id)
    // 同时直接加入待学习（如果 moveToLearn 找不到也能覆盖）
    addToCollection(note, '稍后学习')
  }

  const handleBubbleClick = () => {
    setShowBubble(false)
    handleCollect()
  }

  return (
    <div className="h-full flex flex-col bg-white page-enter">
      <Toast
        message={toastData.message || "已收藏"}
        action={toastData.action || null}
        secondaryAction={toastData.secondaryAction || null}
        visible={showToast}
        onHide={() => setShowToast(false)}
        onAction={() => { setShowToast(false); onGoToLearn() }}
        onSecondaryAction={handleMoveToLearn}
      />

      {/* 顶部导航 */}
      <div className="flex-shrink-0 bg-white z-30">
        <div className="h-11" />
        <div className="px-4 py-2.5 flex items-center justify-between">
          <button onClick={onBack} className="p-0.5 -ml-1 active:opacity-50">
            <Icons.Back />
          </button>
          <div className="flex items-center gap-2">
            <img src={note.avatar} alt="" className="w-8 h-8 rounded-full border border-black/5" />
            <span className="text-[14px] font-medium text-[#333]">{note.author}</span>
          </div>
          <button className="px-3.5 py-1.5 border border-[#FE2C55] rounded-full">
            <span className="text-[12px] font-medium text-[#FE2C55]">+ 关注</span>
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full aspect-[3/4] max-h-[55vh] bg-[#f5f5f5]">
          <img src={note.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-center gap-1.5 py-3">
          <div className="w-4 h-1 bg-[#333] rounded-full" />
          <div className="w-1 h-1 bg-[#ddd] rounded-full" />
          <div className="w-1 h-1 bg-[#ddd] rounded-full" />
        </div>

        <div className="px-4 pb-32">
          <h1 className="text-[17px] font-bold text-[#333] leading-[1.4]">{note.title}</h1>
          <div className="mt-3 space-y-2.5">
            {(note.content || '').split('\n').filter(Boolean).slice(0, 8).map((line, i) => (
              <p key={i} className="text-[14px] text-[#555] leading-[1.7] whitespace-pre-wrap">{line}</p>
            ))}
            {(note.content || '').split('\n').length > 8 && (
              <p className="text-[13px] text-[#bbb] italic">... 展开查看更多</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {(note.tags || []).map((tag, i) => (
              <span key={i} className="text-[12px] text-[#3378FF] bg-[#EEF4FF] px-2.5 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[12px] text-[#bbb]">
            <span>{note.publishTime || '3天前'}</span>
            <span>·</span>
            <span>{note.location || '未知'}</span>
          </div>

          {/* AI 分析结果 */}
          {analysisResult && (
            <div className="mt-4 p-3 bg-[#F8F8F8] rounded-xl border border-[#F0F0F0]">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[11px] font-medium text-[#FE2C55]">🤖 AI 智能分析</span>
                <span className="text-[10px] text-[#bbb]">({analysisResult.source === 'ai' ? 'API' : '本地规则'})</span>
              </div>
              <div className="space-y-1">
                <p className="text-[12px] text-[#666]">分类: <span className="font-medium text-[#333]">{analysisResult.category}</span></p>
                <p className="text-[12px] text-[#666]">置信度: <span className="font-medium">{Math.round(analysisResult.confidence * 100)}%</span></p>
                <p className="text-[12px] text-[#666]">原因: {analysisResult.reason}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-black/5 z-30">
        <div className="flex items-center px-3 py-2.5 pb-7 gap-2">
          <div className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-2">
            <span className="text-[13px] text-[#bbb]">说点什么...</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
              <Icons.Heart filled={liked} />
              <span className="text-[10px] text-[#999]">{note.likes}</span>
            </button>

            {/* 收藏 - 核心交互 */}
            <button onClick={handleCollect} className="flex flex-col items-center gap-0.5 relative active:scale-90 transition-transform">
              {/* 10秒气泡提示 */}
              {showBubble && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bubble-enter z-50" onClick={handleBubbleClick}>
                  <div className="bg-[#333] text-white text-[11px] px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg relative">
                    加入待学习列表
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#333] rotate-45" />
                  </div>
                </div>
              )}

              <div className={`relative ${animating ? 'collect-pop' : ''}`}>
                {analyzing ? (
                  <div className="w-[22px] h-[22px] border-2 border-[#FE2C55] border-t-transparent rounded-full animate-spin" />
                ) : collected ? (
                  analysisResult?.category === '稍后学习' ? <Icons.Book /> : <Icons.Star filled={true} />
                ) : (
                  <Icons.Star filled={false} />
                )}
                {animating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#FE2C55]/30 ripple-effect" />
                  </div>
                )}
              </div>
              <span className={`text-[10px] transition-colors duration-300 ${collected ? 'text-[#FE2C55] font-medium' : 'text-[#999]'}`}>
                {analyzing ? '分析中' : collected ? (analysisResult?.category === '稍后学习' ? '小书' : '已收藏') : '收藏'}
              </span>
              {animating && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute w-1 h-1 rounded-full bg-[#FE2C55] star-burst"
                      style={{ transform: `rotate(${i * 60}deg) translateY(-8px)`, animationDelay: `${i * 0.05}s`, opacity: 0 }} />
                  ))}
                </div>
              )}
            </button>

            <button className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
              <Icons.Comment />
              <span className="text-[10px] text-[#999]">128</span>
            </button>
            <button className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform">
              <Icons.Share />
              <span className="text-[10px] text-[#999]">分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== 「我的」页面 ====================
function ProfilePage({ onBack, onGoToLearn, onNoteClick, initialTab, initialSubTab }) {
  const { collections, learnList } = useCollection()
  const [primaryTab, setPrimaryTab] = useState(initialTab || '笔记')
  const [collectionSubTab, setCollectionSubTab] = useState(initialSubTab || '笔记')
  const [collapsed, setCollapsed] = useState(false)
  const primaryTabs = ['笔记', '评论', '收藏', '赞过']
  const collectionSubTabs = ['笔记', '专辑', '待学习']

  // 当 initialTab/initialSubTab 变化时同步
  useEffect(() => {
    if (initialTab) setPrimaryTab(initialTab)
    if (initialSubTab) setCollectionSubTab(initialSubTab)
  }, [initialTab, initialSubTab])

  // 上划折叠个人信息
  const touchStartY = useRef(0)
  const mouseStartY = useRef(0)
  const isDragging = useRef(false)

  const handleContentTouchStart = (e) => { touchStartY.current = e.touches[0].clientY }
  const handleContentTouchEnd = (e) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY
    if (diff > 60 && !collapsed) setCollapsed(true)
    else if (diff < -60 && collapsed) setCollapsed(false)
  }
  const handleContentMouseDown = (e) => { mouseStartY.current = e.clientY; isDragging.current = true }
  const handleContentMouseUp = (e) => {
    if (!isDragging.current) return
    isDragging.current = false
    const diff = mouseStartY.current - e.clientY
    if (diff > 60 && !collapsed) setCollapsed(true)
    else if (diff < -60 && collapsed) setCollapsed(false)
  }
  const handleContentWheel = (e) => {
    if (e.deltaY > 30 && !collapsed) setCollapsed(true)
    else if (e.deltaY < -30 && collapsed) setCollapsed(false)
  }

  return (
    <div className="h-full flex flex-col bg-white page-enter">
      <div className="h-11 flex-shrink-0" />

      {/* 折叠模式：紧凑顶部（小头像居中 + tabs） */}
      {collapsed && (
        <div className="flex-shrink-0 bg-[#333]/95 backdrop-blur-lg z-10 transition-all duration-300">
          {/* 顶部栏：汉堡 + 小头像 + 操作 */}
          <div className="flex items-center justify-between px-4 py-2">
            <button className="text-white/80">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#FE2C55] to-[#FF8A9E] flex items-center justify-center border-2 border-white/30">
              <span className="text-white text-[13px] font-bold">F</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {/* 一级 Tab - 折叠模式 */}
          <div className="flex items-center justify-center px-2">
            {primaryTabs.map(tab => (
              <button key={tab} onClick={() => setPrimaryTab(tab)} className="relative px-4 py-2.5">
                <span className={`text-[14px] ${primaryTab === tab ? 'text-white font-semibold' : 'text-white/50'}`}>
                  {tab === '评论' || tab === '赞过' ? (
                    <span className="flex items-center gap-0.5">
                      <Icons.Lock />
                      <span className="ml-0.5">{tab}</span>
                    </span>
                  ) : tab}
                </span>
                {primaryTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#FE2C55] rounded-full" />
                )}
              </button>
            ))}
            <button className="px-2 py-2.5 text-white/50">
              <Icons.Search />
            </button>
          </div>
          {/* 二级 Tab (收藏下) - 折叠模式 */}
          {primaryTab === '收藏' && (
            <div className="flex items-center bg-white border-b border-[#F0F0F0]">
              {collectionSubTabs.map(tab => (
                <button key={tab} onClick={() => setCollectionSubTab(tab)} className="relative flex-1 py-2.5">
                  <span className={`text-[13px] ${collectionSubTab === tab ? 'text-[#333] font-semibold' : 'text-[#999]'}`}>
                    {tab}
                    {tab === '笔记' && collections.length > 0 && (
                      <span className="text-[11px] text-[#999] font-normal ml-1">{collections.length}</span>
                    )}
                    {tab === '待学习' && learnList.length > 0 && (
                      <span className="text-[11px] text-[#999] font-normal ml-1">{learnList.length}</span>
                    )}
                  </span>
                  {collectionSubTab === tab && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#FE2C55] rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 展开模式：完整个人信息 */}
      {!collapsed && (
        <>
          {/* 顶部个人信息 */}
          <div className="flex-shrink-0 px-5 pt-2 pb-4 bg-[#333] text-white">
            {/* 头部操作栏 */}
            <div className="flex items-center justify-between mb-4">
              <button className="text-white/80">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="flex items-center gap-4">
                <button className="text-[12px] text-white/80 border border-white/30 rounded-full px-3 py-1">编辑主页</button>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex items-center gap-4">
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#FE2C55] to-[#FF8A9E] flex items-center justify-center border-[3px] border-white/20">
                <span className="text-white text-[28px] font-bold">F</span>
              </div>
              <div className="flex-1">
                <h2 className="text-[22px] font-bold text-white">Finis</h2>
                <p className="text-[12px] text-white/50 mt-0.5">小红书号：94975381143</p>
                <p className="text-[12px] text-white/50">IP：广东</p>
              </div>
            </div>

            {/* 数据统计 */}
            <div className="flex items-center gap-6 mt-4">
              <div>
                <span className="text-[17px] font-bold text-white">170</span>
                <span className="text-[12px] text-white/60 ml-1">关注</span>
              </div>
              <div>
                <span className="text-[17px] font-bold text-white">106</span>
                <span className="text-[12px] text-white/60 ml-1">粉丝</span>
              </div>
              <div>
                <span className="text-[17px] font-bold text-white">2162</span>
                <span className="text-[12px] text-white/60 ml-1">获赞与收藏</span>
              </div>
            </div>

            {/* 简介 */}
            <div className="mt-3">
              <p className="text-[13px] text-white/80">✨ enfp ｜ 工设研究生</p>
              <p className="text-[13px] text-white/80">天生我材必有用，可我是妈妈生的</p>
            </div>

            {/* 标签 */}
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[11px] text-white/60 bg-white/10 px-2.5 py-1 rounded-full">白羊座</span>
              <span className="text-[11px] text-white/60 bg-white/10 px-2.5 py-1 rounded-full">浙江大学</span>
            </div>
          </div>

          {/* 一级 Tab 栏：笔记 | 评论 | 收藏 | 赞过 */}
          <div className="flex-shrink-0 bg-white border-b border-[#F0F0F0]">
            <div className="flex items-center justify-center">
              {primaryTabs.map(tab => (
                <button key={tab} onClick={() => setPrimaryTab(tab)} className="relative px-5 py-3">
                  <span className={`text-[14px] flex items-center gap-0.5 ${primaryTab === tab ? 'text-[#333] font-semibold' : 'text-[#999]'}`}>
                    {(tab === '评论' || tab === '赞过') && <Icons.Lock />}
                    {tab}
                  </span>
                  {primaryTab === tab && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#FE2C55] rounded-full" />
                  )}
                </button>
              ))}
              <button className="px-3 py-3 text-[#999]">
                <Icons.Search />
              </button>
            </div>
          </div>

          {/* 收藏下的二级 Tab */}
          {primaryTab === '收藏' && (
            <div className="flex-shrink-0 bg-white border-b border-[#F0F0F0]">
              <div className="flex items-center px-4">
                {collectionSubTabs.map(tab => (
                  <button key={tab} onClick={() => setCollectionSubTab(tab)} className="relative px-4 py-2.5">
                    <span className={`text-[13px] ${collectionSubTab === tab ? 'text-[#333] font-semibold' : 'text-[#999]'}`}>
                      {tab}
                      {tab === '笔记' && collections.length > 0 && (
                        <span className="text-[11px] text-[#999] font-normal ml-1">{collections.length}</span>
                      )}
                      {tab === '待学习' && learnList.length > 0 && (
                        <span className="text-[11px] text-[#999] font-normal ml-1">{learnList.length}</span>
                      )}
                    </span>
                    {collectionSubTab === tab && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#FE2C55] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto bg-[#F9F9F9] select-none"
        onTouchStart={handleContentTouchStart}
        onTouchEnd={handleContentTouchEnd}
        onMouseDown={handleContentMouseDown}
        onMouseUp={handleContentMouseUp}
        onWheel={handleContentWheel}
      >
        {primaryTab === '笔记' && (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-4xl mb-3">📝</span>
            <p className="text-[14px] text-[#999]">暂无笔记</p>
            <p className="text-[12px] text-[#bbb] mt-1">发布你的第一篇笔记吧</p>
          </div>
        )}
        {primaryTab === '评论' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Icons.Lock />
            <p className="text-[14px] text-[#999] mt-3">评论仅自己可见</p>
          </div>
        )}
        {primaryTab === '赞过' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Icons.Lock />
            <p className="text-[14px] text-[#999] mt-3">赞过仅自己可见</p>
          </div>
        )}
        {primaryTab === '收藏' && (
          <>
            {collectionSubTab === '笔记' && (
              <CollectionGrid items={collections} emptyText="收藏的笔记会出现在这里" onNoteClick={onNoteClick} />
            )}
            {collectionSubTab === '专辑' && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 mb-6 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F4FD] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4AADF7" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-[14px] text-[#333]">创建新专辑</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" className="ml-auto">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[12px] text-[#bbb]">创建专辑来整理你的收藏</p>
              </div>
            )}
            {collectionSubTab === '待学习' && (
              <LearnListWithSlideUp items={learnList} onGoToLearn={onGoToLearn} onNoteClick={onNoteClick} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ==================== 收藏夹网格展示 ====================
function CollectionGrid({ items, emptyText, onNoteClick }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-4xl mb-3">⭐</span>
        <p className="text-[14px] text-[#999]">{emptyText}</p>
        <p className="text-[12px] text-[#bbb] mt-1">去首页逛逛，收藏感兴趣的内容吧</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-[2px] p-[2px] pb-24">
      {items.map((item, i) => (
        <div key={item.id} className="bg-white aspect-[3/4] relative overflow-hidden active:opacity-80 transition-opacity"
          onClick={() => onNoteClick?.(item)}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <img src={item.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2.5 pt-8">
            <p className="text-[12px] text-white leading-tight line-clamp-2">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ==================== 待学习列表（带上划展开） ====================
function LearnListWithSlideUp({ items, onGoToLearn, onNoteClick }) {
  const { removeFromLearn } = useCollection()
  const [expanded, setExpanded] = useState(false)
  const [swipingId, setSwipingId] = useState(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const mouseStartY = useRef(0)
  const isDragging = useRef(false)
  const isSwipeHorizontal = useRef(false)
  const containerRef = useRef(null)

  // Touch 事件（移动端）— 竖向滑动展开/折叠
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (isSwipeHorizontal.current) return
    const diff = touchStartY.current - e.changedTouches[0].clientY
    if (diff > 50 && !expanded) {
      setExpanded(true)
    } else if (diff < -50 && expanded) {
      setExpanded(false)
    }
  }

  // Mouse 事件（桌面端模拟拖拽）
  const handleMouseDown = (e) => {
    mouseStartY.current = e.clientY
    isDragging.current = true
  }

  const handleMouseUp = (e) => {
    if (!isDragging.current) return
    isDragging.current = false
    const diff = mouseStartY.current - e.clientY
    if (diff > 50 && !expanded) {
      setExpanded(true)
    } else if (diff < -50 && expanded) {
      setExpanded(false)
    }
  }

  // Wheel 事件（滚轮触发）
  const handleWheel = (e) => {
    if (e.deltaY > 30 && !expanded) {
      setExpanded(true)
    } else if (e.deltaY < -30 && expanded) {
      setExpanded(false)
    }
  }

  // ---- 左滑移出交互（场景B兜底） ----
  const handleItemTouchStart = (e, itemId) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwipeHorizontal.current = false
    setSwipingId(itemId)
    setSwipeOffset(0)
  }

  const handleItemTouchMove = (e, itemId) => {
    if (swipingId !== itemId) return
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    // 首次判定方向
    if (!isSwipeHorizontal.current && Math.abs(dx) > 10) {
      isSwipeHorizontal.current = Math.abs(dx) > Math.abs(dy)
    }
    if (isSwipeHorizontal.current && dx < 0) {
      // 仅允许左滑，最大 -100px
      setSwipeOffset(Math.max(dx, -100))
    }
  }

  const handleItemTouchEnd = (e, itemId) => {
    if (swipingId !== itemId) return
    if (swipeOffset < -50) {
      // 滑动超过 50px，保持打开状态（显示删除按钮）
      setSwipeOffset(-80)
    } else {
      // 不够，回弹
      setSwipeOffset(0)
      setSwipingId(null)
    }
    isSwipeHorizontal.current = false
  }

  const handleRemoveItem = (itemId) => {
    setSwipingId(null)
    setSwipeOffset(0)
    removeFromLearn(itemId)
  }

  // 点击其他地方关闭已滑开的卡片
  const handleListClick = (e) => {
    if (swipingId && swipeOffset < 0) {
      setSwipingId(null)
      setSwipeOffset(0)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-4xl mb-3">📖</span>
        <p className="text-[14px] text-[#999]">暂无待学习内容</p>
        <p className="text-[12px] text-[#bbb] mt-1">收藏学习类笔记后会自动添加到这里</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="h-full relative select-none"
      style={{ minHeight: '400px' }}
    >
      {/* 普通列表视图 */}
      <div className={`absolute inset-0 transition-all duration-500 ease-out ${expanded ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div className="p-3 pb-24 space-y-2.5 overflow-y-auto h-full no-scrollbar" onClick={handleListClick}>
          {/* 上划提示 - 可点击 */}
          <button
            onClick={() => setExpanded(true)}
            className="flex flex-col items-center py-2 mb-1 w-full active:opacity-60 transition-opacity"
          >
            <div className="w-8 h-1 bg-[#ccc] rounded-full mb-2 animate-pulse" />
            <p className="text-[11px] text-[#999]">↑ 上划 / 点击 查看学习进度</p>
          </button>

          {items.map((item, i) => (
            <div key={item.id} className="relative overflow-hidden rounded-xl">
              {/* 左滑露出的红色删除区域 */}
              <div className="absolute inset-y-0 right-0 w-[80px] flex items-center justify-center bg-[#FE2C55] rounded-r-xl">
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id) }}
                  className="flex flex-col items-center gap-1 text-white active:opacity-70"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                  <span className="text-[11px] font-medium">移出</span>
                </button>
              </div>
              {/* 可滑动的卡片主体 */}
              <div
                className="bg-white p-3 flex gap-3 items-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative z-10 cursor-pointer"
                style={{
                  transform: `translateX(${swipingId === item.id ? swipeOffset : 0}px)`,
                  transition: swipingId === item.id ? 'none' : 'transform 0.3s ease'
                }}
                onTouchStart={(e) => handleItemTouchStart(e, item.id)}
                onTouchMove={(e) => handleItemTouchMove(e, item.id)}
                onTouchEnd={(e) => handleItemTouchEnd(e, item.id)}
                onClick={() => {
                  if (swipingId === item.id && swipeOffset < -10) return
                  onNoteClick?.(item)
                }}
              >
                <div className="w-[56px] h-[56px] rounded-lg overflow-hidden flex-shrink-0 bg-[#f5f5f5]">
                  <img src={item.image} alt="" className="w-full h-full object-cover" draggable={false} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-medium text-[#333] line-clamp-2 leading-[1.4]">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] text-[#999]">{item.author}</span>
                    {item.isLearning && (
                      <span className="text-[10px] text-[#FE2C55] bg-[#FFF0F3] px-1.5 py-0.5 rounded">{item.tag || '学习'}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Icons.Book />
                  {/* 桌面端左滑提示按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (swipingId === item.id && swipeOffset < 0) {
                        setSwipeOffset(0)
                        setSwipingId(null)
                      } else {
                        setSwipingId(item.id)
                        setSwipeOffset(-80)
                      }
                    }}
                    className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#F5F5F5] active:bg-[#EEE] transition-colors"
                    title="移出待学习"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* 左滑提示 */}
          <p className="text-center text-[11px] text-[#ccc] pt-2">← 左滑卡片可移出待学习</p>
        </div>
      </div>

      {/* 展开的学习看板视图 */}
      <div className={`absolute inset-0 transition-all duration-500 ease-out ${expanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <LearnBoardExpanded items={items} onCollapse={() => setExpanded(false)} />
      </div>
    </div>
  )
}

// ==================== 展开后的学习看板 ====================
function LearnBoardExpanded({ items, onCollapse }) {
  const { removeFromLearn } = useCollection()
  const [tasks, setTasks] = useState(items)
  const [completedCount, setCompletedCount] = useState(0)
  const [removingId, setRemovingId] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const touchStartY = useRef(0)
  const mouseStartY = useRef(0)
  const isDragging = useRef(false)

  useEffect(() => { setTasks(items) }, [items])
  const totalTasks = items.length
  const progress = totalTasks > 0 ? Math.min((completedCount / totalTasks) * 100, 100) : 0

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY }
  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientY - touchStartY.current
    if (diff > 60) onCollapse()
  }
  const handleMouseDown = (e) => { mouseStartY.current = e.clientY; isDragging.current = true }
  const handleMouseUp = (e) => {
    if (!isDragging.current) return
    isDragging.current = false
    const diff = e.clientY - mouseStartY.current
    if (diff > 60) onCollapse()
  }
  const handleWheel = (e) => {
    if (e.deltaY < -30) onCollapse()
  }

  const handleComplete = (taskId) => {
    if (removingId) return
    setRemovingId(taskId)
    if (navigator.vibrate) navigator.vibrate(10)
    setTimeout(() => {
      setTasks(prev => prev.filter(t => t.id !== taskId))
      removeFromLearn(taskId)
      setCompletedCount(prev => prev + 1)
      setRemovingId(null)
      setToastMsg('太棒了！学习积分 +10 🎉')
      setShowToast(true)
    }, 500)
  }

  return (
    <div className="h-full flex flex-col bg-[#F5F5F5] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <Toast message={toastMsg} visible={showToast} onHide={() => setShowToast(false)} />

      {/* 下划提示 + 进度头部 */}
      <div className="flex-shrink-0 bg-white pb-3 pt-2 rounded-b-2xl shadow-sm">
        <button onClick={onCollapse} className="flex flex-col items-center mb-2 w-full active:opacity-60 transition-opacity cursor-pointer">
          <div className="w-8 h-1 bg-[#ccc] rounded-full mb-1 animate-pulse" />
          <p className="text-[11px] text-[#999]">↓ 下划 / 点击 返回列表</p>
        </button>

        <div className="px-4">
          <div className="flex items-center gap-3">
            <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#FE2C55] to-[#FF8A9E] flex items-center justify-center shadow-sm">
              <span className="text-white text-[18px] font-bold">F</span>
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold text-[#333]">学习进度</span>
                <span className="text-[11px] text-[#999]">{completedCount}/{totalTasks} 已完成</span>
              </div>
              <div className="mt-2 h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-[#FE2C55] to-[#FF6B8A] rounded-full progress-fill ${completedCount > 0 ? 'progress-glow' : ''}`}
                  style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#bbb]">还剩 {tasks.length} 篇待学</span>
                <span className="text-[10px] font-semibold text-[#FE2C55]">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 任务卡片流 */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-8">
        <div className="flex flex-col gap-3">
          {tasks.map((task, index) => (
            <div key={task.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all ${
                removingId === task.id ? 'card-removing' : 'card-enter'
              }`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="p-3.5">
                <div className="flex gap-3">
                  <div className="w-[72px] h-[54px] rounded-xl overflow-hidden flex-shrink-0 bg-[#f5f5f5]">
                    <img src={task.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <h3 className="text-[13px] font-medium text-[#333] leading-[1.4] line-clamp-2">{task.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] text-[#999]">{task.author}</span>
                      <span className="text-[11px] text-[#ddd]">|</span>
                      <div className="flex items-center gap-0.5">
                        <Icons.Clock />
                        <span className="text-[11px] text-[#999]">约{Math.ceil((task.content?.length || 500) / 400)}分钟</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F5F5]">
                  <span className="text-[11px] text-[#bbb]">
                    {task.progress > 0 ? `已读 ${task.progress}%` : '未开始'}
                  </span>
                  <button onClick={() => handleComplete(task.id)}
                    className="flex items-center gap-1.5 pl-3 pr-3.5 py-[6px] bg-[#FE2C55] text-white text-[12px] font-medium rounded-full active:scale-95 transition-all shadow-[0_2px_8px_rgba(254,44,85,0.25)]">
                    <Icons.Check />
                    <span>学完</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="flex flex-col items-center py-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FE2C55]/10 to-[#FF8A9E]/10 flex items-center justify-center mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <p className="text-[16px] font-bold text-[#333]">全部学完啦！</p>
              <p className="text-[13px] text-[#999] mt-1.5">给自己点个赞 👏</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== 主 App ====================
export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedNote, setSelectedNote] = useState(null)
  const [activeNav, setActiveNav] = useState('home')
  const [showConfig, setShowConfig] = useState(false)
  const [profileInitialTab, setProfileInitialTab] = useState(null)
  const [profileInitialSubTab, setProfileInitialSubTab] = useState(null)
  const [detailFrom, setDetailFrom] = useState('home') // 记录进入详情页的来源

  const handleNoteClick = (note) => {
    setSelectedNote(note)
    setDetailFrom(currentPage === 'me' ? 'me' : 'home')
    setCurrentPage('detail')
  }

  const handleBack = () => {
    if (currentPage === 'detail') {
      if (detailFrom === 'me') {
        setCurrentPage('me')
        setActiveNav('me')
      } else {
        setCurrentPage('home')
        setActiveNav('home')
      }
      setSelectedNote(null)
    } else if (currentPage === 'me') {
      setCurrentPage('home')
      setActiveNav('home')
    } else if (currentPage === 'learn') {
      setCurrentPage('me')
      setActiveNav('me')
    }
  }

  // 跳转到个人页 - 收藏 - 待学习 Tab
  const handleGoToLearn = () => {
    setProfileInitialTab('收藏')
    setProfileInitialSubTab('待学习')
    setCurrentPage('me')
    setActiveNav('me')
  }

  const handleNav = (id) => {
    if (id === 'home') {
      setCurrentPage('home')
      setActiveNav('home')
    } else if (id === 'me') {
      setProfileInitialTab(null)
      setProfileInitialSubTab(null)
      setCurrentPage('me')
      setActiveNav('me')
    }
  }

  return (
    <CollectionProvider>
      <div className="w-full h-full max-w-[430px] mx-auto bg-white relative overflow-hidden" style={{ boxShadow: '0 0 60px rgba(0,0,0,0.15)' }}>
        {currentPage === 'home' && (
          <HomePage onNoteClick={handleNoteClick} />
        )}
        {currentPage === 'detail' && selectedNote && (
          <NoteDetail note={selectedNote} onBack={handleBack} onGoToLearn={handleGoToLearn} />
        )}
        {currentPage === 'me' && (
          <ProfilePage
            onBack={handleBack}
            onGoToLearn={handleGoToLearn}
            onNoteClick={handleNoteClick}
            initialTab={profileInitialTab}
            initialSubTab={profileInitialSubTab}
          />
        )}

        {/* 底部导航 - 首页和我的页面 */}
        {(currentPage === 'home' || currentPage === 'me') && (
          <BottomNav active={activeNav} onNavigate={handleNav} />
        )}

        {/* AI 配置入口 */}
        <button
          onClick={() => setShowConfig(true)}
          className="fixed top-14 right-3 z-50 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center active:scale-90 transition-transform border border-black/5"
          title="AI 配置"
        >
          <span className="text-[14px]">🤖</span>
        </button>

        <AIConfigPanel visible={showConfig} onClose={() => setShowConfig(false)} />
      </div>
    </CollectionProvider>
  )
}
