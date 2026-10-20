"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { jwtDecode } from "jwt-decode";

const FILESERVER_URL =
  process.env.FILESERVER_URL ||
  process.env.NEXT_PUBLIC_FILESERVER_URL ||
  "http://files";

function unauthorized() {
  return {
    ok: false,
    data: null,
    error: {
      title: "Unauthorized",
      messages: ["Only CC and SLO accounts can manage gallery images."],
    },
  };
}

async function adminHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization")?.value;
  if (!token) return null;

  try {
    const role = jwtDecode(token)?.role;
    if (!["cc", "slo"].includes(role)) return null;
  } catch {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
    Cookie: `Authorization=${token}`,
  };
}

export async function uploadGalleryImageAction(formData) {
  const response = { ok: false, data: null, error: null };
  try {
    const headers = await adminHeaders();
    if (!headers) return unauthorized();
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
    revalidatePath("/");
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
    const headers = await adminHeaders();
    if (!headers) return unauthorized();
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
    revalidatePath("/");
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
    const headers = await adminHeaders();
    if (!headers) return unauthorized();
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
    const headers = await adminHeaders();
    if (!headers) return unauthorized();
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
    const headers = await adminHeaders();
    if (!headers) return unauthorized();
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
