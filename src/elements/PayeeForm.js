import { AutoComplete, Button, Form, Input, InputNumber, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  getAutocompleteSuggestions,
  getAllBanks,
  getAllBranches,
} from "israeli-bank-autocomplete";
import isIsraeliIdValid from "israeli-id-validator";
import { validateBankAccount, RESULT } from "israeli-bank-validation";
import Modal from "antd/lib/modal/Modal";
import { useWindowHeight } from "@react-hook/window-size";

const bankOptions = getAllBanks().map((bank) => ({
  label: `${bank.bankCode} - ${bank.bankName}`,
  value: String(bank.bankCode),
}));

const layout = {
  labelCol: { span: 100 },
  wrapperCol: { span: 100 },
};

const areFieldsValid = ({
  accountId,
  amount,
  bankId,
  branchId,
  payeeId,
  payeeName,
}) => {
  if (isNaN(parseInt(bankId)) || parseInt(bankId) < 0 || parseInt(bankId) > 99)
    return false;
  if (
    isNaN(parseInt(branchId)) ||
    parseInt(branchId) < 0 ||
    parseInt(branchId) > 999
  )
    return false;
  if (isNaN(parseInt(accountId)) || accountId.length > 9) return false;
  if (isNaN(parseInt(payeeId)) || payeeId.length > 9) return false;
  if (isNaN(parseInt(amount)) || parseInt(amount) < 0) return false;
  if (!payeeName || payeeName.length > 16) return false;
  return true;
};

export const PayeeForm = forwardRef(({ onFormFinishClick }, ref) => {
  const [isEdit, setisEdit] = useState('');
  const [branchoptions, setbranchoptions] = useState([]);
  const [modalOpen, setmodalOpen] = useState(false);
  const height = useWindowHeight();
  const [form] = Form.useForm();
  const [fieldsValid, setfieldsValid] = useState(false);

  const onSearch = (searchText) => {
    const bankId = form.getFieldValue("bankId");
    const options = getAutocompleteSuggestions(searchText, {
      bankCode: bankId ? parseInt(bankId) : null,
      inputType: "BRANCH_CODE",
    }).map((branch) => ({
      value: branch.branchCode,
      label: `${branch.branchCode} - ${branch.city}, ${branch.branchAddress}`,
    }));
    setbranchoptions(
      options.length && searchText
        ? options
        : [{ label: searchText, value: searchText }]
    );
  };
  const onSumbit = useCallback(() => {
    setmodalOpen(false);
    onFormFinishClick?.(form.getFieldsValue(), isEdit);
  }, [isEdit, form, onFormFinishClick]);

  useImperativeHandle(ref, () => ({
    updateRow: (row) => {
      setisEdit(row.key);
      setfieldsValid(areFieldsValid(row));
      form.setFieldsValue(row);
      setmodalOpen(true);
    },
    addRow: () => {
      setisEdit("");
      setfieldsValid(false);
      form.resetFields();
      setmodalOpen(true);
    },
  }));

  return (
    <Modal
      onCancel={() => {
        form.resetFields();
        setmodalOpen(false);
      }}
      bodyStyle={{ maxHeight: height - 170, overflowY: "auto" }}
      title={isEdit ? "Edit Transaction Details" : "Add Transaction Details"}
      visible={modalOpen}
      footer={null}
    >
      <Form
        {...layout}
        onValuesChange={(_, values) => setfieldsValid(areFieldsValid(values))}
        form={form}
        name="control-hooks"
        layout="vertical"
      >
        <Form.Item
          name="bankId"
          tooltip={{
            title: "The bank Name / ID",
            icon: <InfoCircleOutlined />,
          }}
          label="Bank ID"
          rules={[{ required: true }]}
        >
          <Select options={bankOptions} placeholder="Select bank" />
        </Form.Item>
        <Form.Item
          name="branchId"
          tooltip={{
            title: "The branch ID",
            icon: <InfoCircleOutlined />,
          }}
          label="Branch ID"
          rules={[
            { required: true },
            { max: 3, message: "Can't be longer than 3 digits" },
          ]}
        >
          <AutoComplete
            options={branchoptions}
            onSearch={onSearch}
            placeholder="Start typing branch number"
          />
        </Form.Item>
        <Form.Item
          name="accountId"
          tooltip={{
            title: "The payee's bank account number",
            icon: <InfoCircleOutlined />,
          }}
          label="Account Number"
          rules={[
            { required: true },
            { max: 9, message: "Can't be longer than 9 digits" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const bankId = getFieldValue("bankId");
                const branchId = getFieldValue("branchId");
                const result = validateBankAccount(
                  bankId,
                  branchId,
                  value || ""
                );
                if (!value || result !== RESULT.NOT_VALID) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "The bank details looks invalid. Make sure to check it"
                  )
                );
              },
            }),
          ]}
        >
          <Input placeholder="000000" />
        </Form.Item>
        <Form.Item
          name="payeeId"
          tooltip={{
            title: "The payee's personal ID",
            icon: <InfoCircleOutlined />,
          }}
          label="Payee ID"
          required
          rules={[
            { max: 9, message: "Can't be longer than 9 digits" },
            () => ({
              validator(_, value) {
                const valid = isIsraeliIdValid(value);
                if (!value || valid) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The ID is not a valid ID!"));
              },
            }),
          ]}
        >
          <Input placeholder="000000000" />
        </Form.Item>
        <Form.Item
          name="payeeName"
          tooltip={{
            title: "The payee's name (Should be in Hebrew)",
            icon: <InfoCircleOutlined />,
          }}
          label="Payee Name"
          rules={[
            { required: true },
            { max: 16, message: "Can't be longer than 16 characters" },
          ]}
        >
          <Input placeholder="Enter payee name" />
        </Form.Item>
        <Form.Item
          name="payeeNumber"
          tooltip={{
            title: "The payee's employee number",
            icon: <InfoCircleOutlined />,
          }}
          label="Payee Employee Number"
          rules={[{ max: 20, message: "Can't be longer than 20 digits" }]}
        >
          <Input placeholder="0000" />
        </Form.Item>
        <Form.Item
          name="amount"
          tooltip={{
            title:
              "Amount to transfer in ILS (₪) (Up to 2 digits after decimal)",
            icon: <InfoCircleOutlined />,
          }}
          label="Amount (₪)"
          rules={[{ required: true }]}
        >
          <InputNumber placeholder="0.00 ₪" />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={!fieldsValid}
            onClick={onSumbit}
            type="primary"
            shape="round"
            htmlType="button"
          >
            {isEdit ? "Save Changes" : "Add Transaction"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
});
