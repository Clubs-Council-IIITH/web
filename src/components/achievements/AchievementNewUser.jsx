import { Controller } from "react-hook-form";

import { Button, Stack, TextField, Typography } from "@mui/material";

import Icon from "components/Icon";
import { useToast } from "components/Toast";

import { getUsers } from "actions/users/get/server_action";

export default function AchievementNewUser({
  control,
  setValue,
  onVerifiedUser,
}) {
  const { triggerToast } = useToast();

  return (
    <Controller
      name="userSelector"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Stack direction="row" spacing={1}>
          <TextField
            {...field}
            type="email"
            label="Email"
            autoComplete="off"
            variant="outlined"
            helperText={
              "Click the 👍 button to confirm the user and verify their email"
            }
            fullWidth
            required
          />
          <Button
            color="primary"
            variant="contained"
            onClick={async () => {
              const uid = field.value?.split("@")[0];
              const res = await getUsers(uid);

              if (res.ok) {
                onVerifiedUser(res.data);
                setValue("uid", uid);
                field.onChange("");
              } else {
                triggerToast({
                  ...res.error,
                  severity: "error",
                });
              }
            }}
          >
            <Icon variant="thumb-up-outline-rounded" />
          </Button>
        </Stack>
      )}
    />
  );
}
