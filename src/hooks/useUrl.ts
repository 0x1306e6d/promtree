import { useRecoilState } from "recoil";

import { urlState } from "../atoms/url";

export default function useUrl() {
  return useRecoilState(urlState);
}
