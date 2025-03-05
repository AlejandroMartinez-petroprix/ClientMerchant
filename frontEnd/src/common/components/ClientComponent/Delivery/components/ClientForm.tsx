"use client";

import { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import  clientsUseCases  from "@/service/src/application/queries/lib/clients";
import { Client } from "../interface";

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientData?: Client;
}

export function ClientForm({ isOpen, onClose, clientData }: ClientFormProps) {
  const isEditing = Boolean(clientData);

  const [formData, setFormData] = useState<Client>({
    id: "",
    cifNifNie: "",
    name: "",
    surname: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (clientData) {
      setFormData(clientData);
    } else {
      setFormData({
        id: "",
        cifNifNie: "",
        name: "",
        surname: "",
        phone: "",
        email: "",
      });
    }
  }, [clientData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const signal = new AbortController().signal;

      if (isEditing && formData.id) {
        await clientsUseCases.updateClient(signal, formData.id, formData);
        message.success(`Cliente ${formData.name} actualizado con éxito`);
      } else {
        await clientsUseCases.createClient(signal, formData);
        message.success(`Cliente ${formData.name} creado con éxito`);
      }

      onClose();
    } catch (error) {
      message.error("Ocurrió un error al guardar el cliente");
      console.error(error);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} onOk={handleSubmit} title={isEditing ? "Editar Cliente" : "Nuevo Cliente"}>
      <div className="grid gap-4">
        <Input
          name="cifNifNie"
          placeholder="CIF/NIF/NIE"
          value={formData.cifNifNie}
          onChange={handleChange}
          disabled={isEditing}
        />
        <Input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
        <Input name="surname" placeholder="Apellido" value={formData.surname} onChange={handleChange} />
        <Input name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} />
        <Input name="email" type="email" placeholder="Correo" value={formData.email} onChange={handleChange} />
      </div>
    </Modal>
  );
}
