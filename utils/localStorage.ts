export const saveGeneratorToLocalStorage = (generatorId: string) => {
  localStorage.setItem("selectedGenerator", generatorId);
};

export const getGeneratorFromLocalStorage = () => {
  return localStorage.getItem("selectedGenerator");
};

export const clearGeneratorFromLocalStorage = () => {
  localStorage.removeItem("selectedGenerator");
};
