/* ============================================================
   Vata Dojo — PDF Export (V1.5)
   Captura a página inteira em PDF A4 retrato com paginação automática.
   Implementação completa em Fase 5.2.
   ============================================================ */

export async function exportDashboardToPDF(elementId = 'dashboard-root') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Elemento ${elementId} não encontrado`);
  }

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#0B0F1A',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth  = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth  = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  const timestamp = new Date().toLocaleString('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  pdf.setFontSize(8);
  pdf.setTextColor(150);
  pdf.text(
    `Gerado em ${timestamp} · Vata Dojo Dashboard de Projeção`,
    10,
    pdfHeight - 5
  );

  const filename = `vata-dojo-projecao-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}
