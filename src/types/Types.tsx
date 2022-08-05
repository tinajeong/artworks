export type ArtObject = {
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  primaryImage: string;
  dimensions: string;
  medium: string;
  objectDate: string;
};
export type Hash = {
  object_id: string;
  date: string;
};

export function assertIsHash(hash: any): asserts hash is Hash {
  if (!("object_id" in hash && "date" in hash)) {
    throw new Error("Not Hash");
  }
}

export function assertIsArtobject(
  artObject: any
): asserts artObject is ArtObject {
  if (!("title" in artObject && "artistDisplayName" in artObject)) {
    throw new Error("Not ArtObject");
  }
}
