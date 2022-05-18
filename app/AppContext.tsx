import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

export function AppProvider({ children, value }) {
  const [appContext, setAppContext] = useState(value);
  const values = { appContext, setAppContext };
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("Missing Provider");
  }
  return context;
}
