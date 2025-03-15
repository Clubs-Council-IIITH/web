"use server";

import { getClient } from "gql/client";
import { APPROVE_CERTIFICATE } from "gql/mutations/members";

export async function approveCertificate(certificateNumber) {
    const response = { ok: false, error: null };

    const { data, error } = await getClient().mutation(APPROVE_CERTIFICATE, {
        certificateNumber,
    });

    if (error) {
        response.error = {
            title: error.name,
            messages: error?.graphQLErrors?.map((ge) => ge?.message),
        };
    } else {
        response.ok = true;
        response.data = data.approveCertificate;
    }

    return response;
}