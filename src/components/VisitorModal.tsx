import { useGameStore } from '../store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'

const VISITOR_TYPE_LABELS = {
  merchant: { icon: '🏪', label: '商人' },
  seeker: { icon: '🧙', label: '求道者' },
  benefactor: { icon: '✨', label: '仙人' },
  rival: { icon: '⚔', label: '挑战者' },
}

export function VisitorModal() {
  const activeVisitor = useGameStore(s => s.activeVisitor)
  const handleVisitor = useGameStore(s => s.handleVisitor)

  if (!activeVisitor || !activeVisitor.visitor) return null

  const visitor = activeVisitor.visitor
  const typeInfo = VISITOR_TYPE_LABELS[visitor.type]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-ink border border-gold/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        >
          {/* 标题 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{typeInfo.icon}</span>
            <div>
              <h3 className="font-display text-gold text-lg">{visitor.name}</h3>
              <span className="text-xs text-paper/50">{typeInfo.label}</span>
            </div>
          </div>

          {/* 描述 */}
          <div className="scroll-bg rounded-lg p-4 mb-4">
            <p className="text-sm text-ink leading-relaxed">{visitor.description}</p>
          </div>

          {/* 选项 */}
          <div className="space-y-2">
            {visitor.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleVisitor(i)}
                className="w-full text-left p-3 rounded-lg border border-gold/20 bg-ink/60 hover:bg-gold/10 hover:border-gold/40 transition-all group"
              >
                <div className="text-sm text-paper group-hover:text-gold transition-colors">
                  {option.text}
                </div>
                {option.requirement && (
                  <div className="text-[10px] text-paper/30 mt-1">
                    {option.requirement.charm && `需要魅力≥${option.requirement.charm}`}
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
