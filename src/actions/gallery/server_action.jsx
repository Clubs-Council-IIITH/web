"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const FILESERVER_URL =
  process.env.FILESERVER_URL ||
  process.env.NEXT_PUBLIC_FILESERVER_URL ||
  "http://files";
const INTER_COMMUNICATION_SECRET =
  process.env.INTER_COMMUNICATION_SECRET || "inter-communication-secret";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;
  const headers = {
    "X-Inter-Communication-Secret": INTER_COMMUNICATION_SECRET,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["Cookie"] = `Authorization=${token}`;
  }
  return headers;
}

export async function uploadGalleryImageAction(formData) {
  const response = { ok: false, data: null, error: null };
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${FILESERVER_URL}/files/gallery/upload`, {
      method: "POST",
      body: formData,
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      response.error = {
        title: "Upload Failed",
        messages: [errText || `Server responded with ${res.status}`],
      };
      return response;
    }

    const data = await res.json();
    response.ok = true;
    response.data = data;
    revalidatePath("/gallery");
    revalidatePath("/manage/gallery");
  } catch (error) {
    response.error = {
      title: "Network Error",
      messages: [error.message],
    };
  }
  return response;
}

export async function deleteGalleryImageAction(filename) {
  const response = { ok: false, data: null, error: null };
  try {
    const headers = await getAuthHeaders();
    headers["Content-Type"] = "application/json";

    const res = await fetch(`${FILESERVER_URL}/files/gallery/delete`, {
      method: "POST",
      headers,
      body: JSON.stringify({ filename }),
    });

    if (!res.ok) {
      const errText = await res.text();
      response.error = {
        title: "Delete Failed",
        messages: [errText || `Server responded with ${res.status}`],
      };
      return response;
    }

    response.ok = true;
    revalidatePath("/gallery");
    revalidatePath("/manage/gallery");
  } catch (error) {
    response.error = {
      title: "Network Error",
      messages: [error.message],
    };
  }
  return response;
}

export async function uploadCarouselImageAction(formData) {
  const response = { ok: false, data: null, error: null };
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${FILESERVER_URL}/files/carousel/upload`, {
      method: "POST",
      body: formData,
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      response.error = {
        title: "Upload Failed",
        messages: [errText || `Server responded with ${res.status}`],
      };
      return response;
    }

    const data = await res.json();
    response.ok = true;
    response.data = data;
    revalidatePath("/");
    revalidatePath("/manage/gallery");
  } catch (error) {
    response.error = {
      title: "Network Error",
      messages: [error.message],
    };
  }
  return response;
}

export async function updateCarouselItemsAction(items) {
  const response = { ok: false, data: null, error: null };
  try {
    const headers = await getAuthHeaders();
    headers["Content-Type"] = "application/json";

    const res = await fetch(`${FILESERVER_URL}/files/carousel/update`, {
      method: "POST",
      headers,
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      const errText = await res.text();
      response.error = {
        title: "Update Failed",
        messages: [errText || `Server responded with ${res.status}`],
      };
      return response;
    }

    const data = await res.json();
    response.ok = true;
    response.data = data;
    revalidatePath("/");
    revalidatePath("/manage/gallery");
  } catch (error) {
    response.error = {
      title: "Network Error",
      messages: [error.message],
    };
  }
  return response;
}

export async function deleteCarouselItemAction(id, filename) {
  const response = { ok: false, data: null, error: null };
  try {
    const headers = await getAuthHeaders();
    headers["Content-Type"] = "application/json";

    const res = await fetch(`${FILESERVER_URL}/files/carousel/delete`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id, filename }),
    });

    if (!res.ok) {
      const errText = await res.text();
      response.error = {
        title: "Delete Failed",
        messages: [errText || `Server responded with ${res.status}`],
      };
      return response;
    }

    response.ok = true;
    revalidatePath("/");
    revalidatePath("/manage/gallery");
  } catch (error) {
    response.error = {
      title: "Network Error",
      messages: [error.message],
    };
  }
  return response;
}
