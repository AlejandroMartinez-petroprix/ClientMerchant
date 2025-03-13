"use client";

import { useEffect } from "react";
import { Modal, Input, message, Select, Form } from "antd";
import { Merchant } from "../interface";
import { updateMerchant, createMerchant } from "../../Infrastructure/merchants";

interface MerchantFormProps {
  isOpen: boolean;
  onClose: () => void;
  merchantData?: Merchant;
  onUpdateMerchant: (updatedMerchant: Merchant) => void;
  onCreateMerchant: (newMerchant: Merchant) => void;
}

const { Option } = Select;

const MerchantForm: React.FC<MerchantFormProps> = ({ isOpen, onClose, merchantData, onUpdateMerchant, onCreateMerchant }) => {
  const [form] = Form.useForm();
  const isEditing = Boolean(merchantData);

  useEffect(() => {
    if (merchantData) {
      form.setFieldsValue(merchantData);
    } else {
      form.resetFields();
    }
  }, [merchantData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      let merchant;
      if (isEditing && merchantData?.id) {
        merchant = await updateMerchant(merchantData.id, values);
        if (merchant) {
          onUpdateMerchant(merchant);
          message.success(`Merchant ${values.name} actualizado con éxito`);
        }
      } else {
        merchant = await createMerchant(values);
        if (merchant) {
          onCreateMerchant(merchant);
          message.success(`Merchant ${values.name} creado con éxito`);
        }
      }

      onClose();
    } catch {
      message.error("Ocurrió un error al guardar el merchant");
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      title={
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>
          {isEditing ? "Editar Merchant" : "Nuevo Merchant"}
        </div>
      }
      forceRender
    >
      <Form form={form} layout="vertical">
        {/* Campo ID (No editable) */}
        {isEditing && (
          <Form.Item label="ID" name="id">
            <Input placeholder="ID del Merchant" disabled />
          </Form.Item>
        )}

        <Form.Item 
          label="Nombre" 
          name="name" 
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="Nombre del merchant" />
        </Form.Item>

        <Form.Item 
          label="Dirección" 
          name="address" 
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="Dirección del merchant" />
        </Form.Item>

        <Form.Item 
          label="Tipo de Merchant" 
          name="merchantType" 
          rules={[{ required: true, message: "Selecciona un tipo de merchant" }]}
        >
          <Select placeholder="Selecciona el tipo de merchant">
            <Option value="MERCHANT_TYPE_PERSONAL_SERVICES">Servicios Personales</Option>
            <Option value="MERCHANT_TYPE_FINANCIAL_SERVICES">Servicios Financieros</Option>
          </Select>
        </Form.Item>

        <Form.Item 
          label="ID del Cliente" 
          name="clientId" 
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="ID del Cliente" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MerchantForm;
