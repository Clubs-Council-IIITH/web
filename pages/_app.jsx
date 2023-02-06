import Layout from "layouts/MainLayout";
import ThemeProvider from "theme";
import { AuthProvider } from "contexts/AuthContext";

import "styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default MyApp;
