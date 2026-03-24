interface BcbDataPoint {
  data: string;  // dd/MM/yyyy
  valor: string;
}

/**
 * Fetches IGP-M monthly variation data from the BCB SGS API (series 189).
 * Returns the cumulative correction factor and percentage.
 */
export async function fetchIgpmCorrection(
  dataInicial: string,
  dataFinal: string
): Promise<{ fatorCorrecao: number; percentualAcumulado: number }> {
  // Convert from yyyy-MM-dd to dd/MM/yyyy
  const formatDateBcb = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados?formato=json&dataInicial=${formatDateBcb(dataInicial)}&dataFinal=${formatDateBcb(dataFinal)}`;

  const response = await fetch(url, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados do IGP-M: Status ${response.status}`);
  }

  const data: BcbDataPoint[] = await response.json();

  if (!data || data.length === 0) {
    // If no data available, return factor of 1 (no correction)
    return { fatorCorrecao: 1, percentualAcumulado: 0 };
  }

  // Calculate cumulative factor: (1 + v1/100) * (1 + v2/100) * ...
  let fatorAcumulado = 1;
  for (const point of data) {
    const variacao = parseFloat(point.valor);
    if (!isNaN(variacao)) {
      fatorAcumulado *= (1 + variacao / 100);
    }
  }

  const percentualAcumulado = (fatorAcumulado - 1) * 100;

  return {
    fatorCorrecao: fatorAcumulado,
    percentualAcumulado,
  };
}
