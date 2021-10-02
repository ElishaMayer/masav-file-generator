import { Button, PageHeader, Modal, Space, Table, Tooltip, Upload } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
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

const ValidatedField = ({ text, tooltip, icon }) => {
  return (
    <Tooltip title={tooltip}>
      <span>
        {text}&nbsp;&nbsp;&nbsp;{icon}
      </span>
    </Tooltip>
  );
};

const columns = [
  {
    title: "Bank Details",
    dataIndex: "bankId",
    render: (bankId, { branchId, accountId }) => {
      const result = validateBankAccount(bankId, branchId, accountId);
      let icon = <ExclamationCircleOutlined style={{ color: "orange" }} />;
      let tooltip = "Account number coun't be verified";
      if (result === RESULT.NOT_VALID) {
        icon = <CloseCircleOutlined style={{ color: "red" }} />;
        tooltip = "Account number is not valid";
      }
      if (result === RESULT.VALID) {
        icon = <CheckCircleOutlined style={{ color: "green" }} />;
        tooltip = "Account number is valid";
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
    title: "Payee ID",
    dataIndex: "payeeId",
    render: (payeeId) => {
      const result = isIsraeliIdValid(payeeId);
      let icon = <CloseCircleOutlined style={{ color: "red" }} />;
      let tooltip = "ID number is not valid";
      if (result) {
        icon = <CheckCircleOutlined style={{ color: "green" }} />;
        tooltip = "ID number is valid";
      }
      return <ValidatedField text={payeeId} tooltip={tooltip} icon={icon} />;
    },
  },
  {
    title: "Payee Name",
    dataIndex: "payeeName",
  },
  {
    title: "Employee Number",
    dataIndex: "payeeNumber",
  },
  {
    title: "Amount",
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
      title: "Actions",
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
        title="Online Masav File Builder"
        subTitle="Edit and generate masav payment files"
      />
      <InstitutionForm
        onDataChange={setinstitution}
        onGenerateFileClick={() =>
          generateMasavFile({ institution, transactions })
        }
      />
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
          Delete All
        </Button>
        <Upload
          name="file"
          accept=".xlsx"
          showUploadList={false}
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.onload = async () => {
              const state = await uploadFromExcel(reader.result);
              settransactions((old) => [...old, ...state]);
            };
            reader.readAsArrayBuffer(file);
            reader.onerror = () =>
              Modal.error({
                title: "Error opening file",
                content: "Make sure it's a valid excel file",
              });
            return false;
          }}
        >
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<UploadOutlined />}
          >
            Import from Excel (xlsx)
          </Button>
        </Upload>
        <a download href="/example.xlsx">
          Example Excel File
        </a>
      </Space>
      <Table
        scroll={{ y: height - 422 }}
        dataSource={transactions}
        columns={[...columns, actionsColumn]}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell>Total</Table.Summary.Cell>
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
