import CalculationForm from '@/components/CalculationForm';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary m-0">
            Nova Memória de Cálculo
          </h1>
          <p className="text-sm text-text-secondary mt-1 m-0">
            Preencha os dados abaixo para gerar a planilha e o texto da petição.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <CalculationForm />
    </div>
  );
}
