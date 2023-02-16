import Layout from "layouts/MainLayout";
import ThemeProvider from "theme";
import { AuthProvider } from "contexts/AuthContext";
import { ApolloProvider } from "@apollo/client";
import client from "apollo-client";

import "styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <ThemeProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}

export default MyApp;
