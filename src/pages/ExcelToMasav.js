import { Typography, Upload, Image } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { uploadFromExcel } from "../functions/uploadFromExcel";
import { useTranslation } from "react-i18next";
import { useWindowWidth } from "@react-hook/window-size";
import { isElectron } from "../isElectron";
import { saveInStorageAlways } from "../functions/helpers";
const { Dragger } = Upload;

const { Title, Paragraph, Text, Link } = Typography;

export const ExcelToMasav = () => {
  const history = useHistory();
  const width = useWindowWidth();

  const { t } = useTranslation("convert-from-excel");

  return (
    <div>
      <Typography
        style={{ maxWidth: "600px", margin: "auto", paddingTop: "50px" }}
      >
        <Title>{t("main-title")}</Title>
        <Paragraph>
          {t("para-1")}{" "}
          <a download href="/example.xlsx">
            {t("para-2")}
          </a>
        </Paragraph>
        <Image src="/excel-example.png" alt="Excel example screenshot" />
      </Typography>
      <Dragger
        style={{
          width: `${Math.min(width - 100, 600)}px`,
          margin: "auto",
          marginTop: "100px",
        }}
        name="file"
        accept=".xlsx"
        showUploadList={false}
        beforeUpload={async (file) => {
          let { transactions, institution } = await uploadFromExcel(file, t);
          saveInStorageAlways(
            "transactions-state",
            JSON.stringify(transactions)
          );
          if (institution)
            saveInStorageAlways(
              "institution-state",
              JSON.stringify(institution)
            );
          history.push("/online-builder");
          return false;
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t("dragger-title")}</p>
        <p className="ant-upload-hint">{t("dragger-description")}</p>
      </Dragger>
    </div>
  );
};
