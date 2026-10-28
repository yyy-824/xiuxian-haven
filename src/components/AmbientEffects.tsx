/** Decorative scenery lives behind the game UI and never captures input. */
export function AmbientEffects() {
  return (
    <div className="ambient-effects" aria-hidden="true">
      <style>{`
        .ambient-effects {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .ambient-effects__landscape {
          position: absolute;
          inset: auto 0 0;
          width: 100%;
          height: min(72%, 700px);
          object-fit: cover;
          object-position: center bottom;
          opacity: .64;
        }
        .ambient-effects__mist {
          position: absolute;
          left: -20%;
          right: -20%;
          bottom: 10%;
          height: 25%;
          background: radial-gradient(ellipse, rgba(155, 183, 168, .09), transparent 68%);
          animation: ambient-mist 22s ease-in-out infinite alternate;
        }
        .ambient-effects__mote {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #e8d5a8;
          box-shadow: 0 0 10px 2px rgba(201, 169, 110, .45);
          opacity: .25;
          animation: ambient-mote 7s ease-in-out infinite alternate;
        }
        .ambient-effects__mote:nth-of-type(1) { left: 17%; top: 58%; animation-delay: -2s; }
        .ambient-effects__mote:nth-of-type(2) { left: 72%; top: 43%; animation-delay: -5s; }
        .ambient-effects__mote:nth-of-type(3) { left: 86%; top: 72%; animation-delay: -3s; }
        @keyframes ambient-mist { from { transform: translateX(-3%); } to { transform: translateX(3%); } }
        @keyframes ambient-mote { from { transform: translateY(6px); opacity: .12; } to { transform: translateY(-8px); opacity: .5; } }
        @media (prefers-reduced-motion: reduce) {
          .ambient-effects__mist, .ambient-effects__mote { animation: none; }
        }
      `}</style>
      <img className="ambient-effects__landscape" src={`${import.meta.env.BASE_URL}art/ink-mountains.svg`} alt="" />
      <div className="ambient-effects__mist" />
      <span className="ambient-effects__mote" />
      <span className="ambient-effects__mote" />
      <span className="ambient-effects__mote" />
    </div>
  )
}
