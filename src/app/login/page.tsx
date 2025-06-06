'use client';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold">Zaloguj się</h1>
      <GoogleLoginButton />
    </div>
  );
}
