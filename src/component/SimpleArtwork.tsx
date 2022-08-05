import { useState } from "react";
import { useQuery } from "react-query";
import FetchingError from "./FetchingError";
import Loading from "./Loading";
import { ArtObject, assertIsArtobject } from "../types/Types";

export default function SimpleArtwork() {
  const {
    status: artworkStatus,
    data: artworkData,
    isIdle: isArtworkIdle,
  } = useQuery(
    ["artwork"],
    async () => {
      const response = await fetch(
        "https://sheet.best/api/sheets/092dc8b9-4940-4cf3-842d-ee99768e998a/tabs/recent/0:4"
      );

      if (!response.ok) {
        throw new Error("Problem fetching on Sheet Api");
      }

      const data = await response.json();
      assertIsArtobject(data[0]);
      return data;
    },
    {
      retry: 2,
    }
  );
  if (artworkStatus === "loading" || isArtworkIdle) {
    return <Loading />;
  }

  if (artworkStatus === "error") {
    return <FetchingError message={""} />;
  }
  return artworkData.length > 0 ? (
    <div className="artwork max-h-full grid md:grid-cols-2 md:grid-rows-1 sm:grid-rows-2 sm:grid-cols-1 gap-1 md:border-x-2 bg-white">
      {artworkData.map((artwork, index) => {
        return (
          <div
            id={index}
            className="flex flex-col sm:flex-row flex-column justify-items-center align-middle text-left m-2 p-4 border-2 border-slate-300 rounded-lg"
          >
            <img
              src={artwork.primaryImage}
              alt={artwork.primaryImage}
              width={200}
              height={200}
              className="self-center md:max-w-md lg:max-w-lg"
            />

            <div className="m-4 p-2 self-center border-l-4 border-r-4 border-slate-200">
              <h2 className="text-slate-900 text-md text-gray-900 mb-2">
                {artwork.title}
              </h2>

              <p className="text-sm">{artwork.artistDisplayName}</p>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <Loading />
  );
}
