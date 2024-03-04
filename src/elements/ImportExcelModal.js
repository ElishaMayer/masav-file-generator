import { AutoComplete, Button, Form, Input, InputNumber, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import {

  useState,
} from "react";
import { useTranslation } from "react-i18next";

const layout = {
  labelCol: { span: 100 },
  wrapperCol: { span: 100 },
};

export const ImportExcelModal = ({ sheets, onSubmit }) => {
  const { t } = useTranslation("online-convertor");
  const [fieldsValid, setFieldsValid] = useState({
    mapTransactions: sheets[0],
    mapInstitution: sheets[1],
  });

  console.log(fieldsValid);

  const sheetOptions = sheets.map((sheet) => ({ label: sheet, value: sheet }));
  return (
    <Form
      {...layout}
      onValuesChange={(_, values) => setFieldsValid(values)}
      initialValues={fieldsValid}
      name="control-hooks"
      layout="vertical"
    >
      <Form.Item
        name="mapTransactions"
        tooltip={{
          title: t("map-transactions-tooltip"),
          icon: <InfoCircleOutlined />,
        }}
        label={t("map-transactions-label")}
        rules={[{ required: true, message: t("messages-field-is-required") }]}
      >
        <Select
          options={sheetOptions}
          placeholder={t("map-transactions-placeholder")}
        />
      </Form.Item>
      <Form.Item
        name="mapInstitution"
        tooltip={{
          title: t("map-institution-tooltip"),
          icon: <InfoCircleOutlined />,
        }}
        label={t("map-institution-label")}
      >
        <Select
          options={sheetOptions}
          placeholder={t("map-institution-placeholder")}
        />
      </Form.Item>
      <Form.Item>
        <Button
          disabled={!fieldsValid.mapTransactions}
          onClick={() => onSubmit(fieldsValid)}
          type="primary"
          shape="round"
          htmlType="button"
        >
          {t(`import-excel-map-button`)}
        </Button>
      </Form.Item>
    </Form>
  );
};
