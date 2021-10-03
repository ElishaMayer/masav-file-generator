import { Button, PageHeader, Modal, Space, Table, Tooltip, Upload } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InstitutionForm } from "../elements/InstitutionForm";
import { PayeeForm } from "../elements/PayeeForm";
import { v4 } from "uuid";
import { RESULT, validateBankAccount } from "israeli-bank-validation";
import isIsraeliIdValid from "israeli-id-validator";
import { useWindowHeight } from "@react-hook/window-size";
import { generateMasavFile } from "../functions/generateMasavFile";
import { uploadFromExcel } from "../functions/uploadFromExcel";
import { useTranslation } from "react-i18next";

const ValidatedField = ({ text, tooltip, icon }) => {
  return (
    <Tooltip title={tooltip}>
      <span>
        {text}&nbsp;&nbsp;&nbsp;{icon}
      </span>
    </Tooltip>
  );
};

const columns = (t) => [
  {
    title: t("bank-details"),
    dataIndex: "bankId",
    render: (bankId, { branchId, accountId }) => {
      const result = validateBankAccount(bankId, branchId, accountId);
      let icon = <ExclamationCircleOutlined style={{ color: "orange" }} />;
      let tooltip = t("messages-unvalidated-account");
      if (result === RESULT.NOT_VALID) {
        icon = <CloseCircleOutlined style={{ color: "red" }} />;
        tooltip = t("messages-invalid-account");
      }
      if (result === RESULT.VALID) {
        icon = <CheckCircleOutlined style={{ color: "green" }} />;
        tooltip = t("messages-valid-account");
      }
      return (
        <ValidatedField
          text={`${bankId}-${branchId}-${accountId}`}
          tooltip={tooltip}
          icon={icon}
        />
      );
    },
  },
  {
    title: t("payee-id"),
    dataIndex: "payeeId",
    render: (payeeId) => {
      const result = isIsraeliIdValid(payeeId);
      let icon = <CloseCircleOutlined style={{ color: "red" }} />;
      let tooltip = t("messages-invalid-id");
      if (result) {
        icon = <CheckCircleOutlined style={{ color: "green" }} />;
        tooltip = t("messages-valid-id");
      }
      return <ValidatedField text={payeeId} tooltip={tooltip} icon={icon} />;
    },
  },
  {
    title: t("payee-name"),
    dataIndex: "payeeName",
  },
  {
    title: t("employee-number"),
    dataIndex: "payeeNumber",
  },
  {
    title: t("amount"),
    dataIndex: "amount",
    render: (amount) =>
      `${new Intl.NumberFormat("il-IL", {
        style: "currency",
        currency: "ILS",
      }).format(amount)}`,
  },
];
const getTransactionFromStorage = () => {
  return JSON.parse(
    localStorage.getItem("@online-editor/transactions-state") || "[]"
  );
};
export const OnlineConvertor = () => {
  const height = useWindowHeight();
  const { t } = useTranslation("online-convertor");
  const modalRef = useRef();
  const [transactions, settransactions] = useState(getTransactionFromStorage());
  const [institution, setinstitution] = useState(null);
  useEffect(() => {
    localStorage.setItem(
      "@online-editor/transactions-state",
      JSON.stringify(transactions)
    );
  }, [transactions]);
  const onFormFinishClick = useCallback(
    (fields, isEdit) => {
      if (isEdit) {
        settransactions((state) =>
          state.map((trans) =>
            trans.key === isEdit ? { ...fields, key: isEdit } : trans
          )
        );
      } else {
        settransactions((state) => [...state, { ...fields, key: v4() }]);
      }
    },
    [settransactions, transactions]
  );
  const history = useHistory();

  const actionsColumn = useMemo(
    () => ({
      title: t("actions"),
      dataIndex: "actions",
      width: "150px",
      render: (_, record) => (
        <>
          <Button
            type="text"
            onClick={() => modalRef.current.updateRow(record)}
          >
            <EditOutlined style={{ color: "orange" }} />
          </Button>
          <Button
            type="text"
            onClick={() =>
              settransactions((state) =>
                state.filter((row) => row.key !== record.key)
              )
            }
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Button>
        </>
      ),
    }),
    [settransactions, modalRef]
  );

  return (
    <div>
      <PageHeader
        onBack={() => history.push("/")}
        title={t("title")}
        subTitle={t("sub-title")}
      />
      <InstitutionForm onDataChange={setinstitution} />
      <Space style={{ width: "100%", height: "80px" }}>
        <Button
          type="primary"
          size="large"
          shape="circle"
          onClick={() => modalRef.current.addRow()}
          icon={<PlusOutlined />}
        ></Button>
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={() => settransactions([])}
          icon={<DeleteOutlined />}
        >
          {t("delete-all-button")}
        </Button>
        <Upload
          name="file"
          accept=".xlsx"
          showUploadList={false}
          beforeUpload={async (file) => {
            const state = await uploadFromExcel(file, t);
            settransactions((old) => [...old, ...state]);
            return false;
          }}
        >
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<UploadOutlined />}
          >
            {t("import-excel")}
          </Button>
        </Upload>
        <a download href="/example.xlsx">
          {t("example-file-link")}
        </a>
        <Button
          type="primary"
          size="large"
          shape="round"
          onClick={() => generateMasavFile({ institution, transactions }, t)}
          icon={<DownloadOutlined />}
        >
          {t("download-file-button")}
        </Button>
      </Space>
      <Table
        style={{ minWidth: "800px" }}
        scroll={{ y: height - 386 }}
        dataSource={transactions}
        columns={[...columns(t), actionsColumn]}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell>{t("total")}</Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell></Table.Summary.Cell>
            <Table.Summary.Cell>
              {new Intl.NumberFormat("il-IL", {
                style: "currency",
                currency: "ILS",
              }).format(
                transactions
                  .map((trans) => trans.amount)
                  .reduce((a, b) => a + b, 0)
              )}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <PayeeForm ref={modalRef} onFormFinishClick={onFormFinishClick} />
    </div>
  );
};
