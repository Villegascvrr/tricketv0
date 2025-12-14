import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "marketing" | "pricing" | "alert" | "operations";
  scope: "global" | "provider" | "channel" | "zone" | "ageSegment" | "city";
  targetKey?: string;
  rule?: string;
  dataPoint?: string;
}

export const exportRecommendationsToPDF = (
  recommendations: Recommendation[],
  eventName: string,
  eventDate: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFillColor(99, 102, 241); // Primary color
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Recomendaciones IA", 15, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(eventName, 15, 30);
  
  // Date on right side
  doc.setFontSize(10);
  const dateText = `Generado: ${new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
  const dateWidth = doc.getTextWidth(dateText);
  doc.text(dateText, pageWidth - dateWidth - 15, 30);

  yPosition = 50;

  // Summary metrics
  const highCount = recommendations.filter((r) => r.priority === "high").length;
  const mediumCount = recommendations.filter((r) => r.priority === "medium").length;
  const lowCount = recommendations.filter((r) => r.priority === "low").length;
  const totalCount = recommendations.length;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen Ejecutivo", 15, yPosition);
  yPosition += 10;

  // Summary boxes
  const boxWidth = 45;
  const boxHeight = 20;
  const boxSpacing = 5;
  const boxY = yPosition;

  // Critical recommendations box
  doc.setFillColor(239, 68, 68); // Red
  doc.roundedRect(15, boxY, boxWidth, boxHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(highCount.toString(), 15 + boxWidth / 2, boxY + 12, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Críticas", 15 + boxWidth / 2, boxY + 17, { align: "center" });

  // Important recommendations box
  doc.setFillColor(251, 146, 60); // Orange
  doc.roundedRect(15 + boxWidth + boxSpacing, boxY, boxWidth, boxHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(mediumCount.toString(), 15 + boxWidth + boxSpacing + boxWidth / 2, boxY + 12, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Importantes", 15 + boxWidth + boxSpacing + boxWidth / 2, boxY + 17, {
    align: "center",
  });

  // Low priority recommendations box
  doc.setFillColor(99, 102, 241); // Blue
  doc.roundedRect(15 + (boxWidth + boxSpacing) * 2, boxY, boxWidth, boxHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(lowCount.toString(), 15 + (boxWidth + boxSpacing) * 2 + boxWidth / 2, boxY + 12, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Sugerencias", 15 + (boxWidth + boxSpacing) * 2 + boxWidth / 2, boxY + 17, {
    align: "center",
  });

  // Total recommendations box
  doc.setFillColor(156, 163, 175); // Gray
  doc.roundedRect(15 + (boxWidth + boxSpacing) * 3, boxY, boxWidth, boxHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(totalCount.toString(), 15 + (boxWidth + boxSpacing) * 3 + boxWidth / 2, boxY + 12, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Total", 15 + (boxWidth + boxSpacing) * 3 + boxWidth / 2, boxY + 17, {
    align: "center",
  });

  yPosition += boxHeight + 15;

  // Category breakdown
  const categoryCount = {
    marketing: recommendations.filter((r) => r.category === "marketing").length,
    pricing: recommendations.filter((r) => r.category === "pricing").length,
    alert: recommendations.filter((r) => r.category === "alert").length,
  };

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Distribución por Categoría", 15, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Marketing: ${categoryCount.marketing}`, 20, yPosition);
  doc.text(`Pricing: ${categoryCount.pricing}`, 80, yPosition);
  doc.text(`Alertas: ${categoryCount.alert}`, 140, yPosition);
  yPosition += 12;

  // Group recommendations by priority
  const groupedRecs = {
    high: recommendations.filter((r) => r.priority === "high"),
    medium: recommendations.filter((r) => r.priority === "medium"),
    low: recommendations.filter((r) => r.priority === "low"),
  };

  // Helper function to add new page if needed
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: string): [number, number, number] => {
    switch (priority) {
      case "high":
        return [239, 68, 68]; // Red
      case "medium":
        return [251, 146, 60]; // Orange
      case "low":
        return [99, 102, 241]; // Blue
      default:
        return [156, 163, 175]; // Gray
    }
  };

  // Helper function to get priority label
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "CRÍTICA";
      case "medium":
        return "IMPORTANTE";
      case "low":
        return "SUGERENCIA";
      default:
        return priority.toUpperCase();
    }
  };

  // Helper function to get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "marketing":
        return "Marketing";
      case "pricing":
        return "Pricing";
      case "alert":
        return "Alerta";
      default:
        return category;
    }
  };

  // Render each group
  Object.entries(groupedRecs).forEach(([priority, recs]) => {
    if (recs.length === 0) return;

    checkPageBreak(20);

    // Section header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const color = getPriorityColor(priority);
    doc.setTextColor(color[0], color[1], color[2]);
    const label = getPriorityLabel(priority);
    doc.text(`${label} (${recs.length})`, 15, yPosition);
    yPosition += 10;

    // Draw line
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.5);
    doc.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 8;

    // Render recommendations
    recs.forEach((rec, index) => {
      checkPageBreak(40);

      // Recommendation card
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      const cardHeight = 35;
      doc.roundedRect(15, yPosition, pageWidth - 30, cardHeight, 2, 2, "S");

      // Priority badge
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(20, yPosition + 5, 28, 6, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(label, 34, yPosition + 9, { align: "center" });

      // Category badge
      doc.setFillColor(229, 231, 235);
      doc.roundedRect(50, yPosition + 5, 25, 6, 1, 1, "F");
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(8);
      doc.text(getCategoryLabel(rec.category), 62.5, yPosition + 9, { align: "center" });

      // Title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(rec.title, pageWidth - 50);
      doc.text(titleLines, 20, yPosition + 16);

      // Target info if available
      if (rec.targetKey) {
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.setFont("helvetica", "italic");
        doc.text(`Objetivo: ${rec.targetKey}`, 20, yPosition + 22);
      }

      // Description
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(rec.description, pageWidth - 50);
      const startY = rec.targetKey ? yPosition + 26 : yPosition + 22;
      const maxLines = 2;
      const displayLines = descLines.slice(0, maxLines);
      doc.text(displayLines, 20, startY);

      yPosition += cardHeight + 6;
    });

    yPosition += 5;
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      "Generado por Dashboard de Eventos",
      15,
      pageHeight - 10
    );
  }

  // Save the PDF
  const fileName = `Recomendaciones_IA_${eventName.replace(/\s+/g, "_")}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
};
