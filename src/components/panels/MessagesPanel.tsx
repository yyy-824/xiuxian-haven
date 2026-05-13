import { useGameStore } from '../../store/gameStore'
import { motion } from 'framer-motion'

const TYPE_CONFIG = {
  info: { icon: 'ℹ', color: 'text-spirit-light', bg: 'bg-spirit/10', border: 'border-spirit/20' },
  success: { icon: '✓', color: 'text-jade-light', bg: 'bg-jade/10', border: 'border-jade/20' },
  warning: { icon: '⚠', color: 'text-gold-light', bg: 'bg-gold/10', border: 'border-gold/20' },
  danger: { icon: '✕', color: 'text-cinnabar', bg: 'bg-cinnabar/10', border: 'border-cinnabar/20' },
  event: { icon: '✦', color: 'text-demon', bg: 'bg-demon/10', border: 'border-demon/20' },
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export function MessagesPanel() {
  const messages = useGameStore(s => s.messages)

  return (
    <div className="h-full overflow-y-auto p-4">
      <h3 className="font-display text-gold mb-3">消息记录</h3>
      {messages.length === 0 ? (
        <div className="text-center text-paper/30 mt-10">暂无消息</div>
      ) : (
        <div className="space-y-1.5">
          {messages.map((msg, i) => {
            const config = TYPE_CONFIG[msg.type]
            return (
              <motion.div
                key={msg.id}
                initial={i < 3 ? { opacity: 0, x: -10 } : false}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-2 px-3 py-2 rounded border ${config.bg} ${config.border} ${
                  !msg.read ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <span className={`${config.color} text-sm mt-0.5`}>{config.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-paper/80">{msg.text}</span>
                </div>
                <span className="text-xs text-paper/30 whitespace-nowrap">{formatTime(msg.timestamp)}</span>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
