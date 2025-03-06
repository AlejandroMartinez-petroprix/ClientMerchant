/********************************************************************************************
 * Librería de todos los errores, queries y métodos de gestión de datos de las llamadas a API
 * *****************************************************************************************/

import { CLIENTS_METHODS } from "./methods/clients-methods";
import { CLIENTS_QUERIES, CLIENTS_ERROR_MESSAGES } from "./queries/clients-queries";

import {MERCHANTS_METHODS} from "./methods/merchants-methods";
import {MERCHANTS_QUERIES, MERCHANTS_ERROR_MESSAGES} from "./queries/merchants-queries";

export const ERROR_MESSAGES = {
  ...CLIENTS_ERROR_MESSAGES,
  ...MERCHANTS_ERROR_MESSAGES
};

export const QUERIES = {
  ...CLIENTS_QUERIES,
  ...MERCHANTS_QUERIES
};

export const METHODS = {
  ...CLIENTS_METHODS,
  ...MERCHANTS_METHODS
};
