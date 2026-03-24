'use client';

import React from 'react';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/formatters';
import LegalText from '@/components/LegalText';
import type { ActionState, CalculationResult } from '@/lib/types';

interface ResultsPanelProps {
  state: ActionState;
  isPending: boolean;
}

function ResultsTableRow({
  label,
  detail,
  value,
  highlight,
  isTotal,
}: {
  label: string;
  detail?: string;
  value: string;
  highlight?: 'teal' | 'gold';
  isTotal?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 px-4 ${
        isTotal ? 'bg-bg-hover rounded-xl mt-2' : 'border-b border-border/50'
      }`}
    >
      <div>
        <span
          className={`text-sm font-medium ${
            highlight === 'teal'
              ? 'text-teal'
              : highlight === 'gold'
              ? 'text-gold'
              : 'text-text-primary'
          } ${isTotal ? 'text-base font-bold' : ''}`}
        >
          {label}
        </span>
        {detail && <p className="text-xs text-text-muted m-0 mt-0.5">{detail}</p>}
      </div>
      <span
        className={`text-sm font-semibold tabular-nums ${
          highlight === 'teal'
            ? 'text-teal'
            : highlight === 'gold'
            ? 'text-gold text-lg'
            : 'text-text-primary'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card h-full flex flex-col items-center justify-center text-center py-16">
      <div className="w-20 h-20 rounded-full bg-bg-hover flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="12" y2="14" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">Nenhum cálculo realizado</h3>
      <p className="text-sm text-text-muted max-w-xs">
        Preencha os dados do contrato e clique em &quot;Gerar Cálculo&quot; para ver os resultados aqui.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-8 w-32 rounded-full" />
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 px-4">
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsPanel({ state, isPending }: ResultsPanelProps) {
  if (isPending) return <LoadingState />;
  if (!state.result) return <EmptyState />;

  if (!state.result.success) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger/10 border border-danger/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <p className="text-sm text-danger m-0">{state.result.error}</p>
        </div>
      </div>
    );
  }

  const r: CalculationResult = state.result;

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Results Card */}
      <div className="card">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary m-0 flex items-center gap-2">
                <span className="text-gold">⚖</span>
                Resultado do Cálculo
              </h2>
              <p className="text-xs text-text-muted mt-1 m-0">
                Memória de cálculo detalhada para fins judiciais ou extrajudiciais.
              </p>
            </div>
            <div className="badge-success">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Cálculo Concluído
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 rounded-lg bg-bg-hover border border-border/50 flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Índice</span>
              <span className="text-xs font-semibold text-text-primary">IGP-M</span>
            </div>
            <div className="p-2 rounded-lg bg-bg-hover border border-border/50 flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Juros</span>
              <span className="text-xs font-semibold text-text-primary">1% a.m.</span>
            </div>
            {r.aplicouMulta && (
              <div className="p-2 rounded-lg bg-bg-hover border border-border/50 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Multa</span>
                <span className="text-xs font-semibold text-text-primary">30%</span>
              </div>
            )}
            {r.aplicouHonorarios && (
              <div className="p-2 rounded-lg bg-bg-hover border border-border/50 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Honorários</span>
                <span className="text-xs font-semibold text-text-primary">20%</span>
              </div>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-teal/5 border border-teal/20 text-[11px] text-teal flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Período: <strong>{formatDate(r.dataInicial)}</strong> até <strong>{formatDate(r.dataFinal)}</strong>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-border my-2" />

        {/* Table header */}
        <div className="flex items-center justify-between py-2 px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Descrição do Item
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Valor Calculado
          </span>
        </div>

        {/* Rows */}
        <ResultsTableRow
          label={`Valor Original (${formatDate(r.dataInicial)})`}
          value={formatCurrency(r.valorOriginal)}
        />
        <ResultsTableRow
          label="Principal Corrigido (IGP-M)"
          detail={`Correção acumulada: ${formatPercentage(r.igpmAcumulado)}`}
          value={formatCurrency(r.principalCorrigido)}
        />
        <ResultsTableRow
          label="Juros de Mora (1%/mês)"
          detail={`${r.mesesJuros} meses desde o vencimento`}
          value={formatCurrency(r.jurosMora)}
        />
        <ResultsTableRow
          label="Subtotal"
          value={formatCurrency(r.subtotal)}
          highlight="teal"
        />

        {r.aplicouMulta && (
          <ResultsTableRow
            label={`Multa Contratual (${r.percentualMulta}%)`}
            value={formatCurrency(r.multa)}
          />
        )}

        {r.aplicouHonorarios && (
          <ResultsTableRow
            label={`Honorários Advocatícios (${r.percentualHonorarios}%)`}
            value={formatCurrency(r.honorarios)}
          />
        )}

        <ResultsTableRow
          label="Valor Total Devido"
          value={formatCurrency(r.totalFinal)}
          highlight="gold"
          isTotal
        />

        {/* Export buttons */}
        <div className="flex gap-3 mt-5">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-bg-hover border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-light transition-all cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
            Baixar Planilha (PDF)
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-bg-hover border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-light transition-all cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Legal Text */}
      <LegalText result={r} />
    </div>
  );
}
