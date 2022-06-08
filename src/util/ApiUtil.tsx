type Params = {
  queryKey: [string, { hash: string }];
};

export async function getArtwork(params: Params) {
  const [, { hash }] = params.queryKey;
  const response = await fetch(
    "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + hash
  );

  if (!response.ok) {
    throw new Error("Problem fetching on Museum Api");
  }
  return await response.json();
}

export async function getRecentSheet() {
  const response = await fetch(
    "https://sheet.best/api/sheets/092dc8b9-4940-4cf3-842d-ee99768e998a/0:5"
  );

  if (!response.ok) {
    throw new Error("Problem fetching on Sheet Api");
  }
  return await response.json();
}

export async function getTodaySheet() {
  const response = await fetch(
    "https://sheet.best/api/sheets/092dc8b9-4940-4cf3-842d-ee99768e998a/0)"
  );

  if (!response.ok) {
    throw new Error("Problem fetching on Sheet Api");
  }
  return await response.json();
}
