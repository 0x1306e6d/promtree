import { atom } from "recoil";

export type UrlState = string;

const defaultState: UrlState = "";

export const urlState = atom({
  key: "urlState",
  default: defaultState,
});
