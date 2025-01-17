import { ReactElement, useEffect, useRef, useState } from "react";
import { Flex } from "antd";

import { fetchRepoList, removeRepo, setRepo } from "../../store/repoSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import { IRepo } from "../../types/types";

import RepoCard from "../repoCard/RepoCard";

import s from "./repoList.module.scss";

const RepoList = (): ReactElement => {
  const dispatch = useAppDispatch();

  const repoList = useAppSelector((state) => state.repo.repoList);
  const loading = useAppSelector((state) => state.repo.loadingStatus);
  const sortBy = useAppSelector((state) => state.repo.sortBy);

  const lastRepoRef = useRef<HTMLDivElement | null>(null);
  const pageNumberRef = useRef<number>(1);

  const [lastRequestTime, setLastRequestTime] = useState(0);

  useEffect(() => {
    pageNumberRef.current = 1;

    dispatch(fetchRepoList(pageNumberRef.current));

    pageNumberRef.current += 1;
  }, [sortBy]);

  useEffect(() => {
    if (loading !== "loading") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const currentTime = Date.now();

            if (currentTime - lastRequestTime >= 2000) {
              dispatch(fetchRepoList(pageNumberRef.current));
              pageNumberRef.current += 1;

              setLastRequestTime(currentTime);
            }
          }
        },
        { rootMargin: "100px" }
      );

      if (lastRepoRef.current) {
        observer.observe(lastRepoRef.current);
      }

      return () => {
        if (lastRepoRef.current) {
          observer.unobserve(lastRepoRef.current);
        }
      };
    }
  }, [loading]);

  const handleRemove = (id: number) => {
    dispatch(removeRepo(id));
  };

  const handleSubmit = (repo: IRepo) => {
    dispatch(setRepo(repo));
  };

  const renderCards = (arr: IRepo[]) => {
    return arr.map((repo: IRepo, i: number) => {
      const isLast = i === arr.length - 1;

      return (
        <div ref={isLast ? lastRepoRef : null} key={repo.id}>
          <RepoCard
            key={repo.id}
            repo={repo}
            onRemove={() => handleRemove(repo.id)}
            onSubmit={handleSubmit}
          />
        </div>
      );
    });
  };

  const content = (loading === "idle" || loading === "loading") && (
    <Flex align="middle" justify="center" gap="middle" wrap={true}>
      {renderCards(repoList)}
    </Flex>
  );

  const spinner = loading === "loading" && (
    <div className={s.repoListLoading}>... загрузка ...</div>
  );

  const error = loading === "error" && (
    <div className={s.repoListError}>... упс, произошла ошибка ...</div>
  );

  return (
    <>
      {content}
      {error}
      {spinner}
    </>
  );
};

export default RepoList;
