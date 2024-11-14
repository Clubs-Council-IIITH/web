import { getSignedUploadURL } from "actions/files/signed-url/server_action";
import dynamic from "next/dynamic";

const FILESERVER_URL = process.env.NEXT_PUBLIC_FILESERVER_URL || "http://files";
const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL || "http://nginx/static";
export const PUBLIC_URL = process.env.NEXT_PUBLIC_HOST || "http://localhost";

// Dynamically import browser-image-resizer since it's only needed on the client side
const readAndCompressImage = dynamic(
  () => import("browser-image-resizer").then((mod) => mod.readAndCompressImage),
  { ssr: false }
);

export function getNginxFile(filepath) {
  return `${STATIC_URL}/${filepath}`;
}

export function getStaticFile(
  filepath,
  filetype = "image",
  public_url = false
) {
  if (filepath?.toLowerCase()?.endsWith("pdf")) {
    filetype = "pdf";
  } else if (filepath?.toLowerCase()?.endsWith("json")) {
    filetype = "json";
  }

  if (public_url)
    return `${PUBLIC_URL}/files/static?filename=${filepath}&filetype=${filetype}`;
  else
    return `${FILESERVER_URL}/files/static?filename=${filepath}&filetype=${filetype}`;
}

export function getFile(filepath, public_url = false) {
  if (filepath?.toLowerCase()?.startsWith("http")) {
    // return the full URL if global URL
    return filepath;
  } else if (filepath) {
    // call files service if local URL
    if (public_url) return `${PUBLIC_URL}/files/download?filename=${filepath}`;
    else return `${FILESERVER_URL}/files/download?filename=${filepath}`;
  }
}

export async function uploadImageFile(file, filename = null, maxSizeMB = 0.3) {
  // early return if no file
  if (!file) return "";

  let fileToUpload = file;

  // Resize image if it's larger than 300KB
  const config = {
    quality: 0.7,
    maxSizeMB: maxSizeMB,
  };

  const ext = file.name.split(".").pop();
  let finalFilename = `${filename ? filename : file.name}.${ext}`;

  try {
    const resizedBlob = await readAndCompressImage(file, config);

    if (resizedBlob.size < file.size) {
      // convert blob to file
      finalFilename = "resized_" + finalFilename;
      fileToUpload = new File(
        [resizedBlob],
        file.name,
        {
          type: resizedBlob.type,
          lastModified: new Date().getTime(),
        }
      );
    } else {
      fileToUpload = new File(
        [file],
        `${filename ? filename : file.name}.${ext}`,
        {
          type: file.type,
          lastModified: new Date().getTime(),
        }
      );
    }

    finalFilename = await uploadFileCommon(fileToUpload, "image");
    return finalFilename;
  } catch (error) {
    throw error;
  }
}

export async function uploadPDFFile(
  file,
  static_file = false,
  title = null,
  maxSizeMB = 20,
) {
  if (!file || !title) return null;
  // check file size limits
  const sizeLimit = maxSizeMB * (1024 * 1024);
  if (file.size > sizeLimit) {
    throw Error(
      `File size exceeded ${maxSizeMB} MB, Please compress and reupload.`
    );
  }

  let filename = null;

  if (static_file && (!title || title === ""))
    throw Error("Title is required for static files.");
  else filename = title.toLowerCase().replace(/\s+/g, "_") + ".pdf";

  const finalFilename = await uploadFileCommon(
    file,
    "document",
    static_file,
    filename
  );
  return finalFilename;
}

async function uploadFileCommon(
  file,
  filetype,
  static_file = false,
  filename = null
) {
  try {
    // get signed url
    const details = {
      staticFile: static_file,
      filename: filename,
    };

    const res = await getSignedUploadURL(details);
    if (!res.ok) {
      throw res.err;
    }

    const { url } = res.data;

    // upload file to signed URL
    const body = new FormData();
    body.append("file", file);

    const response = await fetch(`${url}?filetype=${filetype}`, {
      body: body,
      method: "POST",
    });

    if (response.status >= 200 && response.status < 300) {
      const finalFilename = await response.text();
      return finalFilename;
    }
    throw response.err;
  } catch (error) {
    throw error;
  }
}
