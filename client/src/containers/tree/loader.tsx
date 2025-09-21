import type { LoaderFunctionArgs } from "react-router";
import { URL } from "../../config";
import axios from "axios";
import type { RawNodeDatum } from "react-d3-tree";

export type TreeLoaderResponse = {
  familyId: string;
};

interface FamilyTreeData {
  familyName: string;
  members: RawNodeDatum[];
}

const treeLoader = async (
  args: LoaderFunctionArgs
): Promise<FamilyTreeData> => {
  const familyId = args.params.familyId || "";

  const response = await axios.get(`${URL}/families/${familyId}`);

  if (!response.data) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: FamilyTreeData = response.data;

  const familyName = data.familyName;
  const members = data.members[0].children ? data.members[0].children : [];

  return {
    familyName,
    members,
  };
};

export default treeLoader;
