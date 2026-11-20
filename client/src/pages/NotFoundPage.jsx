import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">404</h1>
      <p className="text-xs text-neutral-500 mt-1 mb-5">
        The view you are looking for does not exist.
      </p>
      <Link to="/">
        <Button variant="secondary" size="sm" leftIcon={ArrowLeft}>
          Back to dashboard
        </Button>
      </Link>
    </div>
  );
}
