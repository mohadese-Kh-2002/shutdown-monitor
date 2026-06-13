import { Link } from "react-router-dom";
import Container from "../components/Container";
import Button from "../components/Button";

const links = [
  { id: 1, title: "تایمر معکوس", link: "/countdown", active: false },
  { id: 2, title: "زمانبندی", link: "/schedule", active: false },
  { id: 3, title: "عدم فعالیت", link: "/idleTimer", active: false },
  { id: 4, title: "مدیریت دانلود", link: "/downloadMonitor", active: false },
];

const Home = () => {

  return (
    <Container>
      <div className="flex-1 flex-col gap-10 h-full overflow-y-hidden">
        <div className="shrink-0 h-[70vh] " >
          <h1 className="text-(--color-text) font-bold text-[25px] text-center py-0">مدیریت خاموشی</h1>
          <div className="flex justify-center items-center">
            <img src="./shutdown.png" width={400} height={400} className="opacity-30 select-none" />
          </div>
          
        
                 
        </div>
        <div className="shrink-0 h-[30vh] flex flex-col justify-end p-5">
          <div className="grid grid-cols-2 gap-5  ">
            {links.map((l) => (
              
              <Button key={l.id} to={l.link} text={l.title} replace/>
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              to={"/info"}
              replace
              className="text-(--color-primary) hover:text-(--color-secondary) transition-all cursor-pointer font-medium mt-3"
            >
              اطلاعات درباره اپلیکیشن
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
