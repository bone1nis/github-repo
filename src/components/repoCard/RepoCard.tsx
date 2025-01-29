import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useCallback,
  useState,
} from "react";

import { IRepo } from "../../types/types";

import { Button, Card, Input } from "antd";

import s from "./repoCard.module.scss";
import Title from "antd/es/typography/Title";
import Link from "antd/es/typography/Link";

interface ComponentsProps {
  repo: IRepo;
  onRemove: () => void;
  onSubmit: (repo: IRepo) => void;
}

interface IFormInput {
  title: string;
  created: string;
  updated: string;
  link: string;
}

const RepoCard = ({
  repo,
  onRemove,
  onSubmit,
}: ComponentsProps): ReactElement => {
  const [showEdit, setShowEdit] = useState(false);

  const [newItem, setNewItem] = useState<IFormInput>({
    title: repo.full_name,
    created: repo.created_at,
    updated: repo.updated_at,
    link: repo.html_url,
  });

  const onChangeEdit = useCallback(() => {
    setShowEdit((prev) => !prev);
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev: IFormInput) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const res: IRepo = {
        id: repo.id,
        full_name: newItem.title,
        created_at: newItem.created,
        updated_at: newItem.updated,
        html_url: newItem.link,
      };

      onSubmit(res);
      onChangeEdit();
    },
    [newItem, onSubmit, onChangeEdit, repo.id]
  );

  const content = !showEdit ? (
    <>
      <Title level={5}>Created at: {repo.created_at}</Title>
      <Title level={5}>Updated at: {repo.updated_at}</Title>
      <Link href={repo.html_url}>{repo.html_url}</Link>
    </>
  ) : (
    <form className={s.repoCardForm} onSubmit={handleSubmit}>
      <Input
        type="text"
        name="title"
        value={newItem?.title}
        onChange={handleInputChange}
        placeholder="title"
      />
      <Input
        type="text"
        name="created"
        value={newItem?.created}
        onChange={handleInputChange}
        placeholder="created"
      />
      <Input
        type="text"
        name="updated"
        value={newItem?.updated}
        onChange={handleInputChange}
        placeholder="updated"
      />
      <Input
        type="text"
        name="link"
        value={newItem?.link}
        onChange={handleInputChange}
        placeholder="link"
      />
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </form>
  );

  return (
    <Card
      title={repo.full_name}
      className={s.repoCard}
      extra={
        <>
          <EditIcon onClick={onChangeEdit} />
          <RemoveIcon onClick={onRemove} />
        </>
      }
    >
      {content}
    </Card>
  );
};

const EditIcon = ({ onClick }: { onClick: () => void }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 50 50"
    className={s.repoCardEdit}
    onClick={onClick}
  >
    <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
  </svg>
);

const RemoveIcon = ({ onClick }: { onClick: () => void }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={s.repoCardRemove}
    onClick={onClick}
  >
    <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z" />
  </svg>
);

export default RepoCard;
