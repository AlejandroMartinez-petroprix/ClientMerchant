/********************************************************************************************
 * Librería de todos los errores, queries y métodos de gestión de datos de las llamadas a API
 * *****************************************************************************************/

import { CLIENTS_METHODS } from "./methods/clients-methods";
import { CLIENTS_QUERIES, CLIENTS_ERROR_MESSAGES } from "./queries/clients-queries";

export const ERROR_MESSAGES = {
  ...CLIENTS_ERROR_MESSAGES,
};

export const QUERIES = {
  ...CLIENTS_QUERIES,
};

export const METHODS = {
  ...CLIENTS_METHODS,
};
