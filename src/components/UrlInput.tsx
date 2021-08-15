import {
  IconButton,
  majorScale,
  SearchIcon,
  Pane,
  TextInput,
} from "evergreen-ui";

export default function UrlInput() {
  return (
    <Pane display="flex" margin={majorScale(4)}>
      <TextInput height={majorScale(6)} name="url" width="100%" />
      <IconButton height={majorScale(6)} icon={SearchIcon} />
    </Pane>
  );
}
