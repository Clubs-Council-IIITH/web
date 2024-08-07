const FILESERVER_URL = process.env.FILESERVER_URL || "http://files";
const STATIC_URL = process.env.STATIC_URL || "http://nginx/static";

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

export async function uploadFile(file, filetype = "image") {
  // early return if no file
  if (!file) return null;

  // get signed url
  let res = await fetch("/actions/files/upload");
  let {
    data: { url },
  } = await res.json();

  // upload file to signed URL
  const body = new FormData();
  body.append("file", file);

  var filename = null;
  try {
    filename = await fetch(`${url}?filetype=${filetype}`, {
      body: body,
      method: "POST",
    });
    if (filename.status >= 200 && filename.status < 300)
      filename = await filename.text();
    else filename = null;
  } catch (e) {
    filename = null;
    throw e;
  }

  return filename;
}
