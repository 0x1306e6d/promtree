import produce from "immer";

import type Meter from "../types/Meter";

export default function parsePrometheus(content: string): {
  [name: string]: Meter;
} {
  let meters: { [name: string]: Meter } = {};
  // TODO(ghkim3221): Refactoring
  content.split("\n").forEach((line) => {
    if (line.startsWith("#")) {
      const components = line.split(" ");
      if (components.length > 1) {
        if (components[1] === "HELP") {
          if (components.length > 2) {
            const [_, __, name, description] = components;
            if (name in meters) {
              meters[name] = produce(meters[name], (draft) => {
                draft.description = description;
              });
            } else {
              meters[name] = {
                name: name,
                description: description,
                type: "",
                count: 0,
              };
            }
          }
        } else if (components[1] === "TYPE") {
          if (components.length > 2) {
            const [_, __, name, type] = components;
            if (name in meters) {
              meters[name] = produce(meters[name], (draft) => {
                draft.type = type;
              });
            } else {
              meters[name] = {
                name: name,
                description: "",
                type: type,
                count: 0,
              };
            }
          }
        }
      }
    } else {
      const nameIndex = Math.min(line.indexOf("{"), line.indexOf(" "));
      const name = line.substring(0, nameIndex);
      if (name in meters) {
        meters[name] = produce(meters[name], (draft) => {
          draft.count += 1;
        });
      } else {
        meters[name] = { name: name, description: "", type: "", count: 1 };
      }
    }
  });
  return meters;
}
