import { UserEditionData } from '@/lib/user';
import { ActionResult } from '@/types/actions';
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';
import { mutate as swrMutate } from 'swr';

function allDefined<T>(obj: Partial<T>): obj is T {
  return Object.values(obj).every((v) => v !== undefined);
}

export function useDeleteDialog<T>(
  action: (_state: ActionResult, payload: T) => Promise<ActionResult<void>>,
  parameters: Partial<T>,
  swrKey?: string
): [
  isPending: boolean,
  handleDelete: () => void,
  openDeleteDialog: boolean,
  setOpenDeleteDialog: Dispatch<SetStateAction<boolean>>,
] {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [state, doAction, isPending] = useActionState<ActionResult, T>(action, {
    isError: false,
  });

  function handleDelete() {
    const params = parameters;
    if (!allDefined(params)) {
      console.error('Missing parameters', params);
      return;
    }

    startTransition(() => {
      doAction(params);
    });
  }

  useEffect(() => {
    if (!swrKey) return;
    if (!isPending && state && state.status === 'success') {
      setOpenDeleteDialog(false);
      swrMutate<UserEditionData | null>(swrKey);
    }
  }, [state.status, state, isPending, swrKey]);

  return [isPending, handleDelete, openDeleteDialog, setOpenDeleteDialog];
}
