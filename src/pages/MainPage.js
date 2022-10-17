import { Typography, Button } from "antd";
import { EditOutlined, FileExcelOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWindowWidth } from "@react-hook/window-size";
import { MOBILE_BREAK } from "../constants/constants";

const { Title, Paragraph } = Typography;

export const MainPage = () => {
  const history = useHistory();
  const { t } = useTranslation("home-page");
  const width = useWindowWidth();
  const isMobile = MOBILE_BREAK > width;
  return (
    <div>
      <Typography
        style={{ maxWidth: "600px", margin: "auto", paddingTop: "20px" }}
      >
        <img
          style={{ height: "135px", margin: "auto", display: "block" }}
          src={"/LogoBig.svg"}
        />
        <Title style={{ fontSize: "24px" }}>{t("main-title")}</Title>
        <Paragraph>
          {t("para-1")}
          &nbsp;
          <a target="_blank" href="https://www.masav.co.il/">
            {t("masav")}
          </a>
          {t("para-2")}
        </Paragraph>
      </Typography>
      <div
        style={{
          display: "flex",
          height: isMobile ? "110px" : undefined,
          maxWidth: "600px",
          margin: "auto",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          marginTop: "40px",
        }}
      >
        <Button
          type="primary"
          shape="round"
          onClick={() => history.push("/online-builder")}
          icon={<EditOutlined />}
          style={{
            display: "block",
            width: "250px",
          }}
          size={"large"}
        >
          {t("online-editor")}
        </Button>
        <Button
          style={{
            display: "block",
            width: "250px",
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
    </div>
  );
};
