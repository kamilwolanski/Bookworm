"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

const LoginDialog = ({
  dialogTriggerBtn,
  isOpen,
  onOpenChange,
}: {
  dialogTriggerBtn?: ReactNode;
  onOpenChange?: (o: boolean) => void;
  isOpen?: boolean;
}) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Content = (
    <DialogContent
      className="sm:max-w-156.25 p-6 rounded-2xl
      border border-border
      shadow-2xl
      bg-background/95 backdrop-blur"
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

  return (
    <Dialog
      open={isOpen ?? open}
      onOpenChange={onOpenChange ? onOpenChange : setOpen}
    >
      <DialogTrigger asChild>{dialogTriggerBtn}</DialogTrigger>
      {Content}
    </Dialog>
  );
};

export default LoginDialog;
