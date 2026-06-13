import { Suspense } from "react";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Countdown = lazy(() => import("./pages/Countdown"));
const IdleTimer = lazy(() => import("./pages/IdleTimer"));
const DownloadMonitor = lazy(() => import("./pages/DownloadMonitor"));
const Info=lazy(()=>import("./pages/Info"))

const App = () => {
  return (
    <div className="bg-(--color-background) h-screen overflow-y-hidden w-full">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-(--color-background)">
            <div className="w-16 h-16 border-6 border-(--color-primary) border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/countdown" element={<Countdown />} />
          <Route path="/idleTimer" element={<IdleTimer />} />
          <Route path="/downloadMonitor" element={<DownloadMonitor />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
