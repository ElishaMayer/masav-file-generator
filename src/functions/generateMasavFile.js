import { Modal } from "antd";
import {
  InstitutionSendPayment,
  MasaVSendPayments,
  SendPaymentsRecord,
} from "masav";
import moment from "moment";

export const generateMasavFile = ({ institution, transactions }) => {
  const messages = [];
  if (!institution.institutionId.match(/^\d{8}$/))
    messages.push("Invalid insitution ID");
  if (!institution.institutionName.match(/^.{1,30}$/))
    messages.push("Invalid insitution Name");
  if (!institution.sendingInstitutionId.match(/^\d{5}$/))
    messages.push("Invalid insitution sending ID");
  if (!institution.serialNumber.match(/^\d{3}$/))
    messages.push("Invalid serial number");
  if (!transactions.length) messages.push("No transactions");
  transactions.forEach(
    ({ accountId, amount, bankId, branchId, payeeId, payeeName }, i) => {
      if (!accountId.match(/^\d{1,9}$/))
        messages.push(`In row number ${i + 1} bank account is not valid`);
      if (isNaN(amount) || amount <= 0)
        messages.push(`In row number ${i + 1} amount is not valid`);
      if (!bankId.match(/^\d{1,2}$/))
        messages.push(`In row number ${i + 1} bank ID is not valid`);
      if (!branchId.match(/^\d{1,3}$/))
        messages.push(`In row number ${i + 1} branch ID is not valid`);
      if (!payeeId.match(/^\d{1,9}$/))
        messages.push(`In row number ${i + 1} payee ID is not valid`);
      if (!payeeName.match(/^.{0,16}$/))
        messages.push(`In row number ${i + 1} payee name is not valid`);
    }
  );
  if (messages.length) {
    Modal.error({
      title: "Sorry there are some errors",
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
  var blob = new Blob([masavFile.toBuffer()], { type: "application/masav" });
  var link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `msv.${institution.serialNumber}`;
  link.click();
  window.firebase.analytics().logEvent("file_generated");
};
