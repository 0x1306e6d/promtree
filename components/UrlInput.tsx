import React, { useState } from "react";

import {
  IconButton,
  majorScale,
  SearchIcon,
  Pane,
  TextInput,
} from "evergreen-ui";

import isUrl from "is-url";

import useUrl from "../hooks/useUrl";

export default function UrlInput() {
  const [url, setUrl] = useUrl();
  const [urlInput, setUrlInput] = useState<string>(url);

  const onUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  const onSearchButtonClick = () => {
    if (isUrl(urlInput)) {
      setUrl(urlInput);
    }
  };

  return (
    <Pane display="flex" margin={majorScale(4)}>
      <TextInput
        height={majorScale(6)}
        name="url"
        onChange={onUrlInputChange}
        value={urlInput}
        width="100%"
      />
      <IconButton
        disabled={!isUrl(urlInput)}
        height={majorScale(6)}
        icon={SearchIcon}
        onClick={onSearchButtonClick}
      />
    </Pane>
  );
}
