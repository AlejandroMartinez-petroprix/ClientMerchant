import { Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Client } from "../../ClientComponent/Delivery/interface";

interface ClientTableProps {
  clients: Client[];  // 🔹 Recibe un array de clientes
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onEdit, onDelete }) => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Teléfono", dataIndex: "phone", key: "phone" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, client: Client) => (
        <div className="flex gap-2">
          <EditOutlined className="text-blue-500 cursor-pointer" onClick={() => onEdit(client)} />
          <DeleteOutlined className="text-red-500 cursor-pointer" onClick={() => onDelete(client.id!)} />
        </div>
      ),
    },
  ];

  return <Table dataSource={clients} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />;
};

export default ClientTable;
