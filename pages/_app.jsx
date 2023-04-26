import Layout from "layouts/MainLayout";
import ThemeProvider from "theme";
import { AuthProvider } from "contexts/AuthContext";
import { ApolloProvider } from "@apollo/client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import client from "apollo-client";

import "styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <ApolloProvider client={client}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AuthProvider>
                    <ThemeProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ThemeProvider>
                </AuthProvider>
            </LocalizationProvider>
        </ApolloProvider>
    );
}

export default MyApp;
