"use client";

import { useState, useEffect } from "react";
import { Modal, Input, message, Select, Form } from "antd";
import merchantsUseCases from "@/service/src/application/queries/lib/merchants";
import { Merchant, MerchantType } from "../../../MerchantComponent/Delivery/interface";

interface MerchantFormProps {
  isOpen: boolean;
  onClose: () => void;
  merchantData?: Merchant;
}

const { Option } = Select;

const MerchantForm: React.FC<MerchantFormProps> = ({ isOpen, onClose, merchantData }) => {
  const isEditing = Boolean(merchantData);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState<Merchant>({
    id: "",
    name: "",
    address: "",
    merchantType: undefined,
    clientId: "",
  });

  useEffect(() => {
    if (merchantData) {
      setFormData(merchantData);
      form.setFieldsValue(merchantData);
    } else {
      form.resetFields();
    }
  }, [merchantData, isOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // Validar antes de enviar
      const signal = new AbortController().signal;

      if (isEditing && formData.id) {
        await merchantsUseCases.updateMerchant(signal, formData.id, values);
        message.success(`Merchant ${values.name} actualizado con éxito`);
      } else {
        await merchantsUseCases.createMerchant(signal, values);
        message.success(`Merchant ${values.name} creado con éxito`);
      }

      onClose();
    } catch (error) {
      message.error("Ocurrió un error al guardar el merchant");
      console.error(error);
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
    >
      <Form form={form} layout="vertical">
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
