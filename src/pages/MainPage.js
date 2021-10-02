import { Typography, Divider, Button } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";

const { Title, Paragraph, Text, Link } = Typography;

export const MainPage = () => {
  const history = useHistory();
  return (
    <div>
      <Typography
        style={{ maxWidth: "600px", margin: "auto", paddingTop: "50px" }}
      >
        <Title>Wellcome to Masav Online File Generator</Title>
        <Paragraph>
          When transferring money to multiple people, it's recommended to use
          &nbsp;
          <a target="_blank" href="https://www.masav.co.il/">
            Masav
          </a>
          &nbsp; to transfer money. The problem is that Masav accepts only a
          binary file with the records. Most CRM programs in Israel can export
          this file, but without such a program, it can be complicated. This
          website can help you build them with the online editor, or converting
          from excel files.
        </Paragraph>
      </Typography>
      <Button
        type="primary"
        shape="round"
        onClick={() => history.push("/online-builder")}
        icon={<EditOutlined />}
        style={{
          display: "block",
          margin: "auto",
          width: "250px",
          marginTop: "40px",
        }}
        size={"large"}
      >
        Online Editor
      </Button>
      <Button
        style={{
          display: "block",
          margin: "auto",
          width: "250px",
          marginTop: "40px",
        }}
        onClick={() => history.push("/convert-excel")}
        type="primary"
        shape="round"
        icon={<FileExcelOutlined />}
        size={"large"}
      >
        Excel to Masav Convertor
      </Button>
    </div>
  );
};
