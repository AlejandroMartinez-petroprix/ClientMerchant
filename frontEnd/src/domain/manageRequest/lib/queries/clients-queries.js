export const CLIENTS_QUERIES = {
  searchClientsByName: ({ name }) => {
    return `${process.env.NEXT_PUBLIC_API_URL_CLIENTS}/clients/search/by-name?name=${encodeURIComponent(name)}`;
  },
  createClient: () => `${process.env.NEXT_PUBLIC_API_URL_CLIENTS}/clients`,
  
  getClientById: ({ id }) => `${process.env.NEXT_PUBLIC_API_URL_CLIENTS}/clients/${id}`, //todo: introduce simpleOutput

  findByEmail: ({ email }) =>
    `${process.env.NEXT_PUBLIC_API_URL_CLIENTS}/clients/search/by-email?email=${encodeURIComponent(email)}`,

  updateClient: ({ id }) => `${process.env.NEXT_PUBLIC_API_URL_CLIENTS}/clients/${id}`,

  getAllClients: () => `${process.env.NEXT_PUBLIC_API_URL_CLIENTS}/clients/all`,

  checkMerchantExists: ({ merchantId }) =>
    `${process.env.NEXT_PUBLIC_API_URL_CLIENTS}/clients/merchant/exists?merchantId=${encodeURIComponent(merchantId)}`,
  
};

export const CLIENTS_ERROR_MESSAGES = {
  searchClientsByName: "Error al buscar clientes.",
  createClient: "Error al crear cliente.",
  getClientById: "Error al obtener cliente por id.",
  findByEmail: "Error al buscar cliente por email.",
  updateClient: "Error al actualizar cliente.",
  getAllClients: "Error al obtener todos los clientes.",
  checkMerchantExists: "Error al verificar si el comercio existe.",

};
