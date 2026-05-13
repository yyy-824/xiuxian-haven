import { useGameStore } from '../store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'

export function EventModal() {
  const activeEvents = useGameStore(s => s.activeEvents)
  const disciples = useGameStore(s => s.disciples)
  const handleEventChoice = useGameStore(s => s.handleEventChoice)

  // 取最早的事件显示
  const event = activeEvents[0]
  if (!event) return null

  const disciple = disciples.find(d => d.id === event.discipleId)
  if (!disciple) return null

  const checkRequirement = (req?: Partial<{ comprehension: number; willpower: number; perception: number; luck: number; charm: number }>) => {
    if (!req) return null
    const checks: { label: string; required: number; current: number; pass: boolean }[] = []
    if (req.comprehension) checks.push({ label: '悟性', required: req.comprehension, current: disciple.stats.comprehension, pass: disciple.stats.comprehension >= req.comprehension })
    if (req.willpower) checks.push({ label: '心志', required: req.willpower, current: disciple.stats.willpower, pass: disciple.stats.willpower >= req.willpower })
    if (req.perception) checks.push({ label: '感知', required: req.perception, current: disciple.stats.perception, pass: disciple.stats.perception >= req.perception })
    if (req.luck) checks.push({ label: '气运', required: req.luck, current: disciple.stats.luck, pass: disciple.stats.luck >= req.luck })
    if (req.charm) checks.push({ label: '魅力', required: req.charm, current: disciple.stats.charm, pass: disciple.stats.charm >= req.charm })
    return checks
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-ink border border-gold/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        >
          {/* 标题 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📜</span>
            <div>
              <h3 className="font-display text-gold text-lg">探索遭遇</h3>
              <span className="text-xs text-paper/50">{disciple.name} · {disciple.realm}</span>
            </div>
          </div>

          {/* 事件文本 */}
          <div className="scroll-bg rounded-lg p-4 mb-4">
            <p className="text-sm text-ink leading-relaxed">{event.event.text}</p>
          </div>

          {/* 选项 */}
          <div className="space-y-2">
            {event.event.choices.map((choice, i) => {
              const reqs = checkRequirement(choice.requirement)
              const hasRequirement = choice.requirement && Object.keys(choice.requirement).length > 0

              return (
                <button
                  key={i}
                  onClick={() => handleEventChoice(event.id, i)}
                  className="w-full text-left p-3 rounded-lg border border-gold/20 bg-ink/60 hover:bg-gold/10 hover:border-gold/40 transition-all group"
                >
                  <div className="text-sm text-paper group-hover:text-gold transition-colors">
                    {choice.text}
                  </div>

                  {/* 需求 */}
                  {reqs && reqs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {reqs.map(r => (
                        <span
                          key={r.label}
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            r.pass
                              ? 'bg-jade/20 text-jade-light'
                              : 'bg-cinnabar/20 text-cinnabar'
                          }`}
                        >
                          {r.label}≥{r.required} ({r.current})
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 成功率提示 */}
                  {hasRequirement && (
                    <div className="text-[10px] text-paper/30 mt-1">
                      基础成功率 {Math.round(choice.outcome.successRate * 100)}%（气运加成）
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
