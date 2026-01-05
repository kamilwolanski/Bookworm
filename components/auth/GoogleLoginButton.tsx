'use client';

import { signIn } from 'next-auth/react';
import googleLogo from '@/app/assets/google_logo.svg.png';
import Image from 'next/image';
import { Button } from '../ui/button';

export default function GoogleLoginButton({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => signIn('google', { callbackUrl: callbackUrl ?? '/books' })}
      className="border h-12 rounded-2xl px-6 py-2 w-full flex items-center cursor-pointer gap-3 text-sm font-medium shadow-sm transition"
    >
      <Image src={googleLogo} width={16} height={16} alt="google" />
      Kontynuuj z Google
    </Button>
  );
}
