'use client';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

export default function LoginPage() {
  return (
    <div className="mt-20">
      <div className="container mx-auto flex justify-center">
        <div className="flex justify-center flex-col text-center max-w-sm flex-1">
          <h1 className="text-2xl font-bold mb-10">Log in</h1>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
