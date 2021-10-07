import { getAnalytics, logEvent } from "firebase/analytics";
const ExcelJS = require("exceljs");

export const generateExcelFile = async (transactions, t) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Masav File Generator";
  workbook.created = new Date();
  workbook.modified = new Date();
  const sheet = workbook.addWorksheet(t(`transactions`));
  sheet.columns = [
    { header: t("excel-col-1"), width: 15 },
    { header: t("excel-col-2"), width: 15 },
    { header: t("excel-col-3"), width: 15 },
    { header: t("excel-col-4"), width: 15 },
    { header: t("excel-col-5"), width: 15 },
    { header: t("excel-col-6"), width: 15 },
    { header: t("excel-col-7"), width: 15 },
  ];

  let rowIndex = 2;
  transactions.forEach((transaction) => {
    const row = sheet.getRow(rowIndex);
    row.getCell(1).value = transaction.payeeId;
    row.getCell(2).value = transaction.payeeName;
    row.getCell(3).value = transaction.bankId;
    row.getCell(4).value = transaction.branchId;
    row.getCell(5).value = transaction.accountId;
    row.getCell(6).value = parseFloat(transaction.amount).toFixed(2);
    row.getCell(7).value = transaction.payeeNumber;
    rowIndex++;
  });
  const buffer = await workbook.xlsx.writeBuffer();

  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(new Blob([buffer]));
  link.download = `transactions.xlsx`;
  link.click();

  try {
    const analytics = getAnalytics();
    logEvent(analytics, "excel_exported", { length: transactions.length });
  } catch (e) {
    console.log(e);
  }
};
