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
import { useWindowHeight, useWindowWidth } from "@react-hook/window-size";
import { useTranslation } from "react-i18next";
import { MOBILE_BREAK } from "../constants/constants";

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
  const { t } = useTranslation("online-convertor");
  const [isEdit, setIsEdit] = useState("");
  const [branchOptions, setBranchOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const height = useWindowHeight();
  const width = useWindowWidth();

  const [form] = Form.useForm();
  const [fieldsValid, setFieldsValid] = useState(false);

  const onSearch = (searchText) => {
    const bankId = form.getFieldValue("bankId");
    const options = getAutocompleteSuggestions(searchText, {
      bankCode: bankId ? parseInt(bankId) : null,
      inputType: "BRANCH_CODE",
    }).map((branch) => ({
      value: branch.branchCode,
      label: `${branch.branchCode} - ${branch.city}, ${branch.branchAddress}`,
    }));
    setBranchOptions(
      options.length && searchText
        ? options
        : [{ label: searchText, value: searchText }]
    );
  };
  const onSubmit = useCallback(() => {
    setModalOpen(false);
    onFormFinishClick?.(form.getFieldsValue(), isEdit);
  }, [isEdit, form, onFormFinishClick]);

  useImperativeHandle(ref, () => ({
    updateRow: (row) => {
      setIsEdit(row.key);
      setFieldsValid(areFieldsValid(row));
      form.setFieldsValue(row);
      setModalOpen(true);
    },
    addRow: () => {
      setIsEdit("");
      setFieldsValid(false);
      form.resetFields();
      setModalOpen(true);
    },
  }));
  return (
    <Modal
      className="full-screen"
      onCancel={() => {
        form.resetFields();
        setModalOpen(false);
      }}
      style={{ top: 20 }}
      bodyStyle={{
        maxHeight: height - (width < MOBILE_BREAK ? 20 : 100),
        overflowY: "auto",
      }}
      title={t(`employee-form-${isEdit ? "edit" : "add"}-title`)}
      visible={modalOpen}
      footer={null}
    >
      <Form
        {...layout}
        onValuesChange={(_, values) => setFieldsValid(areFieldsValid(values))}
        form={form}
        name="control-hooks"
        layout="vertical"
      >
        <Form.Item
          name="bankId"
          tooltip={{
            title: t("bank-id-tooltip"),
            icon: <InfoCircleOutlined />,
          }}
          label={t("bank-id-label")}
          rules={[{ required: true, message: t("messages-field-is-required") }]}
        >
          <Select
            options={bankOptions}
            placeholder={t("bank-id-placeholder")}
          />
        </Form.Item>
        <Form.Item
          name="branchId"
          tooltip={{
            title: t("branch-id-tooltip"),
            icon: <InfoCircleOutlined />,
          }}
          label={t("branch-id-label")}
          rules={[
            { required: true, message: t("messages-field-is-required") },
            { max: 3, message: t("messages-max-3-digits") },
          ]}
        >
          <AutoComplete
            options={branchOptions}
            onSearch={onSearch}
            placeholder={t("branch-id-placeholder")}
          />
        </Form.Item>
        <Form.Item
          name="accountId"
          tooltip={{
            title: t("account-id-tooltip"),
            icon: <InfoCircleOutlined />,
          }}
          label={t("account-id-label")}
          rules={[
            { required: true, message: t("messages-field-is-required") },
            { max: 9, message: t("messages-max-9-digits") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const bankId = getFieldValue("bankId");
                const branchId = getFieldValue("branchId");
                const result = validateBankAccount(
                  bankId || "",
                  branchId || "",
                  value || ""
                );
                if (!value || result !== RESULT.NOT_VALID) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t("messages-invalid-bank-details"))
                );
              },
            }),
          ]}
        >
          <Input placeholder={t("account-id-placeholder")} />
        </Form.Item>
        <Form.Item
          name="payeeId"
          tooltip={{
            title: t("payee-id-tooltip"),
            icon: <InfoCircleOutlined />,
          }}
          label={t("payee-id-label")}
          required
          rules={[
            { required: true, message: t("messages-field-is-required") },
            { max: 9, message: t("messages-max-9-digits") },
            () => ({
              validator(_, value) {
                const valid = isIsraeliIdValid(value);
                if (!value || valid) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("messages-invalid-id")));
              },
            }),
          ]}
        >
          <Input placeholder={t("payee-id-placeholder")} />
        </Form.Item>
        <Form.Item
          name="payeeName"
          tooltip={{
            title: t("payee-name-tooltip"),
            icon: <InfoCircleOutlined />,
          }}
          label={t("payee-name-label")}
          rules={[
            { required: true, message: t("messages-field-is-required") },
            { max: 16, message: t("messages-max-16-digits") },
          ]}
        >
          <Input placeholder={t("payee-name-placeholder")} />
        </Form.Item>
        <Form.Item
          name="payeeNumber"
          tooltip={{
            title: t("employee-number-tooltip"),
            icon: <InfoCircleOutlined />,
          }}
          label={t("employee-number-label")}
          rules={[{ max: 20, message: t("messages-max-20-digits") }]}
        >
          <Input placeholder={t("employee-number-placeholder")} />
        </Form.Item>
        <Form.Item
          name="amount"
          tooltip={{
            title: t("amount-tooltip"),
            icon: <InfoCircleOutlined />,
          }}
          label={t("amount-label")}
          rules={[{ required: true, message: t("messages-field-is-required") }]}
        >
          <InputNumber placeholder={t("amount-placeholder")} />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={!fieldsValid}
            onClick={onSubmit}
            type="primary"
            shape="round"
            htmlType="button"
          >
            {t(`employee-form-${isEdit ? "edit" : "add"}-button`)}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
});
