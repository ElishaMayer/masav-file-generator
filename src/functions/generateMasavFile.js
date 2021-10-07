import { Modal } from "antd";
import {
  InstitutionSendPayment,
  MasaVSendPayments,
  SendPaymentsRecord,
} from "masav";
import moment from "moment";
import { getAnalytics, logEvent } from "firebase/analytics";
import JSZip from "jszip";
import i18next from "i18next";

const showSummery = (institution, transactions, t) =>
  new Promise((resolve) => {
    Modal.confirm({
      title: t("masav-file-summery"),
      icon: null,
      bodyStyle: { direction: t("translation:direction") },
      content: (
        <div>
          <p>
            <b>{t("institution-id-label")}</b>: {institution.institutionId}
          </p>
          <p>
            <b>{t("sending-institution-id-label")}</b>:{" "}
            {institution.sendingInstitutionId}
          </p>
          <p>
            <b>{t("institution-name-label")}</b>: {institution.institutionName}
          </p>
          <p>
            <b>{t("file-name")}</b>: {`msv.${institution.serialNumber}`}
          </p>
          <p>
            <b>{t("number-of-transactions")}</b>: {transactions.length}
          </p>
          <p>
            <b>{t("amount")}</b>:{" "}
            {new Intl.NumberFormat("il-IL", {
              style: "currency",
              currency: "ILS",
            }).format(
              transactions
                .map((trans) => trans.amount)
                .reduce((a, b) => a + b, 0)
            )}
          </p>
          <p>{t("masav-file-zip-explanation")}</p>
        </div>
      ),
      okText: t("download"),
      cancelText: t("translation:cancel"),
      onCancel() {
        resolve(false);
      },
      onOk() {
        resolve(true);
      },
    });
  });

export const generateMasavFile = async ({ institution, transactions }, t) => {
  const tt = (str) => t(`translation:${str}`);
  const messages = [];
  if (!institution.institutionId.match(/^\d{8}$/))
    messages.push(tt("invalid-insitution-id"));
  if (!institution.institutionName.match(/^.{1,30}$/))
    messages.push(tt("invalid-insitution-Name"));
  if (!institution.sendingInstitutionId.match(/^\d{5}$/))
    messages.push(tt("invalid-insitution-sending-id"));
  if (!institution.serialNumber.match(/^\d{3}$/))
    messages.push(tt("invalid-serial-number"));
  if (!transactions.length) messages.push(tt("no-transactions"));
  transactions.forEach(
    ({ accountId, amount, bankId, branchId, payeeId, payeeName }, i) => {
      if (!accountId.match(/^\d{1,9}$/))
        messages.push(
          `${tt("in-row-number-")}${i + 1}${tt("-bank-account-is-not-valid")}`
        );
      if (isNaN(amount) || amount <= 0)
        messages.push(
          `${tt("in-row-number-")}${i + 1}${tt("-amount-is-not-valid")}`
        );
      if (!bankId.match(/^\d{1,2}$/))
        messages.push(
          `${tt("in-row-number-")}${i + 1}${tt("-bank-id-is-not-valid")}`
        );
      if (!branchId.match(/^\d{1,3}$/))
        messages.push(
          `${tt("in-row-number-")}${i + 1}${tt("-branch-id-is-not-valid")}`
        );
      if (!payeeId.match(/^\d{1,9}$/))
        messages.push(
          `${tt("in-row-number-")}${i + 1}${tt("-payee-id-is-not-valid")}`
        );
      if (!payeeName.match(/^.{0,16}$/))
        messages.push(
          `${tt("in-row-number-")}${i + 1}${tt("-payee-name-is-not-valid")}`
        );
    }
  );
  if (messages.length) {
    Modal.error({
      bodyStyle: { direction: t("translation:direction") },
      okText: t("translation:ok"),
      title: tt("masav-file-errors"),
      content: (
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      ),
    });
    return;
  }
  const result = await showSummery(institution, transactions, t);
  if (!result) return;

  let masavFile = new MasaVSendPayments();
  let masav_institution = new InstitutionSendPayment(
    institution.institutionId || "",
    institution.sendingInstitutionId || "",
    moment().format("YYMMDD"),
    moment().format("YYMMDD"),
    institution.institutionName || "",
    institution.serialNumber || ""
  );
  transactions.forEach(
    ({
      accountId,
      amount,
      bankId,
      branchId,
      payeeId,
      payeeName,
      payeeNumber,
    }) => {
      masav_institution.addPaymentRecord(
        new SendPaymentsRecord(
          bankId || "",
          branchId || "",
          accountId || "",
          payeeId || "",
          payeeName || "",
          payeeNumber || "",
          amount || 0
        )
      );
    }
  );
  masavFile.addInstitution(masav_institution);
  var blob = new Blob([masavFile.toBuffer()], {
    type: "application/octet-stream",
  });
  var zip = new JSZip();
  zip.file(`msv.${institution.serialNumber}`, blob);
  zip.generateAsync({ type: "blob" }).then(function (content) {
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(content);
    link.download = `msv-${institution.serialNumber}.zip`;
    link.click();
  });

  try {
    const analytics = getAnalytics();
    logEvent(analytics, "masav_exported", { length: transactions.length });
  } catch (e) {
    console.log(e);
  }
};
