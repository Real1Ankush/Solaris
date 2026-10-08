import { ButtonLink } from "../design-system";
import { MEASURED_BENCHMARKS } from "../../services/mockData";

const READOUTS = [
  { term: "Model runtime", value: "YOLOv5n", hint: "edge build" },
  { term: "Model-only throughput", value: `${MEASURED_BENCHMARKS.modelOnlyFps} FPS`, hint: "RPi 4" },
  { term: "Model latency", value: `${MEASURED_BENCHMARKS.modelOnlyLatencyMs} ms`, hint: "model-only" },
  { term: "Live pipeline", value: `${MEASURED_BENCHMARKS.livePipelineFps} FPS`, hint: "measured" },
] as const;

/*
 * Engineering readout instead of three KPI cards. The rail is part of the
 * machine's instrument panel: hairline dividers, tabular figures, one command
 * block at the end. Every figure is deployment throughput/latency — never
 * described as accuracy.
 */
export function HeroRail() {
  return (
    <div className="hero-rail" data-hero-rail>
      <div className="hero-rail-head" data-hero-cmd>
        <span className="hero-rail-kicker">Deployment readout</span>
        <span className="hero-rail-sub">Measured · Raspberry Pi 4</span>
      </div>

      <dl className="hero-rail-list">
        {READOUTS.map((item) => (
          <div className="hero-rail-item" key={item.term}>
            <dt>{item.term}</dt>
            <dd>{item.value}</dd>
            <span className="hero-rail-hint">{item.hint}</span>
          </div>
        ))}
      </dl>

      <p className="hero-rail-note" data-hero-cmd>
        Deployment figures · not model accuracy
      </p>

      <div className="hero-rail-actions" data-hero-cmd>
        <ButtonLink to="/live-inspection" variant="primary" size="md">
          Launch inspection
        </ButtonLink>
        <ButtonLink to="/dashboard" variant="secondary" size="md">
          Explore platform
        </ButtonLink>
      </div>
    </div>
  );
}
