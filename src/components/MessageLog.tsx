import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'

const TYPE_STYLES = {
  info: { icon: 'ℹ', color: 'text-spirit-light' },
  success: { icon: '✓', color: 'text-jade-light' },
  warning: { icon: '⚠', color: 'text-gold-light' },
  danger: { icon: '✕', color: 'text-cinnabar' },
  event: { icon: '✦', color: 'text-demon' },
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}

type DisplayMode = 'hidden' | 'collapsed' | 'expanded'

export function MessageLog() {
  const messages = useGameStore(s => s.messages)
  const [mode, setMode] = useState<DisplayMode>('collapsed')
  const [paused, setPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevCountRef = useRef(messages.length)
  const prevModeRef = useRef(mode)

  const unreadCount = messages.filter(m => !m.read).length

  // 新消息到达时，如果隐藏状态则闪烁提示
  useEffect(() => {
    if (mode === 'hidden' && messages.length > prevCountRef.current) {
      // 不自动弹出，但 unreadCount 会变化
    }
    prevCountRef.current = messages.length
  }, [messages.length, mode])

  // 展开时滚到底
  useEffect(() => {
    if (mode === 'expanded' && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight
      }, 50)
    }
  }, [mode, messages.length])

  // 从隐藏→收起时也滚到底
  useEffect(() => {
    if (mode === 'collapsed' && prevModeRef.current === 'hidden') {
      // just switched from hidden
    }
    prevModeRef.current = mode
  }, [mode])

  const recentMessages = messages.slice(0, 3)
  const expandedMessages = messages.slice(0, 80)

  // 隐藏模式：只显示一个小按钮
  if (mode === 'hidden') {
    return (
      <div className="absolute bottom-3 left-3 z-50">
        <button
          onClick={() => setMode('collapsed')}
          className="relative w-10 h-10 rounded-full bg-ink/90 border border-gold/20 flex items-center justify-center hover:border-gold/40 hover:bg-ink transition-all shadow-lg shadow-black/30"
          title="显示消息"
        >
          <span className="text-base">📜</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-cinnabar text-paper text-[9px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="absolute bottom-0 left-0 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {/* 展开模式 */}
        <AnimatePresence>
          {mode === 'expanded' && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-2 mb-1"
            >
              <div className="bg-ink/95 border border-gold/20 rounded-lg backdrop-blur-md shadow-2xl shadow-black/40 w-[400px] max-h-[50vh] flex flex-col">
                {/* 头部 */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-gold/10">
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-xs font-display">📜 消息</span>
                    {unreadCount > 0 && (
                      <span className="bg-cinnabar text-paper text-[10px] rounded-full px-1.5 py-0 animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPaused(!paused)}
                      className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                        paused ? 'bg-cinnabar/20 text-cinnabar' : 'text-paper/40 hover:text-paper/60'
                      }`}
                      title={paused ? '继续滚动' : '暂停滚动'}
                    >
                      {paused ? '⏸' : '▶'}
                    </button>
                    <button
                      onClick={() => setMode('collapsed')}
                      className="text-paper/40 hover:text-paper text-[10px] px-1.5 py-0.5 rounded hover:bg-paper/10 transition-colors"
                    >
                      ▼ 收起
                    </button>
                    <button
                      onClick={() => setMode('hidden')}
                      className="text-paper/40 hover:text-cinnabar text-[10px] px-1.5 py-0.5 rounded hover:bg-cinnabar/10 transition-colors"
                      title="隐藏消息栏"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* 消息列表 */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-3 py-2 space-y-1 min-h-[120px] max-h-[40vh]"
                >
                  {[...expandedMessages].reverse().map((msg) => {
                    const style = TYPE_STYLES[msg.type]
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-1.5 text-xs leading-relaxed transition-opacity ${
                          msg.read ? 'opacity-40' : 'opacity-100'
                        }`}
                      >
                        <span className={`${style.color} mt-0.5 shrink-0 w-3 text-center`}>{style.icon}</span>
                        <span className="text-paper/80 break-words flex-1">{msg.text}</span>
                        <span className="text-paper/20 shrink-0 text-[10px] mt-0.5">{formatTime(msg.timestamp)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 收起状态 — 紧凑条 */}
        {mode === 'collapsed' && (
          <div className="mx-2 mb-2">
            <div
              onClick={() => setMode('expanded')}
              className="bg-ink/80 border border-gold/10 rounded-lg backdrop-blur-sm px-3 py-1.5 w-[320px] cursor-pointer hover:border-gold/25 transition-all group hover:shadow-lg hover:shadow-black/20"
            >
              <div className="space-y-0.5">
                {recentMessages.map(msg => {
                  const style = TYPE_STYLES[msg.type]
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-center gap-1.5 text-[11px] leading-snug ${
                        msg.read ? 'opacity-25' : 'opacity-80'
                      }`}
                    >
                      <span className={`${style.color} shrink-0 w-3 text-center text-[10px]`}>{style.icon}</span>
                      <span className="text-paper/60 truncate flex-1">{msg.text}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-between mt-1 pt-0.5 border-t border-gold/5">
                <span className="text-[9px] text-paper/15">点击展开</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="text-[9px] text-cinnabar/50">{unreadCount}新</span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setMode('hidden') }}
                    className="text-[9px] text-paper/20 hover:text-cinnabar transition-colors"
                    title="隐藏"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
