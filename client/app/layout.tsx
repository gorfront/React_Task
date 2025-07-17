"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Navbar from "@/components/Navbar";
import "./globals.css";
import AppLoader from "@/components/AppLoader";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AppLoader>
            <Navbar />
            <main>{children}</main>
          </AppLoader>
        </Provider>
      </body>
    </html>
  );
}
