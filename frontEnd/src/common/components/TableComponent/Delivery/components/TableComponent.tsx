import { Table, TableProps } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface TableComponentProps<T> {
  data: T[];
  columns: TableProps<T>["columns"];
  onEdit: (item: T) => void;
}

const TableComponent = <T extends { id: string }>({
  data,
  columns,
  onEdit,
}: TableComponentProps<T>) => {
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
  dataSource={data}
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
