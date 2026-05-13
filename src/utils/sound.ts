// Web Audio API 音效管理器 - 无需外部音频文件
// 所有音效通过振荡器和噪声合成生成

class SoundManager {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private bgmGain: GainNode | null = null
  private bgmSource: AudioBufferSourceNode | null = null
  private bgmBuffer: AudioBuffer | null = null
  private _enabled = true
  private _bgmEnabled = true
  private _volume = 0.5
  private _bgmVolume = 0.3
  private initialized = false

  get enabled() { return this._enabled }
  get bgmEnabled() { return this._bgmEnabled }
  get volume() { return this._volume }
  get bgmVolume() { return this._bgmVolume }

  private init() {
    if (this.initialized) return
    this.ctx = new AudioContext()
    this.masterGain = this.ctx.createGain()
    this.masterGain.connect(this.ctx.destination)

    this.sfxGain = this.ctx.createGain()
    this.sfxGain.gain.value = this._volume
    this.sfxGain.connect(this.masterGain)

    this.bgmGain = this.ctx.createGain()
    this.bgmGain.gain.value = this._bgmVolume
    this.bgmGain.connect(this.masterGain)

    this.initialized = true
  }

  private ensureContext() {
    this.init()
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setEnabled(v: boolean) { this._enabled = v }
  setBgmEnabled(v: boolean) {
    this._bgmEnabled = v
    if (!v && this.bgmSource) {
      this.bgmGain?.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.5)
      setTimeout(() => { this.stopBgm() }, 600)
    } else if (v && this.bgmBuffer) {
      this.playBgm()
    }
  }
  setVolume(v: number) {
    this._volume = v
    if (this.sfxGain) this.sfxGain.gain.value = v
  }
  setBgmVolume(v: number) {
    this._bgmVolume = v
    if (this.bgmGain) this.bgmGain.gain.value = v
  }

  // ===== 音效合成 =====

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', attack = 0.01, _decay = 0.1) {
    if (!this._enabled || !this.ctx || !this.sfxGain) return
    this.ensureContext()

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    osc.connect(gain)
    gain.connect(this.sfxGain)

    const now = this.ctx.currentTime
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.3, now + attack)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    osc.start(now)
    osc.stop(now + duration)
  }

  private playNoise(duration: number, filterFreq = 1000) {
    if (!this._enabled || !this.ctx || !this.sfxGain) return
    this.ensureContext()

    const bufferSize = this.ctx.sampleRate * duration
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15
    }

    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = filterFreq
    const gain = this.ctx.createGain()

    source.connect(filter)
    filter.connect(gain)
    gain.connect(this.sfxGain)

    const now = this.ctx.currentTime
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    source.start(now)
    source.stop(now + duration)
  }

  // ===== 公开音效 =====

  /** 按钮点击 */
  click() {
    this.playTone(800, 0.08, 'sine', 0.005, 0.05)
  }

  /** 成功/确认 */
  success() {
    this.playTone(523, 0.12, 'sine', 0.01, 0.08)
    setTimeout(() => this.playTone(659, 0.12, 'sine', 0.01, 0.08), 80)
    setTimeout(() => this.playTone(784, 0.18, 'sine', 0.01, 0.12), 160)
  }

  /** 失败/错误 */
  fail() {
    this.playTone(300, 0.2, 'sawtooth', 0.01, 0.15)
    setTimeout(() => this.playTone(250, 0.3, 'sawtooth', 0.01, 0.2), 150)
  }

  /** 警告 */
  warning() {
    this.playTone(440, 0.15, 'triangle', 0.01, 0.1)
    setTimeout(() => this.playTone(440, 0.15, 'triangle', 0.01, 0.1), 200)
  }

  /** 通知/消息 */
  notify() {
    this.playTone(660, 0.1, 'sine', 0.01, 0.08)
    setTimeout(() => this.playTone(880, 0.12, 'sine', 0.01, 0.08), 70)
  }

  /** 招募弟子 */
  recruit() {
    this.playTone(440, 0.1, 'sine', 0.01, 0.08)
    setTimeout(() => this.playTone(554, 0.1, 'sine', 0.01, 0.08), 80)
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.01, 0.1), 160)
  }

  /** 建造 */
  build() {
    this.playNoise(0.1, 800)
    setTimeout(() => this.playTone(330, 0.15, 'square', 0.01, 0.1), 100)
    setTimeout(() => this.playTone(440, 0.2, 'square', 0.01, 0.12), 200)
  }

  /** 升级 */
  upgrade() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.playTone(400 + i * 100, 0.1, 'sine', 0.01, 0.08), i * 60)
    }
    setTimeout(() => this.playTone(800, 0.25, 'sine', 0.01, 0.15), 240)
  }

  /** 炼丹成功 */
  craftSuccess() {
    this.playTone(440, 0.1, 'sine', 0.01, 0.08)
    setTimeout(() => this.playTone(554, 0.1, 'sine', 0.01, 0.08), 100)
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.01, 0.08), 200)
    setTimeout(() => this.playTone(880, 0.3, 'sine', 0.01, 0.2), 300)
  }

  /** 炼丹失败 */
  craftFail() {
    this.playNoise(0.2, 500)
    setTimeout(() => this.playTone(200, 0.3, 'sawtooth', 0.01, 0.2), 150)
  }

  /** 战斗 */
  combat() {
    this.playNoise(0.08, 2000)
    setTimeout(() => this.playTone(150, 0.1, 'sawtooth', 0.005, 0.08), 50)
    setTimeout(() => this.playNoise(0.08, 1500), 120)
  }

  /** 探索出发 */
  explore() {
    this.playTone(330, 0.15, 'triangle', 0.01, 0.1)
    setTimeout(() => this.playTone(440, 0.15, 'triangle', 0.01, 0.1), 120)
    setTimeout(() => this.playTone(550, 0.2, 'triangle', 0.01, 0.12), 240)
  }

  /** 突破成功 */
  breakthrough() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => this.playTone(300 + i * 100, 0.12, 'sine', 0.01, 0.08), i * 80)
    }
    setTimeout(() => this.playTone(1000, 0.5, 'sine', 0.02, 0.3), 480)
  }

  /** 成就解锁 */
  achievement() {
    this.playTone(523, 0.15, 'sine', 0.01, 0.1)
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.01, 0.1), 100)
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.01, 0.1), 200)
    setTimeout(() => this.playTone(1047, 0.4, 'sine', 0.01, 0.25), 300)
  }

  /** 访客到来 */
  visitor() {
    this.playTone(600, 0.1, 'triangle', 0.01, 0.08)
    setTimeout(() => this.playTone(500, 0.1, 'triangle', 0.01, 0.08), 120)
    setTimeout(() => this.playTone(600, 0.15, 'triangle', 0.01, 0.1), 240)
  }

  /** 使用丹药 */
  pill() {
    this.playTone(500, 0.08, 'sine', 0.01, 0.06)
    setTimeout(() => this.playTone(700, 0.12, 'sine', 0.01, 0.08), 60)
  }

  /** 装备法器 */
  equip() {
    this.playNoise(0.05, 3000)
    setTimeout(() => this.playTone(600, 0.12, 'sine', 0.01, 0.08), 50)
  }

  // ===== BGM =====

  async loadBgm(url: string) {
    this.init()
    if (!this.ctx) return
    try {
      const resp = await fetch(url)
      const arrayBuffer = await resp.arrayBuffer()
      this.bgmBuffer = await this.ctx.decodeAudioData(arrayBuffer)
      if (this._bgmEnabled) this.playBgm()
    } catch (e) {
      console.warn('BGM load failed:', e)
    }
  }

  playBgm() {
    if (!this.ctx || !this.bgmBuffer || !this.bgmGain || !this._bgmEnabled) return
    this.ensureContext()
    this.stopBgm()

    this.bgmSource = this.ctx.createBufferSource()
    this.bgmSource.buffer = this.bgmBuffer
    this.bgmSource.loop = true
    this.bgmSource.connect(this.bgmGain)
    this.bgmGain.gain.value = this._bgmVolume
    this.bgmSource.start()
  }

  stopBgm() {
    if (this.bgmSource) {
      try { this.bgmSource.stop() } catch {}
      this.bgmSource = null
    }
  }

  /** 生成简易 BGM（无外部文件时的后备方案） */
  playGeneratedBgm() {
    if (!this.ctx || !this.bgmGain || !this._bgmEnabled) return
    this.ensureContext()

    // 生成一段简单的循环旋律
    const duration = 16 // 16秒循环
    const sampleRate = this.ctx.sampleRate
    const bufferSize = sampleRate * duration
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate)
    const data = buffer.getChannelData(0)

    // 五声音阶：宫商角徵羽
    const scale = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3]
    const melody = [0, 2, 4, 5, 4, 2, 0, 3, 5, 7, 5, 3, 0, 4, 2, 0]
    const noteLength = sampleRate // 每个音符1秒

    for (let i = 0; i < bufferSize; i++) {
      const noteIdx = Math.floor(i / noteLength) % melody.length
      const freq = scale[melody[noteIdx]]
      const t = i / sampleRate
      const envelope = Math.exp(-((i % noteLength) / sampleRate) * 2) * 0.08
      // 主旋律 + 泛音
      data[i] = envelope * (
        Math.sin(2 * Math.PI * freq * t) * 0.6 +
        Math.sin(2 * Math.PI * freq * 2 * t) * 0.2 +
        Math.sin(2 * Math.PI * freq * 3 * t) * 0.1
      )
    }

    this.bgmBuffer = buffer
    this.playBgm()
  }
}

export const soundManager = new SoundManager()
