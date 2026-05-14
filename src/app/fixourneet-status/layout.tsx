import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Live Tracker — Fix Our NEET',
    robots: { index: false, follow: false }
};

export default function StatusLayout({ children }: { children: React.ReactNode }) {
    return children;
}
