import { Typography, Divider } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text, Link } = Typography;

export const About = () => {
  const { t } = useTranslation("about");
  return (
    <Typography
      style={{ maxWidth: "600px", margin: "auto", paddingTop: "50px" }}
    >
      <Title>{t("main-title")}</Title>
      <Paragraph>
        {t("para-1-1")}{" "}
        <a
          target="_blank"
          href="https://he.wikipedia.org/wiki/%D7%9E%D7%A8%D7%9B%D7%96_%D7%A1%D7%9C%D7%99%D7%A7%D7%94_%D7%91%D7%A0%D7%A7%D7%90%D7%99"
        >
          {t("para-1-link-1")}
        </a>
        {t("para-1-2")}{" "}
        <a target="_blank" href="https://www.masav.co.il/ts_download">
          {t("para-1-link-2")}
        </a>
      </Paragraph>
      <Paragraph>
        {t("para-2-1")}
        <ul>
          <li>
            <a target="_blank" href="https://www.npmjs.com/package/masav">
              {t("list-1-link")}
            </a>{" "}
            {t("list-1-text")}
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.npmjs.com/package/israeli-bank-autocomplete"
            >
              {t("list-2-link")}{" "}
            </a>{" "}
            {t("list-2-text")}
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.npmjs.com/package/israeli-bank-validation"
            >
              {t("list-3-link")}{" "}
            </a>{" "}
            {t("list-3-text")}
            <a
              target="_blank"
              href="https://www.masav.co.il/media/1982/bdikat_hukiot_heshbon_msv.pdf"
            >
              {t("list-3-link-2")}
            </a>
            .
          </li>
        </ul>
        <Text strong>{t("para-3-1")}</Text>
      </Paragraph>
      <Title level={2}>{t("sub-title")}</Title>
      <Paragraph>{t("para-4-1")}</Paragraph>
      <Paragraph>
        <Text strong>{t("para-5-1")}</Text>
      </Paragraph>
    </Typography>
  );
};
