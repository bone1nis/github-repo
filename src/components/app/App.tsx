import { ReactElement } from "react";

import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

import AppHeader from "../appHeader/AppHeader";
import RepoList from "../repoList/RepoList";
import RepoFilters from "../repoFilters/RepoFilters";

const App = (): ReactElement => {
  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: "50px" }}>
        <RepoFilters />
        <RepoList />
      </Content>
    </Layout>
  );
};

export default App;
