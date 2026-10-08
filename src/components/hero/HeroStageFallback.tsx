/*
 * Shown while the 3D chunk loads, and permanently when WebGL is unavailable.
 *
 * A full-bleed technical elevation rather than a spinner or a small card: the
 * fallback must hold the same composition as the live bay, because it may be
 * the only version some visitors ever see.
 */
export function HeroStageFallback({
  label = "INITIALISING OPTICAL SURFACE",
}: {
  label?: string;
}) {
  return (
    <div className="hero-schematic">
      <svg
        viewBox="0 0 960 560"
        preserveAspectRatio="xMidYMax meet"
        role="img"
        aria-label="Solaris inspection rover, side elevation within an inspection bay"
      >
        <defs>
          <linearGradient id="hx-pane" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#43d9ff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#43d9ff" stopOpacity="0.03" />
          </linearGradient>
          <pattern id="hx-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="#16242e" strokeWidth="1" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="960" height="560" fill="url(#hx-grid)" opacity="0.7" />
        <line x1="0" y1="470" x2="960" y2="470" stroke="#f5b942" strokeOpacity="0.45" />
        <line x1="0" y1="300" x2="960" y2="300" stroke="#43d9ff" strokeOpacity="0.14" />

        {/* panel rows behind the machine */}
        {[70, 260, 690, 830].map((x, i) => (
          <g key={x} transform={`translate(${x} ${i < 2 ? 360 : 380})`} opacity="0.75">
            <rect width="150" height="10" fill="#0a1723" stroke="#2f4a5a" />
            <path d="M0 10 L20 74 M150 10 L130 74" stroke="#1a2129" strokeWidth="5" />
            <line x1="38" y1="2" x2="38" y2="9" stroke="#43d9ff" strokeOpacity="0.35" />
            <line x1="76" y1="2" x2="76" y2="9" stroke="#43d9ff" strokeOpacity="0.35" />
            <line x1="114" y1="2" x2="114" y2="9" stroke="#43d9ff" strokeOpacity="0.35" />
          </g>
        ))}

        {/* rover */}
        <g transform="translate(330 130) scale(1.35)">
          <rect x="20" y="196" width="288" height="46" fill="#0d1218" stroke="#8fb4c4" strokeWidth="1.2" />
          <rect x="32" y="186" width="264" height="12" fill="none" stroke="#303a45" strokeWidth="3" />
          <rect x="20" y="242" width="288" height="12" fill="none" stroke="#f5b942" strokeOpacity="0.55" />
          <rect x="186" y="164" width="150" height="24" fill="#0a1622" stroke="#43d9ff" strokeOpacity="0.55" />
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={186 + (i + 1) * 25}
              y1="164"
              x2={186 + (i + 1) * 25}
              y2="188"
              stroke="#43d9ff"
              strokeOpacity="0.28"
            />
          ))}

          <line x1="104" y1="186" x2="104" y2="74" stroke="#1e2630" strokeWidth="7" />
          <line x1="76" y1="180" x2="76" y2="78" stroke="#1a222b" strokeWidth="4" />
          <line x1="132" y1="180" x2="132" y2="78" stroke="#1a222b" strokeWidth="4" />
          <line x1="76" y1="78" x2="132" y2="78" stroke="#1a222b" strokeWidth="4" />
          <circle cx="104" cy="70" r="7" fill="#f5b942" />
          <rect x="74" y="38" width="60" height="34" fill="url(#hx-pane)" stroke="#8fb4c4" strokeWidth="1.4" />
          <circle cx="148" cy="55" r="13" fill="none" stroke="#43d9ff" strokeWidth="2" />
          <circle cx="148" cy="55" r="5" fill="#43d9ff" />
          <line x1="160" y1="55" x2="330" y2="55" stroke="#f5b942" strokeOpacity="0.4" strokeDasharray="5 5" />

          {[56, 272].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="256" r="42" fill="#0b0f14" stroke="#8fb4c4" strokeWidth="1.6" />
              <circle cx={cx} cy="256" r="15" fill="none" stroke="#f5b942" strokeOpacity="0.8" strokeWidth="1.6" />
              {[0, 45, 90, 135].map((a) => (
                <line
                  key={a}
                  x1={cx - 35}
                  y1="256"
                  x2={cx + 35}
                  y2="256"
                  stroke="#8fb4c4"
                  strokeOpacity="0.35"
                  transform={`rotate(${a} ${cx} 256)`}
                />
              ))}
            </g>
          ))}
        </g>

        <text x="32" y="46" fill="#9aa8b7" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
          PTZ INSPECTION HEAD · ±12° YAW / ±6° PITCH
        </text>
        <text x="32" y="66" fill="#6b7a8a" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
          SOLARIS · ROVER ELEVATION · VISUAL REPRESENTATION
        </text>
      </svg>

      <div className="hero-schematic-label">
        <span className="ds-scan-rail" />
        <span className="ds-label">{label}</span>
      </div>
    </div>
  );
}
