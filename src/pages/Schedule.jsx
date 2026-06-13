import Container from "../components/Container";
import Button from "../components/Button";
import { useEffect, useReducer, useState } from "react";
import ModalComponent from "../components/Modal";
import { useNavigate } from "react-router-dom";
const initialState = {
  hours: 0,
  minutes: 0,
  time: "am",
};
const myReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_HOURS": {
      const newHours = Math.max(0, Math.min(12, state.hours + action.payload));
      return { ...state, hours: newHours };
    }
    case "UPDATE_MINUTES": {
      const newMinutes = Math.max(
        0,
        Math.min(59, state.minutes + action.payload),
      );
      return { ...state, minutes: newMinutes };
    }
    case "UPDATE_TIME": {
      const newTime = state.time == "am" ? "pm" : "am";
      return { ...state, time: newTime };
    }

    default:
      return state;
  }
};
const Schedule = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(myReducer, initialState);
  const [isStart, setIsStart] = useState(false);
  const [modalIsOpenBackToMainPage, setIsOpenBackToMainPage] = useState(false);
  const [modalIsOpenCancel, setIsOpenCancel] = useState(false);
  const [modalIsOpenStart, setIsOpenStart] = useState(false);
  const [remaingTime, setRemainTime] = useState(null);

  useEffect(() => {
    const handleCountdown = (event, time) => {
      setRemainTime(time);
    };

    window.api.onUpdateCountdown(handleCountdown);

    return () => {
      window.api.removeUpdate("update_countdown", handleCountdown);
    };
  }, []);
  const openModalBackToMainPage = () => setIsOpenBackToMainPage(true);

  const closeModalBackToMainPage = () => setIsOpenBackToMainPage(false);
  const openModalStart = () => setIsOpenStart(true);
  const closeModalStart = () => setIsOpenStart(false);
  const openModalCancel = () => setIsOpenCancel(true);
  const closeModalCancel = () => setIsOpenCancel(false);

  const handleWheel = (event, type) => {
    if (isStart) {
      event.preventDefault();
      return;
    }
    const payload = event.deltaY > 0 ? -1 : 1;
    dispatch({ type: `UPDATE_${type.toUpperCase()}`, payload: payload });
  };
  const startShutDown = async () => {
    if (state.hours === 0 && state.minutes === 0) {
      openModalStart();
      return;
    }

    setIsStart(true);
    const { hours, minutes, time } = state;
    let newHours = hours;
    if (time == "pm") {
      newHours += 12;
    }
    if (time == "am") {
      if (hours == 12) {
        newHours = 0;
      }
    }
   await window.api.schedule_shutdown({
      hours: newHours,
      minutes,
    });

  };
  const handleCancel = async () => {
    setIsStart(false);
    setRemainTime(null);
    const result = await window.api.cancelShutdownSchedule();
    if (result.status == "ok") {
      openModalCancel();
   
    }
  };
  return (
    <Container>
      <ModalComponent
        modalIsOpen={modalIsOpenBackToMainPage}
        closeModal={closeModalBackToMainPage}
        title="توجه"
        message="با بازگشت به صفحه اصلی عملیات لغو میشود."
        textBtnConfirm={"برو صفحه اصلی"}
        onConfirm={() => {
          navigate("/", { replace: true });
        }}
        onCancel={closeModalBackToMainPage}
        textBtnCancel={"بیخیال شدم"}
      />
      <ModalComponent
        modalIsOpen={modalIsOpenCancel}
        closeModal={closeModalCancel}
        title="توجه"
        message="عملیات با موفقیت لفو شد."
        onCancel={closeModalCancel}
        textBtnCancel={"بستن مدال"}
      />
      <ModalComponent
        modalIsOpen={modalIsOpenStart}
        closeModal={closeModalStart}
        title="توجه"
        message="زمان تعیین نکردی"
        onCancel={closeModalStart}
        textBtnCancel={"بستن مدال"}
      />

      <h1 className="text-(--color-text) font-bold text-center text-[25px] mb-5">
        خاموشی بر اساس زمانبندی
      </h1>
      <p className="text-yellow-500 text-center">
        برای تعیین کردن اعداد باید روی آن اسکرول کرد تا به عدد مورد نظر خود
        برسید.
      </p>
      <div className="flex justify-center items-center flex-col h-[50vh]">
        <div className="font-bold text-(--color-text) flex items-center gap-3 text-[30px]">
          <span
            onWheel={(e) => handleWheel(e, "minutes")}
            className="cursor-pointer"
          >
            {String(state.minutes).padStart(2, 0)}
          </span>

          <span>:</span>

          <span
            onWheel={(e) => handleWheel(e, "hours")}
            className="cursor-pointer"
          >
            {String(state.hours).padStart(2, 0)}
          </span>

          <span
            onWheel={(e) => handleWheel(e, "time")}
            className="cursor-pointer mr-5 text-[14px]"
          >
            {String(state.time) == "pm" ? "بعد از ظهر" : "قبل از ظهر"}
          </span>
        </div>
        {remaingTime && (
          <div className=" text-[12px] font-bold text-yellow-500 flex items-center gap-3  my-5">
            <span>{String(remaingTime.seconds).padStart(2, 0)}</span>

            <span>:</span>

            <span>{String(remaingTime.minutes).padStart(2, 0)}</span>
            <span>:</span>

            <span>{String(remaingTime.hours).padStart(2, 0)}</span>
            <span>زمان باقی مانده</span>
          </div>
        )}
 
        <div className="flex flex-col gap-3 mt-5">
          <button
            disabled={isStart}
            onClick={startShutDown}
            className={`${isStart ? "bg-slate-800" : "bg-(--color-primary) hover:bg-blue-600"}   text-(--color-text) font-medium  text-center py-2 px-5 rounded-[10px] cursor-pointer transition-all`}
          >
            شروع کن
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-500 text-white font-medium  text-center py-2 px-5 rounded-[10px] cursor-pointer transition-all"
          >
            لغو
          </button>
        </div>
      </div>

      <div className="fixed bottom-8 left-3">
        <Button
          text={"بازگشت به صفحه اصلی"}
          onClick={openModalBackToMainPage}
        />
      </div>
    </Container>
  );
};

export default Schedule;
