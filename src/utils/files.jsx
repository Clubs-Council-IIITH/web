"use client";

import { makeClient } from "gql/provider";
import { GET_SIGNED_UPLOAD_URL } from "gql/queries/misc";

export function getFile(filepath) {
  if (filepath?.toLowerCase()?.startsWith("http")) {
    // return the full URL if global URL
    return filepath;
  } else if (filepath) {
    // call files service if local URL
    return `/files/download?filename=${filepath}`;
  }
}

export async function uploadFile(file, filetype = "image") {
  // get signed upload URL
  const {
    data: {
      signedUploadURL: { url },
    },
  } = await makeClient().query({
    query: GET_SIGNED_UPLOAD_URL,
    fetchPolicy: "network-only",
  });

  // upload file to signed URL
  const body = new FormData();
  body.append("file", file);

  var filename = null;
  try {
    filename = await fetch(`${url}?filetype=${filetype}`, {
      body: body,
      method: "POST",
    });
    if (filename.status === 200) filename = await filename.text();
    else filename = null;
  } catch (e) {
    filename = null;
    throw e;
  }

  return filename;
}
