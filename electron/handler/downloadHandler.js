import { ipcMain, session, app, BrowserWindow } from "electron";
import { exec } from "child_process";
import path from "path";
let isAutoShutdownEnabled = false;


const performShutdown = () => {

  exec("shutdown -s -t 30", (error, stdout, stderr) => {
    if (error) {
      return;
    }
    if (stderr) {
      return;
    }
  });
};

const setupDownloadListener = () => {
  session.defaultSession.on("will-download", (event, item, webContents) => {
    if (!isAutoShutdownEnabled) return;
    const downloadPath = path.join(
      app.getPath("downloads"),
      item.getFilename(),
    );
    item.setSavePath(downloadPath);

    webContents.send("download_status_update", { isDownloading: true });

    item.once("done", (event, state) => {
      webContents.send("download_status_update", { isDownloading: false });

      if (state === "completed") {
        webContents.send("start_shutdown_timer", 30);
        performShutdown();
      }
    });

    item.on("updated", (event, state) => {
      if (state === "interrupted")
       webContents.send("download-interrupted", {
      status: "interrupted",
      filename: item.getFilename(),
      error: item.getError()
    });
  
      else if (state === "progressing") {
        const progress = (item.getReceivedBytes() / item.getTotalBytes()) * 100;
        webContents.send("download-progress", progress);
      }
    });
  });
};

app.whenReady().then(() => setupDownloadListener());

ipcMain.handle("start_download_monitor", async (event, data) => {
  if (!app.isReady()) {
    return { error: "App not ready" };
  }
  if (data.shouldMonitor) {
    isAutoShutdownEnabled = true;
    return { status: "started" };
  } else {
    isAutoShutdownEnabled = false;
    return { status: "stopped" };
  }
});

ipcMain.handle("cancel_download_monitor", async () => {
  exec("shutdown -a");
  return { status: "ok" };
});

ipcMain.handle("start_actual_download", async (event, data) => {
  const { url } = data;

  let workerWindow = BrowserWindow.getFocusedWindow();
   if (workerWindow && workerWindow.webContents) {
    workerWindow.webContents.downloadURL(url);
    return { status: "ok" };
  }

return { status: "error", message: "No active window" };
});
