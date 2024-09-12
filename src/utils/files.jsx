import { uploadFiles } from "actions/files/upload/server_action";
import dynamic from "next/dynamic";

const FILESERVER_URL = process.env.FILESERVER_URL || "http://files";
const STATIC_URL = process.env.STATIC_URL || "http://nginx/static";

// Dynamically import browser-image-resizer since it's only needed on the client side
const readAndCompressImage = dynamic(
  () => import("browser-image-resizer").then((mod) => mod.readAndCompressImage),
  { ssr: false },
);

export function getNginxFile(filepath) {
  return `${STATIC_URL}/${filepath}`;
}

export function getStaticFile(filepath, filetype = "image") {
  if (filepath?.toLowerCase()?.endsWith("pdf")) {
    filetype = "pdf";
  } else if (filepath?.toLowerCase()?.endsWith("json")) {
    filetype = "json";
  }

  return `${FILESERVER_URL}/files/static?filename=${filepath}&filetype=${filetype}`;
}

export function getFile(filepath) {
  if (filepath?.toLowerCase()?.startsWith("http")) {
    // return the full URL if global URL
    return filepath;
  } else if (filepath) {
    // call files service if local URL
    return `${FILESERVER_URL}/files/download?filename=${filepath}`;
  }
}

export async function uploadFile(
  file,
  filetype = "image",
  filename = null,
  maxSizeMB = 0.3,
) {
  // early return if no file
  if (!file) return null;

  let fileToUpload = file;

  // Resize image if it's larger than 300KB
  const config = {
    quality: 0.7,
    maxSizeMB: maxSizeMB,
  };

  let resizedBlob = null;
  try {
    resizedBlob = await readAndCompressImage(file, config);
  } catch (error) {
    fileToUpload = file;
    throw error;
  }

  const ext = file.name.split(".").pop();
  if (resizedBlob.size < file.size) {
    // convert blob to file
    fileToUpload = new File(
      [resizedBlob],
      `resized_${filename ? filename : file.name}.${ext}`,
      {
        type: resizedBlob.type,
        lastModified: new Date().getTime(),
      },
    );
  } else {
    fileToUpload = new File(
      [file],
      `${filename ? filename : file.name}.${ext}`,
      {
        type: file.type,
        lastModified: new Date().getTime(),
      },
    );
  }

  // get signed url
  let res = await uploadFiles();
  if (!res.ok) {
    throw res.error;
  }
  let { url } = res.data;

  // upload file to signed URL
  const body = new FormData();
  body.append("file", fileToUpload);

  let finalFilename = null;
  try {
    const response = await fetch(`${url}?filetype=${filetype}`, {
      body: body,
      method: "POST",
    });
    if (response.status >= 200 && response.status < 300) {
      finalFilename = await response.text();
    } else finalFilename = null;
  } catch (e) {
    finalFilename = null;
    throw e;
  }

  return finalFilename;
}
