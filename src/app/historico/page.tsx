import { getCalculations, deleteCalculation } from '@/actions/history';
import { formatCurrency, formatDate } from '@/lib/formatters';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

export const dynamic = 'force-dynamic';

export default async function HistoricoPage() {
  const calculations = await getCalculations();

  return (
    <div className="flex flex-col flex-1 p-6 fade-in h-screen overflow-hidden">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary m-0">
            Histórico de Cálculos
          </h1>
          <p className="text-sm text-text-secondary mt-1 m-0">
            Confira e gerencie os cálculos realizados anteriormente.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        {calculations.length === 0 ? (
          <div className="card h-[400px] flex flex-col items-center justify-center text-center py-16">
            <div className="w-20 h-20 rounded-full bg-bg-hover flex items-center justify-center mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Nenhum cálculo no histórico</h3>
            <p className="text-sm text-text-muted max-w-xs mb-6">
              Você ainda não realizou nenhum cálculo.
            </p>
            <Link href="/" className="btn-gold">
              Novo Cálculo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {calculations.map((calc: any) => (
              <div key={calc.id} className="card p-5 group transition-colors hover:border-gold/30">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                      Feito em:
                    </span>
                    <span className="text-sm text-text-primary font-medium">
                      {new Date(calc.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <DeleteButton id={calc.id} />
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Period */}
                  <div>
                    <span className="block text-xs text-text-secondary mb-1">Período</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {formatDate(calc.dataInicial.toISOString())} - {formatDate(calc.dataFinal.toISOString())}
                    </span>
                  </div>

                  {/* Original Value */}
                  <div>
                    <span className="block text-xs text-text-secondary mb-1">Valor Original</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {formatCurrency(calc.valorOriginal)}
                    </span>
                  </div>

                  {/* Rules Applied */}
                  <div>
                    <span className="block text-xs text-text-secondary mb-1">Encargos</span>
                    <div className="flex flex-wrap gap-1">
                      {calc.aplicouMulta && (
                        <span className="px-1.5 py-0.5 rounded bg-bg-hover text-[10px] font-bold text-text-primary uppercase border border-border">Multa {calc.percentualMulta}%</span>
                      )}
                      {calc.aplicouHonorarios && (
                        <span className="px-1.5 py-0.5 rounded bg-bg-hover text-[10px] font-bold text-text-primary uppercase border border-border">Honorários {calc.percentualHonorarios}%</span>
                      )}
                      {!calc.aplicouMulta && !calc.aplicouHonorarios && (
                        <span className="text-xs text-text-muted italic">Nenhum</span>
                      )}
                    </div>
                  </div>

                  {/* Final Value */}
                  <div>
                    <span className="block text-xs text-text-secondary mb-1">Valor Final</span>
                    <span className="text-lg font-bold text-gold">
                      {formatCurrency(calc.totalFinal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
