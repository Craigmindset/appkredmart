import { Inter, Poppins, Lato } from "next/font/google"

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
export const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" })
export const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-lato" })

export const appFontClass = `${inter.className} ${poppins.variable} ${lato.variable}`
