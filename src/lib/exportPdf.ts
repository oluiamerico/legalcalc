import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/formatters';
import type { CalculationResult } from '@/lib/types';

export function exportToPDF(result: CalculationResult) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('Memória de Cálculo - LegalCalc', 14, 20);

  // subtitle / meta
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 28);
  if (result.id) {
    doc.text(`ID do Cálculo: ${result.id}`, 14, 34);
  }

  // Parameters Section
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('Parâmetros do Cálculo', 14, 46);

  autoTable(doc, {
    startY: 50,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    body: [
      ['Período:', `${formatDate(result.dataInicial)} a ${formatDate(result.dataFinal)}`],
      ['Índice de Correção:', 'IGP-M'],
      ['Correção Acumulada:', formatPercentage(result.igpmAcumulado)],
      ['Juros de Mora:', '1% a.m.'],
      ['Multa:', result.aplicouMulta ? `${result.percentualMulta}%` : 'Não aplicada'],
      ['Honorários:', result.aplicouHonorarios ? `${result.percentualHonorarios}%` : 'Não aplicados'],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [71, 85, 105], cellWidth: 45 },
      1: { textColor: [30, 41, 59] }
    }
  });

  // Results Section
  // @ts-expect-error: jspdf-autotable adds lastAutoTable to doc
  const finalY = doc.lastAutoTable?.finalY || 85;
  
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('Demonstrativo de Valores', 14, finalY + 12);

  const tableData = [
    ['Valor Original', formatCurrency(result.valorOriginal)],
    ['Principal Corrigido (IGP-M)', formatCurrency(result.principalCorrigido)],
    [`Juros de Mora (${result.mesesJuros} meses)`, formatCurrency(result.jurosMora)],
    ['Subtotal', formatCurrency(result.subtotal)],
  ];

  if (result.aplicouMulta) {
    tableData.push([`Multa Contratual (${result.percentualMulta}%)`, formatCurrency(result.multa)]);
  }

  if (result.aplicouHonorarios) {
    tableData.push([`Honorários Advocatícios (${result.percentualHonorarios}%)`, formatCurrency(result.honorarios)]);
  }

  tableData.push(['Valor Total Devido', formatCurrency(result.totalFinal)]);

  autoTable(doc, {
    startY: finalY + 18,
    theme: 'grid',
    head: [['Descrição do Item', 'Valor Calculado']],
    body: tableData,
    headStyles: { 
      fillColor: [13, 148, 136], // teal
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 10, 
      cellPadding: 6,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' }
    },
    willDrawCell: function(data) {
      if (data.row.index === tableData.length - 1 && data.section === 'body') {
        data.cell.styles.fillColor = [248, 250, 252]; // slate-50
        data.cell.styles.textColor = [184, 134, 11]; // dark goldenrod (better visibility on print)
        data.cell.styles.fontStyle = 'bold';
      } else if (data.row.index === 3 && data.section === 'body') {
        // Subtotal row
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  // Footer Disclaimer
  // @ts-expect-error: jspdf-autotable adds lastAutoTable to doc
  const footerY = doc.lastAutoTable?.finalY + 15;
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  const splitText = doc.splitTextToSize(
    'Este documento é uma memória de cálculo gerada eletronicamente. ' +
    'Os valores apresentados são baseados nos parâmetros informados pelo usuário. ' +
    'Recomenda-se a conferência dos dados antes de sua utilização em processos judiciais ou acordos extrajudiciais.',
    180
  );
  doc.text(splitText, 14, footerY);

  const filename = result.id ? `calculo-legalcalc-${result.id.slice(0, 8)}.pdf` : `calculo-legalcalc-${Date.now()}.pdf`;
  doc.save(filename);
}
