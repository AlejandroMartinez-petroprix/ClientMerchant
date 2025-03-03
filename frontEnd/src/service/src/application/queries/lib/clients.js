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

const clientsUseCases = {
  searchClientsByName
};

export default clientsUseCases;