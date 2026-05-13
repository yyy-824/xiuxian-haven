import { useGameStore } from '../store/gameStore'

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const settings = useGameStore(s => s.settings)
  const toggleSound = useGameStore(s => s.toggleSound)
  const toggleBgm = useGameStore(s => s.toggleBgm)
  const setSoundVolume = useGameStore(s => s.setSoundVolume)
  const setBgmVolume = useGameStore(s => s.setBgmVolume)
  const resetGame = useGameStore(s => s.resetGame)

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-ink border border-gold/30 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-gold text-lg mb-4">⚙ 设置</h3>

        {/* 音效 */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-paper/80">🔊 音效</span>
              <button
                onClick={toggleSound}
                className={`w-10 h-5 rounded-full transition-all ${settings.soundEnabled ? 'bg-gold' : 'bg-paper/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {settings.soundEnabled && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-paper/40">🔈</span>
                <input
                  type="range"
                  min="0" max="100"
                  value={Math.round(settings.soundVolume * 100)}
                  onChange={e => setSoundVolume(Number(e.target.value) / 100)}
                  className="flex-1 h-1 bg-paper/20 rounded-full appearance-none cursor-pointer accent-gold"
                />
                <span className="text-xs text-paper/40 w-8 text-right">{Math.round(settings.soundVolume * 100)}%</span>
              </div>
            )}
          </div>

          {/* BGM */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-paper/80">🎵 背景音乐</span>
              <button
                onClick={toggleBgm}
                className={`w-10 h-5 rounded-full transition-all ${settings.bgmEnabled ? 'bg-gold' : 'bg-paper/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.bgmEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {settings.bgmEnabled && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-paper/40">🔈</span>
                <input
                  type="range"
                  min="0" max="100"
                  value={Math.round(settings.bgmVolume * 100)}
                  onChange={e => setBgmVolume(Number(e.target.value) / 100)}
                  className="flex-1 h-1 bg-paper/20 rounded-full appearance-none cursor-pointer accent-gold"
                />
                <span className="text-xs text-paper/40 w-8 text-right">{Math.round(settings.bgmVolume * 100)}%</span>
              </div>
            )}
          </div>

          <div className="border-t border-gold/10 pt-4">
            <button
              onClick={() => {
                if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
                  resetGame()
                  onClose()
                }
              }}
              className="w-full py-2 rounded-lg text-sm text-cinnabar border border-cinnabar/30 hover:bg-cinnabar/10 transition-colors"
            >
              重置游戏
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-lg text-sm text-paper/60 bg-paper/5 hover:bg-paper/10 transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  )
}
