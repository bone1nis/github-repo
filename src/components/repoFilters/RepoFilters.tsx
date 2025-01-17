import { ReactElement } from "react";

import { Select } from "antd";
import { useAppDispatch } from "../../hooks/hooks";
import { setSortBy } from "../../store/repoSlice";

import s from "./repoFilters.module.scss";

const RepoFilters = (): ReactElement => {
  const dispatch = useAppDispatch();

  const handleChange = (e: string) => {
    dispatch(setSortBy(e));
  };

  return (
    <Select
      placeholder="Select a sort"
      className={s.repoSort}
      onChange={handleChange}
      defaultValue={"stars"}
      options={[
        { value: "stars", label: "Stars" },
        { value: "updated", label: "Updated" },
      ]}
    />
  );
};

export default RepoFilters;
