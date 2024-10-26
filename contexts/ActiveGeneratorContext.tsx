// contexts/ActiveGeneratorContext.tsx
import React, { createContext, useContext, useState } from "react";

type ActiveGeneratorContextType = {
  activeGeneratorId: string | null;
  setActiveGeneratorId: (id: string | null) => void;
};

const ActiveGeneratorContext = createContext<
  ActiveGeneratorContextType | undefined
>(undefined);

export const ActiveGeneratorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeGeneratorId, setActiveGeneratorId] = useState<string | null>(
    null
  );

  return (
    <ActiveGeneratorContext.Provider
      value={{ activeGeneratorId, setActiveGeneratorId }}
    >
      {children}
    </ActiveGeneratorContext.Provider>
  );
};

export const useActiveGenerator = () => {
  const context = useContext(ActiveGeneratorContext);
  if (context === undefined) {
    throw new Error(
      "useActiveGenerator must be used within an ActiveGeneratorProvider"
    );
  }
  return context;
};
