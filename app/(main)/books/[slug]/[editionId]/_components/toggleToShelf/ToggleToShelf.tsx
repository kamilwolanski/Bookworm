import { UserBookStatus } from "@/lib/user";
import { Button } from "@/components/ui/button";
import LoginDialog from "@/components/auth/LoginDialog";
import { Plus } from "lucide-react";
import ToggleToShelfClient from "./ToggleToShelfClient";

export default async function ToggleToShelf({
  userId,
  bookId,
  bookSlug,
  editionId,
  userBookStatusFromServer,
}: {
  userBookStatusFromServer: UserBookStatus | null;
  userId: string | undefined;
  bookId: string;
  bookSlug: string;
  editionId: string;
}) {
  if (!userId) {
    return (
      <LoginDialog
        dialogTriggerBtn={
          <Button className="cursor-pointer bg-badge-new text-secondary-foreground hover:bg-badge-new-hover">
            <Plus className="w-4 h-4 mr-1" />
            Dodaj na półkę
          </Button>
        }
      />
    );
  }

  return (
    <ToggleToShelfClient
      userBookStatusFromServer={userBookStatusFromServer}
      editionId={editionId}
      bookSlug={bookSlug}
      bookId={bookId}
    />
  );
}
