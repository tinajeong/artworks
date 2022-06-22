import { useQuery } from "react-query";
import Loading from "./Loading";
import FetchingError from "./FetchingError";
import React from "react";
import { useState } from "react";
type ArtObject = {
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  primaryImage: string;
  dimensions: string;
  medium: string;
  objectDate: string;
};
type Hash = {
  object_id: string;
  date: string;
};

function assertIsHash(hash: any): asserts hash is Hash {
  if (!("object_id" in hash && "date" in hash)) {
    throw new Error("Not Hash");
  }
}

function assertIsArtobject(artObject: any): asserts artObject is ArtObject {
  if (!("title" in artObject && "artistDisplayName" in artObject)) {
    throw new Error("Not ArtObject");
  }
}

const searchTitle = (event) => {
  const artist = event.target.getAttribute("data-title");
  window.open("https://www.metmuseum.org/search-results?q=" + artist, "_blank");
};
const searchArtistName = (event) => {
  const artist = event.target.getAttribute("data-artist-name");
  window.open("https://www.google.com/search?q=" + artist, "_blank");
};

export default function Artwork() {
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
        <div className="grid md:grid-cols-2 md:grid-rows-1 sm:grid-rows-2 sm:grid-cols-1 place-items-center bg-white">
          <img
            src={fetched["primaryImage"]}
            alt={fetched["primaryImage"]}
            className="p-8"
          />
          <div className="flex-column">
            <h1
              className="float-center transition ease-in-out delay-150 hover:scale-110 hover:text-slate-500 duration-150 justify-self-start tracking-tight font-extrabold bg-white text-slate-900 text-3xl md:text-2xl sm:text-lg mb-2"
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
            <h2 className="float-center max-w-sm mx-auto text-slate-900 hover:scale-110 hover:text-slate-500 duration-150 items-center font-extrabold text-2xl sm:text-lg md:text-xl grid grid-cols-3 place-items-center">
              <span
                className="grid-column-1 col-span-2 place-self-end underline underline-offset-4"
                data-artist-name={fetched["artistDisplayName"]}
                onClick={searchArtistName}
                onMouseEnter={setSearchButtonView}
                onMouseOut={setSearchButtonView}
              >
                {fetched["artistDisplayName"]}
              </span>
              {isShown && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mt-1 mx-0.5 grid-column-2 place-self-start"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-artist-name={fetched["artistDisplayName"]}
                  onClick={searchArtistName}
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
            {/* <div className="text-slate-900 float-center">
              <h3>{fetched["artistDisplayBio"]}</h3>
            </div> */}
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
