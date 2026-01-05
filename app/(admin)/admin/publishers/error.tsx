// app/(main)/books/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Ups! Coś poszło nie tak.</h2>
      <p className="text-sm opacity-70">{error.message}</p>
      <button className="btn mt-4" onClick={() => reset()}>
        Spróbuj ponownie
      </button>
    </div>
  );
}
