import { Typography, Button, Modal, Upload } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPCID, hasLisence, isElectron, saveLisence } from "../isElectron";
import { useEffect, useState } from "react";

const { Title, Paragraph } = Typography;

const extractFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => resolve(reader.result);
    reader.readAsText(file);
    reader.onerror = (e) => reject(e);
  });

export const MainPage = () => {
  const [lisence, setlisence] = useState("PREMIUM");
  useEffect(() => {
    hasLisence().then(setlisence);
  }, []);
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
          {t("para-2")}
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
      {isElectron && lisence !== "PREMIUM" && (
        <>
          {" "}
          <div
            style={{
              display: "block",
              margin: "auto",
              width: "250px",
            }}
          >
            <Upload
              name="file"
              accept="*.*"
              showUploadList={false}
              beforeUpload={async (file) => {
                const cert = await extractFile(file);
                const res = await saveLisence(cert);
                if (!res) {
                  Modal.error({
                    title: t("invalid-lisence"),
                    okText: t("translation:ok"),
                    bodyStyle: { direction: t("translation:direction") },
                  });
                  return false;
                } else {
                  Modal.confirm({
                    title: t("lisence-added"),
                    content: t("do-you-want-to-reload-q"),
                    okText: t("translation:ok"),
                    cancelText: t("translation:cancel"),
                    bodyStyle: { direction: t("translation:direction") },
                    onOk() {
                      window.location.reload();
                    },
                  });
                }
                return false;
              }}
            >
              <Button
                style={{
                  display: "block",
                  margin: "auto",
                  width: "250px",
                  marginTop: "40px",
                }}
                type="primary"
                shape="round"
                size={"large"}
                icon={<UploadOutlined />}
              >
                {t("add-lisence")}
              </Button>
            </Upload>
          </div>
          <Typography
            style={{ maxWidth: "600px", margin: "auto", paddingTop: "5px" }}
          >
            <Paragraph>
              {t("add-lisence-explanation")}{" - "}
              <a
                onClick={async () => {
                  const uuid = await getPCID();
                  let link = document.createElement("a");
                  link.href = window.URL.createObjectURL(
                    new Blob([uuid], {
                      type: "application/octet-stream",
                    })
                  );
                  link.download = `certification`;
                  link.click();
                }}
              >
                {t("download-file")}
              </a>
            </Paragraph>
          </Typography>
        </>
      )}
    </div>
  );
};
