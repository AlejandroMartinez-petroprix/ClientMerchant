export const CLIENTS_QUERIES = {
  searchClientsByName: ({ name }) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/clients/search/by-name?name=${encodeURIComponent(name)}`;
  },
};

export const CLIENTS_ERROR_MESSAGES = {
  searchClientsByName: "Error al buscar clientes.",
};
