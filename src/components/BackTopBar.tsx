'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BackTopBar = () => {
  const router = useRouter();

  return (
    <div>
      <button
        className="flex align-middle cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft />
        <span className="ms-2">Powrót</span>
      </button>
    </div>
  );
};

export default BackTopBar;
