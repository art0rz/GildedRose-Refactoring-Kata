import Head from "next/head";
import AppBar, { Breadcrumb } from "./app-bar";
import React from "react";
import styled from "@emotion/styled";

interface Props {
  title?: string;
  breadcrumbs?: Array<Breadcrumb>;
  children?: React.ReactNode;
}

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100vh;
`;

const Layout = ({ title, breadcrumbs, children }: Props) => (
  <>
    <Head>
      <title>Gilded Rose Inventory Manager {title && `| ${title}`}</title>
    </Head>
    <AppContainer>
      <AppBar breadcrumbs={breadcrumbs} />
      {children}
    </AppContainer>
  </>
);

export default Layout;
