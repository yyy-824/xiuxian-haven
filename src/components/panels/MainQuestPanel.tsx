import { useGameStore } from '../../store/gameStore'
import { REALMS_MAP } from '../../data/constants'
import type { MainQuest } from '../../data/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const CHAPTER_TITLES: Record<number, string> = {
  1: '第一章 · 初入仙途',
  2: '第二章 · 崭露头角',
  3: '第三章 · 锋芒初露',
  4: '第四章 · 筑基之路',
  5: '第五章 · 金丹大道',
}

function getProgress(q: MainQuest, state: { disciples: any[]; haven: any; messages: any[] }): { current: number; target: number } {
  const target = q.objectiveCount
  let current = 0
  switch (q.objectiveType) {
    case 'build':
      if (q.objectiveTarget === 'building') current = state.haven.rooms.length
      else current = state.haven.rooms.filter((r: any) => r.type === q.objectiveTarget).length
      break
    case 'recruit':
      current = state.disciples.length
      break
    case 'explore':
      if (q.objectiveTarget === 'explore') current = (state.messages ?? []).filter((m: any) => m.text.includes('完成「') && m.text.includes('获得')).length
      else current = (state.messages ?? []).filter((m: any) => m.text.includes(q.objectiveTarget) && m.text.includes('完成「')).length
      break
    case 'craft':
      current = (state.messages ?? []).filter((m: any) => m.text.includes('炼丹成功')).length
      break
    case 'forge':
      current = (state.messages ?? []).filter((m: any) => m.text.includes('锻造成功')).length
      break
    case 'realm': {
      const realmIdx = REALMS_MAP[q.objectiveTarget as keyof typeof REALMS_MAP]
      if (realmIdx !== undefined) {
        current = state.disciples.some((d: any) => (REALMS_MAP[d.realm as keyof typeof REALMS_MAP] ?? 0) >= realmIdx) ? 1 : 0
      }
      break
    }
    case 'cultivate':
      current = Math.floor(state.disciples.reduce((s: number, d: any) => s + d.cultivation, 0))
      break
  }
  return { current: Math.min(current, target), target }
}

function QuestCard({ quest, isCurrent }: { quest: MainQuest; isCurrent: boolean }) {
  const [expanded, setExpanded] = useState(isCurrent)
  const disciples = useGameStore(s => s.disciples)
  const haven = useGameStore(s => s.haven)
  const messages = useGameStore(s => s.messages)
  const claimQuestReward = useGameStore(s => s.claimQuestReward)

  const progress = getProgress(quest, { disciples, haven, messages })
  const percent = Math.min(100, (progress.current / progress.target) * 100)
  const canClaim = quest.completed && !quest.rewardClaimed

  return (
    <motion.div
      layout
      onClick={() => setExpanded(!expanded)}
      className={`rounded-lg border overflow-hidden cursor-pointer transition-all ${
        quest.rewardClaimed
          ? 'border-jade/30 bg-jade/5'
          : canClaim
          ? 'border-gold/50 bg-gold/10 shadow-lg shadow-gold/20 animate-pulse'
          : quest.completed
          ? 'border-gold/40 bg-gold/5'
          : isCurrent
          ? 'border-gold/30 bg-ink/40 hover:border-gold/40'
          : quest.unlocked
          ? 'border-gold/15 bg-ink/40 hover:border-gold/30'
          : 'border-paper/10 bg-ink/20 opacity-50'
      }`}
    >
      {/* 标题行 */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {quest.rewardClaimed ? '✅' : canClaim ? '🎁' : isCurrent ? '📜' : quest.unlocked ? '📋' : '🔒'}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-display ${quest.rewardClaimed ? 'text-jade-light' : canClaim ? 'text-gold' : isCurrent ? 'text-gold/80' : 'text-paper/60'}`}>
                {quest.title}
              </span>
              {quest.rewardClaimed && (
                <span className="text-[10px] text-jade-light bg-jade/10 px-1.5 py-0 rounded">已完成</span>
              )}
              {canClaim && (
                <span className="text-[10px] text-gold bg-gold/20 px-1.5 py-0 rounded animate-pulse">领取奖励</span>
              )}
            </div>
            <div className="text-[10px] text-paper/30 mt-0.5">{CHAPTER_TITLES[quest.chapter]}</div>
          </div>
        </div>
        {!quest.completed && quest.unlocked && (
          <div className="text-right shrink-0">
            <div className="text-[10px] text-paper/40">{progress.current}/{progress.target}</div>
            <div className="w-16 h-1.5 bg-ink/60 rounded-full mt-0.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full progress-bar"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 展开内容 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 pb-3 border-t border-gold/5">
              {/* 剧情文本 */}
              <div className="scroll-bg rounded-lg p-3 my-2 text-xs leading-relaxed whitespace-pre-line">
                {quest.narrative}
              </div>

              {/* 目标 */}
              {!quest.completed && quest.unlocked && (
                <div className="mt-2">
                  <div className="text-xs text-paper/50 mb-1">📌 当前目标</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-paper/80">{quest.objective}</span>
                    <span className="text-xs text-gold/70">({progress.current}/{progress.target})</span>
                  </div>
                </div>
              )}

              {/* 奖励 */}
              <div className="mt-2">
                <div className="text-xs text-paper/50 mb-1">🎁 奖励</div>
                <div className="text-xs text-gold/80">{quest.reward.description || '完成获得奖励'}</div>
              </div>

              {/* 领取按钮 */}
              {canClaim && (
                <button
                  onClick={(e) => { e.stopPropagation(); claimQuestReward(quest.id) }}
                  className="mt-3 w-full py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-gold/30 to-gold-light/30 text-gold hover:from-gold/40 hover:to-gold-light/40 transition-all btn-press border border-gold/30"
                >
                  🎁 领取奖励
                </button>
              )}

              {/* 已领取提示 */}
              {quest.rewardClaimed && (
                <div className="mt-2 text-xs text-jade-light/60 text-center">✓ 奖励已领取</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function MainQuestPanel() {
  const mainQuests = useGameStore(s => s.mainQuests)
  const quests = mainQuests ?? []
  const currentIdx = quests.findIndex(q => q.unlocked && !q.completed)
  const completedCount = quests.filter(q => q.rewardClaimed).length

  // 按章节分组
  const chapters = new Map<number, MainQuest[]>()
  for (const q of quests) {
    if (!chapters.has(q.chapter)) chapters.set(q.chapter, [])
    chapters.get(q.chapter)!.push(q)
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* 总览 */}
      <div className="scroll-bg rounded-lg p-4 border border-gold/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg text-ink">📜 主线剧情</h2>
            <p className="text-xs text-ink/50 mt-1">青云洞天的崛起之路</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display text-gold">{completedCount}/{quests.length}</div>
            <div className="text-[10px] text-ink/40">已完成</div>
          </div>
        </div>
        {/* 总进度条 */}
        <div className="mt-3 h-2 bg-ink/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold via-gold-light to-gold rounded-full progress-bar"
            style={{ width: `${quests.length > 0 ? (completedCount / quests.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 任务列表（按章节） */}
      {[...chapters.entries()].map(([chapter, chapterQuests]) => (
        <div key={chapter}>
          <h3 className="font-display text-gold/80 text-sm mb-2 flex items-center gap-2">
            <span>{CHAPTER_TITLES[chapter] || `第${chapter}章`}</span>
            <span className="text-[10px] text-paper/20">
              {chapterQuests.filter(q => q.rewardClaimed).length}/{chapterQuests.length}
            </span>
          </h3>
          <div className="space-y-2">
            {chapterQuests.map((q, i) => (
              <QuestCard
                key={q.id}
                quest={q}
                isCurrent={i === 0 && q.unlocked && !q.completed && quests.indexOf(q) === currentIdx}
              />
            ))}
          </div>
        </div>
      ))}

      {/* 全部完成 */}
      {completedCount === quests.length && quests.length > 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎉</div>
          <div className="font-display text-gold text-lg">第一卷 · 完</div>
          <div className="text-xs text-paper/40 mt-1">敬请期待后续章节……</div>
        </div>
      )}
    </div>
  )
}
