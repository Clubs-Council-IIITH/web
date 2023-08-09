import ThemeRegistry from "components/ThemeRegistry/ThemeRegistry";
import LocalizationWrapper from "components/LocalizationWrapper";
import Progressbar from "components/Progressbar";

import Toast, { ToastProvider } from "components/Toast";
import { Navigation, Content } from "components/Layout";

import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_USER } from "gql/queries/auth";
import { AuthProvider } from "components/AuthProvider";
import { fontClass } from "components/ThemeRegistry/typography";
import TransitionProvider from "components/TransitionProvider";

export const metadata = {
  title: "Clubs Council IIITH",
  description: "Clubs Council IIITH", // TODO: change
};

export default async function RootLayout({ children }) {
  // fetch currently logged in user
  const { data: { userMeta, userProfile } = {} } = await getClient().query(
    GET_USER,
    { userInput: null }
  );
  const user = { ...userMeta, ...userProfile };

  // if user is a club, display the club's logo as profile img
  if (user?.role === "club") {
    const { data: { club } = {} } = await getClient().query(GET_CLUB, {
      clubInput: { cid: user?.uid },
    });
    user.img = club?.logo;
  }

  return (
    <html lang="en">
      <body className={fontClass}>
        <ThemeRegistry>
          <Progressbar />
          <LocalizationWrapper>
            <AuthProvider user={user}>
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
