import React from 'react';
import { ExamTabs } from '@/components/neet';
import { Card } from '@/components/ui';

export default function NeetPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Section */}
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>NEET Exam Preparation</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Comprehensive study material, mock tests, and doubt clearing sessions for NEET 2026.
                </p>
            </div>

            {/* Quick Stats or Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <Card padding="sm">
                    <small style={{ color: 'var(--text-light)' }}>Exam Date</small>
                    <p style={{ fontWeight: 'bold' }}>May 05, 2026 (Tentative)</p>
                </Card>
                <Card padding="sm">
                    <small style={{ color: 'var(--text-light)' }}>Syllabus Status</small>
                    <p style={{ fontWeight: 'bold' }}>Updated (NMC 2025)</p>
                </Card>
            </div>

            {/* Tabs Section */}
            <ExamTabs />
        </div>
    );
}
