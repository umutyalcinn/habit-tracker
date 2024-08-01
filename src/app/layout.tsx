"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Providers from "./providers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import en from 'javascript-time-ago/locale/en'
import TimeAgo from "javascript-time-ago";
import { useMemo } from "react";

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
        children,
        }: Readonly<{
            children: React.ReactNode;
        }>) {

    const timeAgo = useMemo(() => TimeAgo.addDefaultLocale(en), [])

    return (
        <Providers>
            <html lang="en">
                <body className={inter.className}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="flex items-center py-4 px-4 justify-between">
                            <div>
                            </div>
                            <div>
                                <SignedIn>
                                    <Button variant="link"><Link href="/">Home</Link></Button>
                                    <Button variant="link"><Link href="/habits">Habits</Link></Button>
                                </SignedIn>
                                <SignedOut>
                                    <Button variant="link"><Link href="/">Home</Link></Button>
                                </SignedOut>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                                <ModeToggle>
                                </ModeToggle>
                            </div>
                        </div>
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </Providers>
   );
}
