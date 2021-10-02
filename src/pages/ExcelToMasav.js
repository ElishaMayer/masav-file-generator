import { Typography, Modal, Upload, Image } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { uploadFromExcel } from "../functions/uploadFromExcel";
const { Dragger } = Upload;

const { Title, Paragraph, Text, Link } = Typography;

export const ExcelToMasav = () => {
  const history = useHistory();
  return (
    <div>
      <Typography
        style={{ maxWidth: "600px", margin: "auto", paddingTop: "50px" }}
      >
        <Title>Import Transactions from Excel File</Title>
        <Paragraph>
          To import data from excel sheets make sure the excel has only one
          sheet and that the data is in the same format as the{" "}
          <a download href="/example.xlsx">
            Example Excel File
          </a>
        </Paragraph>
        <Image src="/excel-example.png" alt="Excel example screenshot" />
      </Typography>
      <Dragger
        style={{ width: "600px", margin: "auto", marginTop: "100px" }}
        name="file"
        accept=".xlsx"
        showUploadList={false}
        beforeUpload={(file) => {
          const reader = new FileReader();
          reader.onload = async () => {
            const state = await uploadFromExcel(reader.result);
            localStorage.setItem(
              "@online-editor/transactions-state",
              JSON.stringify(state)
            );
            history.push("/online-builder");
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
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Support only for xlsx file</p>
      </Dragger>
    </div>
  );
};
