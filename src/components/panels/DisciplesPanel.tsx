import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { REALMS, ELEMENT_COLORS } from '../../data/constants'
import type { Disciple } from '../../data/types'
import { motion, AnimatePresence } from 'framer-motion'

function DiscipleCard({ disciple, onClick }: { disciple: Disciple; onClick: () => void }) {
  const realm = REALMS[disciple.realm]
  const power = realm.basePower + disciple.realmLevel * 10
  const hpPercent = Math.round((disciple.hp / disciple.maxHp) * 100)
  const hpColor = hpPercent > 60 ? 'bg-jade' : hpPercent > 30 ? 'bg-gold' : 'bg-cinnabar'

  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="bg-ink/60 border border-gold/10 rounded-lg p-3 cursor-pointer hover:border-gold/30 hover:bg-ink/80 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="text-xl">{disciple.gender === '男' ? '🧑' : '👩'}</div>
            {disciple.status !== 'idle' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-ink">
                <div className={`w-full h-full rounded-full ${
                  disciple.status === 'cultivating' ? 'bg-jade animate-pulse' :
                  disciple.status === 'exploring' ? 'bg-spirit animate-pulse' :
                  disciple.status === 'resting' ? 'bg-gold' : 'bg-paper/40'
                }`} />
              </div>
            )}
          </div>
          <div>
            <div className="font-display text-paper text-sm">{disciple.name}</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gold">{disciple.realm}</span>
              <span className="text-paper/30">·</span>
              <span className="text-paper/50">第{disciple.realmLevel}层</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-paper/40">战力</div>
          <div className="text-gold font-mono text-sm">{power}</div>
        </div>
      </div>

      {/* 灵根 */}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-xs text-paper/40">灵根:</span>
        {disciple.spiritualRoot.elements.map(el => (
          <span
            key={el}
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ backgroundColor: ELEMENT_COLORS[el] + '30', color: ELEMENT_COLORS[el] }}
          >
            {el}
          </span>
        ))}
        <span className="text-xs text-paper/30 ml-1">{disciple.spiritualRoot.name}</span>
      </div>

      {/* 状态 + 特质 */}
      <div className="flex items-center gap-2 mt-2">
        <StatusBadge status={disciple.status} />
        {disciple.traits.length > 0 && (
          <span className="text-xs text-purple-400/70">{disciple.traits[0].name}</span>
        )}
      </div>

      {/* HP 条 */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-paper/40 mb-0.5">
          <span>❤ {disciple.hp}/{disciple.maxHp}</span>
          <span className={hpPercent <= 30 ? 'text-cinnabar' : ''}>{hpPercent}%</span>
        </div>
        <div className="h-1.5 bg-ink/80 rounded-full overflow-hidden">
          <div
            className={`h-full ${hpColor} rounded-full transition-all`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* 修为进度条 */}
      <div className="mt-1.5">
        <div className="flex items-center justify-between text-xs text-paper/40 mb-0.5">
          <span>修为</span>
          <span>{Math.floor(disciple.cultivation)}/{realm.requiredQi || '∞'}</span>
        </div>
        <div className="h-1.5 bg-ink/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-jade to-jade-light rounded-full transition-all"
            style={{ width: `${realm.requiredQi > 0 ? Math.min(100, (disciple.cultivation / realm.requiredQi) * 100) : 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: Disciple['status'] }) {
  const config = {
    idle: { label: '空闲', color: 'bg-paper/15 text-paper/60', dot: '' },
    cultivating: { label: '修炼中', color: 'bg-jade/20 text-jade-light', dot: '🟢' },
    exploring: { label: '探索中', color: 'bg-spirit/20 text-spirit-light', dot: '🔵' },
    resting: { label: '休息中', color: 'bg-gold/20 text-gold-light', dot: '🟡' },
    crafting: { label: '炼制中', color: 'bg-cinnabar/20 text-cinnabar', dot: '🔴' },
  }
  const c = config[status]
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.color}`}>{c.label}</span>
}

function DiscipleDetail({ disciple, allDisciples }: { disciple: Disciple; allDisciples: Disciple[] }) {
  const startCultivating = useGameStore(s => s.startCultivating)
  const stopCultivating = useGameStore(s => s.stopCultivating)
  const banishDisciple = useGameStore(s => s.banishDisciple)
  const usePill = useGameStore(s => s.usePill)
  const equipArtifact = useGameStore(s => s.equipArtifact)
  const unequipArtifact = useGameStore(s => s.unequipArtifact)
  const transferCultivation = useGameStore(s => s.transferCultivation)
  const sparDisciples = useGameStore(s => s.sparDisciples)
  const pills = useGameStore(s => s.resources.pills)
  const artifacts = useGameStore(s => s.resources.artifacts)
  const [confirmBanish, setConfirmBanish] = useState(false)
  const [showPills, setShowPills] = useState(false)
  const [showArtifacts, setShowArtifacts] = useState(false)
  const [showInteract, setShowInteract] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-ink/80 border border-gold/20 rounded-lg p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-gold text-lg">{disciple.name}</h3>
          <div className="text-sm text-paper/50">{disciple.gender} · {disciple.age}岁 · {disciple.spiritualRoot.name}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-display text-gold">{disciple.realm}</div>
          <div className="text-xs text-paper/40">第{disciple.realmLevel}层</div>
        </div>
      </div>

      {/* 属性 */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <StatBar label="悟性" value={disciple.stats.comprehension} color="text-spirit" />
        <StatBar label="魅力" value={disciple.stats.charm} color="text-demon" />
        <StatBar label="气运" value={disciple.stats.luck} color="text-gold" />
        <StatBar label="心志" value={disciple.stats.willpower} color="text-cinnabar" />
        <StatBar label="感知" value={disciple.stats.perception} color="text-jade" />
      </div>

      {/* 战斗属性（含法器加成） */}
      {(() => {
        const equipped = (disciple.equippedArtifacts ?? [])
          .map(id => artifacts.find(a => a.id === id))
          .filter(Boolean) as typeof artifacts
        const bonusAtk = equipped.reduce((s, a) => s + (a.stats.attack || 0), 0)
        const bonusDef = equipped.reduce((s, a) => s + (a.stats.defense || 0), 0)
        const bonusHp = equipped.reduce((s, a) => s + (a.stats.hp || 0), 0)
        return (
          <div className="flex gap-4 text-sm">
            <div><span className="text-paper/40">生命:</span> <span className="text-cinnabar">{disciple.hp}/{disciple.maxHp + bonusHp}</span></div>
            <div><span className="text-paper/40">攻击:</span> <span className="text-gold">{disciple.attack + bonusAtk}</span></div>
            <div><span className="text-paper/40">防御:</span> <span className="text-spirit">{disciple.defense + bonusDef}</span></div>
          </div>
        )
      })()}

      {/* 特质 */}
      {disciple.traits.length > 0 && (
        <div>
          <div className="text-xs text-paper/40 mb-1">特质</div>
          <div className="flex flex-wrap gap-1">
            {disciple.traits.map(t => (
              <span key={t.id} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded" title={t.description}>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 激活的Buff */}
      {(disciple.buffs ?? []).length > 0 && (
        <div>
          <div className="text-xs text-paper/40 mb-1">增益效果</div>
          <div className="flex flex-wrap gap-1">
            {(disciple.buffs ?? []).map(b => (
              <span key={b.id} className="text-xs bg-gold/20 text-gold-light px-2 py-0.5 rounded animate-pulse">
                ✦ {b.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 丹药 */}
      <div>
        <button
          onClick={() => setShowPills(!showPills)}
          className="text-xs text-paper/40 hover:text-gold transition-colors"
        >
          {showPills ? '▼' : '▶'} 使用丹药
        </button>
        {showPills && (
          <div className="mt-1 flex flex-wrap gap-1">
            {Object.entries(pills).filter(([_, count]) => count > 0).length === 0 ? (
              <span className="text-xs text-paper/30">暂无丹药</span>
            ) : (
              Object.entries(pills)
                .filter(([_, count]) => count > 0)
                .map(([name, count]) => (
                  <button
                    key={name}
                    onClick={() => usePill(disciple.id, name)}
                    className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded hover:bg-purple-500/30 transition-colors"
                  >
                    {name} ×{count}
                  </button>
                ))
            )}
          </div>
        )}
      </div>

      {/* 法器 */}
      <div>
        <button
          onClick={() => setShowArtifacts(!showArtifacts)}
          className="text-xs text-paper/40 hover:text-gold transition-colors"
        >
          {showArtifacts ? '▼' : '▶'} 法器装备
        </button>
        {showArtifacts && (
          <div className="mt-1 space-y-2">
            {/* 已装备 */}
            <div>
              <div className="text-xs text-paper/50 mb-1">已装备 ({(disciple.equippedArtifacts ?? []).length}/3)：</div>
              {(disciple.equippedArtifacts ?? []).length === 0 ? (
                <span className="text-xs text-paper/30">未装备法器</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {(disciple.equippedArtifacts ?? []).map(aId => {
                    const art = artifacts.find(a => a.id === aId)
                    if (!art) return null
                    const qualityColors: Record<string, string> = {
                      '凡品': 'bg-paper/20 text-paper/60',
                      '灵品': 'bg-jade/20 text-jade-light',
                      '宝品': 'bg-spirit/20 text-spirit-light',
                      '仙品': 'bg-gold/20 text-gold-light',
                      '神品': 'bg-cinnabar/20 text-cinnabar',
                    }
                    return (
                      <button
                        key={aId}
                        onClick={() => unequipArtifact(disciple.id, aId)}
                        className={`text-xs px-2 py-0.5 rounded hover:bg-cinnabar/20 hover:text-cinnabar transition-colors ${qualityColors[art.quality] || ''}`}
                        title={`${art.name} - ${art.description}\n点击卸下`}
                      >
                        {art.name} ✕
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            {/* 可装备 */}
            {(disciple.equippedArtifacts ?? []).length < 3 && (
              <div>
                <div className="text-xs text-paper/50 mb-1">可装备：</div>
                <div className="flex flex-wrap gap-1">
                  {artifacts
                    .filter(a => !(disciple.equippedArtifacts ?? []).includes(a.id))
                    .map(art => {
                      const qualityColors: Record<string, string> = {
                        '凡品': 'bg-paper/10 text-paper/50',
                        '灵品': 'bg-jade/10 text-jade-light',
                        '宝品': 'bg-spirit/10 text-spirit-light',
                        '仙品': 'bg-gold/10 text-gold-light',
                        '神品': 'bg-cinnabar/10 text-cinnabar',
                      }
                      const statText = [
                        art.stats.attack ? `攻+${art.stats.attack}` : '',
                        art.stats.defense ? `防+${art.stats.defense}` : '',
                        art.stats.hp ? `血+${art.stats.hp}` : '',
                        art.stats.cultivationSpeed ? `修+${art.stats.cultivationSpeed}%` : '',
                      ].filter(Boolean).join(' ')
                      return (
                        <button
                          key={art.id}
                          onClick={() => equipArtifact(disciple.id, art.id)}
                          className={`text-xs px-2 py-0.5 rounded hover:bg-gold/20 transition-colors ${qualityColors[art.quality] || ''}`}
                          title={`${art.name} - ${art.description}\n${statText}`}
                        >
                          {art.name} ({art.quality})
                        </button>
                      )
                    })}
                  {artifacts.filter(a => !(disciple.equippedArtifacts ?? []).includes(a.id)).length === 0 && (
                    <span className="text-xs text-paper/30">无法器可用</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 弟子互动 */}
      {disciple.status === 'idle' && allDisciples.filter(d => d.id !== disciple.id && d.status === 'idle').length > 0 && (
        <div>
          <button
            onClick={() => setShowInteract(!showInteract)}
            className="text-xs text-paper/40 hover:text-gold transition-colors"
          >
            {showInteract ? '▼' : '▶'} 弟子互动
          </button>
          {showInteract && (
            <div className="mt-1 space-y-1">
              {allDisciples
                .filter(d => d.id !== disciple.id && d.status === 'idle')
                .map(other => (
                  <div key={other.id} className="flex items-center gap-2 text-xs">
                    <span className="text-paper/50 flex-1">{other.name} ({other.realm})</span>
                    <button
                      onClick={() => transferCultivation(disciple.id, other.id)}
                      className="text-jade-light hover:text-jade px-1.5 py-0.5 rounded hover:bg-jade/10 transition-colors"
                      title={`${disciple.name}传功给${other.name}（损失30%修为）`}
                    >
                      传功
                    </button>
                    <button
                      onClick={() => sparDisciples(disciple.id, other.id)}
                      className="text-gold-light hover:text-gold px-1.5 py-0.5 rounded hover:bg-gold/10 transition-colors"
                      title={`与${other.name}切磋`}
                    >
                      切磋
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="space-y-2 pt-2">
        <div className="flex gap-2">
          {disciple.status === 'idle' ? (
            <button
              onClick={() => startCultivating(disciple.id)}
              className="flex-1 bg-jade/20 text-jade-light py-2 rounded hover:bg-jade/30 transition-colors text-sm"
            >
              🧘 开始修炼
            </button>
          ) : disciple.status === 'cultivating' ? (
            <button
              onClick={() => stopCultivating(disciple.id)}
              className="flex-1 bg-cinnabar/20 text-cinnabar py-2 rounded hover:bg-cinnabar/30 transition-colors text-sm"
            >
              ⏸ 停止修炼
            </button>
          ) : (
            <div className="flex-1 text-center text-paper/40 text-sm py-2">
              {disciple.status === 'exploring' ? '🗺 探索中...' : disciple.status}
            </div>
          )}
        </div>

        {/* 逐出弟子 */}
        {disciple.status === 'idle' && (
          <div>
            {confirmBanish ? (
              <div className="flex gap-2">
                <button
                  onClick={() => { banishDisciple(disciple.id); setConfirmBanish(false) }}
                  className="flex-1 bg-cinnabar/30 text-cinnabar py-1.5 rounded hover:bg-cinnabar/40 transition-colors text-xs"
                >
                  确认逐出
                </button>
                <button
                  onClick={() => setConfirmBanish(false)}
                  className="flex-1 bg-paper/10 text-paper/50 py-1.5 rounded hover:bg-paper/20 transition-colors text-xs"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmBanish(true)}
                className="w-full text-xs text-paper/30 hover:text-cinnabar py-1 rounded hover:bg-cinnabar/10 transition-colors"
              >
                逐出弟子
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const bgColor = color.replace('text-', 'bg-')
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className={`text-xs ${color}`}>{label}</span>
        <span className="text-xs text-paper/50 font-mono">{value}</span>
      </div>
      <div className="h-2 bg-ink/80 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full progress-bar ${bgColor}`}
          style={{ width: `${Math.min(100, value)}%`, opacity: 0.3 + (value / 100) * 0.7 }}
        />
      </div>
    </div>
  )
}

export function DisciplesPanel() {
  const disciples = useGameStore(s => s.disciples)
  const recruitDisciple = useGameStore(s => s.recruitDisciple)
  const resources = useGameStore(s => s.resources)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = disciples.find(d => d.id === selectedId) || null

  return (
    <div className="h-full flex">
      {/* 弟子列表 */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${selected ? 'hidden md:block md:flex-1' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-gold">弟子 ({disciples.length})</h3>
          <button
            onClick={() => recruitDisciple()}
            disabled={resources.spiritStones < 100}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              resources.spiritStones >= 100
                ? 'bg-gold/20 text-gold hover:bg-gold/30'
                : 'bg-paper/10 text-paper/30 cursor-not-allowed'
            }`}
          >
            + 招募 (💎100)
          </button>
        </div>

        {disciples.map(d => (
          <DiscipleCard
            key={d.id}
            disciple={d}
            onClick={() => setSelectedId(d.id)}
          />
        ))}
      </div>

      {/* 详情面板 */}
      <AnimatePresence>
        {selected && (
          <div className="w-full md:w-80 p-4 overflow-y-auto border-l border-gold/10">
            <button
              onClick={() => setSelectedId(null)}
              className="text-xs text-paper/40 hover:text-paper mb-2"
            >
              ← 返回列表
            </button>
            <DiscipleDetail disciple={selected} allDisciples={disciples} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
