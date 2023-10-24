import ImageMasonry from "components/ImageMasonry";
import ImageModal from "components/ImageModal";
import { getStaticFile } from "utils/files";

export const metadata = {
  title: "Gallery",
};

export default async function Gallery({ searchParams, limit = undefined }) {
  const response = await fetch(getStaticFile('gallery/'));
  const galleryJSON = await response.json();
  const galleryItems = galleryJSON.map(item => `${getStaticFile('gallery/')}${item.name}`);
  return (
    <>
      <ImageMasonry
        images={galleryItems}
        linkPrefix="/gallery?img="
        limit={limit}
      />
      <ImageModal images={galleryItems} id={searchParams?.img} />
    </>
  );
}
