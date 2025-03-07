"use client";

import { useEffect, useState, useRef } from "react";
import { Modal, Input, message, Select, Form } from "antd";
import merchantsUseCases from "@/service/src/application/queries/lib/merchants";
import { Merchant } from "../interface";

interface MerchantFormProps {
  isOpen: boolean;
  onClose: () => void;
  merchantData?: Merchant;
}

const { Option } = Select;

const MerchantForm: React.FC<MerchantFormProps> = ({ isOpen, onClose, merchantData }) => {
  const isEditing = Boolean(merchantData);
  const [form] = Form.useForm();
  const formRef = useRef(form);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (merchantData) {
      formRef.current.setFieldsValue(merchantData);
    } else {
      formRef.current.resetFields();
    }
  }, [merchantData, isOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const signal = new AbortController().signal;

      if (isEditing && merchantData?.id) {
        await merchantsUseCases.updateMerchant(signal, merchantData.id, values);
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

  if (!isClient) return null;

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
            <Option value="MERCHANT_TYPE_PERSONAL_SERVICES">Servicios Personales</Option> {/*todo solucionar el value*/}
            <Option value="MERCHANT_TYPE_FINANCIAL_SERVICES">Servicios Financieros</Option> {/*todo solucionar el value*/}
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
