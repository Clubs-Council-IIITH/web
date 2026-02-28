import { Suspense } from "react";
import { evaluate } from "next-mdx-remote-client/rsc";

import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMdxRemoveExpressions from "remark-mdx-remove-expressions";

import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default async function Markdown({ source, fallbackVariant = "body1" }) {
  if (!source) return null;

  let mdxContent = null;
  let mdxError = null;

  try {
    const { content, error } = await evaluate({
      source: source,
      options: {
        mdxOptions: {
          disableImports: true,
          disableExports: true,
          remarkPlugins: [
            remarkMdxRemoveExpressions,
            remarkGfm,
            [remarkEmoji, { emoticon: true }],
          ],
        },
      },
    });
    mdxContent = content;
    mdxError = error;
  } catch (err) {
    console.error("Markdown component error:", err);
    mdxError = err;
  }

  if (mdxError) {
    return (
      <Typography
        variant={fallbackVariant}
        sx={{
          whiteSpace: "pre-wrap",
        }}
      >
        {source}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        "& p": { mb: 1.5 },
        "& a": { color: "primary.main" },
        "& ul, & ol": { ml: 2, mb: 1.5 },
        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          mb: 2,
          mt: 2,
        },
        "& th, & td": {
          border: "1px solid",
          borderColor: "divider",
          padding: "8px 12px",
          textAlign: "left",
        },
        "& th": {
          backgroundColor: "action.hover",
          fontWeight: "bold",
        },
      }}
    >
      <Suspense
        fallback={
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={16} />
            <Typography variant={fallbackVariant}>Loading...</Typography>
          </Stack>
        }
      >
        {mdxContent}
      </Suspense>
    </Box>
  );
}
