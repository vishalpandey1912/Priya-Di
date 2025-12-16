import React from 'react';
import { Card } from '@/components/ui';

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: React.ReactNode;
    color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp, icon, color }) => {
    return (
        <Card padding="md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>{label}</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '4px', color: '#0f172a' }}>{value}</h3>

                    {trend && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '8px',
                            fontSize: '0.875rem',
                            color: trendUp ? '#10b981' : '#ef4444'
                        }}>
                            <span>{trendUp ? '↑' : '↓'}</span>
                            <span>{trend}</span>
                            <span style={{ color: '#94a3b8' }}>vs last month</span>
                        </div>
                    )}
                </div>

                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${color}20`, // 20% opacity
                    color: color
                }}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};
