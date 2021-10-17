import { Typography, Modal, Upload, Image } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { uploadFromExcel } from "../functions/uploadFromExcel";
import { useTranslation } from "react-i18next";
import { useWindowWidth } from "@react-hook/window-size";
import { hasLisence, isElectron } from "../isElectron";
import { useEffect, useState } from "react";
const { Dragger } = Upload;

const { Title, Paragraph, Text, Link } = Typography;

export const ExcelToMasav = () => {
  const [lisence, setlisence] = useState("PREMIUM");

  const history = useHistory();
  const width = useWindowWidth();
  const { t } = useTranslation("conver-from-excel");
  useEffect(() => {
    hasLisence().then(setlisence);
  }, []);
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
        {!isElectron && (
          <Image src="/excel-example.png" alt="Excel example screenshot" />
        )}
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
          let state = await uploadFromExcel(file, t);
          if (isElectron && lisence !== "PREMIUM" && state.length > 5) {
            state = state.slice(0, 5);
            Modal.warn({
              bodyStyle: { direction: t("translation:direction") },
              title: t("translation:free-version-warn-title"),
              content: t("translation:free-version-warn-desc"),
            });
          }
          localStorage.setItem(
            "@online-editor/transactions-state",
            JSON.stringify(state)
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
