import manageRequest from '@/domain/manageRequest';

const searchMerchantsByName = (signal, name, token) => {
  return manageRequest(
    signal,
    'searchMerchantsByName',
    {},
    'normal',
    'get',
    token,
    'no-store',
    {},
    true,
    { name }
  );
};

const createMerchant = async (signal, merchantData, token) => {
  return manageRequest(
    signal,
    "createMerchant",
    merchantData,
    "body",
    "post",
    token,
    "no-store",
    { "Content-Type": "application/json" },
    true,
    {}
  );
};

const getMerchantById = async (signal, id, token) => {
  return manageRequest(
    signal,
    "getMerchantById",
    {},
    "normal",
    "get",
    token,
    "no-store",
    {},
    true,
    { id }
  );
};

const getAllMerchants = async (signal, token) => {
  return manageRequest(
    signal,
    "getAllMerchants",
    {},
    "normal",
    "get",
    token,
    "no-store",
    {},
    true,
    {}
  );
};

const updateMerchant = async (signal, id, merchantData, token) => {
  return manageRequest(
    signal,
    "updateMerchant",
    merchantData,
    "body",
    "put",
    token,
    "no-store",
    { "Content-Type": "application/json" },
    true,
    { id }
  );
};

const getMerchantsByClientId = async (signal, clientId, token) => {
  return manageRequest(
    signal,
    "getMerchantsByClientId",
    {},
    "normal",
    "get",
    token,
    "no-store",
    {},
    true,
    { clientId }
  );
};

const getClientByMerchantId = async (signal, merchantId, token) => {
  return manageRequest(
    signal,
    "getClientByMerchantId",
    {},
    "normal",
    "get",
    token,
    "no-store",
    {},
    true,
    { merchantId }
  );
};

const merchantsUseCases = {
  searchMerchantsByName,
  createMerchant,
  getMerchantById,
  getAllMerchants,
  updateMerchant,
  getMerchantsByClientId,
  getClientByMerchantId
};

export default merchantsUseCases;
