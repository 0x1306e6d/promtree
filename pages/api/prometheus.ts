import type { NextApiRequest, NextApiResponse } from "next";

import isUrl from "is-url";

import parsePrometheus from "../../libs/parsePrometheus";
import treefy from "../../libs/treefy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const upstream = req.query["url"];
  if (upstream && !Array.isArray(upstream) && isUrl(upstream)) {
    const response = await fetch(upstream);
    const content = await response.text();
    if (response.ok) {
      const meters = parsePrometheus(content);
      const tree = treefy(Object.values(meters));
      res.status(200).json(tree);
    } else {
      res.status(response.status).send(content);
    }
  } else {
    res.status(400).send("Bad Request");
  }
}
