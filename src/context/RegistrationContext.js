import React, { createContext, useContext, useState } from "react";

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [snacks, setSnacks] = useState([]); // 登録されたお菓子のリストを保持
  const [currentSnack, setCurrentSnack] = useState(""); // 現在入力中のお菓子の名前

  return (
    <RegistrationContext.Provider
      value={{ snacks, setSnacks, currentSnack, setCurrentSnack }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);
