import React, { useEffect } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { AppProvider } from "./AppContext";
import * as gtag from "~/utils/gtags.client";

import styles from "./styles/app.css";

const globals = {
  basename: "/tip/draft/map",
  appName: "FY2025 TIP for PA",
  startYear: 25,
  endYear: 28,
  ga_tracking_id: "UA-9825778-1",
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
  const location = useLocation();

  useEffect(() => {
    if (globals.ga_tracking_id?.length) {
      gtag.pageview(location.pathname, globals.ga_tracking_id);
    }
  }, [location, globals.ga_tracking_id]);

  return (
    <React.StrictMode>
      <html lang="en">
        <head>
          <Links />
          {process.env.NODE_ENV === "development" ||
          !globals.ga_tracking_id ? null : (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${globals.ga_tracking_id}`}
              />
              <script
                async
                id="gtag-init"
                dangerouslySetInnerHTML={{
                  __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${globals.ga_tracking_id}', {
                  page_path: window.location.pathname,
                });
              `,
                }}
              />
            </>
          )}
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
