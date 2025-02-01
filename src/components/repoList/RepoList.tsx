import { useEffect, useRef, useState } from "react";
import { Alert, Flex, Spin } from "antd";

import { fetchRepoList, removeRepo, setRepo } from "../../store/repoSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import { IRepo } from "../../types/types";

import RepoCard from "../repoCard/RepoCard";

import s from "./repoList.module.scss";

const RepoList: React.FC = () => {
  const dispatch = useAppDispatch();

  const repoList = useAppSelector((state) => state.repo.repoList);
  const loading = useAppSelector((state) => state.repo.loadingStatus);
  const sortBy = useAppSelector((state) => state.repo.sortBy);

  const lastRepoRef = useRef<HTMLDivElement | null>(null);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  useEffect(() => {
    dispatch(fetchRepoList(pageNumber));

    setPageNumber((prev) => (prev += 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, dispatch]);

  useEffect(() => {
    if (loading === "loading") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const currentTime = Date.now();
          const timeDiff = currentTime - lastRequestTime;

          if (timeDiff < 2000) {
            const delay = 2000 - timeDiff;

            const timeoutId = setTimeout(() => {
              dispatch(fetchRepoList(pageNumber));
              setPageNumber((prev) => (prev += 1));
              setLastRequestTime(Date.now());
            }, delay);

            return () => clearTimeout(timeoutId);
          } else {
            dispatch(fetchRepoList(pageNumber));
            setPageNumber((prev) => (prev += 1));
            setLastRequestTime(Date.now());
          }
        }
      },
      { rootMargin: "100px" }
    );

    const currentLastRepoRef = lastRepoRef.current;

    if (currentLastRepoRef) {
      observer.observe(currentLastRepoRef);
    }

    return () => {
      if (currentLastRepoRef) {
        observer.unobserve(currentLastRepoRef);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, dispatch]);

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
    <Spin className={s.repoListLoading} />
  );

  const error = loading === "error" && (
    <Alert
      message="Ошибка"
      description="Не удалось загрузить репозитории"
      type="error"
      showIcon
      className={s.repoListError}
    />
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
