import { ReactElement } from "react";

import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

import AppHeader from "../appHeader/AppHeader";
import RepoList from "../repoList/RepoList";
import RepoFilters from "../repoFilters/RepoFilters";

import s from "./app.module.scss";

const App = (): ReactElement => {
  return (
    <Layout>
      <AppHeader />
      <Content className={s.content}>
        <RepoFilters />
        <RepoList />
      </Content>
    </Layout>
  );
};

export default App;
