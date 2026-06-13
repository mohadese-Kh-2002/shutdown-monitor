import { useState } from "react";
import Container from "../components/Container";
import Button from "../components/Button";

const sections = [
  {
    title: "تایمر معکوس",
    content:
      "این بخش برای زمانی مناسب است که می‌خواهید سیستم بعد از یک بازه زمانی مشخص خاموش شود. کافی است مدت زمان را وارد کنید تا اپلیکیشن پس از پایان زمان تعیین‌شده، عملیات انتخابی را اجرا کند.",
  },
  {
    title: "زمان‌بندی",
    content:
      "از این بخش برای تعیین زمان دقیق اجرای عملیات استفاده می‌شود. اگر می‌خواهید خاموش شدن سیستم در ساعت مشخصی انجام شود، این گزینه بهترین انتخاب است.",
  },
  {
    title: "عدم فعالیت",
    content:
      "این گزینه زمانی کاربرد دارد که سیستم برای مدتی بدون استفاده بماند. اگر کاربر با سیستم کار نکند، برنامه پس از مدت مشخصی عملیات موردنظر را اجرا می‌کند.",
  },
  {
    title: "مدیریت دانلود",
    content:
      "این بخش برای زمانی طراحی شده که می‌خواهید پس از پایان دانلود، سیستم به‌طور خودکار خاموش شود. این قابلیت برای دانلودهای طولانی بسیار کاربردی است.",
  },
];

const Info = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <Container>
     <div className="text-(--color-text) mb-10">
       <h1 className="font-bold mb-3">اپلیکیشن مدیریت خاموشی</h1>
      <p className="font-medium">این اپلیکیشن برای مدیریت زمان خاموش شدن سیستم طراحی شده است.

شما می‌توانید بر اساس تایمر معکوس، زمان‌بندی، عدم فعالیت یا مدیریت دانلود، زمان خاموش شدن  را کنترل کنید.</p>
     </div>
     
      <div className="flex flex-col gap-5">
        {sections.map((s, index) => (
          <div key={index} className="border border-(--color-text) rounded-[10px] overflow-hidden">
          
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-4 bg-slate-800 text-(--color-text) font-bold flex justify-between"
            >
              <span>{s.title}</span>
              <span>{openIndex === index ? "-" : "+"}</span>
            </button>
            
       
            <div 
              className={`bg-(--color-background) text-(--color-text) transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === index ? "max-h-40 py-3 px-4" : "max-h-0 py-0 px-4"
              }`}
            >
              {s.content}
            </div>
          </div>
        ))}
      </div>
     <div className="fixed bottom-8 left-3">
        <Button to={"/"} text={"بازگشت به صفحه اصلی"} />
      </div>
    </Container>
  )
}

export default Info