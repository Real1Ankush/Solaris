import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ButtonLink } from "../design-system";

const LINKS = [
  { href: "#how-it-works", index: "02", label: "Pipeline" },
  { href: "#edge", index: "03", label: "Edge" },
  { href: "#defects", index: "04", label: "Defects" },
  { href: "#realtime", index: "05", label: "Live" },
  { href: "#operations", index: "06", label: "Operations" },
] as const;

/*
 * Floating instrument strip rather than a SaaS navbar: registration mark,
 * numbered section index with a contextual active rule, a mode state, then
 * the two commands. It starts transparent over the bay and gains a hairline
 * only once the page scrolls.
 */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector(link.href)).filter(
      (el): el is Element => Boolean(el),
    );
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, []);

  return (
    <header
      data-nav-shell
      className={`site-nav${scrolled ? " is-scrolled" : ""}`}
    >
      <div className="site-nav-shell">
        <Link to="/" className="site-nav-brand" aria-label="Solaris home">
          <span className="site-nav-mark" aria-hidden="true" />
          <span className="site-nav-word">SOLARIS</span>
        </Link>

        <nav aria-label="Sections" className="site-nav-links">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`site-nav-link${active === link.href ? " is-active" : ""}`}
              aria-current={active === link.href ? "true" : undefined}
            >
              <span className="site-nav-link-index">{link.index}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        <p className="site-nav-state">
          <span className="site-nav-state-dot" aria-hidden="true" />
          Demo mode
        </p>

        <div className="site-nav-actions">
          <ButtonLink to="/dashboard" variant="secondary" size="sm">
            Dashboard
          </ButtonLink>
          <ButtonLink to="/live-inspection" variant="primary" size="sm">
            Launch inspection
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
