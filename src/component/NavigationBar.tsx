import React from "react";
import { BiArchive } from "react-icons/bi";
export default function NavigationBar() {
  return (
    <div className="nav bg-stone-900 text-left grid grid-cols-4 my-3 place-items-center">
      <span className="text-white font-extrabold text-3xl col-span-3 mx-auto ml-8 text">
        Today's Artwork
      </span>
      <button
        className="w-32 h-8 mx-8 place-self-end content-center border-1 hover:scale-110 duration-150 hover:border-stone-400 hover:text-stone-400 rounded-lg bg-slate-700 text-white text-sm font-extrabold text-center overflow-hidden md:max-w-2xl"
        onClick={goToArchive}
      >
        {/* <BiArchive className="place-self-center" /> */} Recent Artworks
      </button>
    </div>
  );
}

function goToArchive() {
  alert("개발중!");
}
