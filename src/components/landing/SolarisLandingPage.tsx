import "../../styles/solaris-frame.css";

const FRAME_SANDBOX = "allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation";

/** The Solaris adaptation of the authored ThreeUI chapter experience. */
export function SolarisLandingPage() {
  return (
    <div className="solaris-page-frame" data-source="Solaris field narrative">
      <iframe
        title="Solaris — Solar field inspection"
        src="/landing-pages/solaris.html"
        sandbox={FRAME_SANDBOX}
        loading="eager"
      />
    </div>
  );
}
