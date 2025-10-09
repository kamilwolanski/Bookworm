'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

const LoginDialog = ({
  onlyContent = false,
  dialogTriggerBtn,
}: {
  onlyContent?: boolean;
  dialogTriggerBtn?: ReactNode;
}) => {
  const pathname = usePathname();

  const Content = (
    <DialogContent
      className="sm:max-w-[625px] p-6 rounded-2xl
      border border-border
      shadow-2xl
      bg-background/95 backdrop-blur"
      data-no-nav="true"
    >
      <DialogHeader>
        <DialogTitle className="text-lg sm:text-xl font-semibold tracking-tight text-dialog-foreground px-8">
          Zaloguj się, aby kontynuować
        </DialogTitle>
      </DialogHeader>
      <div className="flex justify-center p-5">
        <div className="w-full">
          <GoogleLoginButton callbackUrl={pathname} />
        </div>
      </div>
    </DialogContent>
  );

  if (onlyContent) {
    return Content;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTriggerBtn}</DialogTrigger>
      {Content}
    </Dialog>
  );
};

export default LoginDialog;
