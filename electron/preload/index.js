const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  countdown_shutdown: async (data) =>
    await ipcRenderer.invoke("countdown_shutdown", data),
  cancelShutdownTimer: () => ipcRenderer.invoke("cancel_shutdown_timer"),
  //schedule
  schedule_shutdown: async (data) =>
    await ipcRenderer.invoke("schedule_shutdown", data),
  cancelShutdownSchedule: () => ipcRenderer.invoke("cancel_shutdown_schedule"),
  //idletimer
  idleTimer_shutdown: async (data) =>
    await ipcRenderer.invoke("idleTimer_shutdown", data),
  cancelShutdownIdleTimer: () =>
    ipcRenderer.invoke("cancel_shutdown_idleTimer"),
  onUpdateCountdown: (callback) => ipcRenderer.on("update_countdown", callback),
 
    //download-monitor
  downloadMonitor_shutdown: async (data) =>
    await ipcRenderer.invoke("start_download_monitor", data),

  onDownloadStatusUpdate: (callback) =>
    ipcRenderer.on("download_status_update", (event, data) => callback(data)),
  cancelshutdownDownload: () => ipcRenderer.invoke("cancel_download_monitor"),
  onDownloadProgress: (callback) =>
    ipcRenderer.on("download-progress", (event, data) => callback(data)),
  start_actual_download: (data) =>
    ipcRenderer.invoke("start_actual_download", data),
  start_shutdown_timer: (callback) =>
    ipcRenderer.on("start_shutdown_timer", (e, data) => callback(data)),
  onDownloadInterrupted: (callback) =>
    ipcRenderer.on("download-interrupted", (event, data) => callback(data)),
  removeUpdate: (channel, callback) =>
    ipcRenderer.removeListener(channel, callback),

});
