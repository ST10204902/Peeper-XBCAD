import { render } from "../preset/react.js";
export const bridgeData = {
    "workspaceFolder": "file:///c%3A/Users/Jasper/Desktop/React stuff/Peeper-XBCAD",
    "serverRootDir": "",
    "previewFolderRelPath": "preview",
    "activeFileRelPath": "src/screens/organisation/OrgDetailsScreen.tsx",
    "mapFileRelPath": "src/screens/organisation/OrgDetailsScreen.tsx",
    "presetName": "react",
    "workspaceFolderName": "Peeper-XBCAD"
};
export const preview = () => render(getMod);
const getMod = () => import("../../src/screens/organisation/OrgDetailsScreen.tsx");