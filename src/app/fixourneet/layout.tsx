import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fix Our NEET | desieducators.com',
    description: '23 lakh students. 10 days to the re-NEET. Six fixes the Ministry can make now. A citizen representation by educators, parents, and NEET 2026 candidates.',
    openGraph: {
        title: 'Fix Our NEET',
        description: 'Add your name to the representation being delivered to the Ministry of Education and NTA.',
        type: 'website',
        url: 'https://desieducators.com/fixourneet',
        siteName: 'Desi Educators'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Fix Our NEET',
        description: 'Six fixes the Ministry can make for the NEET re-exam. Sign in 45 seconds.'
    },
    robots: { index: true, follow: true }
};

export default function FixOurNeetLayout({ children }: { children: React.ReactNode }) {
    return children;
}
