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

  const materialEntries = Object.entries(resources.materials).filter(([_, v]) => v > 0)

  return (
    <div className="bg-ink/90 border-b border-gold/30 px-4 py-2 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        {/* 洞府名称 */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-gold font-display text-lg animate-glow">✦</span>
          <span className="font-display text-gold-light text-sm">{haven.name}</span>
          <span className="text-paper/40 text-xs">Lv.{haven.level}</span>
        </div>

        {/* 资源 */}
        <div className="flex items-center gap-3 text-sm flex-wrap justify-center">
          <div className="flex items-center gap-1" title="灵石">
            <span className="text-gold">💎</span>
            <span className="text-gold-light font-mono text-xs">{Math.floor(resources.spiritStones)}</span>
          </div>
          <div className="flex items-center gap-1" title="灵气">
            <span className="text-spirit">🌀</span>
            <span className="text-spirit-light font-mono text-xs">{Math.floor(resources.spiritualEnergy)}</span>
          </div>
          {materialEntries.length > 0 && (
            <div className="flex items-center gap-1.5" title="材料">
              {materialEntries.slice(0, 3).map(([name, count]) => (
                <span key={name} className="text-xs text-qi/80">
                  {name}×{Math.floor(count)}
                </span>
              ))}
              {materialEntries.length > 3 && (
                <span className="text-xs text-paper/30">+{materialEntries.length - 3}</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1" title="弟子">
            <span className="text-jade">👥</span>
            <span className="text-jade-light font-mono text-xs">{disciples.length}</span>
          </div>
          <div className="text-xs text-paper/30" title="游戏时间">
            ⏱ {formatGameTime(gameTime)}
          </div>
        </div>

        {/* 控制 */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 text-xs bg-ink/60 rounded-full p-0.5">
            {[1, 2, 5].map(speed => (
              <button
                key={speed}
                onClick={() => setGameSpeed(speed)}
                className={`px-2 py-0.5 rounded-full transition-all text-[11px] ${
                  settings.gameSpeed === speed
                    ? 'bg-gold text-ink font-medium shadow-sm'
                    : 'text-paper/40 hover:text-paper hover:bg-paper/10'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
          <button
            onClick={onSettings}
            className="text-xs text-paper/40 hover:text-gold px-2 py-0.5 rounded-full hover:bg-gold/10 transition-all"
            title="设置"
          >
            ⚙
          </button>
          <button
            onClick={saveGame}
            className="text-xs text-paper/40 hover:text-gold px-2 py-0.5 rounded-full hover:bg-gold/10 transition-all"
            title="保存游戏"
          >
            💾
          </button>
        </div>
      </div>
    </div>
  )
}
