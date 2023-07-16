import { Roboto } from "next/font/google";
import ThemeRegistry from "components/ThemeRegistry/ThemeRegistry";

import { Navigation, Content } from "components/Layout";

export const metadata = {
  title: "Clubs Council IIITH",
  description: "Clubs Council IIITH", // TODO: change
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>
          <Navigation />
          <Content>{children}</Content>
        </ThemeRegistry>
      </body>
    </html>
  );
}
