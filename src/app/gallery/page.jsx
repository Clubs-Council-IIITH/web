import ImageMasonry from "components/ImageMasonry";
import ImageModal from "components/ImageModal";

const galleryItems = [
  "/assets/img/gallery/1.jpg",
  "/assets/img/gallery/2.jpg",
  "/assets/img/gallery/3.jpg",
  "/assets/img/gallery/4.jpg",
  "/assets/img/gallery/5.jpg",
  "/assets/img/gallery/6.jpg",
  "/assets/img/gallery/7.jpg",
  "/assets/img/gallery/8.jpg",
  "/assets/img/gallery/9.jpg",
  "/assets/img/gallery/10.jpg",
  "/assets/img/gallery/11.jpg",
  "/assets/img/gallery/12.jpg",
  "/assets/img/gallery/13.jpg",
  "/assets/img/gallery/14.jpg",
  "/assets/img/gallery/15.jpg",
  "/assets/img/gallery/16.jpg",
  "/assets/img/gallery/17.jpg",
  "/assets/img/gallery/18.jpg",
  "/assets/img/gallery/19.jpg",
  "/assets/img/gallery/20.jpg",
  "/assets/img/gallery/21.jpg",
  "/assets/img/gallery/22.jpg",
];

export const metadata = {
  title: "Gallery",
};

export default function Gallery({ searchParams }) {
  return (
    <>
      <ImageMasonry images={galleryItems} linkPrefix="/gallery?img=" />
      <ImageModal images={galleryItems} id={searchParams?.img} />
    </>
  );
}
