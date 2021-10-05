import { Modal } from "antd";
import {
  InstitutionSendPayment,
  MasaVSendPayments,
  SendPaymentsRecord,
} from "masav";
import moment from "moment";
import { getAnalytics, logEvent } from "firebase/analytics";
import JSZip from "jszip";

export const generateMasavFile = ({ institution, transactions }, t) => {
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
