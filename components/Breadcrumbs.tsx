import React, { ReactNode } from "react";

import { Pane, SlashIcon } from "evergreen-ui";

interface BreadcrumbsProps {
  children: ReactNode;
}

export default function Breadcrumbs({ children }: BreadcrumbsProps) {
  const childrenArray = React.Children.toArray(children);
  return (
    <Pane alignItems="center" display="flex" justifyContent="start">
      {childrenArray.map((child, index) => (
        <React.Fragment key={`breadcrumbs-child-${index}`}>
          <SlashIcon />
          {child}
        </React.Fragment>
      ))}
    </Pane>
  );
}
