import { useState } from 'react'
import { setApiKey, setBaseUrl, setModel, getConfigStatus } from './ai-service.js'

/**
 * AI 配置面板组件
 * 用于在 Demo 界面上直接配置 API 密钥
 */
export default function AIConfigPanel({ visible, onClose }) {
  const [key, setKey] = useState('')
  const [url, setUrl] = useState('https://api.openai.com/v1')
  const [modelName, setModelName] = useState('gpt-4o-mini')
  const [saved, setSaved] = useState(false)

  const status = getConfigStatus()

  const handleSave = () => {
    if (key.trim()) setApiKey(key.trim())
    if (url.trim()) setBaseUrl(url.trim())
    if (modelName.trim()) setModel(modelName.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-5 pb-10 sheet-up" onClick={e => e.stopPropagation()}>
        {/* 拖拽手柄 */}
        <div className="w-10 h-1 bg-[#DDD] rounded-full mx-auto mb-4" />

        <h3 className="text-[16px] font-bold text-[#333] mb-1">AI 分析配置</h3>
        <p className="text-[12px] text-[#999] mb-4">
          配置 API 密钥后，收藏时将调用真实 AI 进行内容分析分流
        </p>

        {/* 状态指示 */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${status.hasApiKey ? 'bg-green-50' : 'bg-orange-50'}`}>
          <div className={`w-2 h-2 rounded-full ${status.hasApiKey ? 'bg-green-500' : 'bg-orange-400'}`} />
          <span className="text-[12px] text-[#666]">
            {status.hasApiKey ? '已配置 - AI 分析已启用' : '未配置 - 使用本地关键词规则'}
          </span>
        </div>

        {/* 表单 */}
        <div className="space-y-3">
          <div>
            <label className="text-[12px] text-[#666] font-medium block mb-1">API Key</label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2.5 bg-[#F5F5F5] rounded-xl text-[13px] text-[#333] outline-none focus:ring-2 focus:ring-[#FE2C55]/20 transition"
            />
          </div>

          <div>
            <label className="text-[12px] text-[#666] font-medium block mb-1">API Base URL</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full px-3 py-2.5 bg-[#F5F5F5] rounded-xl text-[13px] text-[#333] outline-none focus:ring-2 focus:ring-[#FE2C55]/20 transition"
            />
            <p className="text-[10px] text-[#bbb] mt-1">支持 OpenAI 兼容格式（如 DeepSeek、智谱、通义千问等）</p>
          </div>

          <div>
            <label className="text-[12px] text-[#666] font-medium block mb-1">模型</label>
            <input
              type="text"
              value={modelName}
              onChange={e => setModelName(e.target.value)}
              placeholder="gpt-4o-mini"
              className="w-full px-3 py-2.5 bg-[#F5F5F5] rounded-xl text-[13px] text-[#333] outline-none focus:ring-2 focus:ring-[#FE2C55]/20 transition"
            />
          </div>
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          className={`w-full mt-5 py-3 rounded-xl text-[14px] font-medium transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-[#FE2C55] text-white active:scale-[0.98] shadow-[0_4px_12px_rgba(254,44,85,0.25)]'
          }`}
        >
          {saved ? '✓ 已保存' : '保存配置'}
        </button>

        {/* 说明 */}
        <div className="mt-4 p-3 bg-[#F8F8F8] rounded-xl">
          <p className="text-[11px] text-[#999] leading-relaxed">
            💡 也可以在浏览器控制台中配置：<br/>
            <code className="text-[#FE2C55]">AI.setApiKey("sk-xxx")</code><br/>
            <code className="text-[#FE2C55]">AI.setBaseUrl("https://api.deepseek.com/v1")</code><br/>
            <code className="text-[#FE2C55]">AI.setModel("deepseek-chat")</code>
          </p>
        </div>
      </div>
    </div>
  )
}
