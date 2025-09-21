import { parseAsString, parseAsJson } from "nuqs";
import type { ParserMap } from "nuqs";
import type { RawNodeDatum } from "react-d3-tree";

const filterParserMap = {
  familyName: parseAsString.withDefault(""),
  members: parseAsJson<RawNodeDatum[]>((v) => v as RawNodeDatum[]).withDefault(
    []
  ),
} satisfies ParserMap;

export const loadSearchParamsMap = { ...filterParserMap };
