import { CheckCircle2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-theme bg-surface-soft/40 py-6 text-xs text-muted">
      <div className="section-shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-theme">
            MovieVerse Admin System
          </span>
          <span className="text-muted/60">•</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Operational
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-muted font-medium">
          <span>
            &copy; {new Date().getFullYear()} MovieVerse Platform. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
