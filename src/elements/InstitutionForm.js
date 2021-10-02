import { Button, Form, Input } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";

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
          title: "The institution Id ( Given by Masav ) 8 digits",
          icon: <InfoCircleOutlined />,
        }}
        label="Institution Id"
        rules={[
          { required: true },
          { len: 8, message: "Should be 8 digits long" },
        ]}
      >
        <Input placeholder="00000000" />
      </Form.Item>
      <Form.Item
        name="sendingInstitutionId"
        tooltip={{
          title: "The sending institution Id ( Given by Masav ) 5 digits",
          icon: <InfoCircleOutlined />,
        }}
        label="Sending Institution Id"
        rules={[
          { required: true },
          { len: 5, message: "Should be 5 digits long" },
        ]}
      >
        <Input placeholder="00000" />
      </Form.Item>
      <Form.Item
        name="institutionName"
        tooltip={{
          title: "The institution name as subscribed in masav",
          icon: <InfoCircleOutlined />,
        }}
        label="Institution Name"
        rules={[
          { required: true },
          { max: 30, message: "Can't be longer than 30 characters" },
        ]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        name="serialNumber"
        tooltip={{
          title: "The record serial number",
          icon: <InfoCircleOutlined />,
        }}
        label="Serial Number"
        rules={[
          { required: true },
          { len: 3, message: "Should be 3 digits long" },
        ]}
      >
        <Input placeholder="001" />
      </Form.Item>
      <Form.Item>
        <Button
          onClick={onSumbit}
          type="primary"
          shape="round"
          htmlType="button"
        >
          Download Masav File
        </Button>
      </Form.Item>
    </Form>
  );
};
