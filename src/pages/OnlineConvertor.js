import {
  Button,
  PageHeader,
  Modal,
  Space,
  Table,
  Tooltip,
  Upload,
  Switch,
} from "antd";
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
import { useWindowHeight, useWindowWidth } from "@react-hook/window-size";
import { generateMasavFile } from "../functions/generateMasavFile";
import { uploadFromExcel } from "../functions/uploadFromExcel";
import { useTranslation } from "react-i18next";
import { MOBILE_BREAK } from "../constants/constants";
import { showWarning } from "../functions/showWarning";
import { generateExcelFile } from "../functions/generateExcelFile";
import { saveInStorage } from "../functions/helpers";

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
  const width = useWindowWidth();
  const { t } = useTranslation("online-convertor");
  const modalRef = useRef();
  const [transactions, setTransactions] = useState(getTransactionFromStorage());
  const [institution, setInstitution] = useState(null);
  const [saveData, setSaveData] = useState(
    localStorage.getItem("@online-editor/save-data") !== "false"
  );
  useEffect(() => {
    localStorage.setItem(
      "@online-editor/save-data",
      saveData ? "true" : "false"
    );
    if (!saveData) {
      localStorage.removeItem("@online-editor/transactions-state");
      localStorage.removeItem("@online-editor/institution-state");
    }
  }, [saveData]);

  useEffect(() => {
    saveInStorage("transactions-state", JSON.stringify(transactions));
  }, [transactions]);
  const onFormFinishClick = useCallback(
    (fields, isEdit) => {
      if (isEdit) {
        setTransactions((state) =>
          state.map((trans) =>
            trans.key === isEdit ? { ...fields, key: isEdit } : trans
          )
        );
      } else {
        setTransactions((state) => [...state, { ...fields, key: v4() }]);
      }
    },
    [setTransactions, transactions]
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
              showWarning("about-to-delete-row").then((res) =>
                res
                  ? setTransactions((state) =>
                      state.filter((row) => row.key !== record.key)
                    )
                  : null
              )
            }
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Button>
        </>
      ),
    }),
    [setTransactions, modalRef]
  );

  return (
    <div>
      <PageHeader
        onBack={() => history.push("/")}
        title={t("title")}
        subTitle={t("sub-title")}
      />
      <InstitutionForm onDataChange={setInstitution} />
      <Space
        style={{
          gap: 0,
          width: "100%",
          minHeight: width > MOBILE_BREAK ? "80px" : "",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: width < MOBILE_BREAK ? "10px" : "",
        }}
      >
        <Button
          style={{ margin: "4px 0px" }}
          type="primary"
          size="large"
          shape="circle"
          onClick={() => modalRef.current.addRow()}
          icon={<PlusOutlined />}
        ></Button>
        <Button
          style={{ margin: "4px 0px" }}
          type="primary"
          size="large"
          shape="round"
          onClick={() =>
            showWarning("about-to-delete-all").then((res) =>
              res ? setTransactions([]) : null
            )
          }
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
            setTransactions((old) => [...old, ...state]);
            return false;
          }}
        >
          <Button
            style={{ margin: "4px 0px" }}
            type="primary"
            size="large"
            shape="round"
            icon={<UploadOutlined />}
          >
            {t("import-excel")}
          </Button>
        </Upload>
        <a style={{ margin: "4px 0px" }} download href="/example.xlsx">
          {t("example-file-link")}
        </a>
        <Button
          style={{ margin: "4px 0px" }}
          type="primary"
          size="large"
          shape="round"
          onClick={() => generateMasavFile({ institution, transactions }, t)}
          icon={<DownloadOutlined />}
        >
          {t("download-file-button")}
        </Button>
        <Button
          style={{ margin: "4px 0px" }}
          type="primary"
          size="large"
          shape="round"
          onClick={() => generateExcelFile(transactions, t)}
          icon={<DownloadOutlined />}
        >
          {t("download-excel-button")}
        </Button>
        <Tooltip title={t("save-offline-data-tooltip")}>
          <Switch
            checkedChildren={t("save-offline-data-true")}
            unCheckedChildren={t("save-offline-data-false")}
            checked={saveData}
            onChange={(checked) => setSaveData(checked)}
          />
        </Tooltip>
      </Space>
      <Table
        size="small"
        locale={{
          emptyText: (
            <Button
              onClick={() => modalRef.current.addRow()}
              icon={<PlusOutlined />}
              size="large"
              shape="round"
            >
              {t("add-new-transaction")}
            </Button>
          ),
        }}
        style={{ minWidth: width - 100 }}
        scroll={{ y: height - 0, x: 800 }}
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
