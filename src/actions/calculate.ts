'use server';

import { fetchIgpmCorrection } from '@/lib/igpm';
import { differenceInMonths } from 'date-fns';
import prisma from '@/lib/db';
import type { ActionState, CalculationResponse } from '@/lib/types';

export async function calculateDebt(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const valorPrincipalStr = (formData.get('valorPrincipal') as string || '0')
      .replace(/\./g, '')
      .replace(',', '.');
    const valorPrincipal = parseFloat(valorPrincipalStr);
    const dataInicial = formData.get('dataInicial') as string;
    const dataFinal = formData.get('dataFinal') as string;
    const aplicarMulta = formData.get('aplicarMulta') === 'true';
    const aplicarHonorarios = formData.get('aplicarHonorarios') === 'true';
    const percentualMulta = parseFloat(formData.get('percentualMulta') as string || '30');
    const percentualHonorarios = parseFloat(formData.get('percentualHonorarios') as string || '20');

    // Validations
    if (!valorPrincipal || valorPrincipal <= 0) {
      return { result: { success: false, error: 'Valor principal deve ser maior que zero.' } };
    }
    if (!dataInicial || !dataFinal) {
      return { result: { success: false, error: 'As datas são obrigatórias.' } };
    }

    const dateInicial = new Date(dataInicial);
    const dateFinal = new Date(dataFinal);

    if (dateInicial >= dateFinal) {
      return { result: { success: false, error: 'A data final deve ser posterior à data inicial.' } };
    }

    // 1. Fetch IGP-M correction
    let igpmData;
    try {
      igpmData = await fetchIgpmCorrection(dataInicial, dataFinal);
    } catch {
      // Fallback: use a simulated correction if API fails
      igpmData = { fatorCorrecao: 1.0, percentualAcumulado: 0 };
    }

    // 2. Apply correction
    const principalCorrigido = valorPrincipal * igpmData.fatorCorrecao;

    // 3. Calculate months for simple interest
    const mesesJuros = differenceInMonths(dateFinal, dateInicial);

    // 4. Simple interest: 1% per month on corrected principal
    const taxaJurosMensal = 0.01;
    const jurosMora = principalCorrigido * taxaJurosMensal * mesesJuros;

    // 5. Subtotal
    const subtotal = principalCorrigido + jurosMora;

    // 6. Multa
    const multa = aplicarMulta ? subtotal * (percentualMulta / 100) : 0;
    const totalComMulta = subtotal + multa;

    // 7. Honorários
    const honorarios = aplicarHonorarios ? totalComMulta * (percentualHonorarios / 100) : 0;
    const totalFinal = totalComMulta + honorarios;

    // 8. Save to DB
    const savedCalculation = await prisma.calculation.create({
      data: {
        valorOriginal: valorPrincipal,
        dataInicial: dateInicial,
        dataFinal: dateFinal,
        igpmAcumulado: igpmData.percentualAcumulado,
        principalCorrigido,
        mesesJuros,
        jurosMora,
        subtotal,
        aplicouMulta: aplicarMulta,
        percentualMulta,
        multa,
        totalComMulta,
        aplicouHonorarios: aplicarHonorarios,
        percentualHonorarios,
        honorarios,
        totalFinal,
      }
    });

    const result: CalculationResponse = {
      success: true,
      id: savedCalculation.id,
      createdAt: savedCalculation.createdAt.toISOString(),
      valorOriginal: valorPrincipal,
      dataInicial,
      dataFinal,
      igpmAcumulado: igpmData.percentualAcumulado,
      principalCorrigido,
      mesesJuros,
      jurosMora,
      subtotal,
      aplicouMulta: aplicarMulta,
      percentualMulta,
      multa,
      totalComMulta,
      aplicouHonorarios: aplicarHonorarios,
      percentualHonorarios,
      honorarios,
      totalFinal,
    };

    return { result };
  } catch (error) {
    return {
      result: {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no cálculo.',
      },
    };
  }
}
