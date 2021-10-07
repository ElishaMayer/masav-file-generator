import { Modal } from "antd";
import { v4 } from "uuid";
import { getAnalytics, logEvent } from "firebase/analytics";
import i18next from "i18next";

const ExcelJS = require("exceljs");

const extractFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => resolve(reader.result);
    reader.readAsArrayBuffer(file);
    reader.onerror = (e) => reject(e);
  });

export const uploadFromExcel = async (file, t) => {
  const tt = (str) => t(`translation:${str}`);
  try {
    const buffer = await extractFile(file);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("no sheets");
    let validRow = true;
    let rowNum = 2;
    let valid = 0,
      fail = 0;
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
        valid++;
      } else {
        fail++;
      }
    }
    fail--;
    Modal.info({
      bodyStyle: { direction: i18next.t("direction") },
      okText: i18next.t("ok"),
      title: tt("imported-form-") + file.name,
      content:
        tt("successfully-imported-") +
        valid +
        tt("-transactions-") +
        (fail ? tt("failed-to-import-") + fail + tt("-transactions-") : ""),
    });
    try {
      const analytics = getAnalytics();
      logEvent(analytics, "excel_upload", { fail, valid });
    } catch (e) {
      console.log(e);
    }
    return transactions;
  } catch (e) {
    console.error(e);
    Modal.error({
      title: tt("error-opening-file"),
      content: tt("error-opening-file-content"),
    });
    return [];
  }
};
