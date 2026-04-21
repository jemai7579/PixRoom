import { createContext, useContext } from "react";
import { demoWorkspace } from "../lib/demoData";

const DemoContext = createContext(null);

export function DemoProvider({ children }) {
  return <DemoContext.Provider value={{ isDemo: true, workspace: demoWorkspace }}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);

  if (!context) {
    throw new Error("useDemo must be used within DemoProvider");
  }

  return context;
}
