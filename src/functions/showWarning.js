import { Modal } from "antd";
import i18next from "i18next";

export const showWarning = (message) =>
  new Promise((resolve) => {
    Modal.confirm({
      bodyStyle: { direction: i18next.t("direction") },
      title: i18next.t("warning"),
      content: i18next.t(message),
      okText: i18next.t("ok"),
      cancelText: i18next.t("cancel"),
      onOk() {
        resolve(true);
      },
      onCancel() {
        resolve(false);
      },
    });
  });
