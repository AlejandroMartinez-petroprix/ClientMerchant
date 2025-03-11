import manageRequest from '@/domain/manageRequest';

const searchMerchantsByName = (signal, name) => {
  return manageRequest(
    signal,
    'searchMerchantsByName',
    {name},
    'query',
    'normal',
    'get',
    undefined
  )
};

const createMerchant = (signal, merchantData) => {
  return manageRequest(
    signal,
    "createMerchant",
    merchantData,
    "normal",
    "normal",
    "post",
    undefined,
    "no-store",
    { "Content-Type": "application/json" }
  );
};

const getMerchantById = (signal, id, simpleOutput = false) => {
  return manageRequest(
    signal,
    "getMerchantById",
    {},
    undefined,
    "normal",
    "get",
    undefined,
    "no-store",
    {},
    true,
    { id, simpleOutput }
  );
};

const getAllMerchants = (signal) => {
  return manageRequest(
    signal,
    "getAllMerchants",
    {},
    "normal",
    "get",
  );
};

const updateMerchant = (signal, id, merchantData) => {
  return manageRequest(
    signal,
    "updateMerchant",
    merchantData,
    undefined,
    undefined,
    "put",
    undefined,
    undefined,
    { "Content-Type": "application/json" },
    undefined,
    id
  );
};

const getMerchantsByClientId = (signal, clientId) => {
  return manageRequest(
    signal,
    "getMerchantsByClientId",
    {clientId},
    "url",
    "normal",
    "get",
  );
};

const getClientByMerchantId = (signal, merchantId) => {
  return manageRequest(
    signal,
    "getClientByMerchantId",
    {merchantId},
    "url",
    "url",
    "get",
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
