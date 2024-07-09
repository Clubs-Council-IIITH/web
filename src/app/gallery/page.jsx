import ImageMasonry from "components/ImageMasonry";
import ImageModal from "components/ImageModal";

const FILESERVER_URL = process.env.FILESERVER_URL || "http://files";

export const metadata = {
  title: "Gallery",
};

export default async function Gallery({ searchParams, limit = undefined }) {
  const response = await fetch(`${FILESERVER_URL}/files/gallery/list`, {
    next: { revalidate: 120 },
  });

  const galleryJSON = await response.json();
  const galleryItems = galleryJSON["gallery"].map(
    (item) => `${FILESERVER_URL}${item.url}`,
  );

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
