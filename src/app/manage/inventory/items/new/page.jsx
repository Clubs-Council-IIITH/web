import { Container, Typography } from "@mui/material";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";

import ItemForm from "components/inventory/items/ItemForm";

export const metadata = {
  title: "New Inventory Item",
};

export default async function NewInventoryItem() {
  const { data: { userMeta } = {} } = await getClient().query(GET_USER, {
    userInput: null,
  });

  // only cc/slo roles can reach this page
  const allowedRoles = ["cc", "slo"];
  if (!allowedRoles.includes(userMeta?.role)) {
    const { redirect } = await import("next/navigation");
    redirect("/404");
  }

  return (
    <Container>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ mb: 3 }}
      >
        New Inventory Item
      </Typography>
      <ItemForm action="create" defaultValues={{}} />
    </Container>
  );
}