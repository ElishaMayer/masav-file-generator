import { Modal } from "antd";
import { v4 } from "uuid";
import { getAnalytics, logEvent } from "firebase/analytics";
import i18next from "i18next";
import { ImportExcelModal } from "../elements/ImportExcelModal";

const ExcelJS = require("exceljs");

const extractFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => resolve(reader.result);
    reader.readAsArrayBuffer(file);
    reader.onerror = (e) => reject(e);
  });

const getSheetMapping = (sheets, tt, file) =>
  new Promise((resolve) => {
    const manageModal = Modal.info({
      bodyStyle: { direction: i18next.t("direction") },
      footer: null,
      title: `${tt("map-sheets-form")} "${file.name}"`,
      className: "hide-modal-footer",
      content: (
        <ImportExcelModal
          sheets={sheets}
          onSubmit={(mapping) => {
            manageModal.destroy();
            resolve(mapping);
          }}
        />
      ),
    });
  });

export const uploadFromExcel = async (file, t) => {
  const tt = (str) => t(`translation:${str}`);
  try {
    const buffer = await extractFile(file);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    if (!workbook.worksheets[0]) throw new Error("no sheets");
    const sheetMapping = await getSheetMapping(
      workbook.worksheets.map((sheet) => sheet.name),
      tt,
      file
    );

    const worksheet = workbook.getWorksheet(sheetMapping.mapTransactions);
    if (!worksheet) throw new Error("no mapTransactions sheet");
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

    const institutionSheet =
      sheetMapping.mapInstitution &&
      workbook.getWorksheet(sheetMapping.mapInstitution);
    let institution;
    if (institutionSheet) {
      const row = institutionSheet.getRow(2);
      institution = {
        institutionId: String(row.getCell(1).value || ""),
        institutionName: String(row.getCell(3).value || ""),
        sendingInstitutionId: String(row.getCell(2).value || ""),
        serialNumber: String(row.getCell(4).value || ""),
      };
    }
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
    return { transactions, institution };
  } catch (e) {
    console.error(e);
    Modal.error({
      title: tt("error-opening-file"),
      content: tt("error-opening-file-content"),
    });
    return { transactions: [], institution: null };
  }
};
