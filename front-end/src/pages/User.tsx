import { Input, notification, Space, Table, Typography } from "antd";
import "antd/dist/reset.css";
import React, { useState } from "react";

const { Title } = Typography;

interface DataType {
  id: string;
  username: string;
  email: string;
}

const User: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUsername, setFilterUsername] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterId, setFilterId] = useState("");

  const fetchUsers = async () => {
    setLoading(true);

    fetch("http://localhost:8080/user")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar usuários");
        }
        return res.json();
      })
      .then((json) => {
        const users = json.map((user: any) => ({
          key: String(user.id),
          id: String(user.id),
          username: user.username,
          email: user.email,
        }));

        setData(users);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
        notification.error({
          message: "Erro",
          description: "Não foi possível carregar os usuários",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const filteredData = data.filter((user) => {
    const matchesUsername = user.username
      .toLowerCase()
      .includes(filterUsername.toLowerCase());

    const matchesEmail = user.email
      .toLowerCase()
      .includes(filterEmail.toLowerCase());

    const matchesId = user.id.toLowerCase().includes(filterId.toLowerCase());

    return (
      (!filterUsername || matchesUsername) &&
      (!filterEmail || matchesEmail) &&
      (!filterId || matchesId)
    );
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Title level={4}>Filter</Title>
      </div>
      <Space
        direction="vertical"
        style={{
          width: "100%",
          marginBottom: 16,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Input
          placeholder="ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          allowClear
        />
        <Input
          placeholder="Username"
          value={filterUsername}
          onChange={(e) => setFilterUsername(e.target.value)}
          allowClear
        />
        <Input
          placeholder="Email"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          allowClear
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default User;
