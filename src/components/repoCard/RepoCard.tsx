import { ChangeEvent, useCallback, useState } from "react";

import { IRepo } from "../../types/types";

import { Button, Card, Form, Input } from "antd";
import Title from "antd/es/typography/Title";
import Link from "antd/es/typography/Link";
import { EditIcon, RemoveIcon } from "../icons/Icons";

import s from "./repoCard.module.scss";

type ComponentsProps = {
  repo: IRepo;
  onRemove: () => void;
  onSubmit: (repo: IRepo) => void;
};

type IFormInput = {
  title: string;
  created: string;
  updated: string;
  link: string;
};

const RepoCard: React.FC<ComponentsProps> = ({ repo, onRemove, onSubmit }) => {
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

  const handleSubmit = useCallback(() => {
    const res: IRepo = {
      id: repo.id,
      full_name: newItem.title,
      created_at: newItem.created,
      updated_at: newItem.updated,
      html_url: newItem.link,
    };

    onSubmit(res);
    onChangeEdit();
  }, [newItem, onSubmit, onChangeEdit, repo.id]);

  const content = !showEdit ? (
    <>
      <Title ellipsis={true} level={5}>
        Created at: {repo.created_at}
      </Title>
      <Title ellipsis={true} level={5}>
        Updated at: {repo.updated_at}
      </Title>
      <Link href={repo.html_url}>{repo.html_url}</Link>
    </>
  ) : (
    <Form className={s.repoCardForm} onFinish={handleSubmit}>
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
    </Form>
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

export default RepoCard;
