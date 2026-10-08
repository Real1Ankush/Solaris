/*
 * Spatial annotations around the machine — not four boxes in the corners.
 * Each readout hangs off a hairline leader that points back into the scene,
 * so the labels read as machine callouts attached to real parts.
 */
const MARKERS = [
  {
    key: "node",
    side: "left",
    top: "63%",
    term: "Edge node",
    value: "Raspberry Pi 4",
  },
  {
    key: "core",
    side: "left",
    top: "74%",
    term: "Vision core",
    value: "YOLOv5n",
  },
  {
    key: "head",
    side: "right",
    top: "31%",
    term: "PTZ inspection head",
    value: "±12° yaw / ±6° pitch",
  },
  {
    key: "optics",
    side: "right",
    top: "43%",
    term: "Optics",
    value: "Picamera2",
  },
] as const;

export function HeroHud({ tracking }: { tracking: boolean }) {
  return (
    <div className="hero-hud" aria-hidden="true">
      {MARKERS.map((marker) => (
        <dl
          key={marker.key}
          data-hero-hud-cell
          className={`hero-hud-cell hero-hud-cell--${marker.side} hero-hud-cell--${marker.key}`}
          style={{ top: marker.top }}
        >
          <dt>{marker.term}</dt>
          <dd>{marker.value}</dd>
        </dl>
      ))}

      <p className="hero-hud-state">
        <span className="hero-hud-state-dot" />
        {tracking ? "Head tracking · active" : "Head tracking · standby"} · Illustration
      </p>
    </div>
  );
}
