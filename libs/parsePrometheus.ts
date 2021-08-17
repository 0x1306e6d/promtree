import produce from "immer";

import type Meter from "../types/Meter";

export default function parsePrometheus(content: string): {
  [name: string]: Meter;
} {
  let meters: { [name: string]: Meter } = {};
  // TODO(ghkim3221): Refactoring
  content
    .split("\n")
    .filter((line) => line)
    .forEach((line) => {
      if (line.startsWith("# HELP")) {
        const { name, description } = parseHelpText(line);
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
      } else if (line.startsWith("# TYPE")) {
        const { name, type } = parseTypeInformation(line);
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

function parseHelpText(line: string): { name: string; description: string } {
  const remaining = line.substring(7); // `# HELP` + trailing whitespace.

  const name = remaining.substring(0, remaining.indexOf(" "));
  const description = remaining.substring(name.length + 1);
  return { name, description };
}

function parseTypeInformation(line: string): { name: string; type: string } {
  const remaining = line.substring(7); // `# TYPE` + trailing whiespace.

  const name = remaining.substring(0, remaining.indexOf(" "));
  const type = remaining.substring(name.length + 1);
  return { name, type };
}
