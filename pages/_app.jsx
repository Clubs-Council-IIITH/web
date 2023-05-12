import Head from "next/head";

import Layout from "layouts/MainLayout";

import { useRouter } from "next/router";

import ThemeProvider from "theme";
import TransitionProvider from "components/TransitionProvider";
import { ProgressbarProvider } from "contexts/ProgressbarContext";
import { AuthProvider } from "contexts/AuthContext";
import { ModeProvider } from "contexts/ModeContext";
import { ApolloProvider } from "@apollo/client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { AnimatePresence } from "framer-motion";
import client from "apollo-client";

import "styles/globals.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <ApolloProvider client={client}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <AuthProvider>
                        <ModeProvider>
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
                        </ModeProvider>
                    </AuthProvider>
                </LocalizationProvider>
            </ApolloProvider>
        </>
    );
}

export default MyApp;
