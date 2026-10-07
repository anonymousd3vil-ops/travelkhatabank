import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { categoryTotals } from "../components/Charts.jsx";

const COLORS = {
  primary: [15, 118, 110],
  dark: [15, 23, 42],
  muted: [100, 116, 139],
  light: [241, 245, 249],
  border: [226, 232, 240],
  green: [13, 148, 136],
  red: [220, 38, 38],
  amber: [217, 119, 6],
  white: [255, 255, 255],
};

const rs = (value) =>
  "Rs " +
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const safe = (value, fallback = "—") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
};

const dateText = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const timeText = () =>
  new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getShares = (entry) => {
  if (entry.type === "credit") return "Added to trip fund";

  if (entry.shares?.length) {
    return entry.shares
      .map(
        (share) => `${safe(share.user?.name, "Member")}: ${rs(share.amount)}`,
      )
      .join("\n");
  }

  if (entry.participants?.length) {
    const amount = Number(entry.amount || 0) / entry.participants.length;

    return entry.participants
      .map(
        (participant) => `${safe(participant.name, "Member")}: ${rs(amount)}`,
      )
      .join("\n");
  }

  return "No split details";
};

const drawPageBackground = (doc) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 3, "F");
};

const drawSectionTitle = (doc, title, subtitle, y) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.dark);
  doc.text(title, 14, y);

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(subtitle, 14, y + 5);
  }
};

const drawMetricCard = (doc, x, y, width, label, value, accent) => {
  const height = 22;

  doc.setFillColor(...COLORS.light);
  doc.roundedRect(x, y, width, height, 2, 2, "F");

  doc.setFillColor(...accent);
  doc.rect(x, y, 1.5, height, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.muted);
  doc.text(label, x + 5, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.dark);

  const maxTextWidth = width - 10;
  let displayValue = value;

  while (
    doc.getTextWidth(displayValue) > maxTextWidth &&
    displayValue.length > 5
  ) {
    displayValue = displayValue.slice(0, -4) + "...";
  }

  doc.text(displayValue, x + 5, y + 15);
};

const styleTable = {
  theme: "grid",
  margin: { left: 14, right: 14 },
  styles: {
    font: "helvetica",
    fontSize: 8,
    cellPadding: 3,
    overflow: "linebreak",
    textColor: COLORS.dark,
    lineColor: COLORS.border,
    lineWidth: 0.2,
    valign: "middle",
  },
  headStyles: {
    fillColor: COLORS.primary,
    textColor: COLORS.white,
    fontStyle: "bold",
    fontSize: 8,
    cellPadding: 4,
  },
  alternateRowStyles: {
    fillColor: [248, 250, 252],
  },
  didDrawPage: (data) => {
    drawPageBackground(data.doc);
  },
};

export function exportLog(trip, summary, entries = []) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const allEntries = Array.isArray(entries) ? entries : [];
  const liveEntries = allEntries.filter((entry) => !entry.voided);
  const voidedEntries = allEntries.filter((entry) => entry.voided);

  const credits = liveEntries
    .filter((entry) => entry.type === "credit")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  const debits = liveEntries
    .filter((entry) => entry.type === "debit")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  const fund = Number(summary?.fund ?? 0);
  const balance = Number(summary?.balance ?? fund + credits - debits);

  const destination = safe(trip?.destination, "Trip Expense Report");
  const filename = `${destination}-expenses.pdf`
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, "-");

  const members = Array.isArray(summary?.members) ? summary.members : [];

  // --------------------------------------------------
  // REPORT HEADER
  // --------------------------------------------------

  drawPageBackground(doc);

  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(14, 12, 12, 12, 3, 3, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TK", 20, 19.5, { align: "center" });

  doc.setTextColor(...COLORS.dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("TravelKhataBank", 31, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text("TRIP FINANCIAL REPORT", 31, 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.dark);
  doc.text(destination, 14, 36, {
    maxWidth: pageWidth - 28,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(`Generated on ${timeText()}`, 14, 42);

  doc.text(
    `${liveEntries.length} active transactions  |  ${voidedEntries.length} voided`,
    pageWidth - 14,
    42,
    { align: "right" },
  );

  // --------------------------------------------------
  // FINANCIAL SUMMARY
  // --------------------------------------------------

  drawSectionTitle(
    doc,
    "Financial overview",
    "Summary of active trip transactions",
    52,
  );

  const cardGap = 4;
  const cardWidth = (pageWidth - 28 - cardGap * 3) / 4;
  const cardY = 61;

  drawMetricCard(
    doc,
    14,
    cardY,
    cardWidth,
    "INITIAL FUND",
    rs(fund),
    COLORS.primary,
  );

  drawMetricCard(
    doc,
    14 + cardWidth + cardGap,
    cardY,
    cardWidth,
    "TOTAL CREDITS",
    rs(credits),
    COLORS.green,
  );

  drawMetricCard(
    doc,
    14 + (cardWidth + cardGap) * 2,
    cardY,
    cardWidth,
    "TOTAL EXPENSES",
    rs(debits),
    COLORS.red,
  );

  drawMetricCard(
    doc,
    14 + (cardWidth + cardGap) * 3,
    cardY,
    cardWidth,
    "CURRENT BALANCE",
    rs(balance),
    balance < 0 ? COLORS.red : COLORS.primary,
  );

  // --------------------------------------------------
  // TRANSACTION LEDGER
  // --------------------------------------------------

  let nextY = 92;

  drawSectionTitle(
    doc,
    "Transaction ledger",
    "Complete record of trip credits, expenses, and voided entries",
    nextY,
  );

  autoTable(doc, {
    ...styleTable,
    startY: nextY + 8,
    showHead: "everyPage",
    rowPageBreak: "avoid",
    columns: [
      { header: "Date", dataKey: "date" },
      { header: "Type", dataKey: "type" },
      { header: "Description", dataKey: "description" },
      { header: "Category", dataKey: "category" },
      { header: "Amount", dataKey: "amount" },
      { header: "Added by", dataKey: "creator" },
      { header: "Split details", dataKey: "split" },
      { header: "Status", dataKey: "status" },
    ],
    body: allEntries.map((entry) => ({
      date: dateText(entry.createdAt),
      type: entry.type === "credit" ? "Credit" : "Expense",
      description: safe(entry.title, "Untitled entry"),
      category: safe(entry.category, "Uncategorized"),
      amount: `${entry.type === "credit" ? "+" : "-"}${rs(entry.amount)}`,
      creator: safe(entry.createdBy?.name, "Unknown"),
      split: getShares(entry),
      status: entry.voided ? "VOIDED" : "Active",
    })),
    columnStyles: {
      date: { cellWidth: 23 },
      type: { cellWidth: 19 },
      description: { cellWidth: 38 },
      category: { cellWidth: 27 },
      amount: { cellWidth: 31, halign: "right" },
      creator: { cellWidth: 27 },
      split: { cellWidth: 70 },
      status: { cellWidth: 20 },
    },
    didParseCell: (data) => {
      if (data.section !== "body") return;

      const entry = allEntries[data.row.index];
      if (!entry) return;

      if (data.column.dataKey === "amount") {
        data.cell.styles.textColor = entry.voided
          ? COLORS.muted
          : entry.type === "credit"
            ? COLORS.green
            : COLORS.red;

        data.cell.styles.fontStyle = "bold";
      }

      if (data.column.dataKey === "status" && entry.voided) {
        data.cell.styles.textColor = COLORS.red;
        data.cell.styles.fontStyle = "bold";
      }

      if (entry.voided) {
        data.cell.styles.textColor = COLORS.muted;
      }
    },
  });

  // --------------------------------------------------
  // CATEGORY BREAKDOWN
  // --------------------------------------------------

  let y = doc.lastAutoTable.finalY + 12;

  if (y > pageHeight - 45) {
    doc.addPage();
    y = 18;
  }

  drawSectionTitle(
    doc,
    "Spending by category",
    "Active debit entries grouped by category",
    y,
  );

  const categories = categoryTotals(allEntries);

  autoTable(doc, {
    ...styleTable,
    startY: y + 8,
    head: [["Category", "Total spent", "Share of expenses"]],
    body: categories.length
      ? categories.map((category) => [
          category.name,
          rs(category.value),
          debits > 0
            ? `${((category.value / debits) * 100).toFixed(1)}%`
            : "0.0%",
        ])
      : [["No spending categories", rs(0), "0.0%"]],
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 55, halign: "right" },
      2: { cellWidth: 55, halign: "right" },
    },
  });

  // --------------------------------------------------
  // MEMBER FINANCIAL SUMMARY
  // --------------------------------------------------

  y = doc.lastAutoTable.finalY + 12;

  if (y > pageHeight - 45) {
    doc.addPage();
    y = 18;
  }

  drawSectionTitle(
    doc,
    "Member financial summary",
    "Contributions, spending, and remaining balances",
    y,
  );

  autoTable(doc, {
    ...styleTable,
    startY: y + 8,
    head: [["Member", "Contributed", "Spent", "Remaining"]],
    body: members.length
      ? members.map((member) => [
          safe(member.name, "Unknown member"),
          rs(member.contributed),
          rs(member.spent),
          rs(member.remaining),
        ])
      : [["No member data available", rs(0), rs(0), rs(0)]],
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 55, halign: "right" },
      2: { cellWidth: 55, halign: "right" },
      3: { cellWidth: 55, halign: "right" },
    },
    didParseCell: (data) => {
      if (
        data.section === "body" &&
        data.column.index === 3 &&
        members[data.row.index]?.remaining < 0
      ) {
        data.cell.styles.textColor = COLORS.red;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // --------------------------------------------------
  // PAGE FOOTERS
  // --------------------------------------------------

  const pageCount = doc.internal.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);

    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.muted);

    doc.text("TravelKhataBank · Trip expense report", 14, pageHeight - 6);

    doc.text(`Page ${page} of ${pageCount}`, pageWidth - 14, pageHeight - 6, {
      align: "right",
    });
  }

  doc.save(filename);
}
