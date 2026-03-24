'use client';

import { useActionState, useState } from 'react';
import { calculateDebt } from '@/actions/calculate';
import ResultsPanel from '@/components/ResultsPanel';
import type { ActionState } from '@/lib/types';

const initialState: ActionState = { result: null };

export default function CalculationForm() {
  const [state, formAction, isPending] = useActionState(calculateDebt, initialState);
  const [aplicarMulta, setAplicarMulta] = useState(true);
  const [aplicarHonorarios, setAplicarHonorarios] = useState(true);

  return (
    <div className="flex flex-col lg:flex-row gap-6 flex-1 lg:min-h-0">
      {/* Left: Form */}
      <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
        <form action={formAction} className="flex flex-col gap-6">
          {/* Dados do Contrato */}
          <div className="card">
            <div className="flex flex-row items-center gap-2 mb-4">
              <span className="text-gold text-lg shrink-0">①</span>
              <h2 className="text-base font-semibold text-text-primary m-0">Dados do Contrato</h2>
            </div>

            {/* Rule Info Banner */}
            <div className="mb-6 p-3 rounded-xl bg-gold/5 border border-gold/20 flex items-start gap-3">
              <div className="text-gold mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gold uppercase tracking-wider m-0">Regras do Cálculo</p>
                <p className="text-xs text-text-secondary mt-1 m-0 leading-relaxed">
                  Correção pelo <strong>IGP-M</strong> + Juros de <strong>1% ao mês</strong>.
                  Multa de <strong>30%</strong> e Honorários de <strong>20%</strong> aplicados por padrão.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Valor Original */}
              <div>
                <label className="block text-sm text-text-secondary mb-2" htmlFor="valorPrincipal">
                  Valor Original do Contrato (R$)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gold font-bold text-sm pointer-events-none shrink-0 z-10">
                    R$
                  </span>
                  <input
                    type="text"
                    id="valorPrincipal"
                    name="valorPrincipal"
                    placeholder="0,00"
                    className="input-field !pl-12"
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2" htmlFor="dataInicial">
                    Data de Assinatura
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dataInicial"
                      name="dataInicial"
                      required
                      className="input-field text-text-secondary cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2" htmlFor="dataFinal">
                    Data de Atualização
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dataFinal"
                      name="dataFinal"
                      required
                      className="input-field text-text-secondary cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Encargos e Honorários */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-gold text-lg shrink-0">②</span>
              <h2 className="text-base font-semibold text-text-primary m-0">Encargos e Honorários</h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Multa */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-input border border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary m-0">Multa Contratual</p>
                    <span className="px-1.5 py-0.5 rounded bg-gold/10 text-[10px] font-bold text-gold uppercase tracking-tighter border border-gold/20">30%</span>
                  </div>
                  <p className="text-xs text-text-muted m-0 mt-0.5">Incide sobre o principal corrigido + juros</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={`toggle-switch ${aplicarMulta ? 'active' : ''}`}
                    onClick={() => setAplicarMulta(!aplicarMulta)}
                    aria-label="Aplicar multa"
                  />
                </div>
              </div>

              <input type="hidden" name="aplicarMulta" value={aplicarMulta.toString()} />
              <input type="hidden" name="percentualMulta" value="30" />

              {/* Honorários */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-input border border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary m-0">Honorários Advocatícios</p>
                    <span className="px-1.5 py-0.5 rounded bg-gold/10 text-[10px] font-bold text-gold uppercase tracking-tighter border border-gold/20">20%</span>
                  </div>
                  <p className="text-xs text-text-muted m-0 mt-0.5">Incide sobre o valor total devido</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={`toggle-switch ${aplicarHonorarios ? 'active' : ''}`}
                    onClick={() => setAplicarHonorarios(!aplicarHonorarios)}
                    aria-label="Aplicar honorários"
                  />
                </div>
              </div>

              <input type="hidden" name="aplicarHonorarios" value={aplicarHonorarios.toString()} />
              <input type="hidden" name="percentualHonorarios" value="20" />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-gold" disabled={isPending}>
            {isPending ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Calculando...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" />
                </svg>
                Gerar Cálculo
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right: Results */}
      <div className="flex-1 min-w-0">
        <ResultsPanel state={state} isPending={isPending} />
      </div>
    </div>
  );
}
