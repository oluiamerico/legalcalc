'use client';

import React from 'react';
import { useState } from 'react';
import { formatCurrency, currencyToWords, formatDate } from '@/lib/formatters';
import type { CalculationResult } from '@/lib/types';

interface LegalTextProps {
  result: CalculationResult;
}

export default function LegalText({ result }: LegalTextProps) {
  const [copied, setCopied] = useState(false);

  const totalPorExtenso = currencyToWords(result.totalFinal);

  const encargosText: string[] = [];
  encargosText.push('correção monetária pelo índice IGP-M');
  encargosText.push('juros de mora de 1% ao mês');
  if (result.aplicouMulta) {
    encargosText.push(`multa contratual de ${result.percentualMulta}%`);
  }
  if (result.aplicouHonorarios) {
    encargosText.push(`honorários advocatícios de ${result.percentualHonorarios}%`);
  }

  const text = `"Diante do exposto, requer a Vossa Excelência a citação do executado para o pagamento do débito atualizado, o qual foi calculado com base na variação do IGP-M e acrescido de juros moratórios de 1% ao mês${result.aplicouMulta ? `, multa de ${result.percentualMulta}%` : ''}${result.aplicouHonorarios ? ` e honorários de ${result.percentualHonorarios}%` : ''}. O valor total devido, atualizado de ${formatDate(result.dataInicial)} até ${formatDate(result.dataFinal)}, perfaz a quantia de ${formatCurrency(result.totalFinal)} (${totalPorExtenso}), conforme memória de cálculo detalhada em anexo."`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for clipboard API
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted m-0">
          Texto para Petição
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all
            bg-transparent border-gold/30 text-gold hover:bg-gold/10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {copied ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </>
            )}
          </svg>
          {copied ? 'Copiado!' : 'Copiar Texto'}
        </button>
      </div>

      <div className="p-4 rounded-xl bg-bg-input border border-border text-sm leading-7 text-text-secondary italic">
        <p className="m-0">
          {text.split(formatCurrency(result.totalFinal)).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <strong className="text-gold not-italic font-bold">
                  {formatCurrency(result.totalFinal)}
                </strong>
              )}
            </span>
          ))}
        </p>
        <p className="m-0 mt-2">
          {totalPorExtenso && (
            <span className="text-gold not-italic font-semibold text-xs">
              ({totalPorExtenso})
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
