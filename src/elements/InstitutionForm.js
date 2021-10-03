import { Button, Form, Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";
import { useTranslation } from "react-i18next";

const layout = {
  labelCol: { span: 100 },
  wrapperCol: { span: 100 },
};

const defaultValues = {
  institutionId: "",
  institutionName: "",
  sendingInstitutionId: "",
  serialNumber: "001",
};

export const InstitutionForm = ({ onGenerateFileClick, onDataChange }) => {
  const { t } = useTranslation("online-convertor");
  const [form] = Form.useForm();
  const [institueDetals, setinstitueDetals] = useState({
    institutionId: "",
    institutionName: "",
    sendingInstitutionId: "",
    serialNumber: "001",
  });
  useEffect(() => {
    const institueDetals = JSON.parse(
      localStorage.getItem("@online-editor/institution-state") || "null"
    );
    onDataChange?.(institueDetals ? institueDetals : defaultValues);
    form.setFieldsValue(institueDetals ? institueDetals : defaultValues);
  }, []);

  useEffect(() => {
    if (!isEqual(institueDetals, defaultValues)) {
      onDataChange?.(institueDetals);
      localStorage.setItem(
        "@online-editor/institution-state",
        JSON.stringify(institueDetals)
      );
    }
  }, [institueDetals]);
  const onValuesChange = (_, values) => setinstitueDetals(values);
  const onSumbit = () => onGenerateFileClick?.(institueDetals);
  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      layout="inline"
      onValuesChange={onValuesChange}
    >
      <Form.Item
        name="institutionId"
        tooltip={{
          title: t("institution-id-tooltip"),
          icon: <InfoCircleOutlined />,
        }}
        label={t("institution-id-label")}
        rules={[
          { required: true, message: t("messages-field-is-required") },
          { len: 8, message: t("messages-8-digits") },
        ]}
      >
        <Input placeholder={t("institution-id-placeholder")} />
      </Form.Item>
      <Form.Item
        name="sendingInstitutionId"
        tooltip={{
          title: t("sending-institution-id-tooltip"),
          icon: <InfoCircleOutlined />,
        }}
        label={t("sending-institution-id-label")}
        rules={[
          { required: true, message: t("messages-field-is-required") },
          { len: 5, message: t("messages-5-digits") },
        ]}
      >
        <Input placeholder={t("sending-institution-id-palceholder")} />
      </Form.Item>
      <Form.Item
        name="institutionName"
        tooltip={{
          title: t("institution-name-tooltip"),
          icon: <InfoCircleOutlined />,
        }}
        label={t("institution-name-label")}
        rules={[
          { required: true, message: t("messages-field-is-required") },
          { max: 30, message: t("messages-max-30-digits") },
        ]}
      >
        <Input placeholder={t("institution-name-placeholder")} />
      </Form.Item>
      <Form.Item
        name="serialNumber"
        tooltip={{
          title: t("serial-number-tooltip"),
          icon: <InfoCircleOutlined />,
        }}
        label={t("serial-number-label")}
        rules={[
          { required: true, message: t("messages-field-is-required") },
          { len: 3, message: t("messages-3-digits") },
        ]}
      >
        <Input placeholder={t("serial-number-placeholder")} />
      </Form.Item>
    </Form>
  );
};
