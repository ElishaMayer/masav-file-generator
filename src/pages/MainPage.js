import { Typography, Divider, Button } from "antd";
import { DownloadOutlined, EditOutlined, FileExcelOutlined } from "@ant-design/icons";
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
          In the process of internal desktop applications development, many
          different design specs and implementations would be involved, which
          might cause designers and developers difficulties and duplication and
          reduce the efficiency of development.
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
