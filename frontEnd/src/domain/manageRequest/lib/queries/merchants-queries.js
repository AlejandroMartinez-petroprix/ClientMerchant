export const MERCHANTS_QUERIES = {
    searchMerchantsByName: ({ name }) => {
      return `${process.env.NEXT_PUBLIC_API_URL_MERCHANTS}/merchants/search?name=${encodeURIComponent(name)}`;
    },
  
    createMerchant: () => `${process.env.NEXT_PUBLIC_API_URL_MERCHANTS}/merchants`,
  
    getMerchantById: ({ id }) => {
      return `${process.env.NEXT_PUBLIC_API_URL_MERCHANTS}/merchants/${id}`; //todo: introduce simpleOutput
    },
  
    updateMerchant: ({ id }) => `${process.env.NEXT_PUBLIC_API_URL_MERCHANTS}/merchants/${id}`,
  
    getAllMerchants: () => `${process.env.NEXT_PUBLIC_API_URL_MERCHANTS}/merchants/all`,
  
    getMerchantsByClientId: ({ clientId }) => {
      return `${process.env.NEXT_PUBLIC_API_URL_MERCHANTS}/merchants/client/${clientId}`;
    },
  
    getClientByMerchantId: ({ merchantId }) => {
      return `${process.env.NEXT_PUBLIC_API_URL_MERCHANTS}/merchants/${merchantId}/client`;
    },
  };
  
  export const MERCHANTS_ERROR_MESSAGES = {
    searchMerchantsByName: "Error al buscar merchants.",
    createMerchant: "Error al crear merchant.",
    getMerchantById: "Error al obtener merchant por ID.",
    updateMerchant: "Error al actualizar merchant.",
    getAllMerchants: "Error al obtener todos los merchants.",
    getMerchantsByClientId: "Error al obtener merchants por cliente.",
    getClientByMerchantId: "Error al obtener cliente del merchant.",
  };
  