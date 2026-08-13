import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <h1 className="text-9xl font-bold text-white/5 tracking-tighter">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-3xl font-bold">Page Not Found</h2>
        </div>
      </div>
      <p className="text-gray-400 mt-4 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button href="/" variant="primary">
        Return to Home
      </Button>
    </div>
  );
}
