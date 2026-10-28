import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { ROOM_TEMPLATES, PILL_RECIPES, FORGING_RECIPES } from '../../data/constants'
import type { RoomType, Room } from '../../data/types'
import { motion } from 'framer-motion'

const ROOM_ICONS: Record<RoomType, string> = {
  '修炼室': '🧘', '丹房': '⚗', '炼器房': '🔨', '聚灵阵': '🌀',
  '藏经阁': '📚', '灵田': '🌱', '灵矿': '⛏', '会客厅': '🏯',
  '寝殿': '🛏', '练功场': '⚔', '秘境入口': '🌀', '护山大阵': '🛡',
}

const QUALITY_COLORS: Record<string, string> = {
  '凡品': 'text-paper/60',
  '灵品': 'text-jade-light',
  '宝品': 'text-spirit-light',
  '仙品': 'text-gold-light',
  '神品': 'text-cinnabar',
}

const QUALITY_BG: Record<string, string> = {
  '凡品': 'bg-paper/10',
  '灵品': 'bg-jade/10',
  '宝品': 'bg-spirit/10',
  '仙品': 'bg-gold/10',
  '神品': 'bg-cinnabar/10',
}

function CraftingSection({ room }: { room: Room }) {
  const resources = useGameStore(s => s.resources)
  const craftPill = useGameStore(s => s.craftPill)
  const forgeArtifact = useGameStore(s => s.forgeArtifact)
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null)

  const recipes = room.type === '丹房' ? PILL_RECIPES : FORGING_RECIPES
  const craftFn = room.type === '丹房' ? craftPill : forgeArtifact

  const canCraft = (materials: Record<string, number>, cost: number) => {
    if (resources.spiritStones < cost) return false
    for (const [mat, amt] of Object.entries(materials)) {
      if ((resources.materials[mat] || 0) < amt) return false
    }
    return true
  }

  return (
    <div className="mt-3 pt-3 border-t border-gold/10">
      <div className="text-xs text-paper/50 mb-2 font-medium">
        {room.type === '丹房' ? '⚗ 炼丹配方' : '🔨 锻造配方'}
      </div>
      <div className="space-y-1.5">
        {recipes.map(recipe => {
          const isPill = room.type === '丹房'
          const name = isPill ? (recipe as typeof PILL_RECIPES[0]).name : (recipe as typeof FORGING_RECIPES[0]).name
          const quality = isPill ? (recipe as typeof PILL_RECIPES[0]).quality : (recipe as typeof FORGING_RECIPES[0]).artifact.quality
          const desc = isPill ? (recipe as typeof PILL_RECIPES[0]).description : (recipe as typeof FORGING_RECIPES[0]).artifact.description
          const materials = recipe.materials
          const cost = recipe.spiritStoneCost
          const rate = recipe.baseSuccessRate
          const craftable = canCraft(materials, cost)
          const isExpanded = expandedRecipe === recipe.id

          return (
            <div key={recipe.id} className="rounded-lg border border-gold/10 overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); setExpandedRecipe(isExpanded ? null : recipe.id) }}
                className={`w-full text-left p-2.5 transition-all ${craftable ? 'hover:bg-gold/5' : 'opacity-60'} ${QUALITY_BG[quality] || ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${QUALITY_COLORS[quality] || ''}`}>{name}</span>
                    <span className={`text-[10px] px-1 py-0 rounded ${QUALITY_COLORS[quality]} bg-ink/30`}>{quality}</span>
                    <span className="text-[10px] text-paper/30">{desc}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-paper/30">成功率 {Math.round(rate * 100)}%</span>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-2.5 pb-2.5 border-t border-gold/5"
                >
                  <div className="flex flex-wrap gap-2 mt-2 text-[10px]">
                    <span className={resources.spiritStones >= cost ? 'text-gold' : 'text-cinnabar'}>
                      💎{cost}
                    </span>
                    {Object.entries(materials).map(([mat, amt]) => (
                      <span key={mat} className={(resources.materials[mat] || 0) >= amt ? 'text-qi' : 'text-cinnabar'}>
                        {mat}×{amt} ({resources.materials[mat] || 0})
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      craftFn(recipe.id)
                    }}
                    disabled={!craftable}
                    className={`mt-2 w-full py-1.5 rounded text-xs font-medium transition-all ${
                      craftable
                        ? 'bg-gold/20 text-gold hover:bg-gold/30 btn-press'
                        : 'bg-paper/5 text-paper/30 cursor-not-allowed'
                    }`}
                  >
                    {room.type === '丹房' ? '🔥 开始炼丹' : '🔨 开始锻造'}
                  </button>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function HavenPanel() {
  const haven = useGameStore(s => s.haven)
  const resources = useGameStore(s => s.resources)
  const disciples = useGameStore(s => s.disciples)
  const buildRoom = useGameStore(s => s.buildRoom)
  const upgradeRoom = useGameStore(s => s.upgradeRoom)
  const upgradeHaven = useGameStore(s => s.upgradeHaven)
  const assignToRoom = useGameStore(s => s.assignToRoom)
  const unassignFromRoom = useGameStore(s => s.unassignFromRoom)
  const [showBuild, setShowBuild] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const buildableRooms: RoomType[] = ['修炼室', '丹房', '炼器房', '聚灵阵', '藏经阁', '灵田', '灵矿', '会客厅', '寝殿', '练功场']

  return (
    <div className="h-full overflow-y-auto px-8 pt-8 pb-28">
      <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="mb-2 text-xs tracking-[0.28em] text-gold/70">青云山 · 洞府纪事</p>
          <h1 className="font-display text-3xl tracking-wide text-paper">洞府经营</h1>
          <p className="mt-2 text-sm text-paper/60">经营山门，安顿弟子，积蓄灵气。</p>
        </div>
        <span className="border-l border-gold/30 pl-4 text-sm text-gold/80">洞府等级 <strong className="ml-2 font-display text-xl text-gold-light">{haven.level}</strong></span>
      </div>
      {/* 洞府概览 */}
      <div className="scroll-bg rounded-xl p-6 border border-gold/30 shadow-xl shadow-black/10">
        <div className="flex items-center justify-between mb-5">
          <div><p className="mb-1 text-xs tracking-[0.2em] text-ink/55">山门气象</p><h2 className="font-display text-xl text-ink">洞府概览</h2></div>
          {haven.level < 10 && (
            <button
              onClick={upgradeHaven}
              className="text-sm bg-[#54452f] text-paper px-4 py-2 rounded-lg hover:bg-[#6b5739] transition-colors btn-press"
            >
              ⬆ 升级洞府 (Lv.{haven.level}→{haven.level + 1})
            </button>
          )}
          {haven.level >= 10 && (
            <span className="text-xs text-gold/60">已满级</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div className="border-l border-ink/15 pl-4">
            <div className="text-ink/70">灵气浓度</div>
            <div className="text-jade font-display text-2xl mt-1">{haven.spiritualDensity.toFixed(1)}</div>
          </div>
          <div className="border-l border-ink/15 pl-4">
            <div className="text-ink/70">护山强度</div>
            <div className="text-spirit font-display text-2xl mt-1">{haven.defense}</div>
          </div>
          <div className="border-l border-ink/15 pl-4">
            <div className="text-ink/70">建筑数</div>
            <div className="text-cinnabar font-display text-2xl mt-1">{haven.rooms.length}</div>
          </div>
        </div>
        {/* 升级费用提示 */}
        {haven.level < 10 && (
          <div className="mt-5 pt-4 border-t border-ink/10 text-xs text-ink/70 flex flex-wrap gap-3">
            <span>升级费用：</span>
            <span className={resources.spiritStones >= haven.level * 200 ? 'text-[#66502d]' : 'text-cinnabar'}>💎{haven.level * 200}</span>
            <span className={(resources.materials['灵草'] || 0) >= haven.level * 10 ? 'text-[#66502d]' : 'text-cinnabar'}>灵草×{haven.level * 10}</span>
            <span className={(resources.materials['矿石'] || 0) >= haven.level * 10 ? 'text-[#66502d]' : 'text-cinnabar'}>矿石×{haven.level * 10}</span>
            {haven.level >= 3 && <span className={(resources.materials['精铁'] || 0) >= haven.level * 5 ? 'text-[#66502d]' : 'text-cinnabar'}>精铁×{haven.level * 5}</span>}
            {haven.level >= 5 && <span className={(resources.materials['妖丹'] || 0) >= haven.level * 3 ? 'text-[#66502d]' : 'text-cinnabar'}>妖丹×{haven.level * 3}</span>}
            {haven.level >= 7 && <span className={(resources.materials['灵石矿'] || 0) >= (haven.level - 5) * 2 ? 'text-[#66502d]' : 'text-cinnabar'}>灵石矿×{(haven.level - 5) * 2}</span>}
          </div>
        )}
      </div>

      {/* 建筑列表 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div><p className="mb-1 text-xs tracking-[0.2em] text-gold/60">山门营造</p><h3 className="font-display text-xl text-paper">洞府建筑 <span className="ml-1 text-sm text-paper/50">{haven.rooms.length}</span></h3></div>
          <button
            onClick={() => setShowBuild(!showBuild)}
            className="text-sm bg-gold text-ink font-medium px-4 py-2 rounded-lg hover:bg-gold-light transition-colors btn-press"
          >
            {showBuild ? '取消' : '+ 建造'}
          </button>
        </div>

        {/* 建造菜单 */}
        {showBuild && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 grid grid-cols-2 gap-2"
          >
            {buildableRooms.map(type => {
              const template = ROOM_TEMPLATES[type]
              const cost = template.upgradeCost
              const canAfford = (!cost.spiritStones || resources.spiritStones >= cost.spiritStones)
                && (!cost.materials || Object.entries(cost.materials).every(([mat, amt]) => (resources.materials[mat] || 0) >= amt))

              return (
                <button
                  key={type}
                  onClick={() => { buildRoom(type); setShowBuild(false) }}
                  disabled={!canAfford}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    canAfford
                      ? 'border-gold/30 bg-ink/50 hover:bg-gold/10 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5'
                      : 'border-paper/10 bg-ink/30 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{ROOM_ICONS[type]}</span>
                    <span className="font-display text-sm text-paper">{type}</span>
                  </div>
                  <div className="text-xs text-paper/50 mb-2">{template.description}</div>
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {cost.spiritStones ? (
                      <span className={resources.spiritStones >= cost.spiritStones ? 'text-gold' : 'text-cinnabar'}>
                        💎{cost.spiritStones}
                      </span>
                    ) : null}
                    {cost.materials && Object.entries(cost.materials).map(([mat, amt]) => (
                      <span key={mat} className={(resources.materials[mat] || 0) >= amt ? 'text-qi' : 'text-cinnabar'}>
                        {mat}×{amt}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </motion.div>
        )}

        {/* 已建建筑 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {haven.rooms.map(room => (
            <motion.div
              key={room.id}
              layout
              className="bg-[#202337]/95 border border-gold/20 rounded-xl p-5 hover:border-gold/50 card-hover transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/15 bg-gold/10 text-2xl">{ROOM_ICONS[room.type]}</span>
                  <div>
                    <div className="font-display text-paper text-base">
                      {room.type}
                      <span className="text-gold/60 text-xs ml-1">Lv.{room.level}</span>
                    </div>
                    <div className="text-sm text-paper/60 mt-1">{room.description}</div>
                    {/* 产出摘要 */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {room.production.spiritStones ? <span className="text-xs text-gold/80">💎{room.production.spiritStones}/min</span> : null}
                      {room.production.spiritualEnergy ? <span className="text-xs text-spirit-light/80">🌀{room.production.spiritualEnergy}/min</span> : null}
                      {room.production.cultivationSpeed ? <span className="text-xs text-jade-light/80">📈修炼+{room.production.cultivationSpeed}%</span> : null}
                      {room.production.materials?.map(m => (
                        <span key={m.type} className="text-xs text-qi/80">📦{m.type}×{m.amount}/min</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-paper/70">
                    👥 {room.assignedDisciples.length}/{room.capacity}
                  </div>
                  {room.level < room.maxLevel && (
                    <button
                      onClick={(e) => { e.stopPropagation(); upgradeRoom(room.id) }}
                      className="text-xs text-gold hover:text-gold-light mt-1 px-2 py-0.5 rounded hover:bg-gold/10 transition-colors"
                    >
                      ⬆ 升级
                    </button>
                  )}
                </div>
              </div>

              <button type="button" onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)} aria-expanded={selectedRoom === room.id} className="mt-4 w-full border-t border-gold/10 pt-3 text-left text-sm text-gold hover:text-gold-light">{selectedRoom === room.id ? "收起详情 ↑" : "查看建筑详情 ↓"}</button>

              {/* 展开详情 */}
              {selectedRoom === room.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 pt-3 border-t border-gold/10"
                >
                  {/* 分配弟子 */}
                  {room.capacity > 0 && (
                    <div>
                      <div className="text-xs text-paper/60 mb-1">分配弟子：</div>
                      <div className="flex flex-wrap gap-1">
                        {room.assignedDisciples.map(dId => {
                          const d = disciples.find(x => x.id === dId)
                          return d ? (
                            <button
                              key={dId}
                              onClick={(e) => { e.stopPropagation(); unassignFromRoom(dId) }}
                              className="text-xs bg-jade/20 text-jade-light px-2 py-0.5 rounded hover:bg-cinnabar/20 hover:text-cinnabar transition-colors"
                            >
                              {d.name} ✕
                            </button>
                          ) : null
                        })}
                        {room.assignedDisciples.length < room.capacity && (
                          <div className="relative group">
                            <button className="text-xs bg-gold/10 text-gold/60 px-2 py-0.5 rounded hover:bg-gold/20">
                              + 分配
                            </button>
                            <div className="absolute left-0 top-full mt-1 bg-ink border border-gold/20 rounded-lg p-2 hidden group-hover:block group-focus-within:block z-10 min-w-[150px]">
                              {disciples
                                .filter(d => !room.assignedDisciples.includes(d.id))
                                .map(d => (
                                  <button
                                    key={d.id}
                                    onClick={(e) => { e.stopPropagation(); assignToRoom(d.id, room.id) }}
                                    className="block w-full text-left text-xs text-paper/70 hover:text-gold px-2 py-1 rounded hover:bg-gold/10"
                                  >
                                    {d.name} ({d.realm})
                                  </button>
                                ))
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 炼丹/锻造 UI */}
                  {(room.type === '丹房' || room.type === '炼器房') && (
                    <CraftingSection room={room} />
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
