import { useQuery } from "react-query";
import React from "react";
import Loading from "../component/Loading";
import FetchingError from "../component/FetchingError";
import { getRecentSheet, getTodaySheet } from "./ApiUtil";

interface Hash {
  object_id: string;
  date: string;
}
export function getRecentHash() {
  const response = useQuery<Hash, Error>("hash", getRecentSheet);

  if (response.status === "loading") {
    return <Loading />;
  }
  if (response.status === "error") {
    return <FetchingError message={response.error!.message} />;
  }
  const fetched = response.data;
  return fetched;
}

export function getTodaytHash() {
  const response = useQuery<Hash, Error>("hash", getTodaySheet);

  if (response.status === "loading") {
    return <Loading />;
  }
  if (response.status === "error") {
    return <FetchingError message={response.error!.message} />;
  }
  const fetched = response.data;
  return fetched;
}
