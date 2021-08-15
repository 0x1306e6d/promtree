import { ReactNode } from "react";

import { majorScale, Pane } from "evergreen-ui";

import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Pane
      alignItems="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      margin={0}
      minHeight="100vh"
      padding={0}
      width="100vw"
    >
      <Navigation />
      <Pane flex={1} height="100%" paddingX={majorScale(32)} width="100%">
        {children}
      </Pane>
    </Pane>
  );
}
