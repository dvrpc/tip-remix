import React, { createContext, useContext, useState } from "react";

const AppContext: React.Context<any> = createContext({
  appContext: {},
  setAppContext: () => {},
});

export function AppProvider({
  children,
  value,
}: {
  children: React.ReactElement;
  value: object;
}): JSX.Element {
  const [appContext, setAppContext] = useState(value);
  const values = { appContext, setAppContext };
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export function useAppContext(): {
  appContext: any;
  setAppContext: Function;
} {
  const context: {
    appContext: any;
    setAppContext: Function;
  } = useContext(AppContext);
  if (context === undefined) {
    throw new Error("Missing Provider");
  }
  return context;
}
