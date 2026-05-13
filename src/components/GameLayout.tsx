import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { HavenPanel } from './panels/HavenPanel'
import { DisciplesPanel } from './panels/DisciplesPanel'
import { ExplorePanel } from './panels/ExplorePanel'
import { MainQuestPanel } from './panels/MainQuestPanel'
import { TopBar } from './TopBar'
import { MessageLog } from './MessageLog'
import { EventModal } from './EventModal'
import { VisitorModal } from './VisitorModal'
import { motion, AnimatePresence } from 'framer-motion'

type Tab = 'haven' | 'disciples' | 'explore' | 'quest'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'haven', label: '洞府', icon: '🏛' },
  { key: 'disciples', label: '弟子', icon: '⚔' },
  { key: 'explore', label: '探索', icon: '🗺' },
  { key: 'quest', label: '主线', icon: '📜' },
]

export function GameLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('haven')
  const tick = useGameStore(s => s.tick)
  const settings = useGameStore(s => s.settings)
  const saveGame = useGameStore(s => s.saveGame)
  const tickRef = useRef(tick)
  tickRef.current = tick

  // 游戏主循环
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current()
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // 自动保存
  useEffect(() => {
    if (!settings.autoSave) return
    const interval = setInterval(() => {
      saveGame()
    }, settings.autoSaveInterval)
    return () => clearInterval(interval)
  }, [settings.autoSave, settings.autoSaveInterval, saveGame])

  return (
    <div className="h-full flex flex-col bg-ink-texture relative">
      <TopBar />

      {/* 标签栏 */}
      <div className="flex border-b border-gold/20 bg-ink/80 backdrop-blur-sm">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 py-3 px-2 text-sm font-display transition-all relative btn-press
              ${activeTab === tab.key
                ? 'text-gold bg-gold/10'
                : 'text-paper/50 hover:text-paper/80 hover:bg-paper/5'
              }
            `}
          >
            <span className="mr-1.5 text-base">{tab.icon}</span>
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-gold/50 via-gold to-gold/50 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'haven' && <HavenPanel />}
            {activeTab === 'disciples' && <DisciplesPanel />}
            {activeTab === 'explore' && <ExplorePanel />}
            {activeTab === 'quest' && <MainQuestPanel />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 常驻消息日志 - 左下角 */}
      <MessageLog />

      {/* 探索事件弹窗 */}
      <EventModal />

      {/* 访客弹窗 */}
      <VisitorModal />
    </div>
  )
}
