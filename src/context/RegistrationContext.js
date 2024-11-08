import React, { createContext, useContext, useState } from "react";

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [snacks, setSnacks] = useState([]); // 登録されたお菓子のリスト
  const [currentSnack, setCurrentSnack] = useState({ name: "", productId: -1 }); // 商品IDを保持
  const [snacksData, setSnacksData] = useState([]); // データベースまたはサンプルのお菓子リスト

  return (
    <RegistrationContext.Provider
      value={{
        snacks,
        setSnacks,
        currentSnack,
        setCurrentSnack,
        snacksData, // 新しく追加
        setSnacksData, // 新しく追加
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);
