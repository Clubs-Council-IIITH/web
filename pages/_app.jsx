import Layout from "layouts/MainLayout";
import ThemeProvider from "theme";

import "styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    );
}

export default MyApp;
