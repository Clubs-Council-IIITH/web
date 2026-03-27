import ImageMasonry from "components/ImageMasonry";
import path from "path"
import {promises as fs} from 'fs'
import { imageSizeFromFile } from 'image-size/fromFile'
import { Height } from "@mui/icons-material";
const FILESERVER_URL = process.env.FILESERVER_URL || "http://files";

export const metadata = {
  title: "Gallery | Life @ IIIT-H",
};

export default async function Gallery({ limit = undefined }) {
  const response = await fetch(`${FILESERVER_URL}/files/gallery/list`, {
    next: { revalidate: 1200 }, // 20 minutes
  });


  const galleryJSON = await response.json();
  const galleryItems = galleryJSON["gallery"].map(
    (item) => ({url:`${FILESERVER_URL}${item.url}`, height:item.height, width:item.width}),
  );



  return <ImageMasonry images={galleryItems} limit={limit} />;
}
