import type { RealmInfo, CultivationRealm, Element, Trait, Artifact, Room, RoomType, Pill, Disciple } from './types'

// ===== 境界体系 =====
export const REALMS: Record<CultivationRealm, RealmInfo> = {
  '练气': { name: '练气', description: '初窥仙道，引气入体', maxLevel: 9, basePower: 10, breakthroughChance: 0.8, requiredQi: 100 },
  '筑基': { name: '筑基', description: '筑就道基，脱胎换骨', maxLevel: 9, basePower: 50, breakthroughChance: 0.6, requiredQi: 500 },
  '金丹': { name: '金丹', description: '凝聚金丹，大道初成', maxLevel: 9, basePower: 200, breakthroughChance: 0.4, requiredQi: 2000 },
  '元婴': { name: '元婴', description: '元婴出窍，神游太虚', maxLevel: 9, basePower: 800, breakthroughChance: 0.25, requiredQi: 8000 },
  '化神': { name: '化神', description: '化神合道，天地共鸣', maxLevel: 9, basePower: 3000, breakthroughChance: 0.15, requiredQi: 30000 },
  '渡劫': { name: '渡劫', description: '天劫降临，浴火重生', maxLevel: 9, basePower: 10000, breakthroughChance: 0.1, requiredQi: 100000 },
  '大乘': { name: '大乘', description: '大乘圆满，飞升在望', maxLevel: 9, basePower: 50000, breakthroughChance: 0.05, requiredQi: 500000 },
  '真仙': { name: '真仙', description: '超脱凡尘，永恒不朽', maxLevel: 1, basePower: 999999, breakthroughChance: 0, requiredQi: 0 },
}

export const REALM_ORDER: CultivationRealm[] = ['练气', '筑基', '金丹', '元婴', '化神', '渡劫', '大乘', '真仙']

export const REALMS_MAP: Record<CultivationRealm, number> = {
  '练气': 0, '筑基': 1, '金丹': 2, '元婴': 3, '化神': 4, '渡劫': 5, '大乘': 6, '真仙': 7,
}

// ===== 灵根系统 =====
export const ELEMENTS: Element[] = ['金', '木', '水', '火', '土']

export const ELEMENT_COLORS: Record<Element, string> = {
  '金': '#FFD700',
  '木': '#4a7c59',
  '水': '#5b7bb5',
  '火': '#c23b22',
  '土': '#d4a574',
}

export const ELEMENT_RELATIONS: Record<Element, { generates: Element; overcomes: Element }> = {
  '金': { generates: '水', overcomes: '木' },
  '木': { generates: '火', overcomes: '土' },
  '水': { generates: '木', overcomes: '火' },
  '火': { generates: '土', overcomes: '金' },
  '土': { generates: '金', overcomes: '水' },
}

// 灵根品质名称
export function getSpiritualRootName(elements: Element[]): string {
  if (elements.length === 1) return '天灵根'
  if (elements.length === 2) return '双灵根'
  if (elements.length === 3) return '三灵根'
  if (elements.length === 4) return '四灵根'
  return '杂灵根'
}

// ===== 特质系统 =====
export const TRAITS: Trait[] = [
  { id: 'genius', name: '天纵奇才', description: '修炼速度大幅提升', effect: { cultivationSpeed: 50 } },
  { id: 'diligent', name: '勤修苦练', description: '修炼速度小幅提升', effect: { cultivationSpeed: 20 } },
  { id: 'lucky', name: '气运之子', description: '探索时获得额外奖励', effect: { stat: { luck: 30 }, explorationBonus: 25 } },
  { id: 'strong', name: '天生神力', description: '战斗力提升', effect: { combatPower: 30, stat: { willpower: 10 } } },
  { id: 'calm', name: '心如止水', description: '突破概率提升', effect: { stat: { willpower: 30, comprehension: 10 } } },
  { id: 'charming', name: '倾国倾城', description: '魅力极高，会客效果提升', effect: { stat: { charm: 40 } } },
  { id: 'perceptive', name: '感知敏锐', description: '更容易发现隐藏机缘', effect: { stat: { perception: 30 }, explorationBonus: 15 } },
  { id: 'weak', name: '体弱多病', description: '生命值较低', effect: { stat: { willpower: -10 } } },
  { id: 'cursed', name: '命途多舛', description: '气运较低，但悟性补偿', effect: { stat: { luck: -20, comprehension: 15 } } },
  { id: 'reckless', name: '鲁莽冲动', description: '战斗力高但容易受伤', effect: { combatPower: 20, stat: { willpower: -15, perception: -10 } } },
]

// ===== 姓名库 =====
export const SURNAMES = [
  '李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
  '林', '苏', '叶', '沈', '韩', '萧', '谢', '陆', '顾', '宋',
  '楚', '秦', '白', '慕容', '上官', '欧阳', '司马', '诸葛',
  '云', '风', '雪', '月', '星', '霜', '凌', '墨', '夜', '龙',
]

export const MALE_NAMES = [
  '长风', '天行', '无忌', '逸尘', '子墨', '浩然', '承渊', '玄清',
  '破军', '剑心', '孤鸿', '归尘', '九霄', '星辰', '玉衡', '明远',
  '青云', '问道', '凌霄', '千山', '万壑', '沧海', '惊鸿', '飞羽',
]

export const FEMALE_NAMES = [
  '清音', '若雪', '紫烟', '月华', '凝霜', '碧落', '瑶光', '素心',
  '青鸾', '灵犀', '幽兰', '冰心', '秋水', '梦蝶', '云裳', '霓凰',
  '剑心', '飞雪', '听雨', '落梅', '映月', '拂柳', '含烟', '凝露',
]

// ===== 法器预设 =====
export const ARTIFACT_TEMPLATES: Omit<Artifact, 'id'>[] = [
  { name: '青锋剑', type: 'weapon', quality: '凡品', element: '金', stats: { attack: 10 }, description: '普通铁剑，锋利尚可' },
  { name: '玄铁重剑', type: 'weapon', quality: '灵品', element: '金', stats: { attack: 30 }, description: '重剑无锋，大巧不工' },
  { name: '碧玉簪', type: 'accessory', quality: '灵品', element: '木', stats: { cultivationSpeed: 10 }, description: '蕴含木灵之气，助益修炼' },
  { name: '寒冰甲', type: 'armor', quality: '灵品', element: '水', stats: { defense: 25, hp: 50 }, description: '以千年寒冰铸就' },
  { name: '赤炎旗', type: 'weapon', quality: '宝品', element: '火', stats: { attack: 60 }, description: '旗展之处，烈焰焚天' },
  { name: '土灵珠', type: 'accessory', quality: '宝品', element: '土', stats: { defense: 20, cultivationSpeed: 15 }, description: '大地之力凝聚而成' },
  { name: '紫电锤', type: 'weapon', quality: '仙品', stats: { attack: 120 }, description: '雷电交织，威能无穷' },
  { name: '混元金斗', type: 'talisman', quality: '仙品', stats: { attack: 80, defense: 80 }, description: '可收万物，攻防一体' },
]

// ===== 建筑模板 =====
export const ROOM_TEMPLATES: Record<RoomType, Omit<Room, 'id' | 'assignedDisciples'>> = {
  '修炼室': {
    type: '修炼室', level: 1, maxLevel: 10, capacity: 3,
    production: { cultivationSpeed: 10 },
    upgradeCost: { spiritStones: 100 },
    description: '弟子闭关修炼之所，灵气充裕',
  },
  '丹房': {
    type: '丹房', level: 1, maxLevel: 10, capacity: 2,
    production: { pills: [{ type: '聚气丹', amount: 1 }] },
    upgradeCost: { spiritStones: 200, materials: { '灵草': 5 } },
    description: '炼制丹药之处，炉火纯青',
  },
  '炼器房': {
    type: '炼器房', level: 1, maxLevel: 10, capacity: 2,
    production: { materials: [{ type: '精铁', amount: 2 }] },
    upgradeCost: { spiritStones: 300, materials: { '矿石': 10 } },
    description: '锻造法器之地，炉火熊熊',
  },
  '聚灵阵': {
    type: '聚灵阵', level: 1, maxLevel: 10, capacity: 0,
    production: { spiritualEnergy: 5 },
    upgradeCost: { spiritStones: 500 },
    description: '汇聚天地灵气，提升洞府灵气浓度',
  },
  '藏经阁': {
    type: '藏经阁', level: 1, maxLevel: 10, capacity: 5,
    production: { cultivationSpeed: 5 },
    upgradeCost: { spiritStones: 400 },
    description: '收藏功法秘籍，弟子可在此参悟',
  },
  '灵田': {
    type: '灵田', level: 1, maxLevel: 10, capacity: 2,
    production: { materials: [{ type: '灵草', amount: 3 }] },
    upgradeCost: { spiritStones: 80 },
    description: '种植灵药仙草，定期收获',
  },
  '灵矿': {
    type: '灵矿', level: 1, maxLevel: 10, capacity: 3,
    production: { materials: [{ type: '矿石', amount: 2 }], spiritStones: 5 },
    upgradeCost: { spiritStones: 150 },
    description: '开采灵矿，获取炼器材料',
  },
  '会客厅': {
    type: '会客厅', level: 1, maxLevel: 5, capacity: 2,
    production: { spiritStones: 10 },
    upgradeCost: { spiritStones: 300 },
    description: '接待访客，交易物品，获取灵石',
  },
  '寝殿': {
    type: '寝殿', level: 1, maxLevel: 10, capacity: 5,
    production: {},
    upgradeCost: { spiritStones: 120 },
    description: '弟子休息恢复之所',
  },
  '练功场': {
    type: '练功场', level: 1, maxLevel: 10, capacity: 4,
    production: { cultivationSpeed: 8 },
    upgradeCost: { spiritStones: 250, materials: { '精铁': 5 } },
    description: '弟子切磋修炼战斗技巧',
  },
  '秘境入口': {
    type: '秘境入口', level: 1, maxLevel: 3, capacity: 1,
    production: {},
    upgradeCost: { spiritStones: 1000, materials: { '灵石矿': 5 } },
    description: '通往秘境的传送阵',
  },
  '护山大阵': {
    type: '护山大阵', level: 1, maxLevel: 10, capacity: 0,
    production: {},
    upgradeCost: { spiritStones: 800, materials: { '阵旗': 3 } },
    description: '守护洞府的大阵，抵御外敌',
  },
}

// ===== 探索事件模板 =====
import type { TaskEvent } from './types'

// ===== 访客模板 =====
import type { Visitor, MainQuest } from './types'

export const VISITORS: Visitor[] = [
  {
    name: '游方商人',
    type: 'merchant',
    description: '一位走南闯北的散修商人，携带各种奇货。',
    options: [
      { text: '购买灵草包（💎50）', cost: { spiritStones: 50 }, reward: { materials: { '灵草': 10 } } },
      { text: '购买矿石包（💎80）', cost: { spiritStones: 80 }, reward: { materials: { '矿石': 10 } } },
      { text: '购买灵泉水（💎120）', cost: { spiritStones: 120 }, reward: { materials: { '灵泉水': 3 } } },
      { text: '礼貌送客', reward: {} },
    ],
  },
  {
    name: '落魄修士',
    type: 'seeker',
    description: '一位衣衫褴褛的修士，恳求加入洞府。',
    options: [
      { text: '收留他（免费获得一名弟子）', reward: {} },
      { text: '赠予灵石打发（💎30）', cost: { spiritStones: 30 }, reward: { spiritStones: 0 } },
      { text: '婉言谢绝', reward: {} },
    ],
  },
  {
    name: '云游仙人',
    type: 'benefactor',
    description: '一位仙风道骨的老者路过，似乎心情不错。',
    options: [
      { text: '恭敬请教（魅力≥40）', requirement: { charm: 40 }, reward: { cultivation: 100 } },
      { text: '献茶招待（💎20）', cost: { spiritStones: 20 }, reward: { cultivation: 60, spiritStones: 50 } },
      { text: '目送离去', reward: {} },
    ],
  },
  {
    name: '挑战者',
    type: 'rival',
    description: '一位傲慢的修士登门挑战，扬言要踏平洞府。',
    options: [
      { text: '应战（随机弟子出战）', reward: { spiritStones: 200, cultivation: 80 } },
      { text: '纳贡求和（💎100）', cost: { spiritStones: 100 }, reward: {} },
      { text: '闭门不见', reward: {} },
    ],
  },
  {
    name: '丹药贩子',
    type: 'merchant',
    description: '一个精明的商人，专门出售成品丹药。',
    options: [
      { text: '购买回春丹（💎40）', cost: { spiritStones: 40 }, reward: { pillName: '回春丹' } },
      { text: '购买聚气丹（💎50）', cost: { spiritStones: 50 }, reward: { pillName: '聚气丹' } },
      { text: '购买破境丹（💎200）', cost: { spiritStones: 200 }, reward: { pillName: '破境丹' } },
      { text: '不买，送客', reward: {} },
    ],
  },
]

// 动态探索任务生成器
export function generateDynamicTask(havenLevel: number, gameTime: number) {
  const templates = [
    { name: '遗迹探秘', type: '探索' as const, baseDuration: 60000, baseDifficulty: 1, baseReward: { spiritStones: 50, cultivation: 20 } },
    { name: '妖兽巢穴', type: '讨伐' as const, baseDuration: 120000, baseDifficulty: 2, baseReward: { spiritStones: 100, cultivation: 50 } },
    { name: '灵脉采集', type: '采集' as const, baseDuration: 90000, baseDifficulty: 1, baseReward: { spiritStones: 30, cultivation: 10 } },
    { name: '宗门试炼', type: '历练' as const, baseDuration: 180000, baseDifficulty: 3, baseReward: { spiritStones: 200, cultivation: 100 } },
    { name: '上古秘境', type: '秘境' as const, baseDuration: 300000, baseDifficulty: 4, baseReward: { spiritStones: 500, cultivation: 300 } },
    { name: '深渊讨伐', type: '讨伐' as const, baseDuration: 240000, baseDifficulty: 5, baseReward: { spiritStones: 400, cultivation: 200 } },
    { name: '天机阁探秘', type: '探索' as const, baseDuration: 150000, baseDifficulty: 3, baseReward: { spiritStones: 150, cultivation: 80 } },
    { name: '灵矿开采', type: '采集' as const, baseDuration: 120000, baseDifficulty: 2, baseReward: { spiritStones: 60, cultivation: 25 } },
  ]

  // 随着游戏时间推进，难度递进
  const timeFactor = Math.floor(gameTime / 600000) // 每10分钟游戏时间+1级
  const levelFactor = havenLevel - 1
  const difficultyBoost = Math.min(5, timeFactor + levelFactor)

  const template = templates[Math.floor(Math.random() * templates.length)]
  const difficulty = Math.min(10, template.baseDifficulty + difficultyBoost)
  const rewardMultiplier = 1 + difficultyBoost * 0.3

  return {
    name: template.name,
    type: template.type,
    duration: template.baseDuration + difficultyBoost * 30000,
    difficulty,
    rewards: {
      spiritStones: Math.floor(template.baseReward.spiritStones * rewardMultiplier),
      cultivation: Math.floor(template.baseReward.cultivation * rewardMultiplier),
    },
  }
}

// ===== 探索事件模板 =====

export const EXPLORATION_EVENTS: TaskEvent[] = [
  // === 探索类 ===
  {
    id: 'evt_ancient_cave',
    trigger: 'random',
    probability: 0.3,
    text: '你发现了一处隐蔽的古修洞府入口，洞口灵气浓郁，但隐约传来危险的气息。',
    choices: [
      {
        text: '谨慎探查',
        requirement: { perception: 40 },
        outcome: {
          success: { spiritStones: 100, cultivation: 30, materials: [{ type: '灵草', amount: 3 }] },
          failure: { hpLoss: 20, text: '洞中设有禁制，你被弹飞受伤。' },
          successRate: 0.7,
        },
      },
      {
        text: '大胆闯入',
        outcome: {
          success: { spiritStones: 200, cultivation: 50 },
          failure: { hpLoss: 40, text: '洞中妖兽突袭，你重伤逃出。' },
          successRate: 0.4,
        },
      },
      {
        text: '放弃离开',
        outcome: {
          success: {},
          successRate: 1,
        },
      },
    ],
  },
  {
    id: 'evt_spirit_spring',
    trigger: 'random',
    probability: 0.2,
    text: '途中偶遇一处灵泉，泉水清澈见底，散发着淡淡的灵气波动。',
    choices: [
      {
        text: '饮泉修炼',
        outcome: {
          success: { cultivation: 80 },
          failure: { hpLoss: 10, text: '泉水寒气入体，修炼受阻。' },
          successRate: 0.8,
        },
      },
      {
        text: '收集泉水',
        outcome: {
          success: { materials: [{ type: '灵泉水', amount: 2 }] },
          successRate: 1,
        },
      },
    ],
  },
  {
    id: 'evt_wandering_merchant',
    trigger: 'random',
    probability: 0.25,
    text: '一位游方散修拦住去路，声称有宝物低价出售。',
    choices: [
      {
        text: '花50灵石购买',
        outcome: {
          success: { cultivation: 60, materials: [{ type: '灵草', amount: 5 }] },
          failure: { text: '买到的是废品，灵石白花了。', spiritStones: -50 },
          successRate: 0.6,
        },
      },
      {
        text: '婉言谢绝',
        outcome: {
          success: {},
          successRate: 1,
        },
      },
    ],
  },
  // === 讨伐类 ===
  {
    id: 'evt_beast_ambush',
    trigger: 'random',
    probability: 0.35,
    text: '一群妖兽突然从林中窜出，将你团团围住！',
    choices: [
      {
        text: '奋力迎战',
        requirement: { willpower: 30 },
        outcome: {
          success: { spiritStones: 150, cultivation: 40, materials: [{ type: '妖丹', amount: 2 }] },
          failure: { hpLoss: 35, text: '妖兽凶猛，你寡不敌众，重伤逃脱。' },
          successRate: 0.6,
        },
      },
      {
        text: '丢弃物资逃走',
        outcome: {
          success: { spiritStones: -30, text: '你丢下部分灵石引开妖兽，趁机逃脱。' },
          successRate: 0.9,
        },
      },
    ],
  },
  {
    id: 'evt_boss_beast',
    trigger: 'random',
    probability: 0.15,
    text: '前方出现一只强大的妖兽首领，周围小妖退避三舍。',
    choices: [
      {
        text: '挑战妖兽首领',
        requirement: { willpower: 50, perception: 30 },
        outcome: {
          success: { spiritStones: 300, cultivation: 100, materials: [{ type: '妖丹', amount: 5 }] },
          failure: { hpLoss: 60, text: '妖兽首领实力恐怖，你几乎丧命。' },
          successRate: 0.35,
        },
      },
      {
        text: '绕道避开',
        outcome: {
          success: { text: '你明智地绕开了危险区域。' },
          successRate: 1,
        },
      },
    ],
  },
  // === 采集类 ===
  {
    id: 'evt_rare_herb',
    trigger: 'random',
    probability: 0.3,
    text: '悬崖边发现一株罕见的千年灵芝，但位置十分危险。',
    choices: [
      {
        text: '冒险采摘',
        requirement: { perception: 35 },
        outcome: {
          success: { materials: [{ type: '灵芝', amount: 3 }, { type: '灵草', amount: 5 }], cultivation: 20 },
          failure: { hpLoss: 25, text: '脚下打滑跌落，所幸抓住了藤蔓。' },
          successRate: 0.65,
        },
      },
      {
        text: '在附近采集普通灵草',
        outcome: {
          success: { materials: [{ type: '灵草', amount: 4 }] },
          successRate: 1,
        },
      },
    ],
  },
  // === 历练类 ===
  {
    id: 'evt_duel_challenge',
    trigger: 'random',
    probability: 0.25,
    text: '一位同道修士向你发起切磋挑战。',
    choices: [
      {
        text: '欣然应战',
        outcome: {
          success: { cultivation: 60, spiritStones: 50, text: '切磋中你领悟了新的战斗技巧！' },
          failure: { hpLoss: 15, text: '技不如人，但收获了宝贵经验。', cultivation: 20 },
          successRate: 0.5,
        },
      },
      {
        text: '礼貌拒绝',
        outcome: {
          success: { text: '对方理解地离去了。' },
          successRate: 1,
        },
      },
    ],
  },
  // === 秘境类 ===
  {
    id: 'evt_treasure_room',
    trigger: 'random',
    probability: 0.4,
    text: '秘境深处发现一间密室，内有宝光闪烁，但门口刻着危险的阵纹。',
    choices: [
      {
        text: '破解阵法进入',
        requirement: { comprehension: 50, perception: 40 },
        outcome: {
          success: { spiritStones: 500, cultivation: 200, materials: [{ type: '灵石矿', amount: 3 }] },
          failure: { hpLoss: 45, text: '阵法反噬，你被弹出数丈。' },
          successRate: 0.4,
        },
      },
      {
        text: '记录位置，下次再来',
        outcome: {
          success: { text: '你记下了密室位置，留待日后探索。' },
          successRate: 1,
        },
      },
    ],
  },
]

// ===== 敌人模板 =====
export interface Enemy {
  name: string
  hp: number
  maxHp: number
  attack: number
  defense: number
  realm: CultivationRealm
  rewards: { spiritStones: number; cultivation: number; materials?: { type: string; amount: number }[] }
}

export const ENEMY_TEMPLATES: Record<number, Enemy[]> = {
  // 难度 1-2
  1: [
    { name: '野狼', hp: 30, maxHp: 30, attack: 5, defense: 2, realm: '练气', rewards: { spiritStones: 10, cultivation: 5 } },
    { name: '灵蜂群', hp: 20, maxHp: 20, attack: 8, defense: 1, realm: '练气', rewards: { spiritStones: 8, cultivation: 4, materials: [{ type: '灵草', amount: 1 }] } },
    { name: '石傀儡', hp: 50, maxHp: 50, attack: 4, defense: 5, realm: '练气', rewards: { spiritStones: 15, cultivation: 6, materials: [{ type: '矿石', amount: 2 }] } },
  ],
  2: [
    { name: '黑风狼王', hp: 80, maxHp: 80, attack: 12, defense: 6, realm: '练气', rewards: { spiritStones: 25, cultivation: 12, materials: [{ type: '妖丹', amount: 1 }] } },
    { name: '毒蛇妖', hp: 60, maxHp: 60, attack: 15, defense: 4, realm: '练气', rewards: { spiritStones: 20, cultivation: 10, materials: [{ type: '灵草', amount: 2 }] } },
  ],
  // 难度 3-4
  3: [
    { name: '赤炎虎', hp: 150, maxHp: 150, attack: 25, defense: 12, realm: '筑基', rewards: { spiritStones: 50, cultivation: 30, materials: [{ type: '妖丹', amount: 2 }] } },
    { name: '玄冰蟒', hp: 200, maxHp: 200, attack: 20, defense: 18, realm: '筑基', rewards: { spiritStones: 60, cultivation: 35 } },
    { name: '噬灵蝠', hp: 100, maxHp: 100, attack: 30, defense: 8, realm: '筑基', rewards: { spiritStones: 40, cultivation: 25 } },
  ],
  4: [
    { name: '金丹妖兽·蛟', hp: 400, maxHp: 400, attack: 50, defense: 30, realm: '金丹', rewards: { spiritStones: 150, cultivation: 80, materials: [{ type: '妖丹', amount: 5 }] } },
    { name: '千年树妖', hp: 500, maxHp: 500, attack: 40, defense: 40, realm: '金丹', rewards: { spiritStones: 120, cultivation: 70, materials: [{ type: '灵芝', amount: 3 }] } },
  ],
  // 难度 5+
  5: [
    { name: '元婴大妖', hp: 1000, maxHp: 1000, attack: 100, defense: 60, realm: '元婴', rewards: { spiritStones: 300, cultivation: 200, materials: [{ type: '妖丹', amount: 10 }] } },
    { name: '天劫残魂', hp: 800, maxHp: 800, attack: 120, defense: 50, realm: '元婴', rewards: { spiritStones: 250, cultivation: 180 } },
  ],
}

// 战斗日志
export interface CombatRound {
  round: number
  attacker: 'disciple' | 'enemy'
  damage: number
  attackerName: string
  defenderName: string
  defenderHpAfter: number
}

export interface CombatResult {
  victory: boolean
  rounds: CombatRound[]
  discipleHpLost: number
  rewards: { spiritStones: number; cultivation: number; materials?: { type: string; amount: number }[] }
}

export function resolveCombat(disciple: Disciple, enemy: Enemy, artifactBonus?: { attack: number; defense: number; hp: number }): CombatResult {
  let dHp = disciple.hp + (artifactBonus?.hp || 0)
  const dAtk = disciple.attack + (artifactBonus?.attack || 0)
  const dDef = disciple.defense + (artifactBonus?.defense || 0)

  let eHp = enemy.hp
  const eAtk = enemy.attack
  const eDef = enemy.defense

  const rounds: CombatRound[] = []
  let round = 0
  const maxRounds = 20

  while (dHp > 0 && eHp > 0 && round < maxRounds) {
    round++

    // 弟子攻击
    const dDmg = Math.max(1, dAtk - eDef + Math.floor(Math.random() * 5) - 2)
    eHp = Math.max(0, eHp - dDmg)
    rounds.push({ round, attacker: 'disciple', damage: dDmg, attackerName: disciple.name, defenderName: enemy.name, defenderHpAfter: eHp })

    if (eHp <= 0) break

    // 敌人攻击
    const eDmg = Math.max(1, eAtk - dDef + Math.floor(Math.random() * 5) - 2)
    dHp = Math.max(0, dHp - eDmg)
    rounds.push({ round, attacker: 'enemy', damage: eDmg, attackerName: enemy.name, defenderName: disciple.name, defenderHpAfter: dHp })
  }

  const victory = eHp <= 0
  const discipleHpLost = disciple.hp - dHp

  return {
    victory,
    rounds,
    discipleHpLost,
    rewards: victory ? enemy.rewards : { spiritStones: 0, cultivation: Math.floor(enemy.rewards.cultivation * 0.2) },
  }
}

// ===== 探索任务模板 =====
export const TASK_TEMPLATES = [
  {
    name: '黑风山探秘',
    type: '探索' as const,
    description: '黑风山中传闻有古修遗迹，或有机缘',
    duration: 60000, // 1分钟（游戏时间）
    difficulty: 1,
    requirements: {},
    rewards: { spiritStones: 50, cultivation: 20, materials: [{ type: '灵草', amount: 2 }] },
  },
  {
    name: '剿灭妖兽',
    type: '讨伐' as const,
    description: '山下村庄受妖兽侵扰，前往清剿',
    duration: 120000,
    difficulty: 2,
    requirements: { minRealm: '练气' as const },
    rewards: { spiritStones: 100, cultivation: 50, materials: [{ type: '妖丹', amount: 1 }] },
  },
  {
    name: '灵药采集',
    type: '采集' as const,
    description: '深谷中有珍稀灵药，需小心采集',
    duration: 90000,
    difficulty: 1,
    requirements: {},
    rewards: { materials: [{ type: '灵草', amount: 5 }, { type: '灵芝', amount: 1 }] },
  },
  {
    name: '宗门大比',
    type: '历练' as const,
    description: '参加宗门弟子比武，以武会友',
    duration: 180000,
    difficulty: 3,
    requirements: { minRealm: '练气' as const },
    rewards: { spiritStones: 200, cultivation: 100 },
  },
  {
    name: '小秘境探索',
    type: '秘境' as const,
    description: '发现一处小型秘境，内有宝物和危险',
    duration: 300000,
    difficulty: 4,
    requirements: { minRealm: '筑基' as const },
    rewards: { spiritStones: 500, cultivation: 300, artifacts: [] },
  },
]

// ===== 丹药配方 =====
export const PILL_RECIPES: Pill[] = [
  {
    id: 'healing_pill',
    name: '回春丹',
    description: '恢复50点生命值',
    quality: '凡品',
    effect: { type: 'heal', value: 50 },
    materials: { '灵草': 3 },
    spiritStoneCost: 10,
    baseSuccessRate: 0.9,
  },
  {
    id: 'qi_pill',
    name: '聚气丹',
    description: '直接增加30修为',
    quality: '凡品',
    effect: { type: 'cultivation', value: 30 },
    materials: { '灵草': 2, '矿石': 1 },
    spiritStoneCost: 15,
    baseSuccessRate: 0.85,
  },
  {
    id: 'spirit_pill',
    name: '凝神丹',
    description: '临时提升悟性+20',
    quality: '灵品',
    effect: { type: 'buff', value: 20, duration: 120000, stat: { comprehension: 20 } },
    materials: { '灵草': 5, '灵泉水': 1 },
    spiritStoneCost: 30,
    baseSuccessRate: 0.7,
  },
  {
    id: 'luck_pill',
    name: '运灵丹',
    description: '临时提升气运+25',
    quality: '灵品',
    effect: { type: 'buff', value: 15, duration: 120000, stat: { luck: 25 } },
    materials: { '灵草': 4, '灵芝': 1 },
    spiritStoneCost: 30,
    baseSuccessRate: 0.7,
  },
  {
    id: 'breakthrough_pill',
    name: '破境丹',
    description: '大幅提升突破概率',
    quality: '宝品',
    effect: { type: 'breakthrough', value: 30 },
    materials: { '灵草': 8, '灵芝': 3, '妖丹': 2 },
    spiritStoneCost: 80,
    baseSuccessRate: 0.5,
  },
  {
    id: 'full_heal_pill',
    name: '九转还魂丹',
    description: '完全恢复生命值',
    quality: '仙品',
    effect: { type: 'heal', value: 9999 },
    materials: { '灵草': 15, '灵芝': 5, '妖丹': 3, '灵泉水': 3 },
    spiritStoneCost: 200,
    baseSuccessRate: 0.3,
  },
]

// ===== 锻造配方 =====
import type { ForgingRecipe } from './types'

export const FORGING_RECIPES: ForgingRecipe[] = [
  {
    id: 'forge_qingfeng',
    name: '锻造青锋剑',
    artifact: { name: '青锋剑', type: 'weapon', quality: '凡品', element: '金', stats: { attack: 10 }, description: '普通铁剑，锋利尚可' },
    materials: { '矿石': 5, '精铁': 2 },
    spiritStoneCost: 20,
    baseSuccessRate: 0.85,
  },
  {
    id: 'forge_xuantie',
    name: '锻造玄铁重剑',
    artifact: { name: '玄铁重剑', type: 'weapon', quality: '灵品', element: '金', stats: { attack: 30 }, description: '重剑无锋，大巧不工' },
    materials: { '矿石': 10, '精铁': 5 },
    spiritStoneCost: 50,
    baseSuccessRate: 0.65,
  },
  {
    id: 'forge_biyu',
    name: '锻造碧玉簪',
    artifact: { name: '碧玉簪', type: 'accessory', quality: '灵品', element: '木', stats: { cultivationSpeed: 10 }, description: '蕴含木灵之气，助益修炼' },
    materials: { '灵草': 8, '灵芝': 2 },
    spiritStoneCost: 40,
    baseSuccessRate: 0.7,
  },
  {
    id: 'forge_hanbing',
    name: '锻造寒冰甲',
    artifact: { name: '寒冰甲', type: 'armor', quality: '灵品', element: '水', stats: { defense: 25, hp: 50 }, description: '以千年寒冰铸就' },
    materials: { '矿石': 8, '精铁': 4, '灵泉水': 2 },
    spiritStoneCost: 60,
    baseSuccessRate: 0.6,
  },
  {
    id: 'forge_chiyan',
    name: '锻造赤炎旗',
    artifact: { name: '赤炎旗', type: 'weapon', quality: '宝品', element: '火', stats: { attack: 60 }, description: '旗展之处，烈焰焚天' },
    materials: { '精铁': 10, '妖丹': 3, '灵泉水': 2 },
    spiritStoneCost: 120,
    baseSuccessRate: 0.45,
  },
  {
    id: 'forge_tuling',
    name: '锻造土灵珠',
    artifact: { name: '土灵珠', type: 'accessory', quality: '宝品', element: '土', stats: { defense: 20, cultivationSpeed: 15 }, description: '大地之力凝聚而成' },
    materials: { '矿石': 12, '灵芝': 4, '妖丹': 2 },
    spiritStoneCost: 100,
    baseSuccessRate: 0.5,
  },
  {
    id: 'forge_zidian',
    name: '锻造紫电锤',
    artifact: { name: '紫电锤', type: 'weapon', quality: '仙品', stats: { attack: 120 }, description: '雷电交织，威能无穷' },
    materials: { '精铁': 20, '妖丹': 8, '灵泉水': 5, '灵石矿': 3 },
    spiritStoneCost: 300,
    baseSuccessRate: 0.3,
  },
  {
    id: 'forge_hunyuan',
    name: '锻造混元金斗',
    artifact: { name: '混元金斗', type: 'talisman', quality: '仙品', stats: { attack: 80, defense: 80 }, description: '可收万物，攻防一体' },
    materials: { '精铁': 15, '妖丹': 6, '灵芝': 5, '灵石矿': 2 },
    spiritStoneCost: 250,
    baseSuccessRate: 0.35,
  },
]

// ===== 游戏配置 =====
export const GAME_CONFIG = {
  TICK_INTERVAL: 1000, // 游戏主循环间隔（毫秒）
  AUTO_SAVE_INTERVAL: 30000, // 自动保存间隔
  BASE_CULTIVATION_SPEED: 1, // 基础修炼速度
  ENERGY_REGEN_RATE: 0.5, // 灵气回复速率（每秒）
  MAX_MESSAGES: 100, // 最大消息数
  INITIAL_SPIRIT_STONES: 500,
  INITIAL_SPIRITUAL_ENERGY: 100,
  HAVEN_NAME: '青云洞天',
}

// 工具函数
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

export function getRealmIndex(realm: CultivationRealm): number {
  return REALM_ORDER.indexOf(realm)
}

export function getNextRealm(realm: CultivationRealm): CultivationRealm | null {
  const idx = REALM_ORDER.indexOf(realm)
  return idx < REALM_ORDER.length - 1 ? REALM_ORDER[idx + 1] : null
}

// ===== 主线任务 =====
export const MAIN_QUESTS: MainQuest[] = [
  // === 第一章：初入仙途 ===
  {
    id: 'mq_1_1', chapter: 1, title: '破土而出',
    narrative: '你站在青云山巅，望着脚下这片荒芜的土地。这里曾是一位大能修士的洞府遗址，如今只剩下残垣断壁和微弱的灵气波动。你深吸一口气，感受着体内那一丝若有若无的灵力——是时候开始重建了。\n\n「既然天地给了我这个机缘，我便要在此扎根，开创属于自己的修仙之路。」',
    objective: '建造修炼室',
    objectiveType: 'build', objectiveTarget: '修炼室', objectiveCount: 1,
    reward: { spiritStones: 100, description: '获得💎100' },
    completed: false, unlocked: true,
  },
  {
    id: 'mq_1_2', chapter: 1, title: '招贤纳士',
    narrative: '修炼室落成之日，山间灵气似乎浓郁了几分。你盘膝而坐，感受着灵气缓缓流入经脉。然而仅凭一人之力，终究难以支撑整个洞府的运转。\n\n你需要弟子——那些渴望修仙却苦无门路的凡人，或是已经踏上修仙路却寻不到好去处的散修。',
    objective: '招募3名弟子',
    objectiveType: 'recruit', objectiveTarget: 'disciple', objectiveCount: 3,
    reward: { spiritStones: 150, materials: { '灵草': 10 }, description: '获得💎150 + 灵草×10' },
    completed: false, unlocked: false,
  },
  {
    id: 'mq_1_3', chapter: 1, title: '开枝散叶',
    narrative: '弟子们陆续到来，洞府渐渐有了生气。你在藏经阁中翻出一卷残破的竹简，上面记载着这座洞府的前身——「青云仙府」，曾是化神期大修士的道场。\n\n「化神期……」你喃喃自语，心中涌起一股豪情。既然前人能做到，你为何不能？\n\n当务之急是扩大洞府规模，为弟子们提供更好的修炼环境。',
    objective: '拥有5座建筑',
    objectiveType: 'build', objectiveTarget: 'building', objectiveCount: 5,
    reward: { spiritStones: 200, materials: { '矿石': 15 }, description: '获得💎200 + 矿石×15' },
    completed: false, unlocked: false,
  },

  // === 第二章：崭露头角 ===
  {
    id: 'mq_2_1', chapter: 2, title: '第一次远行',
    narrative: '洞府初具规模，但想要发展壮大，仅靠洞府内的产出远远不够。你需要让弟子们走出去，探索这片未知的修仙界。\n\n你召集弟子，指着远方云雾缭绕的山脉道：「那便是黑风山，传闻中有古修遗迹。此去虽有凶险，但机缘往往藏于险地之中。」',
    objective: '完成3次探索',
    objectiveType: 'explore', objectiveTarget: 'explore', objectiveCount: 3,
    reward: { spiritStones: 300, materials: { '灵草': 20, '矿石': 10 }, description: '获得💎300 + 灵草×20 + 矿石×10' },
    completed: false, unlocked: false,
  },
  {
    id: 'mq_2_2', chapter: 2, title: '丹道启蒙',
    narrative: '弟子们从黑风山带回了珍贵的灵草和矿石，还有一则消息：附近有一个名为「百草谷」的地方，盛产各种灵药。\n\n你意识到，仅靠采集天然灵药远远不够。如果能学会炼丹之术，便能将这些材料转化为提升修为的丹药，事半功倍。\n\n「传令下去，建造丹房。我要亲自研究丹道。」',
    objective: '建造丹房',
    objectiveType: 'build', objectiveTarget: '丹房', objectiveCount: 1,
    reward: { spiritStones: 200, materials: { '灵草': 15, '灵泉水': 2 }, description: '获得💎200 + 灵草×15 + 灵泉水×2' },
    completed: false, unlocked: false,
  },
  {
    id: 'mq_2_3', chapter: 2, title: '第一炉丹',
    narrative: '丹房建成，炉火初燃。你按照古籍中的配方，小心翼翼地将灵草投入丹炉。火候、药引、时机——每一步都马虎不得。\n\n「丹道如修行，急不得，躁不得。静心凝神，方能成丹。」你对身旁观摩的弟子如是说。',
    objective: '成功炼丹1次',
    objectiveType: 'craft', objectiveTarget: 'craft', objectiveCount: 1,
    reward: { spiritStones: 100, pillName: '聚气丹', description: '获得💎100 + 聚气丹×1' },
    completed: false, unlocked: false,
  },

  // === 第三章：锋芒初露 ===
  {
    id: 'mq_3_1', chapter: 3, title: '妖兽之患',
    narrative: '平静的日子没过多久，山下传来噩耗——一群妖兽从黑风山深处涌出，袭击了附近的村庄。村民们四处逃散，哭声震天。\n\n你站在洞府门前，望着远处升起的浓烟，眉头紧锁。这些妖兽若是不加制止，迟早会威胁到洞府的安全。\n\n「传令弟子，随我出征。是时候让这片地域知道，青云洞天不是好欺负的。」',
    objective: '完成5次讨伐任务',
    objectiveType: 'explore', objectiveTarget: '讨伐', objectiveCount: 5,
    reward: { spiritStones: 500, materials: { '妖丹': 5 }, description: '获得💎500 + 妖丹×5' },
    completed: false, unlocked: false,
  },
  {
    id: 'mq_3_2', chapter: 3, title: '器道传承',
    narrative: '战斗中，你发现弟子们的武器太过简陋。那些妖兽皮糙肉厚，普通铁剑根本难以伤其分毫。\n\n你在一处妖兽巢穴中发现了一块刻满符文的石碑，上面记载着基础的炼器之法。「原来如此……以灵力为引，以矿石为材，辅以阵纹，便可锻造出蕴含灵力的法器。」\n\n这座洞府的秘密，似乎比你想象的更多。',
    objective: '建造炼器房',
    objectiveType: 'build', objectiveTarget: '炼器房', objectiveCount: 1,
    reward: { spiritStones: 300, materials: { '矿石': 20, '精铁': 5 }, description: '获得💎300 + 矿石×20 + 精铁×5' },
    completed: false, unlocked: false,
  },
  {
    id: 'mq_3_3', chapter: 3, title: '初次锻造',
    narrative: '炼器房中炉火熊熊，你将矿石和精铁投入火中，按照石碑上的方法，以灵力引导金属流动，试图在其中刻入阵纹。\n\n汗水顺着额头滑落，灵力消耗巨大。但当你看到那柄初具雏形的铁剑在炉中散发出淡淡的灵光时，你知道——成功了。\n\n「虽然只是凡品，但这只是一个开始。」',
    objective: '成功锻造1件法器',
    objectiveType: 'forge', objectiveTarget: 'forge', objectiveCount: 1,
    reward: { spiritStones: 200, description: '获得💎200' },
    completed: false, unlocked: false,
  },

  // === 第四章：筑基之路 ===
  {
    id: 'mq_4_1', chapter: 4, title: '瓶颈',
    narrative: '随着弟子们修为的提升，你发现一个严峻的问题——练气期的弟子越来越多，但能突破到筑基期的却寥寥无几。\n\n筑基，是修仙路上的第一道天堑。练气期修士若不能筑基成功，寿元不过百年，终将化为尘土。你必须想办法帮助弟子们突破这道瓶颈。',
    objective: '有弟子达到筑基境',
    objectiveType: 'realm', objectiveTarget: '筑基', objectiveCount: 1,
    reward: { spiritStones: 500, materials: { '灵芝': 5, '妖丹': 3 }, description: '获得💎500 + 灵芝×5 + 妖丹×3' },
    completed: false, unlocked: false,
  },
  {
    id: 'mq_4_2', chapter: 4, title: '宗门来人',
    narrative: '第一位弟子成功筑基的消息不胫而走。这日，洞府外来了一位身穿青色道袍的修士，自称来自千里外的「天元宗」。\n\n「恭喜道友，门下弟子能自行筑基，足见道友教导有方。」来人拱手道，「天元宗欲与贵府结为盟友，互通有无。不知意下如何？」\n\n你心中暗喜——能与大宗门搭上关系，对洞府的发展大有裨益。但你也知道，天下没有免费的午餐……',
    objective: '拥有10名弟子',
    objectiveType: 'recruit', objectiveTarget: 'disciple', objectiveCount: 10,
    reward: { spiritStones: 800, materials: { '灵草': 30, '矿石': 20, '灵泉水': 5 }, description: '获得💎800 + 大量材料' },
    completed: false, unlocked: false,
  },
  {
    id: 'mq_4_3', chapter: 4, title: '声名远播',
    narrative: '与天元宗结盟后，青云洞天的名声渐渐传开。越来越多的散修慕名而来，有的想加入，有的想交易，有的……心怀不轨。\n\n你站在洞府最高处，望着下方熙熙攘攘的人群，心中感慨万千。当初那个破败的遗址，如今已是一座生机勃勃的修仙据点。\n\n「但这还不够。」你望向远方那座直插云霄的山峰，「真正的修仙之路，才刚刚开始。」',
    objective: '拥有15座建筑',
    objectiveType: 'build', objectiveTarget: 'building', objectiveCount: 15,
    reward: { spiritStones: 1000, materials: { '灵石矿': 5 }, description: '获得💎1000 + 灵石矿×5' },
    completed: false, unlocked: false,
  },

  // === 第五章：金丹大道 ===
  {
    id: 'mq_5_1', chapter: 5, title: '天劫预兆',
    narrative: '某日深夜，天空突然电闪雷鸣。你惊醒后发现，洞府上空凝聚着一片紫金色的雷云，其中蕴含着令人窒息的威压。\n\n「这是……天劫？」你瞳孔一缩。传说中，修士突破金丹期时会引来天劫，若能扛过去便能凝聚金丹，否则便是形神俱灭。\n\n你的弟子中，已经有人触摸到了金丹的门槛。是时候为他们准备渡劫了。',
    objective: '有弟子达到金丹境',
    objectiveType: 'realm', objectiveTarget: '金丹', objectiveCount: 1,
    reward: { spiritStones: 2000, materials: { '妖丹': 10, '灵芝': 8, '灵泉水': 5 }, description: '获得💎2000 + 稀有材料' },
    completed: false, unlocked: false,
  },
  {
    id: 'mq_5_2', chapter: 5, title: '洞天之主',
    narrative: '金丹弟子的诞生震动了方圆千里。青云洞天不再是一个默默无闻的小势力，而是足以与天元宗比肩的一方豪强。\n\n天元宗掌门亲自来访，与你促膝长谈。他告诉你一个秘密——青云洞天的地下，封印着一处上古秘境，其中蕴含着足以让修士突破元婴的机缘。\n\n「但秘境的封印需要金丹期修士才能解开。」掌门意味深长地看着你，「现在，你有资格知道了。」',
    objective: '完成10次秘境探索',
    objectiveType: 'explore', objectiveTarget: '秘境', objectiveCount: 10,
    reward: { spiritStones: 3000, materials: { '灵石矿': 10, '妖丹': 15 }, description: '获得💎3000 + 顶级材料' },
    completed: false, unlocked: false,
  },
  {
    id: 'mq_5_3', chapter: 5, title: '新的征程',
    narrative: '秘境探索的成果远超预期。弟子们带回了珍贵的灵药、失传的功法，以及一块刻着「青云仙府」四个大字的玉碑。\n\n你将玉碑立在洞府正中，望着上面苍劲有力的大字，心中涌起一股难以言喻的情感。从最初的三名弟子、一座破败的修炼室，到如今的金丹弟子、上古秘境——你终于明白，这不仅仅是一座洞府的复兴，更是一段传奇的开始。\n\n「青云仙府……不，从今天起，它叫青云洞天。而我们的故事，才刚刚翻开第一页。」\n\n—— 第一卷 · 完 ——',
    objective: '弟子总修为达到5000',
    objectiveType: 'cultivate', objectiveTarget: 'totalCultivation', objectiveCount: 5000,
    reward: { spiritStones: 5000, materials: { '灵草': 50, '矿石': 50, '精铁': 20, '妖丹': 10, '灵芝': 10, '灵泉水': 10, '灵石矿': 5 }, description: '获得💎5000 + 大量稀有材料（第一卷通关奖励）' },
    completed: false, unlocked: false,
  },
]
