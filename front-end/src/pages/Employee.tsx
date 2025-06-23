import { Input, notification, Space, Table, Typography } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title } = Typography;

interface DataType {
  id: string;
  name: string;
  cpf: string;
  gender: string;
  birth: string;
  email: string;
  phone: string;
  address: string;
  salary: string;
}

const formatCPF = (cpf: string) => {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
};

const formatPhone = (phone: string) => {
  return phone.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2.$3-$4");
};

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format("DD/MM/YYYY");
};

const formatCurrency = (value: string) => {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const Employee: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState("");
  const [filterCpf, setFilterCpf] = useState("");
  const [filterId, setFilterId] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);

    fetch("http://localhost:8080/employee")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar funcionários");
        }
        return res.json();
      })
      .then((json) => {
        const employees = json.map((emp: any) => ({
          key: String(emp.id),
          id: String(emp.id),
          name: emp.name,
          cpf: emp.cpf,
          gender: emp.gender,
          birth: emp.birth,
          email: emp.email,
          phone: String(emp.phone),
          address: emp.address,
          salary: String(emp.salary),
        }));

        setData(employees);
      })
      .catch((err) => {
        console.error("Erro ao buscar funcionários:", err);
        notification.error({
          message: "Erro",
          description: "Não foi possível carregar os funcionários",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredData = data.filter((employee) => {
    const matchesName = employee.name
      .toLowerCase()
      .includes(filterName.toLowerCase());

    const matchesCpf = employee.cpf
      .toLowerCase()
      .includes(filterCpf.toLowerCase());

    const matchesId = employee.id
      .toLowerCase()
      .includes(filterId.toLowerCase());

    return (
      (!filterName || matchesName) &&
      (!filterCpf || matchesCpf) &&
      (!filterId || matchesId)
    );
  });

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
      render: (text: string) => formatCPF(text),
    },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Birth",
      dataIndex: "birth",
      key: "birth",
      render: (text: string) => formatDate(text),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => formatPhone(text),
    },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (text: string) => formatCurrency(text),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <Title level={4}>Filter</Title>
      </div>
      <Space
        style={{
          width: "100%",
          marginBottom: 16,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <Input
          placeholder="ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          allowClear
        />
        <Input
          placeholder="Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          allowClear
        />
        <Input
          placeholder="CPF"
          value={filterCpf}
          onChange={(e) => setFilterCpf(e.target.value)}
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

export default Employee;
