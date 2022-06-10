import { createContext } from "react";
import { RootStore } from "./RootStore";

export const rootStoreContext = {
  rootStore: new RootStore(),
}