import { useQuery } from "react-query";
import Loading from "./Loading";
import FetchingError from "./FetchingError";
import React from "react";
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

export default function Artwork() {
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
        throw new Error("Network response was not ok");
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
        <div className="grid grid-cols-2 place-items-center bg-white">
          <img
            src={fetched["primaryImage"]}
            alt={fetched["primaryImage"]}
            className="p-8"
          />
          <div className="flex-column">
            <h1 className="transition ease-in-out delay-150 hover:scale-110 hover:text-slate-500 duration-150 text-2xl place-self-center tracking-tight font-extrabold bg-white text-black  sm:text-2xl md:text-3xl mb-2">
              {fetched.title}
            </h1>
            <h3 className="max-w-sm mx-auto text-slate-900 items-center space-x-4 font-extrabold">
              {fetched["artistDisplayName"]}
            </h3>
            <div className="text-slate-900">
              <h3>{fetched["artistDisplayBio"]}</h3>
            </div>
            <div>-</div>
            <h3 className="text-slate-500">{fetched["dimensions"]}</h3>
            <h3 className="text-slate-500">{fetched["medium"]}</h3>
            <h3 className="text-slate-500">{fetched["objectDate"]}</h3>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
