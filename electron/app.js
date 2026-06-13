import { app, Menu, nativeImage, Tray } from "electron";
import createMainWindow from "./windows/mainWindow.js";
import "./handler/countdownHandler.js";
import "./handler/scheduleHandler.js";
import "./handler/idleTimerHandler.js";
import "./handler/downloadHandler.js";
import { exec } from "child_process";
import fs from "fs";
import { configDotenv } from "dotenv";
configDotenv();
import path from "path";
export let isQuiting = false;
let mainWindow = null;

function getTrayIconSimple() {
  const isDev = process.env.NODE_ENV === "development";

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "public", "shutdownIcon.png");
  } else {
    const possibleIcons = [
      path.join(process.resourcesPath, "public/shutdownIcon.png"),
      path.join(process.resourcesPath, "shutdownIcon.png"),
      path.join(path.dirname(app.getPath("exe")), "shutdownIcon.png"),
      path.join(app.getAppPath(), "public", "shutdownIcon.png"),
    ];

    for (const p of possibleIcons) {
      if (fs.existsSync(p)) {
        iconPath = p;
        break;
      }
    }
  }

  if (iconPath && fs.existsSync(iconPath)) {
    return nativeImage.createFromPath(iconPath);
  }

  return undefined;
}

app.whenReady().then(() => {
  mainWindow = createMainWindow();
  const icon = getTrayIconSimple();
  const tray = new Tray(icon);
  const menu = Menu.buildFromTemplate([
    { label: "نمایش برنامه", click: () => mainWindow.show() },
    {
      label: "خروج",
      click: () => {
        isQuiting = true;
        exec("shutdown -a");
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(menu);
});

app.on("activate", () => {
  if (mainWindow) {
    mainWindow.show();
  }
});
