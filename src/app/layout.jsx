import { Roboto } from "next/font/google";
import ThemeRegistry from "components/ThemeRegistry/ThemeRegistry";

import Toast, { ToastProvider } from "components/Toast";
import { Navigation, Content } from "components/Layout";

import { getClient } from "gql/client";
import { ApolloWrapper } from "gql/provider";
import { GET_USER } from "gql/queries/auth";

export const metadata = {
  title: "Clubs Council IIITH",
  description: "Clubs Council IIITH", // TODO: change
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const { data: { userMeta, userProfile } = {} } = await getClient().query({
    query: GET_USER,
    variables: { userInput: null },
  });

  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>
          <ApolloWrapper>
            <ToastProvider>
              <Navigation user={{ ...userMeta, ...userProfile }} />
              <Content>{children}</Content>
              <Toast />
            </ToastProvider>
          </ApolloWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
