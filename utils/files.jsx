import client from "apollo-client";
import { GET_SIGNED_UPLOAD_URL } from "gql/queries/misc";

export async function uploadFile(file, filetype = "image") {
    // get signed upload URL
    const {
        data: {
            signedUploadURL: { url },
        },
    } = await client.query({
        query: GET_SIGNED_UPLOAD_URL,
        fetchPolicy: "network-only",
    });

    // upload file to signed URL
    const body = new FormData();
    body.append("file", file);
    const filename = await fetch(`${url}?filetype=${filetype}`, {
        body: body,
        method: "POST",
    })
        .then((res) => res.text())
        .catch((err) => {
            throw err;
        });

    return filename;
}

export function downloadFile(filepath) {
    const host = process.env.NEXT_PUBLIC_HOST;

    if (filepath?.toLowerCase()?.startsWith("http")) {
        // return the full URL if global URL
        return filepath;
    } else if (filepath) {
        // call files service if local URL
        return `${host}/files/download?filename=${filepath}`;
    }
}
