import { Table, TableProps } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface TableComponentProps<T> {
  data: T[];
  columns: TableProps<T>["columns"];
  onEdit: (item: T) => void;
  
}

const TableComponent = <T extends { id: string; name?: string; email?: string; phone?: string; surname?: string; cifNifNie?: string; address?: string; merchantType?: string; clientId?: string }>(
  { data, columns, onEdit }: TableComponentProps<T>
) => {
  
  const formattedData = data.map((item) => ({
    ...item,
    name: item.name || "No disponible",
    surname: item.surname || "No disponible",
    cifNifNie: item.cifNifNie || "No disponible",
    email: item.email || "No disponible",
    phone: item.phone || "No disponible",
    address: item.address || "No disponible",
    merchantType: item.merchantType || "No disponible",
    clientId: item.clientId || "No disponible",
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
