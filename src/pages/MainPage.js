import { Typography, Button } from "antd";
import { EditOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

export const MainPage = () => {
  const history = useHistory();
  const { t } = useTranslation("home-page");
  return (
    <div>
      <Typography
        style={{ maxWidth: "600px", margin: "auto", paddingTop: "50px" }}
      >
        <Title>{t("main-title")}</Title>
        <Paragraph>
          {t("para-1")}
          &nbsp;
          <a target="_blank" href="https://www.masav.co.il/">
            {t("masav")}
          </a>
          &nbsp; {t("para-2")}
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
        {t("online-editor")}
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
        {t("excel-to-masav-convertor")}
      </Button>
    </div>
  );
};
