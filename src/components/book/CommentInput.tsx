'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

type Props = {
  onSubmit?: (text: string) => void;
  loading?: boolean;
};

export default function CommentInput({ onSubmit, loading }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit?.(text);
    setText('');
  };

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Dodaj komentarz..."
        className="resize-none min-h-[80px]"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />

      <div className="flex items-center justify-end">
        <Button
          disabled={loading || !text.trim()}
          onClick={handleSubmit}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full"
        >
          {loading ? 'Zapisuje...' : 'Odpowiedz'}
        </Button>
      </div>
    </div>
  );
}
