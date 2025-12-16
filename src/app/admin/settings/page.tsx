'use client';

import React, { useState } from 'react';
import { Card, Button, Input } from '@/components/ui';

export default function AdminSettingsPage() {
    const [siteName, setSiteName] = useState('Desi Educators');
    const [supportEmail, setSupportEmail] = useState('support@desi.com');
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>Platform Settings</h1>

            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
                {/* General Settings */}
                <Card padding="lg">
                    <h3 style={{ marginBottom: '16px' }}>General Configuration</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Input
                            label="Site Name"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                        />
                        <Input
                            label="Support Contact Email"
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                        />
                    </div>
                </Card>

                {/* Privacy & Security */}
                <Card padding="lg">
                    <h3 style={{ marginBottom: '16px' }}>Privacy & Maintenance</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                        <div>
                            <p style={{ fontWeight: 500 }}>Maintenance Mode</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Disable public access to the site</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={maintenanceMode}
                                onChange={() => setMaintenanceMode(!maintenanceMode)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </Card>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
