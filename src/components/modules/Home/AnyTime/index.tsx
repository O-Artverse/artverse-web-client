import Image from "next/image";
import BannerImg from "@/assets/images/anytime.png";
import PlayIconUrl from "@/components/common/icons/Playicon.svg";
import ViewFullIconUrl from "@/components/common/icons/ViewFull.svg";
import Tate from "@/components/common/icons/Tate.svg";

const AnyTime = () => {
  return (
<div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
  <Image
    src={BannerImg}
    alt="Banner"
    fill
    className="object-cover z-0"
    priority
  />
   <div className="absolute left-0 top-0 h-full flex flex-col justify-center w-[50%] overflow-hidden">
    <div className="px-4">
     
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight break-words">
      Join art exhibitions <br />
      <span className="text-primary">anytime, anywhere</span>
    </h1>
    <div className="flex-col gap-2 mt-6 hidden md:flex">
      <span className="text-white font-bold text-sm flex items-center gap-2">
        <Image src={Tate} alt="Play" className="w-8 h-8" />
        TATE MODERN
      </span>
      <span className="text-white font-bold uppercase text-sm">
        LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISCING ELIT
      </span>
      <p className="text-white/90 mt-2 text-xs break-words">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
      </p>
    </div>
    <div className="flex flex-row flex-wrap gap-4 mt-8 w-full max-w-[420px]">
      <button className="flex items-center gap-2 text-white rounded-full font-semibold">
        <Image src={PlayIconUrl} alt="Play" className="w-8 h-8" />
        <span className="hidden sm:inline whitespace-nowrap">Play audio</span>
      </button>
      <button className="flex items-center gap-2 text-white rounded-full font-semibold">
        <Image src={ViewFullIconUrl} alt="View Fullscreen" className="w-8 h-8" />
        <span className="hidden sm:inline whitespace-nowrap">View Fullscreen</span>
      </button>
    </div>
  </div>
</div>
</div>

  );
};

export default AnyTime;