import useCases from "./application";

const useCasesJson = useCases as Utility.JSONValue;

/**
 * @description Ejecuta un caso de uso de la aplicación.
 * @param useCaseName - Nombre del caso de uso.
 * @param parameters - Parámetros del caso de uso.
 */
const executeUseCase = (useCaseName: string, parameters: Utility.JSONValue) => 
  new Promise((resolve, reject) => {
    try {
      if (!useCasesJson || !useCasesJson[useCaseName]) {
        throw new Error(`UseCase "${useCaseName}" no está definido en Service.`);
      }

      const { signal, endPointData, token } = parameters;
      useCasesJson[useCaseName](signal, endPointData, token)
        .then((response: unknown) => resolve(response))
        .catch((error: unknown) => reject(error));
    } catch (error) {
      console.error("Error en Service.executeUseCase:", error);
      reject(error);
    }
  });

const Service = {
  executeUseCase,
};

export default Service;
