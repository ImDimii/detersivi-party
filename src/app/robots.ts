import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Robot.txt",
}

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: "https://detersiviparty.it/sitemap.xml",
  }
}
