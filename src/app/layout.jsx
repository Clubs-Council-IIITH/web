import ThemeRegistry from "components/ThemeRegistry/ThemeRegistry";
import LocalizationWrapper from "components/LocalizationWrapper";
import Progressbar from "components/Progressbar";

import Toast, { ToastProvider } from "components/Toast";
import { Navigation, Content } from "components/Layout";

import { getClient } from "gql/client";
import { GET_USER } from "gql/queries/auth";
import { AuthProvider } from "components/AuthProvider";
import { fontClass } from "components/ThemeRegistry/typography";
import TransitionProvider from "components/TransitionProvider";

export const metadata = {
  title: "Clubs Council IIITH",
  description: "Clubs Council IIITH", // TODO: change
};

export default async function RootLayout({ children }) {
  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null }
  );

  return (
    <html lang="en">
      <body className={fontClass}>
        <ThemeRegistry>
          <Progressbar />
          <LocalizationWrapper>
            <AuthProvider user={{ ...userMeta, ...userProfile }}>
              <ToastProvider>
                <Navigation />
                <Content>
                  <TransitionProvider>{children}</TransitionProvider>
                </Content>
                <Toast />
              </ToastProvider>
            </AuthProvider>
          </LocalizationWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
