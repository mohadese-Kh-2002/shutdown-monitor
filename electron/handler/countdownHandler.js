import { ipcMain } from "electron";
import { exec } from "child_process";
ipcMain.handle("countdown_shutdown", (e, time) => {
  return new Promise((resolve) => {
    exec(`shutdown -s -t ${time}`, (err) => {
      if (err) {
        resolve({ status: "no" });
        return;
      }
      resolve({ status: "ok" });
    });
  });
});
ipcMain.handle("cancel_shutdown_timer", () => {
  return new Promise((resolve) => {
    exec("shutdown /a", (err) => {
      if (err) {
        resolve({ status: "no" });
        return;
      } else {
        resolve({ status: "ok" });
      }
    });
  });
});
