import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { generateDynamicTask } from '../../data/constants'
import { motion } from 'framer-motion'

const EXPLORATIONS = [
  { name: '黑风山探秘', icon: '⛰', type: '探索' as const, difficulty: 1, duration: '1分钟', durationMs: 60000, desc: '黑风山中传闻有古修遗迹', rewards: '💎50 · 📈修为20', rewardData: { spiritStones: 50, cultivation: 20 }, recommended: 15 },
  { name: '剿灭妖兽', icon: '🐉', type: '讨伐' as const, difficulty: 2, duration: '2分钟', durationMs: 120000, desc: '山下村庄受妖兽侵扰', rewards: '💎100 · 📈修为50', rewardData: { spiritStones: 100, cultivation: 50 }, recommended: 25 },
  { name: '灵药采集', icon: '🌿', type: '采集' as const, difficulty: 1, duration: '1.5分钟', durationMs: 90000, desc: '深谷中有珍稀灵药', rewards: '💎30 · 📈修为10', rewardData: { spiritStones: 30, cultivation: 10 }, recommended: 15 },
  { name: '宗门大比', icon: '🏆', type: '历练' as const, difficulty: 3, duration: '3分钟', durationMs: 180000, desc: '参加宗门弟子比武', rewards: '💎200 · 📈修为100', rewardData: { spiritStones: 200, cultivation: 100 }, recommended: 50 },
  { name: '小秘境', icon: '🌀', type: '秘境' as const, difficulty: 4, duration: '5分钟', durationMs: 300000, desc: '小型秘境，内有宝物和危险', rewards: '💎500 · 📈修为300', rewardData: { spiritStones: 500, cultivation: 300 }, recommended: 100 },
]

function getDynamicTasks(havenLevel: number, gameTime: number) {
  return Array.from({ length: 3 }, () => generateDynamicTask(havenLevel, gameTime))
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="text-gold text-xs">
      {'★'.repeat(level)}{'☆'.repeat(5 - level)}
    </span>
  )
}

export function ExplorePanel() {
  const disciples = useGameStore(s => s.disciples)
  const tasks = useGameStore(s => s.tasks)
  const haven = useGameStore(s => s.haven)
  const gameTime = useGameStore(s => s.gameTime)
  const startExploration = useGameStore(s => s.startExploration)
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [selectedDisciple, setSelectedDisciple] = useState<string | null>(null)
  const [dynamicTasks] = useState(() => getDynamicTasks(haven.level, gameTime))

  const activeEvents = useGameStore(s => s.activeEvents)
  const idleDisciples = disciples.filter(d => d.status === 'idle')

  const handleStart = () => {
    if (selectedTask !== null && selectedDisciple) {
      const isDynamic = selectedTask >= EXPLORATIONS.length
      if (isDynamic) {
        const dynIdx = selectedTask - EXPLORATIONS.length
        const task = dynamicTasks[dynIdx]
        startExploration(selectedDisciple, task)
      } else {
        const exp = EXPLORATIONS[selectedTask]
        startExploration(selectedDisciple, {
          name: exp.name,
          type: exp.type,
          duration: exp.durationMs,
          difficulty: exp.difficulty,
          rewards: exp.rewardData,
        })
      }
      setSelectedTask(null)
      setSelectedDisciple(null)
    }
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* 进行中的探索 */}
      {tasks.length > 0 && (
        <div>
          <h3 className="font-display text-gold mb-3">进行中的探索</h3>
          <div className="space-y-2">
            {tasks.map(task => {
              const elapsed = gameTime - task.startTime
              const progress = Math.min(100, (elapsed / task.duration) * 100)
              const remaining = Math.max(0, task.duration - elapsed)
              const disciple = disciples.find(d => d.currentTask?.id === task.id)

              return (
                <div key={task.id} className="bg-ink/60 border border-spirit/20 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-paper text-sm">{task.name}</span>
                      {disciple && <span className="text-xs text-paper/40 ml-2">— {disciple.name}</span>}
                      {activeEvents.some(e => e.taskId === task.id) && (
                        <span className="text-xs text-cinnabar ml-2 animate-pulse">⚠ 事件发生！</span>
                      )}
                    </div>
                    <span className="text-xs text-spirit-light">
                      {Math.ceil(remaining / 1000)}秒
                    </span>
                  </div>
                  <div className="h-2 bg-ink/80 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-spirit to-spirit-light rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 可选探索 */}
      <div>
        <h3 className="font-display text-gold mb-3">探索任务</h3>
        <div className="space-y-2">
          {EXPLORATIONS.map((exp, i) => (
            <motion.div
              key={i}
              onClick={() => setSelectedTask(selectedTask === i ? null : i)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`bg-ink/60 border rounded-lg p-3 cursor-pointer transition-all card-hover ${
                selectedTask === i ? 'border-gold/40 bg-gold/5 shadow-lg shadow-gold/5' : 'border-gold/10 hover:border-gold/25'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{exp.icon}</span>
                  <div>
                    <div className="text-paper text-sm">{exp.name}</div>
                    <div className="text-xs text-paper/40">{exp.desc}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <DifficultyStars level={exp.difficulty} />
                  <div className="text-xs text-paper/30 mt-0.5">⏱ {exp.duration}</div>
                  <div className="text-[10px] text-paper/20 mt-0.5">推荐战力 ≥{exp.recommended}</div>
                </div>
              </div>
              <div className="text-xs text-gold/70 mt-1">奖励: {exp.rewards}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 动态任务 */}
      <div>
        <h3 className="font-display text-gold mb-3">动态任务 <span className="text-xs text-paper/30">（随时间递进）</span></h3>
        <div className="space-y-2">
          {dynamicTasks.map((task, i) => {
            const durationStr = task.duration >= 60000 ? `${Math.round(task.duration / 60000)}分钟` : `${Math.round(task.duration / 1000)}秒`
            const idx = EXPLORATIONS.length + i
            return (
              <motion.div
                key={i}
                onClick={() => setSelectedTask(selectedTask === idx ? null : idx)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`bg-ink/60 border rounded-lg p-3 cursor-pointer transition-all card-hover ${
                  selectedTask === idx ? 'border-gold/40 bg-gold/5 shadow-lg shadow-gold/5' : 'border-gold/10 hover:border-gold/25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-paper text-sm">{task.name}</span>
                    <span className="text-xs text-paper/30 ml-2">{task.type}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <DifficultyStars level={Math.min(5, task.difficulty)} />
                    <div className="text-xs text-paper/30 mt-0.5">⏱ {durationStr}</div>
                  </div>
                </div>
                <div className="text-xs text-gold/70 mt-1">奖励: 💎{task.rewards.spiritStones} · 📈修为{task.rewards.cultivation}</div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 选择弟子出发 */}
      {selectedTask !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ink/80 border border-gold/20 rounded-lg p-4"
        >
          <h4 className="text-sm text-gold mb-2">选择弟子出发</h4>
          {idleDisciples.length === 0 ? (
            <div className="text-sm text-paper/40">没有空闲弟子</div>
          ) : (
            <div className="space-y-1 mb-3">
              {idleDisciples.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDisciple(d.id)}
                  className={`w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                    selectedDisciple === d.id
                      ? 'bg-gold/20 text-gold'
                      : 'text-paper/60 hover:bg-paper/5'
                  }`}
                >
                  {d.name} · {d.realm} · 战力{d.attack + d.defense} · ❤{d.hp}/{d.maxHp}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleStart}
            disabled={!selectedDisciple}
            className={`w-full py-2 rounded text-sm transition-colors ${
              selectedDisciple
                ? 'bg-gold/20 text-gold hover:bg-gold/30'
                : 'bg-paper/10 text-paper/30 cursor-not-allowed'
            }`}
          >
            出发！
          </button>
        </motion.div>
      )}
    </div>
  )
}
