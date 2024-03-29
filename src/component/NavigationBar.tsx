import { Link } from "react-router-dom";
export default function NavigationBar() {
  return (
    <div className="nav bg-white underline underline-offset-4 border-y-2 border-slate-800 text-left grid grid-cols-4 pt-2 pb-2 place-items-center">
      <Link
        to="/"
        className="text-slate-800 font-extrabold text-3xl md:text-xl sm:text-md col-span-3 mx-auto ml-8 text"
      >
        Today's Artwork
      </Link>
      <Link
        to="artworks"
        className="h-8 w-8 mx-8 p-1.5 place-self-end content-center border-1 hover:scale-110 duration-150 hover:border-stone-400 hover:text-stone-400 rounded-lg bg-white border-2 border-slate-700 text-sm font-extrabold text-center overflow-hidden md:max-w-2xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      </Link>
      {/* </button> */}
    </div>
  );
}
