import Layout from "layouts/MainLayout";

import { useRouter } from "next/router";

import ThemeProvider from "theme";
import TransitionProvider from "components/TransitionProvider";
import { ProgressbarProvider } from "contexts/ProgressbarContext";
import { AuthProvider } from "contexts/AuthContext";
import { ApolloProvider } from "@apollo/client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { AnimatePresence } from "framer-motion";
import client from "apollo-client";

import "styles/globals.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <ApolloProvider client={client}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AuthProvider>
                    <ThemeProvider>
                        <ProgressbarProvider>
                            <AnimatePresence mode="wait" initial={false}>
                                <Layout>
                                    <TransitionProvider route={router.route}>
                                        <Component {...pageProps} />
                                    </TransitionProvider>
                                </Layout>
                            </AnimatePresence>
                        </ProgressbarProvider>
                    </ThemeProvider>
                </AuthProvider>
            </LocalizationProvider>
        </ApolloProvider>
    );
}

export default MyApp;
