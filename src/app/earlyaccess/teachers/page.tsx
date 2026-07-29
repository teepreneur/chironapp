import { Metadata } from 'next'
import TeacherEarlyAccessClient from './client-page'

export const metadata: Metadata = {
    title: 'Early Access for Educators | Chiron (by Theia)',
    description: 'Join Ghana\'s premier tutoring platform built for educators. Own your programs, set your rates, and get direct Mobile Money payouts.',
    keywords: [
        'Teacher jobs Ghana',
        'Private tutoring platform Ghana',
        'Educator careers Accra',
        'Online tutoring engine Ghana',
        'Personalized education careers',
        'Early access program for educators',
        'Chiron teacher sign up'
    ],
    openGraph: {
        title: 'Own Your Teaching Business | Educator Early Access',
        description: 'Join the top 50 pioneering educators shaping personalized tutoring in Ghana. Create your own programs and earn on your terms.',
        url: 'https://chironlearning.com/earlyaccess/teachers',
        siteName: 'Chiron (by Theia)',
        locale: 'en_GH',
        type: 'website',
        images: [
            {
                url: 'https://chironlearning.com/marketing-assets/campaign-launch.png',
                width: 1080,
                height: 1080,
                alt: 'Own Your Teaching Business - Chiron by Theia',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Own Your Teaching Business | Educator Early Access',
        description: 'Join the top 50 pioneering educators shaping personalized tutoring in Ghana.',
        images: ['https://chironlearning.com/marketing-assets/campaign-launch.png'],
    },
    alternates: {
        canonical: 'https://chironlearning.com/earlyaccess/teachers',
    }
}

export default function TeacherEarlyAccessPage() {
    return <TeacherEarlyAccessClient />
}
