import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fix Our NEET — Petition to MoE | desieducators.com',
    description: '22.79 lakh students. 410 leaked questions. 120 Chemistry questions matched the actual NEET 2026 paper exactly. Sign the petition demanding 6 fixes from the Ministry of Education for the re-NEET.',
    keywords: 'Fix Our NEET, NEET 2026 cancelled, NEET paper leak, NEET petition, re-NEET, Ministry of Education, NTA, NEET reform',
    openGraph: {
        title: 'Fix Our NEET — Petition to Ministry of Education',
        description: '22.79 lakh students. 410 leaked questions. 120 matched exactly. 6 specific demands. 25,000 signatures → hand-delivered to MoE by 19 May 2026. Sign in 30 seconds.',
        type: 'website',
        url: 'https://www.desieducators.com/fixourneet',
        siteName: 'Desi Educators',
        locale: 'en_IN',
        images: [
            {
                url: 'https://www.desieducators.com/logo-v4.png',
                width: 800,
                height: 600,
                alt: 'Fix Our NEET — Desi Educators'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Fix Our NEET — Petition to MoE',
        description: '22.79 lakh students. 410 leaked questions. 120 matched exactly. Sign in 30 seconds. Spearheaded by Santosh Pandey + India\'s top NEET educators.',
        images: ['https://www.desieducators.com/logo-v4.png']
    },
    robots: { index: true, follow: true }
};

export default function FixOurNeetLayout({ children }: { children: React.ReactNode }) {
    return children;
}
