import { forwardRef } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { Box } from "@mui/material";

const Page = forwardRef(({ children, title = "", meta, ...other }, ref) => (
    <>
        <Head>
            <title>{`${title} | CC`}</title>
            {meta}
        </Head>

        <Box ref={ref} {...other}>
            {children}
        </Box>
    </>
));

Page.displayName = "Page";
Page.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    meta: PropTypes.node,
};

export default Page;
