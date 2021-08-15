import { Heading, majorScale, Pane } from "evergreen-ui";

export default function Navigation() {
  return (
    <Pane
      is="nav"
      alignItems="center"
      borderBottom="muted"
      display="flex"
      height={majorScale(6)}
      paddingX={majorScale(6)}
      position="sticky"
      top={0}
      width="100%"
    >
      <Heading>promtree</Heading>
    </Pane>
  );
}
