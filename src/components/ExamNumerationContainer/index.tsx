interface ExamNumerationContainerProps {
  children: React.ReactNode;
}

const ExamNumerationContainer: React.FC<ExamNumerationContainerProps> = ({ children }) => {
  return (
    <div className="w-screen mx-auto flex items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-x-auto mt-5 px-5">
      {children}
    </div>
  );
};

export default ExamNumerationContainer;
