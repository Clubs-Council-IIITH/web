import ThemeRegistry from "components/ThemeRegistry/ThemeRegistry";
import LocalizationWrapper from "components/LocalizationWrapper";
import Progressbar from "components/Progressbar";
import Toast, { ToastProvider } from "components/Toast";
import { Navigation, Content } from "components/Layout";
import { ModeProvider } from "contexts/ModeContext";
import { getClient } from "gql/client";
import { GET_CLUB } from "gql/queries/clubs";
import { GET_USER } from "gql/queries/auth";
import { AuthProvider } from "components/AuthProvider";
import { fontClass } from "components/ThemeRegistry/typography";
import TransitionProvider from "components/TransitionProvider";
import { headers } from "next/headers";
import Head from "next/head";
import { PUBLIC_URL } from "utils/files";

const description =
  "Discover the vibrant campus life at IIIT Hyderabad. Explore diverse student-led clubs and bodies, and events that foster an inclusive community and enrich student experiences beyond the classroom. Stay updated on activities, events, and opportunities to engage and grow at IIIT-H.";
const shortDescription =
  "Explore with the Life @ IIIT Hyderabad for diverse student-led clubs and bodies & events that enrich campus life and foster community.";

export const metadata = {
  title: "Life @ IIITH",
  authors: [
    { name: "Clubs Council" },
    { name: "IIITH" },
    { name: "SLC Tech Team", url: "https://github.com/Clubs-Council-IIITH/" },
  ],
  publisher: "SLC Tech Team",
  description: description,
  generator: "Next.js",
  keywords: [
    "IIIT Hyderabad",
    "Life",
    "Clubs Council",
    "Student Clubs",
    "Student Bodies",
    "Campus Life",
    "Student Life",
    "Student Activities",
    "Events",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Life @ IIIT Hyderabad",
    description: shortDescription,
    images: [
      {
        url: `${PUBLIC_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Life @ IIIT Hyderabad",
      },
    ],
  },
};

export default async function RootLayout({ children }) {
  // get the nonce and use it
  const nonce = headers().get("x-nonce") || " ";

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
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Life @ IIITH" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta charSet="utf-8" />
      </head>
      <body className={fontClass}>
        <ModeProvider>
          <ThemeRegistry nonce={nonce}>
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
        </ModeProvider>
      </body>
    </html>
  );
}
