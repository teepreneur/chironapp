import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/marketing", "/login", "/signup"],
                disallow: ["/parent/", "/teacher/", "/api/", "/auth/"],
            },
        ],
        sitemap: "https://chironlearning.com/sitemap.xml",
    }
}
