import React from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { AppProvider } from "./AppContext";

import styles from "./styles/app.css";

const globals = {
  appName: "Draft FY2023 TIP for PA",
  startYear: 23,
  endYear: 26,
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: globals.appName,
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <React.StrictMode>
      <html lang="en">
        <head>
          <Links />
        </head>
        <body>
          <AppProvider value={globals}>
            <Outlet />
          </AppProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </React.StrictMode>
  );
}
