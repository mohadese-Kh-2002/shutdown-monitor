import { BrowserWindow, Menu, app, nativeImage } from "electron";
import path from "path";
import { isQuiting } from "../app.js";
import { fileURLToPath } from "url";
import { configDotenv } from "dotenv";
import fs from 'fs';
configDotenv();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const getPreloadPath=()=> {
  const isDev = process.env.NODE_ENV === "development";
  
  if (isDev) {
    return path.join(__dirname, "../preload/index.js");
  } else {
    
    const possiblePaths = [
      path.join(process.resourcesPath, "preload/index.js"),
      path.join(path.dirname(app.getPath('exe')), "resources/preload/index.js"),
      path.join(app.getAppPath(), "preload/index.js"),
      path.join(__dirname, "../../preload/index.js"),
      path.join(__dirname, "../preload/index.js"),
    ];
    
    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        return tryPath;
      }
    }
    
  
    return path.join(process.resourcesPath, "preload/index.js");
  }
}
const menu = Menu.buildFromTemplate([
  {
    label: "zoom",
    submenu: [
      { label: "+", role: "zoomIn" },
      { label: "-", role: "zoomIn" },
      { label: "reset", role: "resetZoom" },
    ],
  },
  { role: "reload" },
]);
const mainWindow = () => {
   const preloadPath = getPreloadPath();
  const icon = nativeImage.createFromPath(
    path.join(app.getAppPath(), "public", "shutdownIcon.png"),
  );
  const window = new BrowserWindow({
    width: 500,
    height: 700,
    resizable: false,
    icon,
    title: "مدیریت خاموشی",
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
    },
    
  });
  window.setMenu(menu);
  if (process.env.NODE_ENV == "devlopment") {
    window.loadURL("http://localhost:5173");
  } else {
    window.loadFile(path.join(__dirname, "../../dist/index.html"));
  }

  window.on("close", (event) => {
    if (!isQuiting) {
      event.preventDefault();
      window?.hide();
    }
  });
 
  return window;
};

export default mainWindow;
