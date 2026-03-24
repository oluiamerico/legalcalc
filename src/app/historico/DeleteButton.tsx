'use client';

import { useTransition } from 'react';
import { deleteCalculation } from '@/actions/history';

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja apagar este cálculo?')) {
      startTransition(async () => {
        await deleteCalculation(id);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-text-muted hover:text-danger hover:bg-danger/10 p-2 rounded-lg transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-50"
      aria-label="Apagar cálculo"
      title="Apagar cálculo"
    >
      {isPending ? (
        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      )}
    </button>
  );
}
