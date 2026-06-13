import { useState, useEffect } from "react";
import Button from "../components/Button";
import Container from "../components/Container";
import ModalComponent from "../components/Modal";
import { useNavigate } from "react-router-dom";

const DownloadMonitor = () => {
  const navigate = useNavigate();

  const [modalIsOpenBackToMainPage, setIsOpenBackToMainPage] = useState(false);
  const [modalIsOpenCancel, setIsOpenCancel] = useState(false);
  const [modalIsOpenError, setIsOpenError] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [shutdownTimer, setShutdownTimer] = useState({
    timer: null,
    show: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const openModalBackToMainPage = () => setIsOpenBackToMainPage(true);
  const closeModalBackToMainPage = () => setIsOpenBackToMainPage(false);
  const openModalCancel = () => setIsOpenCancel(true);
  const closeModalCancel = () => setIsOpenCancel(false);
  const openModalError = () => setIsOpenError(true);
  const closeModalError = () => setIsOpenError(false);
  useEffect(() => {
    const handleProgress = (data) => {
      setProgress(data);
    };

    const handleTimer = (data) => {
      setShutdownTimer({ show: true, timer: data });
    };

    const handleStatusUpdate = (data) => {
      setIsDownloading(data.isDownloading);

      if (!data.isDownloading) {
        setProgress(0);
      }
    };
    const handleDownloadInterrupted = (data) => {
      setIsDownloading(false);
      setProgress(0);

      let message = "";
      if (data.status === "interrupted") {
        message = `دانلود فایل "${data.filename || "ناشناخته"}" با خطا مواجه شد.\n${data.error || "ارتباط قطع شده یا فایل موجود نیست."}`;
      } else if (data.status === "cancelled") {
        message = `دانلود فایل "${data.filename || "ناشناخته"}" توسط کاربر لغو شد.`;
      }

      setErrorMessage(message);
      openModalError();
    };
    const enableMonitor = async () => {
      await window.api.downloadMonitor_shutdown({ shouldMonitor: true });
    };
    enableMonitor();

    window.api.onDownloadProgress(handleProgress);
    window.api.start_shutdown_timer(handleTimer);
    window.api.onDownloadStatusUpdate(handleStatusUpdate);
    window.api.onDownloadInterrupted(handleDownloadInterrupted);

    return () => {
      window.api.removeUpdate("download-progress", handleProgress);
      window.api.removeUpdate("start_shutdown_timer", handleTimer);
      window.api.removeUpdate("download_status_update", handleStatusUpdate);
      window.api.removeUpdate(
        "download-interrupted",
        handleDownloadInterrupted,
      );
      window.api.downloadMonitor_shutdown({ shouldMonitor: false });
    };
  }, []);

  useEffect(() => {
    if (shutdownTimer.timer === null || shutdownTimer.timer <= 0) return;

    const interval = setInterval(() => {
      setShutdownTimer((prev) => {
        const newTimer = prev.timer - 1;
        if (newTimer <= 0) {
          clearInterval(interval);
          return { ...prev, timer: 0, show: false };
        }
        return { ...prev, timer: newTimer };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [shutdownTimer.timer]);

  const handleStartDownload = async (e) => {
    e.preventDefault();
    if (!downloadUrl.trim()) return;

    const result = await window.api.start_actual_download({ url: downloadUrl });
    if (result.status == "ok") {
      setDownloadUrl("");
    }
  };

  const handleCancelShutdown = async () => {
    const result = await window.api.cancelshutdownDownload();
    if (result.status === "ok") {
      setIsDownloading(false);
      setProgress(0);
      setShutdownTimer({ timer: null, show: false });
      openModalCancel();
    }
  };

  return (
    <Container>
      <ModalComponent
        modalIsOpen={modalIsOpenBackToMainPage}
        closeModal={closeModalBackToMainPage}
        title="توجه"
        message="با بازگشت به صفحه اصلی عملیات لغو می‌شود."
        textBtnConfirm={"برو صفحه اصلی"}
        onConfirm={() => navigate("/", { replace: true })}
        onCancel={closeModalBackToMainPage}
        textBtnCancel={"بیخیال شدم"}
      />

      <ModalComponent
        modalIsOpen={modalIsOpenCancel}
        closeModal={closeModalCancel}
        title="لغو شد"
        message="دستور خاموشی با موفقیت لغو شد."
        onCancel={closeModalCancel}
        textBtnCancel={"بستن"}
      />
      <ModalComponent
        modalIsOpen={modalIsOpenError}
        closeModal={closeModalError}
        title="خطا در دانلود"
        message={errorMessage}
        onConfirm={closeModalError}
        textBtnConfirm={"متوجه شدم"}
        onCancel={closeModalError}
        textBtnCancel={null}
      />
      <h1 className="text-(--color-text) font-bold text-center text-[25px] mb-6">
        خاموشی بر اساس مدیریت دانلود
      </h1>

      <div className="border-(--color-secondary) border rounded-[10px] p-4 mb-3 text-center">
        <p className="text-(--color-secondary) font-medium">
          پس از اتمام هر دانلود، سیستم به طور خودکار خاموش می‌شود
        </p>
        <p className="text-[13px] text-(--color-text) mt-1">
          می‌توانید در هر زمان با کلیک روی دکمه "لغو خاموشی" از خاموش شدن سیستم
          جلوگیری کنید
        </p>
      </div>

      <div className="bg-(--color-background rounded-[10px] p-5 border border-white/10">
        <h4 className="text-(--color-text) font-bold mb-4">
          افزودن لینک دانلود جدید
        </h4>
        <form onSubmit={handleStartDownload} className="flex flex-col gap-2">
          <input
            type="url"
            placeholder="لینک مستقیم فایل را اینجا وارد کنید (https://...)"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            className="w-full p-3 rounded-[10px] bg-black/30 border border-white/10 text-white focus:outline-none focus:border-(--color-primary) transition-all"
            required
          />
          <button
            type="submit"
            disabled={isDownloading}
            className="bg-(--color-primary) hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 rounded-[10px] transition-all"
          >
            {isDownloading ? "در حال دانلود..." : "شروع دانلود"}
          </button>
        </form>
      </div>

      {isDownloading && progress > 0 && (
        <div className="flex flex-col gap-1 mt-3">
          <p className="text-left text-(--color-primary) font-medium">
            {progress.toFixed(1)}%
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-(--color-primary) h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {shutdownTimer.show && shutdownTimer.timer > 0 && !isDownloading && (
        <div className="mt-3 p-5  rounded-[10px] text-center border border-yellow-500 ">
          <p className="text-yellow-500 ">
            دانلود کامل شد! سیستم در {shutdownTimer.timer} ثانیه خاموش می‌شود...
          </p>
          <button
            onClick={handleCancelShutdown}
            className="mt-2 bg-red-600 hover:bg-red-500 text-(--color-text) font-medium text-center py-1 px-4 rounded-[10px] cursor-pointer transition-all "
          >
            لغو خاموشی
          </button>
        </div>
      )}

      <div className="fixed bottom-8 left-3">
        <Button
          text={"بازگشت به صفحه اصلی"}
          onClick={openModalBackToMainPage}
        />
      </div>
    </Container>
  );
};

export default DownloadMonitor;
