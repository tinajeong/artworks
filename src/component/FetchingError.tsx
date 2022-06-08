import React from "react";
export default function FetchingError(props: any) {
  return (
    <div>
      <h3>Oops! Error ocurred while fetching data</h3>
      <i>{props.message}</i>
    </div>
  );
}
