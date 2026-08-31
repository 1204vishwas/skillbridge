import { IconLogo } from './icons';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <IconLogo className="h-6 w-6 text-brand-600" />
          <span className="font-bold">
            Skill<span className="text-brand-600">Bridge</span>
          </span>
        </div>
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} SkillBridge — Full-Stack Career Portal. Built with React,
          Node.js &amp; MongoDB.
        </p>
      </div>
    </footer>
  );
}
