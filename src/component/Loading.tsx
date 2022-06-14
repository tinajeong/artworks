import React from "react";
import reload from "../images/reload.png";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 place-items-center m-6">
      <img
        src={reload}
        className="animate-spin h-7 w-7 mr-3 bg-transparent"
      ></img>
    </div>
  );
}
