import { useQuery } from "react-query";
import Loading from "./Loading";
import FetchingError from "./FetchingError";
import React from "react";
import { useState } from "react";
import { ArtObject, Hash, assertIsArtobject, assertIsHash } from "./Types";

const searchTitle = (event) => {
  const artist = event.target.getAttribute("data-title");
  window.open("https://www.metmuseum.org/search-results?q=" + artist, "_blank");
};
const searchArtistName = (event) => {
  const artist = event.target.getAttribute("data-artist-name");
  window.open("https://www.google.com/search?q=" + artist, "_blank");
};

export default function Artwork() {
  // console.log(new Date().toLocaleString());
  const [isShown, setIsShown] = useState(false);
  const [isLShown, setIsLShown] = useState(false);
  const setInfoButtonView = () => {
    if (isLShown) {
      setIsLShown(false);
    } else {
      setIsLShown(true);
    }
  };
  const setSearchButtonView = () => {
    if (isShown) {
      setIsShown(false);
    } else {
      setIsShown(true);
    }
  };
  const {
    status: hashStatus,
    error: hashError,
    data: hashData,
  } = useQuery<Hash, Error>(
    "hash",
    async () => {
      const response = await fetch(
        "https://sheet.best/api/sheets/092dc8b9-4940-4cf3-842d-ee99768e998a/0"
      );

      if (!response.ok) {
        throw new Error("Problem fetching on Sheet Api");
      }

      const data = await response.json();
      console.log("hash", data);
      assertIsHash(data[0]);
      return data[0];
    },
    {
      retry: 2,
    }
  );

  const {
    status: artworkStatus,
    error: artworkError,
    data: artworkData,
    isIdle: isArtworkIdle,
  } = useQuery<ArtObject, Error>(
    ["artwork", hashData?.object_id],
    async () => {
      const response = await fetch(
        "https://collectionapi.metmuseum.org/public/collection/v1/objects/" +
          hashData?.object_id
      );

      if (!response.ok) {
        throw new Error("Problem fetching on Museum Api");
      }

      const data = await response.json();
      console.log("artwork", data);
      assertIsArtobject(data);
      return data;
    },
    {
      enabled:
        !!hashData && !!hashData.object_id && hashData.object_id.length > 1,
      retry: 2,
    }
  );

  if (
    hashStatus === "loading" ||
    artworkStatus === "loading" ||
    isArtworkIdle
  ) {
    return <Loading />;
  }

  if (hashStatus === "error") {
    return <FetchingError message={hashError!.message} />;
  }

  if (artworkStatus === "error") {
    return <FetchingError message={artworkError!.message} />;
  }

  const fetched = artworkData;
  return (
    <div className="artwork">
      {fetched ? (
        <div className="h-screen grid md:grid-cols-2 md:grid-rows-1 sm:grid-rows-2 sm:grid-cols-1 place-items-center gap-1 md:border-x-2 bg-white">
          <img
            src={fetched["primaryImage"] + "?tr=w-1,h-1"}
            alt={"artwork image"}
            className="p-8 md:max-w-md lg:max-w-lg"
            loading="lazy"
          />
          <div className="flex-column">
            <h1
              className="float-center transition ease-in-out delay-150 hover:scale-105 hover:text-slate-500 duration-150 justify-self-start tracking-tight font-extrabold bg-white text-slate-900 text-3xl md:text-2xl sm:text-lg mb-2"
              onClick={searchTitle}
              data-title={fetched["title"]}
              onMouseEnter={setInfoButtonView}
              onMouseOut={setInfoButtonView}
            >
              {fetched.title}
              {isLShown && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mt-1 mx-0.5 float-right"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </h1>
            <h2
              className="flex flex-row flex-wrap justify-center	place-items-cetner underline underline-offset-4 max-w-sm mx-auto text-slate-900 hover:scale-110 hover:text-slate-500 duration-150 font-extrabold text-2xl md:text-xl sm:text-md"
              onClick={searchArtistName}
              onMouseEnter={setSearchButtonView}
              onMouseOut={setSearchButtonView}
              data-artist-name={fetched["artistDisplayName"]}
            >
              <span
                className="w-auto"
                data-artist-name={fetched["artistDisplayName"]}
              >
                {fetched["artistDisplayName"]}
              </span>
              {isShown && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mt-1 mx-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-artist-name={fetched["artistDisplayName"]}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </h2>
            <div>-</div>
            <h3 className="text-slate-500 float-center hover:underline">
              {fetched["dimensions"]}
            </h3>
            <h3 className="text-slate-500 float-center hover:underline">
              {fetched["medium"]}
            </h3>
            <h3 className="text-slate-500 float-center hover:underline">
              {fetched["objectDate"]}
            </h3>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
