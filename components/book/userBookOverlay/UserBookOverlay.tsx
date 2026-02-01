import { BookCardDTO } from "@/lib/books/listings";
import { getTheUserInformationForEdition } from "@/lib/user";
import LoginDialog from "../../auth/LoginDialog";
import { Plus } from "lucide-react";
import { getUserSession } from "@/lib/session";
import BookContextMenu from "../bookContextMenu/BookContextMenu";
import UserBookOverlayClient from "../userBookOverlayClient/UserBookOverlayClient";

export async function UserBookOverlay({
  editionId,
  book,
  representativeEditionId,
  representativeEditionTitle,
}: {
  editionId: string;
  book: BookCardDTO["book"];
  representativeEditionId: string;
  representativeEditionTitle: string;
}) {
  const session = await getUserSession();
  const userId = session?.user?.id || null;
  if (!userId) {
    return (
      <>
        <LoginDialog
          dialogTriggerBtn={
            <button
              type="button"
              className="bg-badge-new text-secondary-foreground hover:bg-badge-new-hover px-3 py-1 rounded-2xl cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium">Dodaj</span>
                <Plus size={14} />
              </div>
            </button>
          }
        />
        <BookContextMenu
          logIn={false}
          book={book}
          onShelf={false}
          representativeEditionTitle={representativeEditionTitle}
          userEditions={[]}
        />
      </>
    );
  }

  const editionUserResponse = await getTheUserInformationForEdition(
    userId,
    editionId
  );

  return (
    <UserBookOverlayClient
      editionUserResponseFromServer={editionUserResponse}
      representativeEditionId={representativeEditionId}
      representativeEditionTitle={representativeEditionTitle}
      book={book}
    />
  );
}
