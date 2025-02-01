import { useAppSelector } from "../../hooks/hooks";

import { Header } from "antd/es/layout/layout";
import Link from "antd/es/typography/Link";

import Title from "antd/es/typography/Title";

import s from "./appHeader.module.scss";

const AppHeader: React.FC = () => {
  const filterActive = useAppSelector(state => state.repo.sortBy)
  return (
    <Header className={s.appHeader}>
      <Link className={s.appHeaderTitle} href="/">GitJS</Link>
      <Title className={s.appHeaderFilter} level={3}>{filterActive}</Title>
    </Header>
  );
};

export default AppHeader;
