import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
