import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material";

import { combineQuery, getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { GET_FULL_ITEM } from "gql/queries/inventory";

import ItemForm from "components/inventory/items/ItemForm";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  const { data: { getItem: item } = {} } = await getClient().query(
    GET_FULL_ITEM,
    { iid: id },
  );

  return {
    title: item?.name ? `Edit — ${item.name}` : "Edit Item",
  };
}

function transformItem(item) {
  return {
    iid: item?.iid ?? "",
    name: item?.name ?? "",
    brand: item?.brand ?? "",
    quantity: item?.netQty ?? item?.net_qty ?? 1,
    description: item?.otherDetails ?? item?.other_details ?? "",
    warrantyDetails: item?.warrantyDetails ?? item?.warranty_details ?? "",
    clubid: item?.clubid ?? "",
    currentLocation: item?.currentLocation ?? item?.current_location ?? [],
    photo: item?.photo ?? null,
  };
}

export default async function EditInventoryItem(props) {
  const params = await props.params;
  const { id } = params;

  try {
    const { document, variables } = combineQuery("CombinedEditItemQuery")
      .add(GET_USER, { userInput: null })
      .add(GET_FULL_ITEM, { iid: id });

    const { data = {}, error } = await getClient().query(document, variables);
    const { userMeta, userProfile, getItem: item } = data;
    const user = { ...userMeta, ...userProfile };

    // item not found
    if (error?.message?.includes("Item not found") || !item) {
      redirect("/404");
    }

    // clubs can only edit their own items
    if (user?.role === "club" && item?.clubid && user?.uid !== item?.clubid) {
      redirect("/404");
    }

    // only cc/slo/club can edit
    if (!["cc", "slo", "club"].includes(user?.role)) {
      redirect("/404");
    }

    return (
      <Container>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ mb: 3 }}
        >
          Edit Item Details
        </Typography>
        <ItemForm
          id={id}
          defaultValues={transformItem(item)}
          action="edit"
        />
      </Container>
    );
  } catch (error) {
    redirect("/404");
  }
}
