import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#08090b] px-6 text-center">
      <div>
        <p className="font-mono text-[11px] tracking-[0.24em] text-[#ffb020]">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          That route does not exist in the Solaris workspace.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-md bg-[#ffb020] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}