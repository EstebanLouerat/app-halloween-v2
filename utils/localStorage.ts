export const saveTimerToLocalStorage = (timeLeft: number) => {
  localStorage.setItem("timeLeft", timeLeft.toString());
};

export const getTimerFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const localTimeLeft = localStorage.getItem("timeLeft");
    if (localTimeLeft) return parseFloat(localTimeLeft);
  }
  return undefined;
};
export const clearTimerFromLocalStorage = () => {
  localStorage.removeItem("timeLeft");
};

export const saveGeneratorToLocalStorage = (generatorId: string) => {
  localStorage.setItem("selectedGenerator", generatorId);
};

export const getGeneratorFromLocalStorage = () => {
  return localStorage.getItem("selectedGenerator");
};

export const clearGeneratorFromLocalStorage = () => {
  localStorage.removeItem("selectedGenerator");
};
