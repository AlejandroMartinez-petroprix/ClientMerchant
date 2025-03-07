"use client";

import { useEffect, useState, useRef } from "react";
import { Modal, Input, message, Form } from "antd";
import clientsUseCases from "@/service/src/application/queries/lib/clients";
import { Client } from "../interface";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientData?: Client;
}

export function ClientForm({ isOpen, onClose, clientData }: ClientFormProps) {
  const isEditing = Boolean(clientData);
  const [form] = Form.useForm();
  const formRef = useRef(form);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (clientData) {
      formRef.current.setFieldsValue(clientData);
    } else {
      formRef.current.resetFields();
    }
  }, [clientData, isOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const signal = new AbortController().signal;

      if (isEditing && clientData?.id) {
        await clientsUseCases.updateClient(signal, clientData.id, values);
        message.success(`Cliente ${values.name} actualizado con éxito`);
      } else {
        await clientsUseCases.createClient(signal, values);
        message.success(`Cliente ${values.name} creado con éxito`);
      }

      onClose();
    } catch (error) {
      message.error("Ocurrió un error al guardar el cliente");
      console.error(error);
    }
  };

  if (!isClient) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      title={<div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>
        {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
      </div>}
      forceRender
    >
      <Form form={form} layout="vertical">
        
        {/* Campo ID (No editable) */}
        <Form.Item label="ID" name="id">
          <Input placeholder="ID" disabled />
        </Form.Item>

        {/* Campo CIF/NIE/NIF (No editable) */}
        <Form.Item
          label="CIF/NIF/NIE"
          name="cifNifNie"
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="CIF/NIF/NIE" disabled />
        </Form.Item>

        {/* Campo Nombre */}
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="Nombre" />
        </Form.Item>

        {/* Campo Apellido */}
        <Form.Item
          label="Apellido"
          name="surname"
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="Apellido" />
        </Form.Item>

        {/* Campo Teléfono */}
        <Form.Item
          label="Teléfono"
          name="phone"
          rules={[{ required: true, message: "Este campo es obligatorio" }]}
        >
          <Input placeholder="Teléfono" />
        </Form.Item>

        {/* Campo Correo */}
        <Form.Item
          label="Correo"
          name="email"
          rules={[{ required: true, type: "email", message: "Introduce un correo válido" }]}
        >
          <Input placeholder="Correo" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
