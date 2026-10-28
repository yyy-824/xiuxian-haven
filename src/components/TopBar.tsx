import { useGameStore } from '../store/gameStore'

function formatGameTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  if (hours > 0) return `${hours}时${minutes}分`
  if (minutes > 0) return `${minutes}分${seconds}秒`
  return `${seconds}秒`
}

export function TopBar({ onSettings }: { onSettings: () => void }) {
  const resources = useGameStore(s => s.resources)
  const haven = useGameStore(s => s.haven)
  const disciples = useGameStore(s => s.disciples)
  const settings = useGameStore(s => s.settings)
  const gameTime = useGameStore(s => s.gameTime)
  const setGameSpeed = useGameStore(s => s.setGameSpeed)
  const saveGame = useGameStore(s => s.saveGame)
  const materialEntries = Object.entries(resources.materials).filter(([, value]) => value > 0)

  return (
    <header className="relative z-10 border-b border-gold/20 bg-ink/95 px-6 py-3 shadow-lg shadow-black/10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <div className="flex shrink-0 items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-xl text-gold">✦</span>
          <div>
            <div className="font-display text-lg tracking-wider text-gold-light">{haven.name}</div>
            <div className="text-xs tracking-widest text-paper/55">洞府 · LV.{haven.level}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          <div title="灵石" className="flex items-center gap-2"><span aria-hidden="true">💎</span><span className="text-paper/60">灵石</span><span className="font-mono text-gold-light">{Math.floor(resources.spiritStones)}</span></div>
          <div title="灵气" className="flex items-center gap-2"><span aria-hidden="true">🌀</span><span className="text-paper/60">灵气</span><span className="font-mono text-spirit-light">{Math.floor(resources.spiritualEnergy)}</span></div>
          {materialEntries.length > 0 && <div className="flex items-center gap-2 border-l border-gold/20 pl-5 text-paper/70" title="材料">
            {materialEntries.slice(0, 3).map(([name, count]) => <span key={name}>{name} <span className="text-qi">{Math.floor(count)}</span></span>)}
            {materialEntries.length > 3 && <span>+{materialEntries.length - 3}</span>}
          </div>}
          <div title="弟子" className="text-paper/70">弟子 <span className="text-jade-light">{disciples.length}</span></div>
          <div title="游戏时间" className="text-xs text-paper/55">{formatGameTime(gameTime)}</div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div aria-label="游戏速度" className="flex items-center rounded-full border border-gold/15 bg-black/20 p-1">
            {[1, 2, 5].map(speed => <button key={speed} onClick={() => setGameSpeed(speed)} aria-pressed={settings.gameSpeed === speed} className={`rounded-full px-3 py-1 text-xs transition-colors ${settings.gameSpeed === speed ? 'bg-gold font-medium text-ink' : 'text-paper/60 hover:bg-paper/10 hover:text-paper'}`}>{speed}x</button>)}
          </div>
          <button onClick={onSettings} className="rounded-lg px-3 py-2 text-sm text-paper/70 transition-colors hover:bg-gold/10 hover:text-gold-light" title="设置" aria-label="设置">⚙</button>
          <button onClick={saveGame} className="rounded-lg border border-gold/25 px-3 py-2 text-xs text-gold-light transition-colors hover:bg-gold/10" title="保存游戏">保存</button>
        </div>
      </div>
    </header>
  )
}
