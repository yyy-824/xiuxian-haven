// ===== 修仙境界 =====
export type CultivationRealm =
  | '练气' | '筑基' | '金丹' | '元婴' | '化神' | '渡劫' | '大乘' | '真仙'

export interface RealmInfo {
  name: CultivationRealm
  description: string
  maxLevel: number
  basePower: number
  breakthroughChance: number // 基础突破概率
  requiredQi: number // 突破所需灵气
}

// ===== 灵根属性 =====
export type Element = '金' | '木' | '水' | '火' | '土'

export interface SpiritualRoot {
  elements: Element[] // 灵根元素
  quality: number // 灵根品质 1-100
  name: string // 天灵根、双灵根、杂灵根等
}

// ===== 弟子属性 =====
export interface Disciple {
  id: string
  name: string
  gender: '男' | '女'
  age: number
  realm: CultivationRealm
  realmLevel: number // 当前境界等级
  cultivation: number // 当前修为进度
  spiritualRoot: SpiritualRoot
  stats: DiscipleStats
  traits: Trait[]
  equippedArtifacts: string[] // 装备的法器ID
  status: 'idle' | 'cultivating' | 'exploring' | 'resting' | 'crafting'
  currentTask?: Task
  hp: number
  maxHp: number
  attack: number
  defense: number
  buffs: ActiveBuff[] // 激活的buff
}

export interface ActiveBuff {
  id: string
  name: string
  effect: PillEffect
  startTime: number
  endTime: number
}

export interface DiscipleStats {
  comprehension: number // 悟性 1-100
  charm: number // 魅力 1-100
  luck: number // 气运 1-100
  willpower: number // 心志 1-100
  perception: number // 感知 1-100
}

export interface Trait {
  id: string
  name: string
  description: string
  effect: TraitEffect
}

export interface TraitEffect {
  stat?: Partial<DiscipleStats>
  cultivationSpeed?: number // 百分比加成
  combatPower?: number
  explorationBonus?: number
  special?: string
}

// ===== 资源 =====
export interface Resources {
  spiritStones: number // 灵石
  spiritualEnergy: number // 灵气
  pills: Record<string, number> // 丹药
  materials: Record<string, number> // 材料
  artifacts: Artifact[] // 法器
}

// ===== 丹药 =====
export interface Pill {
  id: string
  name: string
  description: string
  quality: '凡品' | '灵品' | '宝品' | '仙品'
  effect: PillEffect
  materials: Record<string, number> // 炼制所需材料
  spiritStoneCost: number // 灵石消耗
  baseSuccessRate: number // 基础成功率 0-1
}

// ===== 锻造配方 =====
export interface ForgingRecipe {
  id: string
  name: string
  artifact: Omit<Artifact, 'id'>
  materials: Record<string, number>
  spiritStoneCost: number
  baseSuccessRate: number
}

export interface PillEffect {
  type: 'heal' | 'cultivation' | 'buff' | 'breakthrough'
  value: number
  duration?: number // buff持续时间（毫秒）
  stat?: Partial<DiscipleStats>
}

// ===== 法器 =====
export interface Artifact {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'accessory' | 'talisman'
  quality: '凡品' | '灵品' | '宝品' | '仙品' | '神品'
  element?: Element
  stats: {
    attack?: number
    defense?: number
    hp?: number
    cultivationSpeed?: number
    special?: string
  }
  description: string
}

// ===== 建筑/房间 =====
export type RoomType =
  | '修炼室' | '丹房' | '炼器房' | '聚灵阵' | '藏经阁'
  | '灵田' | '灵矿' | '会客厅' | '寝殿' | '练功场'
  | '秘境入口' | '护山大阵'

export interface Room {
  id: string
  type: RoomType
  level: number
  maxLevel: number
  capacity: number // 可容纳弟子数
  assignedDisciples: string[] // 分配的弟子ID
  production: ResourceProduction
  upgradeCost: Partial<Resources>
  description: string
}

export interface ResourceProduction {
  spiritStones?: number // 每分钟产出
  spiritualEnergy?: number
  pills?: { type: string; amount: number }[]
  materials?: { type: string; amount: number }[]
  cultivationSpeed?: number // 修炼速度加成
}

// ===== 探索任务 =====
export interface Task {
  id: string
  name: string
  type: '探索' | '讨伐' | '采集' | '历练' | '秘境'
  description: string
  duration: number // 毫秒
  startTime: number
  difficulty: number // 1-10
  requirements: {
    minRealm?: CultivationRealm
    minPower?: number
    elements?: Element[]
  }
  rewards: TaskReward
  events: TaskEvent[] // 随机事件
}

export interface TaskReward {
  spiritStones?: number
  cultivation?: number
  pills?: { type: string; amount: number }[]
  materials?: { type: string; amount: number }[]
  artifacts?: Artifact[]
  experience?: number
}

export interface TaskEvent {
  id: string
  trigger: 'start' | 'middle' | 'end' | 'random'
  probability: number
  text: string
  choices: EventChoice[]
}

export interface EventOutcome {
  spiritStones?: number
  cultivation?: number
  materials?: { type: string; amount: number }[]
  hpLoss?: number
  text?: string
}

export interface EventChoice {
  text: string
  requirement?: Partial<DiscipleStats>
  outcome: {
    success: EventOutcome
    failure?: EventOutcome
    successRate: number
  }
}

// ===== 洞府（基地） =====
export interface Haven {
  name: string
  level: number
  rooms: Room[]
  defense: number // 护山大阵强度
  spiritualDensity: number // 灵气浓度（影响修炼速度）
}

// ===== 游戏事件/消息 =====
export interface GameMessage {
  id: string
  timestamp: number
  type: 'info' | 'success' | 'warning' | 'danger' | 'event'
  text: string
  read: boolean
}

// ===== 主线任务 =====
export interface MainQuest {
  id: string
  chapter: number
  title: string
  narrative: string // 剧情文本
  objective: string // 目标描述
  objectiveType: 'build' | 'recruit' | 'cultivate' | 'explore' | 'craft' | 'forge' | 'realm' | 'collect' | 'defeat'
  objectiveTarget: string // 目标值，如 '修炼室', '筑基', 数量字符串
  objectiveCount: number
  reward: { spiritStones?: number; materials?: Record<string, number>; pillName?: string; description?: string }
  completed: boolean // 目标是否完成
  rewardClaimed?: boolean // 奖励是否已领取
  unlocked: boolean
}

// ===== 访客 =====
export interface Visitor {
  name: string
  type: 'merchant' | 'seeker' | 'benefactor' | 'rival'
  description: string
  options: VisitorOption[]
}

export interface VisitorOption {
  text: string
  cost?: { spiritStones?: number; materials?: Record<string, number> }
  reward?: { spiritStones?: number; cultivation?: number; materials?: Record<string, number>; pillName?: string }
  requirement?: { charm?: number }
}

// ===== 成就 =====
export interface Achievement {
  id: string
  name: string
  description: string
  condition: string
  reward?: { spiritStones?: number; description?: string }
  unlocked: boolean
  unlockedAt?: number
}

// ===== 活跃探索事件 =====
export interface ActiveEvent {
  id: string
  taskId: string
  discipleId: string
  event: TaskEvent
  triggeredAt: number // gameTime
}

// ===== 游戏状态 =====
export interface GameState {
  haven: Haven
  disciples: Disciple[]
  resources: Resources
  messages: GameMessage[]
  tasks: Task[]
  activeEvents: ActiveEvent[] // 进行中的探索事件
  activeVisitor: { visitor: Visitor; arrivedAt: number } | null // 当前访客
  achievements: Achievement[]
  mainQuests: MainQuest[]
  gameTime: number // 游戏内时间（毫秒）
  lastSaveTime: number
  totalPlayTime: number
  settings: GameSettings
}

export interface GameSettings {
  autoSave: boolean
  autoSaveInterval: number // 毫秒
  gameSpeed: number // 1x, 2x, 5x
  soundEnabled: boolean
  bgmEnabled: boolean
  soundVolume: number // 0-1
  bgmVolume: number // 0-1
  notificationsEnabled: boolean
}
