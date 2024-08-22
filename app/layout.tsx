import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import Header from '@/components/Header/Header'
import { cn } from '@/lib/utils/cn'
import '@/styles/globals.css'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext/AuthContext'

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default async function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
    return (
        <html lang="en">
            <body className={cn('', fontSans.className)}>
                <AuthProvider>
                    <CartProvider>
                        <Header />
                        <main className="flex justify-center mx-auto max-w-[1366px]">
                            {children}
                        </main>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
