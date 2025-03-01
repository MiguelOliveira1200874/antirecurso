import { createContext } from 'react';

export const ExamContext = createContext<{
  examResult: ExamResult | null;
  setExamResult: React.Dispatch<React.SetStateAction<ExamResult | null>>;
}>({
  examResult: null,
  setExamResult: () => {} // @typescript-eslint/no-empty-function
});

import React, { useState } from 'react';
import ExamResult from 'src/types/ExamResult';

interface ExamProviderProps {
  children: React.ReactNode;
}

const ExamContextProvider: React.FC<ExamProviderProps> = ({ children }) => {
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  return (
    <ExamContext.Provider value={{ examResult, setExamResult }}>{children}</ExamContext.Provider>
  );
};

export default ExamContextProvider;
