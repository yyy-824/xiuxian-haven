import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Disciple, Room, GameMessage, ActiveBuff, ActiveEvent } from '../data/types'
import { soundManager } from '../utils/sound'
import {
  GAME_CONFIG, REALMS, generateId, getNextRealm, REALMS_MAP,
  SURNAMES, MALE_NAMES, FEMALE_NAMES, TRAITS, ELEMENTS, ROOM_TEMPLATES,
  getSpiritualRootName, ARTIFACT_TEMPLATES, PILL_RECIPES, EXPLORATION_EVENTS,
  ENEMY_TEMPLATES, resolveCombat, FORGING_RECIPES, VISITORS, MAIN_QUESTS
} from '../data/constants'
import type { CultivationRealm } from '../data/types'

interface GameStore extends GameState {
  // === 弟子管理 ===
  recruitDisciple: () => Disciple | null
  assignToRoom: (discipleId: string, roomId: string) => void
  unassignFromRoom: (discipleId: string) => void
  startCultivating: (discipleId: string) => void
  stopCultivating: (discipleId: string) => void
  banishDisciple: (discipleId: string) => void
  usePill: (discipleId: string, pillName: string) => void
  equipArtifact: (discipleId: string, artifactId: string) => void
  unequipArtifact: (discipleId: string, artifactId: string) => void
  craftPill: (recipeId: string) => void
  forgeArtifact: (recipeId: string) => void
  handleVisitor: (optionIndex: number) => void
  transferCultivation: (fromId: string, toId: string) => void
  sparDisciples: (id1: string, id2: string) => void
  checkAchievements: () => void
  checkMainQuests: () => void
  claimQuestReward: (questId: string) => void

  // === 建筑管理 ===
  buildRoom: (type: Room['type']) => void
  upgradeRoom: (roomId: string) => void
  upgradeHaven: () => void

  // === 探索 ===
  startExploration: (discipleId: string, task: { name: string; type: '探索' | '讨伐' | '采集' | '历练' | '秘境'; duration: number; difficulty: number; rewards?: { spiritStones?: number; cultivation?: number } }) => void
  handleEventChoice: (eventId: string, choiceIndex: number) => void

  // === 游戏循环 ===
  tick: () => void
  addMessage: (msg: Omit<GameMessage, 'id' | 'timestamp' | 'read'>) => void

  // === 存档 ===
  saveGame: () => void
  loadGame: () => void
  resetGame: () => void

  // === 设置 ===
  setGameSpeed: (speed: number) => void
  toggleAutoSave: () => void
  toggleSound: () => void
  toggleBgm: () => void
  setSoundVolume: (v: number) => void
  setBgmVolume: (v: number) => void
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateDisciple(): Disciple {
  const gender = Math.random() > 0.5 ? '男' : '女'
  const surname = randomFrom(SURNAMES)
  const givenName = gender === '男' ? randomFrom(MALE_NAMES) : randomFrom(FEMALE_NAMES)

  // 随机灵根（1-3种元素居多）
  const rootCount = Math.random() < 0.1 ? 1 : Math.random() < 0.3 ? 2 : Math.random() < 0.7 ? 3 : 4
  const shuffled = [...ELEMENTS].sort(() => Math.random() - 0.5)
  const elements = shuffled.slice(0, rootCount)
  const quality = rootCount === 1 ? randomInt(70, 100) : rootCount === 2 ? randomInt(50, 85) : randomInt(20, 60)

  // 随机特质（1-2个）
  const traitCount = Math.random() < 0.7 ? 1 : 2
  const shuffledTraits = [...TRAITS].sort(() => Math.random() - 0.5)
  const traits = shuffledTraits.slice(0, traitCount)

  const comprehension = randomInt(20, 80) + (traits.find(t => t.effect.stat?.comprehension)?.effect.stat?.comprehension || 0)
  const willpower = randomInt(20, 80) + (traits.find(t => t.effect.stat?.willpower)?.effect.stat?.willpower || 0)

  return {
    id: generateId(),
    name: surname + givenName,
    gender,
    age: randomInt(15, 30),
    realm: '练气',
    realmLevel: 1,
    cultivation: 0,
    spiritualRoot: {
      elements,
      quality: Math.max(1, Math.min(100, quality)),
      name: getSpiritualRootName(elements),
    },
    stats: {
      comprehension: Math.max(1, Math.min(100, comprehension)),
      charm: Math.max(1, Math.min(100, randomInt(20, 80) + (traits.find(t => t.effect.stat?.charm)?.effect.stat?.charm || 0))),
      luck: Math.max(1, Math.min(100, randomInt(20, 80) + (traits.find(t => t.effect.stat?.luck)?.effect.stat?.luck || 0))),
      willpower: Math.max(1, Math.min(100, willpower)),
      perception: Math.max(1, Math.min(100, randomInt(20, 80) + (traits.find(t => t.effect.stat?.perception)?.effect.stat?.perception || 0))),
    },
    traits,
    equippedArtifacts: [],
    status: 'idle',
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 5,
    buffs: [],
  }
}

function createInitialState(): GameState {
  // 初始弟子
  const initialDisciples = Array.from({ length: 3 }, () => generateDisciple())

  // 初始建筑
  const initialRooms: Room[] = [
    { ...ROOM_TEMPLATES['修炼室'], id: generateId(), assignedDisciples: [] },
    { ...ROOM_TEMPLATES['灵田'], id: generateId(), assignedDisciples: [] },
    { ...ROOM_TEMPLATES['寝殿'], id: generateId(), assignedDisciples: [] },
  ]

  return {
    haven: {
      name: GAME_CONFIG.HAVEN_NAME,
      level: 1,
      rooms: initialRooms,
      defense: 10,
      spiritualDensity: 1,
    },
    disciples: initialDisciples,
    resources: {
      spiritStones: GAME_CONFIG.INITIAL_SPIRIT_STONES,
      spiritualEnergy: GAME_CONFIG.INITIAL_SPIRITUAL_ENERGY,
      pills: { '聚气丹': 3 },
      materials: { '灵草': 10, '矿石': 5 },
      artifacts: [
        { ...ARTIFACT_TEMPLATES[0], id: generateId() },
      ],
    },
    messages: [{
      id: generateId(),
      timestamp: Date.now(),
      type: 'info',
      text: `欢迎来到${GAME_CONFIG.HAVEN_NAME}！你已招募到${initialDisciples.length}名弟子，开始你的修仙之路吧。`,
      read: false,
    }],
    tasks: [],
    activeEvents: [],
    activeVisitor: null,
    achievements: [
      { id: 'ach_first_recruit', name: '初入仙途', description: '招募第一名弟子', condition: 'recruit >= 1', unlocked: true, unlockedAt: 0 },
      { id: 'ach_first_build', name: '开山立派', description: '建造第一座建筑', condition: 'build >= 1', unlocked: false },
      { id: 'ach_five_disciples', name: '门庭若市', description: '拥有5名弟子', condition: 'disciples >= 5', unlocked: false },
      { id: 'ach_first_explore', name: '踏出山门', description: '完成第一次探索', condition: 'explore >= 1', unlocked: false },
      { id: 'ach_reach_zhuji', name: '筑基有成', description: '有弟子达到筑基境', condition: 'realm >= 筑基', unlocked: false },
      { id: 'ach_craft_pill', name: '丹道初窥', description: '第一次炼丹成功', condition: 'craft >= 1', unlocked: false },
      { id: 'ach_forge_artifact', name: '器道入门', description: '第一次锻造成功', condition: 'forge >= 1', unlocked: false },
      { id: 'ach_ten_buildings', name: '洞天福地', description: '拥有10座建筑', condition: 'buildings >= 10', unlocked: false },
    ],
    mainQuests: MAIN_QUESTS.map(q => ({ ...q, rewardClaimed: false })),
    gameTime: 0,
    lastSaveTime: Date.now(),
    totalPlayTime: 0,
    settings: {
      autoSave: true,
      autoSaveInterval: GAME_CONFIG.AUTO_SAVE_INTERVAL,
      gameSpeed: 1,
      soundEnabled: true,
      bgmEnabled: true,
      soundVolume: 0.5,
      bgmVolume: 0.3,
      notificationsEnabled: true,
    },
  }
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      // === 弟子管理 ===
      recruitDisciple: () => {
        const state = get()
        const cost = 100
        if (state.resources.spiritStones < cost) {
          get().addMessage({ type: 'warning', text: '灵石不足，无法招募！' })
          return null
        }
        const newDisciple = generateDisciple()
        set(state => ({
          disciples: [...state.disciples, newDisciple],
          resources: {
            ...state.resources,
            spiritStones: state.resources.spiritStones - cost,
          },
        }))
        soundManager.recruit()
        get().addMessage({
          type: 'success',
          text: `花费💎${cost}招募新弟子 ${newDisciple.name}（${newDisciple.spiritualRoot.name}）！`,
        })
        // 成就：初入仙途
        const ach = (get().achievements ?? []).find(a => a.id === 'ach_first_recruit')
        if (ach && !ach.unlocked) {
          set(state => ({ achievements: state.achievements.map(a => a.id === 'ach_first_recruit' ? { ...a, unlocked: true, unlockedAt: state.gameTime } : a) }))
          soundManager.achievement()
          get().addMessage({ type: 'event', text: '🏆 成就解锁：初入仙途！' })
        }
        return newDisciple
      },

      assignToRoom: (discipleId, roomId) => {
        set(state => {
          const disciple = state.disciples.find(d => d.id === discipleId)
          const room = state.haven.rooms.find(r => r.id === roomId)
          if (!disciple || !room) return state
          if (room.assignedDisciples.length >= room.capacity) return state
          if (room.assignedDisciples.includes(discipleId)) return state

          // 从其他房间移除
          const rooms = state.haven.rooms.map(r => ({
            ...r,
            assignedDisciples: r.assignedDisciples.filter(id => id !== discipleId),
          }))

          // 添加到新房间
          const targetRoom = rooms.find(r => r.id === roomId)!
          targetRoom.assignedDisciples = [...targetRoom.assignedDisciples, discipleId]

          const disciples = state.disciples.map(d =>
            d.id === discipleId ? { ...d, status: (room.type === '修炼室' || room.production.cultivationSpeed) ? 'cultivating' as const : 'idle' as const } : d
          )

          return { haven: { ...state.haven, rooms }, disciples }
        })
      },

      unassignFromRoom: (discipleId) => {
        set(state => ({
          haven: {
            ...state.haven,
            rooms: state.haven.rooms.map(r => ({
              ...r,
              assignedDisciples: r.assignedDisciples.filter(id => id !== discipleId),
            })),
          },
          disciples: state.disciples.map(d =>
            d.id === discipleId ? { ...d, status: 'idle' as const } : d
          ),
        }))
      },

      startCultivating: (discipleId) => {
        set(state => ({
          disciples: state.disciples.map(d =>
            d.id === discipleId ? { ...d, status: 'cultivating' as const } : d
          ),
        }))
      },

      stopCultivating: (discipleId) => {
        set(state => ({
          disciples: state.disciples.map(d =>
            d.id === discipleId ? { ...d, status: 'idle' as const } : d
          ),
        }))
      },

      banishDisciple: (discipleId) => {
        const state = get()
        const disciple = state.disciples.find(d => d.id === discipleId)
        if (!disciple) return
        if (disciple.status !== 'idle') {
          get().addMessage({ type: 'warning', text: '该弟子正在忙碌，无法逐出！' })
          return
        }
        set(state => ({
          disciples: state.disciples.filter(d => d.id !== discipleId),
          haven: {
            ...state.haven,
            rooms: state.haven.rooms.map(r => ({
              ...r,
              assignedDisciples: r.assignedDisciples.filter(id => id !== discipleId),
            })),
          },
        }))
        get().addMessage({ type: 'event', text: `${disciple.name}已被逐出洞府。` })
      },

      usePill: (discipleId, pillName) => {
        const state = get()
        const disciple = state.disciples.find(d => d.id === discipleId)
        if (!disciple) return

        const pillCount = state.resources.pills[pillName] || 0
        if (pillCount <= 0) {
          get().addMessage({ type: 'warning', text: `没有${pillName}！` })
          return
        }

        const recipe = PILL_RECIPES.find(p => p.name === pillName)
        if (!recipe) return

        const effect = recipe.effect
        set(state => {
          const newDisciples = state.disciples.map(d => {
            if (d.id !== discipleId) return d
            switch (effect.type) {
              case 'heal':
                return { ...d, hp: Math.min(d.maxHp, d.hp + effect.value) }
              case 'cultivation':
                return { ...d, cultivation: d.cultivation + effect.value }
              case 'buff': {
                const buff: ActiveBuff = { id: generateId(), name: pillName, effect, startTime: state.gameTime, endTime: state.gameTime + (effect.duration || 60000) }
                return { ...d, buffs: [...(d.buffs ?? []), buff] }
              }
              case 'breakthrough': {
                const buff: ActiveBuff = { id: generateId(), name: pillName, effect, startTime: state.gameTime, endTime: state.gameTime + 300000 }
                return { ...d, buffs: [...(d.buffs ?? []), buff] }
              }
              default:
                return d
            }
          })
          return {
            resources: { ...state.resources, pills: { ...state.resources.pills, [pillName]: pillCount - 1 } },
            disciples: newDisciples,
          }
        })
        soundManager.pill()
        get().addMessage({ type: 'success', text: `${disciple.name}使用了${pillName}！` })
      },

      equipArtifact: (discipleId, artifactId) => {
        const state = get()
        const disciple = state.disciples.find(d => d.id === discipleId)
        const artifact = state.resources.artifacts.find(a => a.id === artifactId)
        if (!disciple || !artifact) return
        // 已装备则跳过
        if ((disciple.equippedArtifacts ?? []).includes(artifactId)) return
        // 最多装备3件法器
        if ((disciple.equippedArtifacts ?? []).length >= 3) {
          get().addMessage({ type: 'warning', text: '最多装备3件法器！' })
          return
        }
        set(state => ({
          disciples: state.disciples.map(d =>
            d.id === discipleId
              ? { ...d, equippedArtifacts: [...(d.equippedArtifacts ?? []), artifactId] }
              : d
          ),
        }))
        soundManager.equip()
        get().addMessage({ type: 'success', text: `${disciple.name}装备了${artifact.name}！` })
      },

      unequipArtifact: (discipleId, artifactId) => {
        const state = get()
        const disciple = state.disciples.find(d => d.id === discipleId)
        if (!disciple || !(disciple.equippedArtifacts ?? []).includes(artifactId)) return
        const artifact = state.resources.artifacts.find(a => a.id === artifactId)
        set(state => ({
          disciples: state.disciples.map(d =>
            d.id === discipleId
              ? { ...d, equippedArtifacts: (d.equippedArtifacts ?? []).filter(id => id !== artifactId) }
              : d
          ),
        }))
        get().addMessage({ type: 'info', text: `${disciple.name}卸下了${artifact?.name || '法器'}。` })
      },

      craftPill: (recipeId) => {
        const state = get()
        const recipe = PILL_RECIPES.find(r => r.id === recipeId)
        if (!recipe) return

        // 检查是否有丹房
        const danfang = state.haven.rooms.find(r => r.type === '丹房')
        if (!danfang) {
          get().addMessage({ type: 'warning', text: '还没有建造丹房！' })
          return
        }
        if (danfang.assignedDisciples.length === 0) {
          get().addMessage({ type: 'warning', text: '丹房没有分配弟子！' })
          return
        }

        // 检查灵石
        if (state.resources.spiritStones < recipe.spiritStoneCost) {
          get().addMessage({ type: 'warning', text: '灵石不足！' })
          return
        }

        // 检查材料
        for (const [mat, amt] of Object.entries(recipe.materials)) {
          if ((state.resources.materials[mat] || 0) < amt) {
            get().addMessage({ type: 'warning', text: `材料不足：${mat}` })
            return
          }
        }

        // 计算成功率
        const crafter = state.disciples.find(d => danfang.assignedDisciples.includes(d.id))
        const compBonus = crafter ? crafter.stats.comprehension / 200 : 0
        const roomBonus = (danfang.level - 1) * 0.03
        const successRate = Math.min(0.99, recipe.baseSuccessRate + compBonus + roomBonus)
        const success = Math.random() < successRate

        // 单次 set：扣资源 + 成功时加丹药
        set(state => {
          const materials = { ...state.resources.materials }
          for (const [mat, amt] of Object.entries(recipe.materials)) {
            materials[mat] = (materials[mat] || 0) - amt
          }
          const pills = success
            ? { ...state.resources.pills, [recipe.name]: (state.resources.pills[recipe.name] || 0) + 1 }
            : state.resources.pills
          return {
            resources: {
              ...state.resources,
              spiritStones: state.resources.spiritStones - recipe.spiritStoneCost,
              materials,
              pills,
            },
          }
        })

        if (success) {
          soundManager.craftSuccess()
          get().addMessage({ type: 'success', text: `炼丹成功！获得${recipe.name}（${Math.round(successRate * 100)}%成功率）` })
          const ach = (get().achievements ?? []).find(a => a.id === 'ach_craft_pill')
          if (ach && !ach.unlocked) {
            set(state => ({ achievements: state.achievements.map(a => a.id === 'ach_craft_pill' ? { ...a, unlocked: true, unlockedAt: state.gameTime } : a) }))
            get().addMessage({ type: 'event', text: '🏆 成就解锁：丹道初窥！' })
          }
        } else {
          soundManager.craftFail()
          get().addMessage({ type: 'danger', text: `炼丹失败！${recipe.name}化为灰烬...（${Math.round(successRate * 100)}%成功率）` })
        }
      },

      forgeArtifact: (recipeId) => {
        const state = get()
        const recipe = FORGING_RECIPES.find(r => r.id === recipeId)
        if (!recipe) return

        // 检查是否有炼器房
        const forge = state.haven.rooms.find(r => r.type === '炼器房')
        if (!forge) {
          get().addMessage({ type: 'warning', text: '还没有建造炼器房！' })
          return
        }
        if (forge.assignedDisciples.length === 0) {
          get().addMessage({ type: 'warning', text: '炼器房没有分配弟子！' })
          return
        }

        // 检查灵石
        if (state.resources.spiritStones < recipe.spiritStoneCost) {
          get().addMessage({ type: 'warning', text: '灵石不足！' })
          return
        }

        // 检查材料
        for (const [mat, amt] of Object.entries(recipe.materials)) {
          if ((state.resources.materials[mat] || 0) < amt) {
            get().addMessage({ type: 'warning', text: `材料不足：${mat}` })
            return
          }
        }

        // 计算成功率
        const crafter = state.disciples.find(d => forge.assignedDisciples.includes(d.id))
        const percBonus = crafter ? crafter.stats.perception / 200 : 0
        const roomBonus = (forge.level - 1) * 0.03
        const successRate = Math.min(0.99, recipe.baseSuccessRate + percBonus + roomBonus)
        const success = Math.random() < successRate

        // 单次 set：扣资源 + 成功时加法器
        set(state => {
          const materials = { ...state.resources.materials }
          for (const [mat, amt] of Object.entries(recipe.materials)) {
            materials[mat] = (materials[mat] || 0) - amt
          }
          const artifacts = success
            ? [...state.resources.artifacts, { ...recipe.artifact, id: generateId() }]
            : state.resources.artifacts
          return {
            resources: {
              ...state.resources,
              spiritStones: state.resources.spiritStones - recipe.spiritStoneCost,
              materials,
              artifacts,
            },
          }
        })

        if (success) {
          soundManager.craftSuccess()
          get().addMessage({ type: 'success', text: `锻造成功！获得${recipe.artifact.name}（${Math.round(successRate * 100)}%成功率）` })
          const ach = (get().achievements ?? []).find(a => a.id === 'ach_forge_artifact')
          if (ach && !ach.unlocked) {
            set(state => ({ achievements: state.achievements.map(a => a.id === 'ach_forge_artifact' ? { ...a, unlocked: true, unlockedAt: state.gameTime } : a) }))
            get().addMessage({ type: 'event', text: '🏆 成就解锁：器道入门！' })
          }
        } else {
          soundManager.craftFail()
          get().addMessage({ type: 'danger', text: `锻造失败！材料化为废铁...（${Math.round(successRate * 100)}%成功率）` })
        }
      },

      // === 访客处理 ===
      handleVisitor: (optionIndex) => {
        const state = get()
        if (!state.activeVisitor || !state.activeVisitor.visitor) return
        const option = state.activeVisitor.visitor.options[optionIndex]
        if (!option) return

        // 检查魅力需求
        if (option.requirement?.charm) {
          const bestCharm = Math.max(...state.disciples.map(d => d.stats.charm))
          if (bestCharm < option.requirement.charm) {
            get().addMessage({ type: 'warning', text: `需要魅力≥${option.requirement.charm}的弟子！` })
            return
          }
        }

        // 检查消耗
        if (option.cost) {
          if (option.cost.spiritStones && state.resources.spiritStones < option.cost.spiritStones) {
            get().addMessage({ type: 'warning', text: '灵石不足！' })
            return
          }
          if (option.cost.materials) {
            for (const [mat, amt] of Object.entries(option.cost.materials)) {
              if ((state.resources.materials[mat] || 0) < amt) {
                get().addMessage({ type: 'warning', text: `材料不足：${mat}` })
                return
              }
            }
          }
        }

        const visitorName = state.activeVisitor.visitor.name
        const visitorType = state.activeVisitor.visitor.type

        set(state => {
          let newResources = { ...state.resources }
          let newDisciples = [...state.disciples]

          // 扣除消耗
          if (option.cost?.spiritStones) newResources.spiritStones -= option.cost.spiritStones
          if (option.cost?.materials) {
            const materials = { ...newResources.materials }
            for (const [mat, amt] of Object.entries(option.cost.materials)) {
              materials[mat] = (materials[mat] || 0) - amt
            }
            newResources.materials = materials
          }

          // 发放奖励
          if (option.reward) {
            if (option.reward.spiritStones) newResources.spiritStones += option.reward.spiritStones
            if (option.reward.cultivation && newDisciples.length > 0) {
              const idx = Math.floor(Math.random() * newDisciples.length)
              newDisciples[idx] = { ...newDisciples[idx], cultivation: newDisciples[idx].cultivation + option.reward.cultivation }
            }
            if (option.reward.materials) {
              const materials = { ...newResources.materials }
              for (const [mat, amt] of Object.entries(option.reward.materials)) {
                materials[mat] = (materials[mat] || 0) + amt
              }
              newResources.materials = materials
            }
            if (option.reward.pillName) {
              newResources.pills = { ...newResources.pills, [option.reward.pillName]: (newResources.pills[option.reward.pillName] || 0) + 1 }
            }
          }

          return { resources: newResources, disciples: newDisciples, activeVisitor: null }
        })

        // 落魄修士：免费获得弟子
        if (visitorType === 'seeker' && optionIndex === 0) {
          const newDisciple = generateDisciple()
          set(state => ({ disciples: [...state.disciples, newDisciple] }))
          get().addMessage({ type: 'success', text: `${visitorName}加入了洞府！新弟子 ${newDisciple.name}（${newDisciple.spiritualRoot.name}）` })
        }

        // 挑战者：随机弟子战斗
        if (visitorType === 'rival' && optionIndex === 0 && state.disciples.length > 0) {
          const fighter = state.disciples[Math.floor(Math.random() * state.disciples.length)]
          const enemyPower = 20 + Math.floor(Math.random() * 30)
          const fighterPower = fighter.attack + fighter.defense + fighter.realmLevel * 5
          if (fighterPower >= enemyPower) {
            get().addMessage({ type: 'success', text: `${fighter.name}击退了${visitorName}！获得奖励。` })
          } else {
            get().addMessage({ type: 'warning', text: `${fighter.name}不敌${visitorName}，但对方见好就收。` })
          }
        }

        if (optionIndex < state.activeVisitor.visitor.options.length && option.text !== '礼貌送客' && option.text !== '婉言谢绝' && option.text !== '目送离去' && option.text !== '不买，送客' && option.text !== '闭门不见') {
          get().addMessage({ type: 'success', text: `与${visitorName}交易完成。` })
        } else {
          get().addMessage({ type: 'info', text: `${visitorName}离去了。` })
        }

        // 检查成就
        get().checkAchievements()
      },

      // === 弟子互动 ===
      transferCultivation: (fromId, toId) => {
        const state = get()
        const from = state.disciples.find(d => d.id === fromId)
        const to = state.disciples.find(d => d.id === toId)
        if (!from || !to) return
        if (from.status !== 'idle' || to.status !== 'idle') {
          get().addMessage({ type: 'warning', text: '两名弟子都必须空闲！' })
          return
        }
        if (from.cultivation < 50) {
          get().addMessage({ type: 'warning', text: `${from.name}修为不足50，无法传功！` })
          return
        }
        const transferAmount = Math.floor(from.cultivation * 0.3)
        set(state => ({
          disciples: state.disciples.map(d => {
            if (d.id === fromId) return { ...d, cultivation: d.cultivation - transferAmount }
            if (d.id === toId) return { ...d, cultivation: d.cultivation + transferAmount }
            return d
          }),
        }))
        get().addMessage({ type: 'success', text: `${from.name}向${to.name}传授了${transferAmount}修为！` })
      },

      sparDisciples: (id1, id2) => {
        const state = get()
        const d1 = state.disciples.find(d => d.id === id1)
        const d2 = state.disciples.find(d => d.id === id2)
        if (!d1 || !d2) return
        if (d1.status !== 'idle' || d2.status !== 'idle') {
          get().addMessage({ type: 'warning', text: '两名弟子都必须空闲！' })
          return
        }
        const p1 = d1.attack + d1.defense + d1.realmLevel * 5 + Math.random() * 20
        const p2 = d2.attack + d2.defense + d2.realmLevel * 5 + Math.random() * 20
        const winner = p1 >= p2 ? d1 : d2
        const loser = winner.id === d1.id ? d2 : d1
        const gain = 15 + Math.floor(Math.random() * 20)
        set(state => ({
          disciples: state.disciples.map(d => {
            if (d.id === winner.id) return { ...d, cultivation: d.cultivation + gain }
            if (d.id === loser.id) return { ...d, cultivation: d.cultivation + Math.floor(gain / 2) }
            return d
          }),
        }))
        get().addMessage({ type: 'event', text: `切磋：${winner.name}胜出！${winner.name}+${gain}修为，${loser.name}+${Math.floor(gain / 2)}修为。` })
      },

      // === 成就检查 ===
      checkAchievements: () => {
        const state = get()
        const achievements = state.achievements ?? []
        const newAchievements = achievements.map(ach => {
          if (ach.unlocked) return ach
          let unlock = false
          switch (ach.id) {
            case 'ach_five_disciples': unlock = state.disciples.length >= 5; break
            case 'ach_first_explore': unlock = (state.messages ?? []).some(m => m.text.includes('完成「')); break
            case 'ach_reach_zhuji': unlock = state.disciples.some(d => d.realm !== '练气'); break
            case 'ach_ten_buildings': unlock = state.haven.rooms.length >= 10; break
            default: break
          }
          if (unlock) {
            soundManager.achievement()
            get().addMessage({ type: 'event', text: `🏆 成就解锁：${ach.name}！` })
            return { ...ach, unlocked: true, unlockedAt: state.gameTime }
          }
          return ach
        })
        if (newAchievements.some((a, i) => a.unlocked !== achievements[i]?.unlocked)) {
          set({ achievements: newAchievements })
        }
      },

      checkMainQuests: () => {
        const state = get()
        const quests = state.mainQuests ?? []
        let changed = false
        const newQuests = quests.map(q => {
          if (q.completed || !q.unlocked) return q
          if (q.rewardClaimed) return q
          let done = false
          switch (q.objectiveType) {
            case 'build':
              if (q.objectiveTarget === 'building') done = state.haven.rooms.length >= q.objectiveCount
              else done = state.haven.rooms.filter(r => r.type === q.objectiveTarget).length >= q.objectiveCount
              break
            case 'recruit': done = state.disciples.length >= q.objectiveCount; break
            case 'explore':
              // 只匹配探索完成的消息（不含主线/成就等）
              if (q.objectiveTarget === 'explore') done = (state.messages ?? []).filter(m => m.text.includes('完成「') && m.text.includes('获得')).length >= q.objectiveCount
              else done = (state.messages ?? []).filter(m => m.text.includes(q.objectiveTarget) && m.text.includes('完成「')).length >= q.objectiveCount
              break
            case 'craft': done = (state.messages ?? []).filter(m => m.text.includes('炼丹成功')).length >= q.objectiveCount; break
            case 'forge': done = (state.messages ?? []).filter(m => m.text.includes('锻造成功')).length >= q.objectiveCount; break
            case 'realm': {
              const targetRealm = q.objectiveTarget as CultivationRealm
              const realmIdx = REALMS_MAP[targetRealm]
              if (realmIdx !== undefined) {
                done = state.disciples.some(d => (REALMS_MAP[d.realm as CultivationRealm] ?? 0) >= realmIdx)
              }
              break
            }
            case 'cultivate': done = state.disciples.reduce((s, d) => s + d.cultivation, 0) >= q.objectiveCount; break
            default: break
          }
          if (done) {
            changed = true
            soundManager.notify()
            get().addMessage({ type: 'event', text: `📜 主线完成：${q.title}！点击领取奖励。` })
            return { ...q, completed: true, rewardClaimed: false }
          }
          return q
        })
        if (changed) {
          // 解锁下一个未解锁的任务
          const idx = newQuests.findIndex(q => !q.unlocked && !q.completed)
          if (idx >= 0) {
            newQuests[idx] = { ...newQuests[idx], unlocked: true }
            get().addMessage({ type: 'info', text: `📜 新主线：${newQuests[idx].title}` })
          }
          set({ mainQuests: newQuests })
        }
      },

      claimQuestReward: (questId) => {
        const state = get()
        const quests = state.mainQuests ?? []
        const quest = quests.find(q => q.id === questId)
        if (!quest || !quest.completed || quest.rewardClaimed) return

        // 发放奖励（单次 set）
        set(s => {
          let newResources = { ...s.resources }
          if (quest.reward.spiritStones) {
            newResources = { ...newResources, spiritStones: newResources.spiritStones + quest.reward.spiritStones }
          }
          if (quest.reward.materials) {
            const materials = { ...newResources.materials }
            for (const [mat, amt] of Object.entries(quest.reward.materials)) {
              materials[mat] = (materials[mat] || 0) + amt
            }
            newResources = { ...newResources, materials }
          }
          if (quest.reward.pillName) {
            newResources = { ...newResources, pills: { ...newResources.pills, [quest.reward.pillName]: (newResources.pills[quest.reward.pillName] || 0) + 1 } }
          }
          return {
            resources: newResources,
            mainQuests: s.mainQuests.map(q => q.id === questId ? { ...q, rewardClaimed: true } : q),
          }
        })
        soundManager.success()
        get().addMessage({ type: 'success', text: `📜 领取奖励：${quest.title} — ${quest.reward.description || '获得奖励'}` })
      },

      // === 建筑管理 ===
      buildRoom: (type) => {
        const template = ROOM_TEMPLATES[type]
        const cost = template.upgradeCost

        const state = get()
        // 检查资源
        if (cost.spiritStones && state.resources.spiritStones < cost.spiritStones) {
          get().addMessage({ type: 'warning', text: '灵石不足！' })
          return
        }
        if (cost.materials) {
          for (const [mat, amount] of Object.entries(cost.materials)) {
            if ((state.resources.materials[mat] || 0) < amount) {
              get().addMessage({ type: 'warning', text: `材料不足：${mat}` })
              return
            }
          }
        }

        const newRoom: Room = {
          ...template,
          id: generateId(),
          assignedDisciples: [],
        }

        // 扣除资源并建造（单次 set）
        set(state => {
          const materials = { ...state.resources.materials }
          if (cost.materials) {
            for (const [mat, amount] of Object.entries(cost.materials)) {
              materials[mat] = (materials[mat] || 0) - amount
            }
          }
          return {
            haven: { ...state.haven, rooms: [...state.haven.rooms, newRoom] },
            resources: {
              ...state.resources,
              spiritStones: state.resources.spiritStones - (cost.spiritStones || 0),
              materials,
            },
          }
        })

        soundManager.build()
        get().addMessage({ type: 'success', text: `建造了${type}！` })
        // 成就检查
        const ach = (get().achievements ?? []).find(a => a.id === 'ach_first_build')
        if (ach && !ach.unlocked) {
          set(state => ({ achievements: state.achievements.map(a => a.id === 'ach_first_build' ? { ...a, unlocked: true, unlockedAt: state.gameTime } : a) }))
          soundManager.achievement()
          get().addMessage({ type: 'event', text: '🏆 成就解锁：开山立派！' })
        }
      },

      upgradeRoom: (roomId) => {
        const state = get()
        const room = state.haven.rooms.find(r => r.id === roomId)
        if (!room || room.level >= room.maxLevel) return

        const cost = room.upgradeCost
        const multiplier = room.level + 1
        const totalCost = {
          spiritStones: (cost.spiritStones || 0) * multiplier,
          materials: Object.fromEntries(
            Object.entries(cost.materials || {}).map(([k, v]) => [k, v * multiplier])
          ),
        }

        if (state.resources.spiritStones < (totalCost.spiritStones || 0)) {
          get().addMessage({ type: 'warning', text: '灵石不足！' })
          return
        }
        if (totalCost.materials) {
          for (const [mat, amount] of Object.entries(totalCost.materials)) {
            if ((state.resources.materials[mat] || 0) < amount) {
              get().addMessage({ type: 'warning', text: `材料不足：${mat}` })
              return
            }
          }
        }

        set(state => {
          const materials = { ...state.resources.materials }
          if (totalCost.materials) {
            for (const [mat, amount] of Object.entries(totalCost.materials)) {
              materials[mat] = (materials[mat] || 0) - amount
            }
          }
          return {
            haven: {
              ...state.haven,
              rooms: state.haven.rooms.map(r =>
                r.id === roomId ? { ...r, level: r.level + 1 } : r
              ),
            },
            resources: {
              ...state.resources,
              spiritStones: state.resources.spiritStones - (totalCost.spiritStones || 0),
              materials,
            },
          }
        })

        soundManager.upgrade()
        get().addMessage({ type: 'success', text: `${room.type}升级到${room.level + 1}级！` })
      },

      upgradeHaven: () => {
        const state = get()
        const level = state.haven.level
        const maxLevel = 10
        if (level >= maxLevel) {
          get().addMessage({ type: 'warning', text: '洞府已达最高等级！' })
          return
        }

        // 升级费用递增：每级需要 等级×200 灵石 + 等级×10 各材料
        const cost = {
          spiritStones: level * 200,
          materials: { '灵草': level * 10, '矿石': level * 10 } as Record<string, number>,
        }
        // 3级以上需要精铁
        if (level >= 3) cost.materials['精铁'] = level * 5
        // 5级以上需要妖丹
        if (level >= 5) cost.materials['妖丹'] = level * 3
        // 7级以上需要灵石矿
        if (level >= 7) cost.materials['灵石矿'] = (level - 5) * 2

        // 检查灵石
        if (state.resources.spiritStones < cost.spiritStones) {
          get().addMessage({ type: 'warning', text: `灵石不足！需要💎${cost.spiritStones}` })
          return
        }
        // 检查材料
        for (const [mat, amt] of Object.entries(cost.materials)) {
          if ((state.resources.materials[mat] || 0) < amt) {
            get().addMessage({ type: 'warning', text: `材料不足：${mat}` })
            return
          }
        }

        // 扣除资源 + 升级（单次 set）
        set(state => {
          const materials = { ...state.resources.materials }
          for (const [mat, amt] of Object.entries(cost.materials)) {
            materials[mat] = (materials[mat] || 0) - amt
          }
          return {
            haven: {
              ...state.haven,
              level: state.haven.level + 1,
              defense: state.haven.defense + 5,
              spiritualDensity: +(state.haven.spiritualDensity + 0.2).toFixed(1),
            },
            resources: {
              ...state.resources,
              spiritStones: state.resources.spiritStones - cost.spiritStones,
              materials,
            },
          }
        })

        soundManager.upgrade()
        get().addMessage({ type: 'success', text: `🎉 洞府升级到${level + 1}级！护山强度+5，灵气浓度+0.2` })
      },

      // === 探索 ===
      startExploration: (discipleId, taskData) => {
        const state = get()
        const disciple = state.disciples.find(d => d.id === discipleId)
        if (!disciple || disciple.status !== 'idle') return

        const task = {
          id: generateId(),
          name: taskData.name,
          type: taskData.type,
          description: '',
          duration: taskData.duration,
          startTime: state.gameTime,
          difficulty: taskData.difficulty,
          requirements: {},
          rewards: { spiritStones: taskData.rewards?.spiritStones ?? 50, cultivation: taskData.rewards?.cultivation ?? 20 },
          events: [],
        }

        set(state => ({
          tasks: [...state.tasks, task],
          disciples: state.disciples.map(d =>
            d.id === discipleId ? { ...d, status: 'exploring' as const, currentTask: task } : d
          ),
        }))

        soundManager.explore()
        get().addMessage({ type: 'info', text: `${disciple.name}出发${taskData.name}！` })
      },

      // === 事件处理 ===
      handleEventChoice: (eventId, choiceIndex) => {
        const state = get()
        const activeEvent = state.activeEvents.find(e => e.id === eventId)
        if (!activeEvent) return

        const choice = activeEvent.event.choices[choiceIndex]
        if (!choice) return

        const disciple = state.disciples.find(d => d.id === activeEvent.discipleId)
        if (!disciple) return

        // 检查属性需求
        let success = true
        if (choice.requirement) {
          const req = choice.requirement
          if (req.comprehension && disciple.stats.comprehension < req.comprehension) success = false
          if (req.willpower && disciple.stats.willpower < req.willpower) success = false
          if (req.perception && disciple.stats.perception < req.perception) success = false
          if (req.luck && disciple.stats.luck < req.luck) success = false
          if (req.charm && disciple.stats.charm < req.charm) success = false
        }

        // 运气加成
        const luckBonus = disciple.stats.luck / 200 // 最多 +50%
        const finalSuccess = success && Math.random() < (choice.outcome.successRate + luckBonus)

        const outcome = finalSuccess ? choice.outcome.success : (choice.outcome.failure || {})

        // 应用结果
        set(state => {
          let newResources = { ...state.resources }
          let newDisciples = state.disciples.map(d => {
            if (d.id !== activeEvent.discipleId) return d
            let newHp = d.hp

            // HP 损失
            if (outcome.hpLoss) {
              newHp = Math.max(1, d.hp - outcome.hpLoss)
            }

            // 修为奖励
            let newCultivation = d.cultivation + (outcome.cultivation || 0)

            return { ...d, hp: newHp, cultivation: newCultivation }
          })

          // 灵石
          if (outcome.spiritStones) {
            newResources.spiritStones = Math.max(0, newResources.spiritStones + outcome.spiritStones)
          }

          // 材料
          if (outcome.materials) {
            const materials = { ...newResources.materials }
            for (const mat of outcome.materials) {
              materials[mat.type] = (materials[mat.type] || 0) + mat.amount
            }
            newResources.materials = materials
          }

          return {
            resources: newResources,
            disciples: newDisciples,
            activeEvents: state.activeEvents.filter(e => e.id !== eventId),
          }
        })

        // 消息
        const resultText = finalSuccess
          ? (outcome.text || `${disciple.name}成功应对了事件！`)
          : (outcome.text || `${disciple.name}未能应对，遭遇了挫折。`)
        get().addMessage({
          type: finalSuccess ? 'success' : 'warning',
          text: `📜 ${disciple.name}「${activeEvent.event.text.slice(0, 15)}...」— ${resultText}`,
        })
      },

      // === 游戏循环 ===
      tick: () => {
        const state = get()
        const gameSpeed = state.settings.gameSpeed
        const tickMs = GAME_CONFIG.TICK_INTERVAL * gameSpeed

        let newResources = { ...state.resources }
        let newDisciples = [...state.disciples]
        let newTasks = [...state.tasks]
        const newMessages: GameMessage[] = []

        // 1. 资源产出
        for (const room of state.haven.rooms) {
          if (room.assignedDisciples.length === 0) continue
          if (room.capacity <= 0) continue // 聚灵阵等无容量建筑跳过弟子效率计算
          const efficiency = room.assignedDisciples.length / room.capacity
          const levelBonus = 1 + (room.level - 1) * 0.2

          if (room.production.spiritStones) {
            newResources.spiritStones += room.production.spiritStones * efficiency * levelBonus * (tickMs / 60000)
          }
          if (room.production.spiritualEnergy) {
            newResources.spiritualEnergy += room.production.spiritualEnergy * efficiency * levelBonus * (tickMs / 60000)
          }
          if (room.production.materials) {
            for (const mat of room.production.materials) {
              const key = mat.type
              newResources.materials[key] = (newResources.materials[key] || 0) + mat.amount * efficiency * levelBonus * (tickMs / 60000)
            }
          }
        }

        // 1.5 寝殿 HP 回复
        for (const room of state.haven.rooms) {
          if (room.type !== '寝殿') continue
          if (room.assignedDisciples.length === 0) continue
          const regenRate = 2 + room.level * 1 // 每 tick 回复 2+level HP
          for (const dId of room.assignedDisciples) {
            const dIdx = newDisciples.findIndex(d => d.id === dId)
            if (dIdx >= 0 && newDisciples[dIdx].hp < newDisciples[dIdx].maxHp) {
              const newHp = Math.min(newDisciples[dIdx].maxHp, newDisciples[dIdx].hp + regenRate * (tickMs / 1000))
              newDisciples[dIdx] = { ...newDisciples[dIdx], hp: newHp }
            }
          }
        }

        // 2. 修炼进度
        newDisciples = newDisciples.map(d => {
          // 处理 buff 过期
          const currentTime = state.gameTime + tickMs
          const activeBuffs = (d.buffs ?? []).filter(b => currentTime < b.endTime)
          const expiredBuffs = (d.buffs ?? []).filter(b => currentTime >= b.endTime)
          if (expiredBuffs.length > 0) {
            expiredBuffs.forEach(b => {
              newMessages.push({
                id: generateId(), timestamp: Date.now(), type: 'info', read: false,
                text: `${d.name}的${b.name}效果已消散。`,
              })
            })
          }

          if (d.status !== 'cultivating') return { ...d, buffs: activeBuffs }

          const realm = REALMS[d.realm]
          const rootBonus = d.spiritualRoot.quality / 50
          const traitBonus = 1 + (d.traits.reduce((sum, t) => sum + (t.effect.cultivationSpeed || 0), 0) / 100)
          // buff 加成：悟性buff影响修炼速度
          const buffCompBonus = activeBuffs.reduce((sum, b) => sum + (b.effect.stat?.comprehension || 0), 0)
          const compBonus = (d.stats.comprehension + buffCompBonus) / 50
          // 建筑加成：修炼室/藏经阁/练功场的 cultivationSpeed
          const assignedRoom = state.haven.rooms.find(r => r.assignedDisciples.includes(d.id))
          const roomBonus = 1 + (assignedRoom?.production.cultivationSpeed || 0) / 100
          const speed = GAME_CONFIG.BASE_CULTIVATION_SPEED * rootBonus * traitBonus * compBonus * roomBonus * (tickMs / 1000)

          let newCultivation = d.cultivation + speed
          let newRealm = d.realm
          let newRealmLevel = d.realmLevel
          let newHp = d.hp
          let newMaxHp = d.maxHp
          let newAttack = d.attack
          let newDefense = d.defense

          // 境内升级
          if (newRealm === d.realm && d.realmLevel < realm.maxLevel) {
            const levelThreshold = realm.requiredQi * (d.realmLevel / realm.maxLevel)
            if (newCultivation >= levelThreshold) {
              newRealmLevel = d.realmLevel + 1
              newMaxHp += 10
              newHp = Math.min(newHp + 10, newMaxHp)
              newAttack += 2
              newDefense += 1
            }
          }

          // 最高级突破（修为满后每 tick 有概率触发，不再死循环）
          if (newRealm === d.realm && d.realmLevel >= realm.maxLevel && newCultivation >= realm.requiredQi) {
            const nextRealm = getNextRealm(d.realm)
            if (nextRealm) {
              const breakthroughBuff = activeBuffs.find(b => b.effect.type === 'breakthrough')
              const breakBonus = breakthroughBuff ? breakthroughBuff.effect.value / 100 : 0
              const breakChance = Math.min(0.95, realm.breakthroughChance * (d.stats.willpower / 100) + breakBonus) * 0.1 // 每 tick 概率
              if (Math.random() < breakChance) {
                newRealm = nextRealm
                newRealmLevel = 1
                newCultivation = 0
                newMaxHp = REALMS[nextRealm].basePower * 2
                newHp = newMaxHp
                newAttack = REALMS[nextRealm].basePower
                newDefense = REALMS[nextRealm].basePower * 0.5
                newMessages.push({
                  id: generateId(), timestamp: Date.now(), type: 'success', read: false,
                  text: `🎉 ${d.name}突破成功！晋升${nextRealm}境！`,
                })
                soundManager.breakthrough()
              }
              // 失败不扣修为，只是等下次 tick
            } else {
              newCultivation = realm.requiredQi // 真仙境封顶
            }
          }

          return {
            ...d,
            realm: newRealm,
            realmLevel: newRealmLevel,
            cultivation: newCultivation,
            hp: newHp,
            maxHp: newMaxHp,
            attack: newAttack,
            defense: newDefense,
            buffs: activeBuffs,
          }
        })

        // 3. 探索任务完成检查（基于游戏时间）
        const completedTasks = newTasks.filter(t => state.gameTime + tickMs - t.startTime >= t.duration)
        newTasks = newTasks.filter(t => state.gameTime + tickMs - t.startTime < t.duration)

        for (const task of completedTasks) {
          const disciple = newDisciples.find(d => d.currentTask?.id === task.id)
          if (disciple) {
            // 讨伐类任务触发战斗
            if (task.type === '讨伐') {
              const enemies = ENEMY_TEMPLATES[task.difficulty] || ENEMY_TEMPLATES[1]
              const enemy = { ...enemies[Math.floor(Math.random() * enemies.length)] }
              // 计算法器加成
              const equippedArts = (disciple.equippedArtifacts ?? [])
                .map(id => newResources.artifacts?.find(a => a.id === id))
                .filter(Boolean) as { stats: { attack?: number; defense?: number; hp?: number; cultivationSpeed?: number; special?: string } }[]
              const artifactBonus = {
                attack: equippedArts.reduce((s, a) => s + (a.stats.attack || 0), 0),
                defense: equippedArts.reduce((s, a) => s + (a.stats.defense || 0), 0),
                hp: equippedArts.reduce((s, a) => s + (a.stats.hp || 0), 0),
              }
              const combatResult = resolveCombat(disciple, enemy, artifactBonus)

              // 应用战斗结果
              newDisciples = newDisciples.map(d => {
                if (d.id !== disciple.id) return d
                return {
                  ...d,
                  hp: Math.max(1, d.hp - combatResult.discipleHpLost),
                  cultivation: d.cultivation + combatResult.rewards.cultivation,
                }
              })

              newResources.spiritStones += combatResult.rewards.spiritStones
              if (combatResult.rewards.materials) {
                for (const mat of combatResult.rewards.materials) {
                  newResources.materials[mat.type] = (newResources.materials[mat.type] || 0) + mat.amount
                }
              }

              // 战斗日志
              const combatSummary = combatResult.rounds.slice(0, 6).map(r => {
                const arrow = r.attacker === 'disciple' ? '⚔' : '💥'
                return `${arrow} ${r.attackerName}→${r.defenderName} -${r.damage}HP`
              }).join(' | ')

              newMessages.push({
                id: generateId(), timestamp: Date.now(),
                type: combatResult.victory ? 'success' : 'danger', read: false,
                text: combatResult.victory
                  ? `⚔ ${disciple.name}击败了${enemy.name}！${combatSummary}`
                  : `💀 ${disciple.name}不敌${enemy.name}，重伤而归。${combatSummary}`,
              })
              soundManager.combat()
            }

            // 发放基础奖励
            newResources.spiritStones += task.rewards.spiritStones || 0
            if (task.rewards.cultivation) {
              newDisciples = newDisciples.map(d =>
                d.id === disciple.id ? { ...d, cultivation: d.cultivation + task.rewards.cultivation! } : d
              )
            }
            // 法器掉落（难度越高概率越大）
            if (Math.random() < task.difficulty * 0.12) {
              const template = ARTIFACT_TEMPLATES[Math.floor(Math.random() * ARTIFACT_TEMPLATES.length)]
              const newArtifact = { ...template, id: generateId() }
              newResources.artifacts = [...(newResources.artifacts || []), newArtifact]
              newMessages.push({
                id: generateId(), timestamp: Date.now(), type: 'event', read: false,
                text: `🎉 ${disciple.name}在探索中获得了法器「${newArtifact.name}」！`,
              })
            }
            if (task.type !== '讨伐') {
              newMessages.push({
                id: generateId(), timestamp: Date.now(), type: 'success', read: false,
                text: `${disciple.name}完成「${task.name}」，获得${task.rewards.spiritStones}灵石！`,
              })
            }
            // 清除任务状态
            newDisciples = newDisciples.map(d =>
              d.id === disciple.id ? { ...d, status: 'idle' as const, currentTask: undefined } : d
            )
            // 清理关联的活跃事件
            set(state => ({
              activeEvents: state.activeEvents.filter(e => e.taskId !== task.id),
            }))
          }
        }

        // 3.5 随机事件触发（批量收集后一次 set，避免循环内 set 覆盖）
        const currentActiveEvents = get().activeEvents
        const newActiveEvents: ActiveEvent[] = []
        for (const task of newTasks) {
          if (currentActiveEvents.some(e => e.taskId === task.id)) continue
          if (newActiveEvents.some(e => e.taskId === task.id)) continue

          const eligibleEvents = EXPLORATION_EVENTS.filter(evt => {
            if (task.type === '探索' && !['evt_ancient_cave', 'evt_spirit_spring', 'evt_wandering_merchant'].includes(evt.id)) return false
            if (task.type === '讨伐' && !['evt_beast_ambush', 'evt_boss_beast', 'evt_wandering_merchant'].includes(evt.id)) return false
            if (task.type === '采集' && !['evt_rare_herb', 'evt_spirit_spring'].includes(evt.id)) return false
            if (task.type === '历练' && !['evt_duel_challenge', 'evt_wandering_merchant'].includes(evt.id)) return false
            if (task.type === '秘境' && !['evt_treasure_room', 'evt_ancient_cave', 'evt_spirit_spring'].includes(evt.id)) return false
            return true
          })

          for (const evt of eligibleEvents) {
            // 概率按游戏时间缩放，但上限 15%/tick 避免 5x 时过于频繁
            const triggerChance = Math.min(0.15, evt.probability * (tickMs / 60000))
            if (Math.random() < triggerChance) {
              const disciple = newDisciples.find(d => d.currentTask?.id === task.id)
              if (disciple) {
                newActiveEvents.push({
                  id: generateId(),
                  taskId: task.id,
                  discipleId: disciple.id,
                  event: evt,
                  triggeredAt: state.gameTime + tickMs,
                })
                break
              }
            }
          }
        }
        if (newActiveEvents.length > 0) {
          set(state => ({
            activeEvents: [...state.activeEvents, ...newActiveEvents],
          }))
        }

        // 4. 灵气回复（tickMs 已含 gameSpeed，不重复乘）
        newResources.spiritualEnergy = Math.min(
          newResources.spiritualEnergy + GAME_CONFIG.ENERGY_REGEN_RATE * (tickMs / 1000),
          1000
        )

        // 5. 舍入
        newResources.spiritStones = Math.floor(newResources.spiritStones)
        newResources.spiritualEnergy = Math.round(newResources.spiritualEnergy * 100) / 100
        for (const key in newResources.materials) {
          newResources.materials[key] = Math.round(newResources.materials[key] * 100) / 100
        }

        // 6. 访客到来（会客厅有弟子时，每 tick 5% 概率）
        if (!(state.activeVisitor) && state.haven.rooms.some(r => r.type === '会客厅' && r.assignedDisciples.length > 0)) {
          if (Math.random() < 0.05 * (tickMs / 1000)) {
            const visitor = VISITORS[Math.floor(Math.random() * VISITORS.length)]
            set({ activeVisitor: { visitor, arrivedAt: state.gameTime + tickMs } })
            newMessages.push({
              id: generateId(), timestamp: Date.now(), type: 'event', read: false,
              text: `🚪 ${visitor.name}到访洞府！`,
            })
            soundManager.visitor()
          }
        }

        // 7. 成就检查（每 30 秒）
        if (Math.floor((state.gameTime + tickMs) / 30000) > Math.floor(state.gameTime / 30000)) {
          get().checkAchievements()
          get().checkMainQuests()
        }

        set({
          resources: newResources,
          disciples: newDisciples,
          tasks: newTasks,
          messages: [...newMessages, ...state.messages].slice(0, GAME_CONFIG.MAX_MESSAGES),
          gameTime: state.gameTime + tickMs,
          totalPlayTime: state.totalPlayTime + tickMs,
        })
      },

      addMessage: (msg) => {
        set(state => ({
          messages: [
            { ...msg, id: generateId(), timestamp: Date.now(), read: false },
            ...state.messages,
          ].slice(0, GAME_CONFIG.MAX_MESSAGES),
        }))
      },

      // === 存档 ===
      saveGame: () => {
        set({ lastSaveTime: Date.now() })
        get().addMessage({ type: 'info', text: '💾 游戏已保存' })
      },

      loadGame: () => {
        // Zustand persist 自动处理
        get().addMessage({ type: 'info', text: '📂 存档已加载' })
      },

      resetGame: () => {
        set(createInitialState())
      },

      setGameSpeed: (speed) => {
        set(state => ({
          settings: { ...state.settings, gameSpeed: speed },
        }))
      },

      toggleAutoSave: () => {
        set(state => ({
          settings: { ...state.settings, autoSave: !state.settings.autoSave },
        }))
      },

      toggleSound: () => {
        set(state => {
          const enabled = !state.settings.soundEnabled
          soundManager.setEnabled(enabled)
          return { settings: { ...state.settings, soundEnabled: enabled } }
        })
      },

      toggleBgm: () => {
        set(state => {
          const enabled = !state.settings.bgmEnabled
          soundManager.setBgmEnabled(enabled)
          return { settings: { ...state.settings, bgmEnabled: enabled } }
        })
      },

      setSoundVolume: (v) => {
        soundManager.setVolume(v)
        set(state => ({ settings: { ...state.settings, soundVolume: v } }))
      },

      setBgmVolume: (v) => {
        soundManager.setBgmVolume(v)
        set(state => ({ settings: { ...state.settings, bgmVolume: v } }))
      },
    }),
    {
      name: 'xiuxian-haven-save',
      partialize: (state) => ({
        haven: state.haven,
        disciples: state.disciples,
        resources: state.resources,
        messages: state.messages,
        tasks: state.tasks,
        activeEvents: state.activeEvents,
        activeVisitor: state.activeVisitor,
        achievements: state.achievements,
        mainQuests: state.mainQuests,
        gameTime: state.gameTime,
        lastSaveTime: state.lastSaveTime,
        totalPlayTime: state.totalPlayTime,
        settings: state.settings,
      }),
    }
  )
)
