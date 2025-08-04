import { Button } from "@heroui/react";
import { CaretCircleRightIcon } from "@phosphor-icons/react";
import Image from "next/image";
import comingL from "@/assets/images/comingL.png";
import comingM from "@/assets/images/comingM.png";
import comingR from "@/assets/images/comingR.png";

const events = [
    {
      date: "24 Jul, 2024",
      title: "Bernard Von Orley At Saint-Géry",
      img: comingL,
    },
    {
      date: "04 Aug, 2024",
      title: "Bernard Von Orley At Saint-Géry",
      img: comingM,
    },
    {
      date: "12 Dec, 2024",
      title: "Bernard Von Orley At Saint-Géry",
      img: comingR,
    },
  ];

const Coming = () => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-between dark:bg-black bg-white py-8 gap-5">
    <h2 className="text-3xl md:text-4xl font-bold text-[#9C27B0] text-center">
      Up Coming Event
    </h2>
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center w-full max-w-5xl flex-1">
      {events.map((event, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow-lg overflow-hidden w-72 flex flex-col"
        >
          <div className="w-full h-[350px] relative">
            <Image
              src={event.img}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="bg-[#9C27B0] p-5 flex flex-col gap-3">
            <span className="text-xs text-white mb-1">{event.date}</span>
            <span className="text-white font-semibold text-sm">{event.title}</span>
          </div>
        </div>
      ))}
    </div>
    <div className="w-full flex justify-center">
      <Button
        className="bg-primary rounded-xl px-4 py-2 text-base md:px-5 md:py-4 md:text-lg lg:text-xl font-bold text-white"
        endContent={<CaretCircleRightIcon size={24} weight="fill" />}
      >
        Explore
      </Button>
    </div>
  </section>
  );
};

export default Coming;