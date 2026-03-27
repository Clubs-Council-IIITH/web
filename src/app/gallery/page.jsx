import ImageMasonry from "components/ImageMasonry";
import path from "path"
import {promises as fs} from 'fs'
import { imageSizeFromFile } from 'image-size/fromFile'
import { Height } from "@mui/icons-material";
const FILESERVER_URL = process.env.FILESERVER_URL || "http://files";

export const metadata = {
  title: "Gallery | Life @ IIIT-H",
};

async function returnImageObject(name){

  const dimensions = await imageSizeFromFile(`public/gallery_images/${name}`);

  return {url:`/gallery_images/${name}`,  width:dimensions.width, height: dimensions.height};



}
export default async function Gallery({ limit = undefined }) {
  // const imagePath= path.join(process.cwd(), 'public/gallery_images');
  // const file_names = await fs.readdir(imagePath )
  // const galleryItems = await Promise.all( file_names.map(returnImageObject));
  // console.log(galleryItems);
   const response = await fetch(`${FILESERVER_URL}/files/gallery/list`, {
    next: { revalidate: 1200 }, // 20 minutes
  });

  const galleryJSON = await response.json();
  const galleryItems = galleryJSON["gallery"].map(
    (item) => ({url:`${FILESERVER_URL}${item.url}`, height:item.height|0, width:item.width|0}),
  );



  return <ImageMasonry images={galleryItems} limit={limit} />;
}
