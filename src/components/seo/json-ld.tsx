export function OrganizationJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: "Chiron (by Theia)",
        url: "https://chironlearning.com",
        logo: "https://chironlearning.com/brand/chiron-icon.svg",
        description: "Chiron provides professional teachers and client pairs with a streamlined tutoring, scheduling, and mobile money payment platform.",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Accra",
            addressCountry: "GH",
        },
        areaServed: {
            "@type": "Country",
            name: "Ghana",
        },
        sameAs: [],
        serviceType: "Personal Tutoring & Client Management",
        audience: {
            "@type": "EducationalAudience",
            educationalRole: "student",
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

export function WebsiteJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Chiron",
        url: "https://chironlearning.com",
        description: "Personal Tutoring & Client Management platform by Theia",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: "https://chironlearning.com/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
        },
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
