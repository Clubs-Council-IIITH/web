"use server";

import { getClient } from "gql/client";
import { REJECT_CERTIFICATE } from "gql/mutations/members";

export async function rejectCertificate(certificateNumber) {
    const response = { ok: false, error: null };

    const { data, error } = await getClient().mutation(REJECT_CERTIFICATE, {
        certificateNumber,
    });

    if (error) {
        response.error = {
            title: error.name,
            messages: error?.graphQLErrors?.map((ge) => ge?.message),
        };
    } else {
        response.ok = true;
        response.data = data.rejectCertificate;
    }

    return response;
}