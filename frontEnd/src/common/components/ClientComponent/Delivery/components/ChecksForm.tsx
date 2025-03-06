"use client";

import { useState } from "react";
import { Input, Button, message, Card } from "antd";
import clientsUseCases from "@/service/src/application/queries/lib/clients";

const CheckMerchantExists = () => {
  const [merchantId, setMerchantId] = useState("");
  const [exists, setExists] = useState<boolean | null>(null);

  const handleCheckMerchant = async () => {
    if (!merchantId.trim()) {
      message.warning("Introduce un ID de merchant");
      return;
    }

    try {
      const signal = new AbortController().signal;
      const response = await clientsUseCases.checkMerchantExists(signal, merchantId);
      setExists(response);
    } catch {
      message.error("Error al comprobar el merchant");
      setExists(null);
    }
  };

  return (
    <Card title="Comprobar si un Merchant Existe" className="p-1 shadow-md ">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Introduce el ID del Merchant"
          value={merchantId}
          onChange={(e) => setMerchantId(e.target.value)}
        />
        <Button type="primary" onClick={handleCheckMerchant}>
          Comprobar
        </Button>
      </div>

      {exists !== null && (
        <p className={`mt-4 text-lg font-bold ${exists ? "text-green-500" : "text-red-500"}`}>
          {exists ? "El merchant existe ✅" : "El merchant NO existe ❌"}
        </p>
      )}
    </Card>
  );
};

export default CheckMerchantExists;
