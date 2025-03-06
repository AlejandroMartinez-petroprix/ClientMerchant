import manageRequest from '@/domain/manageRequest';

const searchClientsByName = (signal, name, token) => {
  return manageRequest(
    signal,                     
    'searchClientsByName',      
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

const createClient = async (signal, clientData,token) => {

  return manageRequest(
    signal,
    "createClient",
    clientData,
    "body",
    "post",
    token,
    "no-store",
    { "Content-Type": "application/json" },
    true,
    {}
  );
};

const getClientById = async (signal, id,token) => {
  return manageRequest(
    signal,
    "getClientById",
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

const findByEmail = async (signal, email,token) => {
  return manageRequest(
    signal,
    "findByEmail",
    {},
    "normal",
    "get",
    token,
    "no-store",
    {},
    true,
    { email }
  );
};

const updateClient = async (signal, id, clientData,token) => {
  return manageRequest(
    signal,
    "updateClient",
    clientData,
    "body",
    "put",
    token,
    "no-store",
    { "Content-Type": "application/json" },
    true,
    { id }
  );
};

const getAllClients = async (signal,token) => {
  return manageRequest(
    signal,
    "getAllClients",
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

const checkMerchantExists = async (signal, merchantId, token) => {
  return manageRequest(
    signal,
    "checkMerchantExists",
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



const clientsUseCases = {
  searchClientsByName,
  createClient,
  getClientById,
  findByEmail,
  updateClient,
  getAllClients,
  checkMerchantExists
};

export default clientsUseCases;