import React from "react";
import moai_spin from "../images/moai_spin.webp";
export default function Loading() {
  return (
    <div className="grid grid-cols-1 place-items-center m-6">
      <img src={moai_spin} width={36} height={36} alt="spin"></img>
      <h3 className="text-stone-100">Loading...</h3>
    </div>
  );
}
