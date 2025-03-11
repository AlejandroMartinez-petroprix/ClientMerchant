import manageRequest from '@/domain/manageRequest';


const searchClientsByName = (signal, name, token) => {
  return manageRequest(
    signal,                     
    'searchClientsByName',      
    {name},  
    'query',                   
    undefined,        
    "get",              
    token                 
  );
};

const createClient = (signal, clientData,token) => {

  return manageRequest(
    signal,
    "createClient",
    clientData,
    "normal",
    "normal",
    "post",
    token,
    "no-store",
    { "Content-Type": "application/json" }
  );
};

const getClientById = (signal, id, simpleOutput = false, token) => {
  return manageRequest(
    signal,
    "getClientById",
    {},
    undefined,
    "normal",
    "get",
    token,
    "no-store",
    {},
    true,
    { id, simpleOutput }
  );
};


const findByEmail = (signal, email,token) => {
  return manageRequest(
    signal,
    "findByEmail",
    {email},
    "query",
    undefined,
    "get",
    token,
  );
};

const updateClient = (signal, id, clientData,token) => {
  return manageRequest(
    signal,
    "updateClient",
    clientData,
    undefined,
    undefined,
    "put",
    token,
    "no-store",
    { "Content-Type": "application/json" },
    undefined,
     id 
  );
};

const getAllClients = (signal,token) => {
  return manageRequest(
    signal,
    "getAllClients",
    {},
    "query",
    "normal",
    "get",
    token,
  );
};




const clientsUseCases = {
  searchClientsByName,
  createClient,
  getClientById,
  findByEmail,
  updateClient,
  getAllClients,
};

export default clientsUseCases;