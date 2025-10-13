import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ActionResult } from '@/types/actions';
import { ReviewVoteType } from '@prisma/client';
import { VoteState } from '../reviews';

type VoteAction =
  | { type: 'apply'; next: ReviewVoteType | null }
  | { type: 'replace'; state: VoteState };

export function useOptimisticVoteReview(initial: VoteState) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [state, dispatch] = useOptimistic<VoteState, VoteAction>(
    initial,
    (currentState, action) => {
      if (action.type === 'replace') return action.state;

      // apply optimistic change with toggle/change logic
      const next = action.next; // 'LIKE' | 'DISLIKE' | null
      let { myVote, likes, dislikes } = currentState;

      // Clicking the same vote => toggle off (clear)
      if (next !== null && myVote === next) {
        if (next === 'LIKE') likes = Math.max(0, likes - 1);
        else dislikes = Math.max(0, dislikes - 1);
        myVote = null;
        return { myVote, likes, dislikes };
      }

      // Explicit clear (next === null)
      if (next === null) {
        if (myVote === 'LIKE') likes = Math.max(0, likes - 1);
        if (myVote === 'DISLIKE') dislikes = Math.max(0, dislikes - 1);
        myVote = null;
        return { myVote, likes, dislikes };
      }

      // Switching vote or adding first time
      if (next === 'LIKE') {
        if (myVote === 'DISLIKE') {
          dislikes = Math.max(0, dislikes - 1);
        }
        likes += 1;
        myVote = 'LIKE';
      } else {
        if (myVote === 'LIKE') {
          likes = Math.max(0, likes - 1);
        }
        dislikes += 1;
        myVote = 'DISLIKE';
      }

      return { myVote, likes, dislikes };
    }
  );

  function vote(
    next: ReviewVoteType,
    fn: () => Promise<
      ActionResult<{ removed: boolean; currentType?: ReviewVoteType }>
    >
  ) {
    const prev = state;
    // Optimistycznie zastosuj zmianę
    dispatch({ type: 'apply', next });

    startTransition(async () => {
      try {
        const res = await fn();

        if (res.isError) {
          // Revert na błąd
          dispatch({ type: 'replace', state: prev });
          return;
        }

        router.refresh();
      } catch {
        dispatch({ type: 'replace', state: prev });
      }
    });
  }

  function clear(fn: () => Promise<ActionResult<{ removed: boolean }>>) {
    const prev = state;
    dispatch({ type: 'apply', next: null });

    startTransition(async () => {
      try {
        const res = await fn();
        if (res.isError) {
          dispatch({ type: 'replace', state: prev });
          return;
        }
        router.refresh();
      } catch {
        dispatch({ type: 'replace', state: prev });
      }
    });
  }

  const netScore = state.likes - state.dislikes;

  return {
    myVoteOptimistic: state.myVote,
    likesOptimistic: state.likes,
    dislikesOptimistic: state.dislikes,
    netScoreOptimistic: netScore,
    isPending,
    vote,
    clear,
  };
}
