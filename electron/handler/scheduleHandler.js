import { BrowserWindow, ipcMain } from "electron";
import { exec } from "child_process";

let shutdownTimeout = null;
let countdownInterval = null;

ipcMain.handle("schedule_shutdown", (e, { hours, minutes }) => {

  const mainwindow = BrowserWindow.fromWebContents(e.sender);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

   let remainingTime = target.getTime() - now.getTime();
  if (remainingTime <= 0) {
 target.setDate(target.getDate() + 1);
  remainingTime = target.getTime() - now.getTime();
  }
    if (shutdownTimeout) {
    clearTimeout(shutdownTimeout);
    shutdownTimeout = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
   let remainingMs = remainingTime;
  countdownInterval = setInterval(() => {
    remainingMs -= 1000;
    if (remainingMs <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      mainwindow.webContents.send('update_countdown', formatTime(0));
    } else {
      mainwindow.webContents.send('update_countdown', formatTime(remainingMs));
    }
  }, 1000);


 shutdownTimeout = setTimeout(() => {
    exec("shutdown -s -t 0", (err) => {
      if (err) {
        console.error("Shutdown error:", err);
      }
    });
  }, remainingTime);
  
 
});
ipcMain.handle("cancel_shutdown_schedule", () => {
  if (shutdownTimeout) {
    clearTimeout(shutdownTimeout);
    shutdownTimeout = null;
   
  }
  if(countdownInterval){
    clearInterval(countdownInterval)
    countdownInterval=null
  }
  return {status:'ok'}
});

export const formatTime = (ms) => {
  if (ms <= 0) return { hours: '00', minutes: '00', seconds: '00' };
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, 0);
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, 0);
  const seconds = (totalSeconds % 60).toString().padStart(2, 0);
  return { hours, minutes, seconds };
};
