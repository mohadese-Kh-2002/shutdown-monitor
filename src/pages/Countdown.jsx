import { useEffect, useReducer, useRef, useState } from "react";
import Container from "../components/Container";
import Button from "../components/Button";
import ModalComponent from "../components/Modal";
import { useNavigate } from "react-router-dom";

const initialState = {
  hours: 0,
  minutes: 0,
  seconds: 0,
};
const myReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_HOURS": {
      const newHours = Math.max(0, Math.min(23, state.hours + action.payload));
      return { ...state, hours: newHours };
    }
    case "UPDATE_MINUTES": {
      const newMinutes = Math.max(
        0,
        Math.min(59, state.minutes + action.payload),
      );
      return { ...state, minutes: newMinutes };
    }

    case "UPDATE_SECONDS": {
      const newSeconds = Math.max(
        0,
        Math.min(59, state.seconds + action.payload),
      );
      return { ...state, seconds: newSeconds };
    }
    case "TICK": {
      const { hours, minutes, seconds } = state;
      if (hours === 0 && minutes === 0 && seconds === 0) {
        return state;
      }
      let newSeconds = seconds - 1;
      let newMinutes = minutes;
      let newHours = hours;
      if (newSeconds < 0) {
        newSeconds = 59;
        newMinutes -= 1;
      }
      if (newMinutes < 0) {
        newMinutes = 59;
        newHours -= 1;
      }
      return { ...state, hours: newHours, minutes: newMinutes, seconds: newSeconds };
    }
    case "RESET":
      return { hours: 0, minutes: 0, seconds: 0 };
    default:
      return state;
  }
};

const Countdown = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(myReducer, initialState);
  const [isCounting, setIsCounting] = useState(false);
  const [modalIsOpenBackToMainPage, setIsOpenBackToMainPage] = useState(false);
  const [modalIsOpenCancel, setIsOpenCancel] = useState(false);
  const [modalIsOpenStart, setIsOpenStart] = useState(false);

  const openModalBackToMainPage = () => setIsOpenBackToMainPage(true);

  const closeModalBackToMainPage = () => setIsOpenBackToMainPage(false);

  const openModalStart = () => setIsOpenStart(true);

  const closeModalStart = () => setIsOpenStart(false);

  const openModalCancel = () => setIsOpenCancel(true);

  const closeModalCancel = () => setIsOpenCancel(false);
  const intervalRef = useRef(null);
  const handleWheel = (event, type) => {
    if (isCounting) {
      event.preventDefault();
      return;
    }
    const payload = event.deltaY > 0 ? -1 : 1;
    dispatch({ type: `UPDATE_${type.toUpperCase()}`, payload: payload });
  };
  const handleCountDown = async (event) => {
    if (state.hours === 0 && state.minutes === 0 && state.seconds === 0) {
      openModalStart();
      return;
    }

    if (!isCounting) {
      setIsCounting(true);
      const totalSeconds = state.hours * 3600 + state.minutes * 60 + state.seconds;
      await window.api.countdown_shutdown(totalSeconds);
  
    } else {
      event.preventDefault();
    }
  };
  useEffect(() => {
    if (isCounting) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isCounting, dispatch]);
  const handleCancel = async () => {
    clearInterval(intervalRef.current);
    setIsCounting(false);
    dispatch({ type: "RESET" });
    const result = await window.api.cancelShutdownTimer();
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
          if (isCounting) {
            handleCancel();
          }

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
        خاموشی بر اساس تایمر معکوس
      </h1>
      <p className="text-yellow-500 text-center">
        برای تعیین کردن اعداد باید روی آن اسکرول کرد تا به عدد مورد نظر خود
        برسید.
      </p>
      <div className="flex justify-center items-center flex-col h-[50vh]">
        <div className="font-bold text-(--color-text) flex items-center gap-3 text-[30px]">
          <span
            onWheel={(e) => handleWheel(e, "seconds")}
            className="cursor-pointer"
          >
            {String(state.seconds).padStart(2, 0)}
          </span>
          <span>:</span>
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
        </div>
        <div className="flex flex-col gap-3 mt-5">
          <button
            disabled={isCounting}
            onClick={(e) => handleCountDown(e)}
            className={`${isCounting ? "bg-slate-800" : "bg-(--color-primary) hover:bg-blue-600"}   text-(--color-text) font-medium  text-center py-2 px-5 rounded-[10px] cursor-pointer transition-all`}
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

export default Countdown;
