import { Modal } from "antd";
import { v4 } from "uuid";

const ExcelJS = require("exceljs");

export const uploadFromExcel = async (buffer) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) console.log("no sheets");
    let validRow = true;
    let rowNum = 2;
    const transactions = [];
    while (validRow) {
      const row = worksheet.getRow(rowNum);
      rowNum++;
      const payeeId = String(row.getCell(1).value || "");
      const payeeName = String(row.getCell(2).value || "");
      const bankId = String(row.getCell(3).value || "");
      const branchId = String(row.getCell(4).value || "");
      const accountId = String(row.getCell(5).value || "");
      const amount = parseFloat(row.getCell(6).value || "") || 0;
      const payeeNumber = String(row.getCell(7).value || "");
      const key = v4();
      validRow =
        payeeId && payeeName && bankId && branchId && accountId && amount;
      if (validRow) {
        transactions.push({
          payeeId,
          payeeName,
          bankId,
          branchId,
          accountId,
          amount,
          payeeNumber,
          key,
        });
      }
    }
    return transactions;
  } catch (e) {
    Modal.error({
      title: "Error opening file",
      content: "Make sure it's a valid excel file",
    });
    return [];
  }
};
