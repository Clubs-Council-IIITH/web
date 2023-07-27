import { Roboto } from "next/font/google";
import ThemeRegistry from "components/ThemeRegistry/ThemeRegistry";
import LocalizationWrapper from "components/LocalizationWrapper";
import Progressbar from "components/Progressbar";

import Toast, { ToastProvider } from "components/Toast";
import { Navigation, Content } from "components/Layout";

import { getClient } from "gql/client";
import { ApolloWrapper } from "gql/provider";
import { GET_USER } from "gql/queries/auth";
import { AuthProvider } from "components/AuthProvider";

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
          <Progressbar />
          <ApolloWrapper>
            <LocalizationWrapper>
              <AuthProvider user={{ ...userMeta, ...userProfile }}>
                <ToastProvider>
                  <Navigation />
                  <Content>{children}</Content>
                  <Toast />
                </ToastProvider>
              </AuthProvider>
            </LocalizationWrapper>
          </ApolloWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
