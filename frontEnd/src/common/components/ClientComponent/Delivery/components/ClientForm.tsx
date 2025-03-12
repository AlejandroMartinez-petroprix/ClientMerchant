import { useEffect } from "react";
import { Modal, Input, Form, Button, message } from "antd";
import { Client } from "../interface";
import { updateClient, createClient } from "../../Infrastructure/clients";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientData?: Client;
  onUpdateClient: (updatedClient: Client) => void;
  onCreateClient: (newClient: Client) => void;
  token: string | null;
}

const ClientForm: React.FC<ClientFormProps> = ({ isOpen, onClose, clientData, onUpdateClient, onCreateClient, token }) => {
  const [form] = Form.useForm();
  const isEditing = !!clientData;

  useEffect(() => {
    if (clientData) {
      form.setFieldsValue(clientData);
    } else {
      form.resetFields();
    }
  }, [clientData, form]);

  const handleFinish = async (values: Partial<Client>) => {
    if (isEditing) {
      try {
        const updatedClient = await updateClient(clientData!.id, values, token);
        if (updatedClient) {
          onUpdateClient(updatedClient);
          message.success("Cliente editado correctamente");
          onClose();
        } else {
          throw new Error("No se pudo actualizar el cliente");
        }
      } catch  {
        message.error("Error al actualizar el cliente");
      }
    } else {
      try {
        const newClient = await createClient(values, token);
        if (newClient) {
          onCreateClient(newClient);
          message.success("Cliente creado correctamente");
          onClose();
        } else {
          throw new Error("No se pudo crear el cliente");
        }
      } catch  {
        message.error("Error al crear el cliente");
      }
    }
  };

  return (
    <Modal
      title={isEditing ? "Editar Cliente" : "Crear Cliente"}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancelar</Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          OK
        </Button>
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* El ID no aparece en creación, pero sí en edición */}
        {isEditing && (
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>
        )}
        
        {/* CIF/NIF/NIE solo está disabled en edición */}
        <Form.Item label="CIF/NIF/NIE" name="cifNifNie" rules={[{ required: true, message: "Este campo es obligatorio" }]}>
          <Input disabled={isEditing} />
        </Form.Item>

        <Form.Item label="Nombre" name="name" rules={[{ required: true, message: "Este campo es obligatorio" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Apellido" name="surname">
          <Input />
        </Form.Item>
        <Form.Item label="Teléfono" name="phone" rules={[{ required: true, message: "Este campo es obligatorio" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Correo" name="email" rules={[{ required: true, message: "Este campo es obligatorio" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClientForm;
