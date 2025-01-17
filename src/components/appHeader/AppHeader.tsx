import { ReactElement } from "react";

import { Header } from "antd/es/layout/layout";

import s from "./appHeader.module.scss";

const AppHeader = (): ReactElement => {
  return (
    <Header>
      <h4 className={s.appHeaderTitle}>Github JS</h4>
    </Header>
  );
};

export default AppHeader;
