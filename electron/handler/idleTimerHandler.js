import { powerMonitor, ipcMain, BrowserWindow } from "electron";
import { exec } from "child_process";
import { formatTime } from "./scheduleHandler.js";
let idleTimer = null;

ipcMain.handle("idleTimer_shutdown", (e, time) => {
  const mainwindow = BrowserWindow.fromWebContents(e.sender);
  if (idleTimer) clearInterval(idleTimer);
  idleTimer = setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();
    mainwindow.webContents.send(
      "update_countdown",
      formatTime(idleTime*1000),
    );
    if (idleTime >= time) {
      exec("shutdown -s -t 0");
      clearInterval(idleTimer);
    }
  }, 1000);
});

ipcMain.handle("cancel_shutdown_idleTimer", () => {
  clearInterval(idleTimer);
  return { status: "ok" };
});
