import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { JssProvider } from "react-jss";
import getPageContext from "../lib/getPageContext";
import Navbar from "../components/Navbar";

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const pageContext = getPageContext();

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Nextconnect</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <JssProvider
        registry={pageContext.sheetsRegister}
        generateClassName={pageContext.generateClassName}
      >
        <MuiThemeProvider theme={pageContext.theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Navbar {...props} />
          <Component {...pageProps} />
        </MuiThemeProvider>
      </JssProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
