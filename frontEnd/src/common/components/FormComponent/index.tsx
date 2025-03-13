"use client";

import { useEffect } from "react";
import { Modal, Input, Select, Form, Button, message } from "antd";

interface GenericFormProps<T> {
  isOpen: boolean;
  onClose: () => void;
  entityData?: T;
  onUpdateEntity: (updatedEntity: T) => void;
  onCreateEntity: (newEntity: T) => void;
  entityType: "client" | "merchant";
  fields: {
    key: keyof T;
    label: string;
    placeholder?: string;
    type?: "text" | "email" | "select";
    options?: { value: string; label: string }[];
    required?: boolean;
    disabled?: boolean;
  }[];
  createEntity: (values: Partial<T>) => Promise<T | null>;
  updateEntity: (id: string, values: Partial<T>) => Promise<T | null>;
}

const { Option } = Select;

const GenericForm = <T extends { id?: string }>({
  isOpen,
  onClose,
  entityData,
  onUpdateEntity,
  onCreateEntity,
  entityType,
  fields,
  createEntity,
  updateEntity,
}: GenericFormProps<T>) => {
  const [form] = Form.useForm();
  const isEditing = Boolean(entityData);

  useEffect(() => {
    if (entityData) {
      form.setFieldsValue(entityData);
    } else {
      form.resetFields();
    }
  }, [entityData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let entity;

      if (isEditing && entityData?.id) {
        entity = await updateEntity(entityData.id, values);
        if (entity) {
          onUpdateEntity(entity);
          message.success(`${entityType === "client" ? "Cliente" : "Merchant"} actualizado con éxito`);
        }
      } else {
        entity = await createEntity(values);
        if (entity) {
          onCreateEntity(entity);
          message.success(`${entityType === "client" ? "Cliente" : "Merchant"} creado con éxito`);
        }
      }

      onClose();
    } catch {
      message.error(`Error al ${isEditing ? "actualizar" : "crear"} el ${entityType === "client" ? "cliente" : "merchant"}`);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      title={isEditing ? `Editar ${entityType === "client" ? "Cliente" : "Merchant"}` : `Nuevo ${entityType === "client" ? "Cliente" : "Merchant"}`}
      forceRender
      footer={[
        <Button key="cancel" onClick={onClose}>Cancelar</Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>OK</Button>
      ]}
    >
      <Form form={form} layout="vertical">
        {fields.map((field) => (
          <Form.Item
            key={String(field.key)}
            label={field.label}
            name={field.key as string}
            rules={field.required ? [{ required: true, message: `Este campo es obligatorio` }] : []}
          >
            {field.type === "select" && field.options ? (
              <Select placeholder={field.placeholder}>
                {field.options.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            ) : (
              <Input
                placeholder={field.placeholder}
                type={field.type || "text"}
                disabled={field.disabled}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default GenericForm;
