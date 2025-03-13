import { Table, TableProps } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface TableComponentProps<T> {
  data: T[];
  columns: TableProps<T>["columns"];
  onEdit: (item: T) => void;
  simpleOutput: boolean;
}

const TableComponent = <T extends { id: string; name?: string; email?: string; phone?: string; address?: string; merchantType?: string; clientId?: string  }>(
  { data, columns, onEdit, simpleOutput }: TableComponentProps<T>
) => {
  
  const formattedData = data.map((item) => ({
    ...item,
    name: simpleOutput ? "No disponible" : item.name || "No disponible",
    email: simpleOutput ? "No disponible" : item.email || "No disponible",
    phone: simpleOutput ? "No disponible" : item.phone || "No disponible",
    address: simpleOutput ? "No disponible" : item.address || "No disponible",
    merchantType: simpleOutput ? "No disponible" : item.merchantType || "No disponible",
    clientId: simpleOutput ? "No disponible" : item.clientId || "No disponible",
  }));
  

  const actionColumn: TableProps<T>["columns"] = [
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, item: T) => (
        <div className="flex justify-center items-center">
          <EditOutlined className="text-blue-500 cursor-pointer text-xl" onClick={() => onEdit(item)} />
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={formattedData}
      columns={[...(columns || []), ...actionColumn]}
      rowKey="id"
      pagination={{
        pageSize: 5,
        showSizeChanger: false,
        position: ["bottomCenter"],
        itemRender: (page, type, originalElement) => {
          if (type === "page") {
            return <div className="text-lg px-2">{originalElement}</div>;
          }
          return originalElement;
        },
      }}
    />
  );
};

export default TableComponent;
