export interface CalculationInput {
  valorPrincipal: number;
  dataInicial: string; // yyyy-MM-dd
  dataFinal: string;   // yyyy-MM-dd
  aplicarMulta: boolean;
  aplicarHonorarios: boolean;
  percentualMulta: number;
  percentualHonorarios: number;
}

export interface CalculationResult {
  success: true;
  id: string;
  createdAt: string;
  valorOriginal: number;
  dataInicial: string;
  dataFinal: string;
  igpmAcumulado: number; // percentage
  principalCorrigido: number;
  mesesJuros: number;
  jurosMora: number;
  subtotal: number;
  aplicouMulta: boolean;
  percentualMulta: number;
  multa: number;
  totalComMulta: number;
  aplicouHonorarios: boolean;
  percentualHonorarios: number;
  honorarios: number;
  totalFinal: number;
}

export interface CalculationError {
  success: false;
  error: string;
}

export type CalculationResponse = CalculationResult | CalculationError;

export interface ActionState {
  result: CalculationResponse | null;
}
