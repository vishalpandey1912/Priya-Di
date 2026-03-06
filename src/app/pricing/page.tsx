'use client';

import React, { useState } from 'react';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PaymentModal } from '@/components/ui';
import styles from './Pricing.module.css';

/* ─────────────────────────────────────────────
   PLAN DATA - Hardcoded per Santosh's decision
   
   TODO (Vishal): Create matching products in Supabase
   "products" table with these IDs so enrollments work
   after payment. Until then, payment goes through
   Razorpay but enrollment must be done manually.
   ───────────────────────────────────────────── */

const PLANS = [
  {
    id: 'free',
    name: 'Explorer',
    price: 0,
    period: 'forever',
    description: 'Browse the platform and get a taste of what NEET prep should feel like.',
    accessLevel: '15% of all content',
    features: [
      { text: '3 free quizzes per subject', included: true },
      { text: 'Sample NCERT-aligned notes', included: true },
      { text: 'Audio episodes (free catalog)', included: true },
      { text: 'XP and streak tracking', included: true },
      { text: 'Priya AI on Telegram', included: true },
      { text: 'Full chapter notes and PDFs', included: false },
      { text: 'All 93+ topic quizzes', included: false },
      { text: 'One-on-one sessions', included: false },
    ],
    cta: 'Start Free',
    recommended: false,
  },
  {
    id: 'basic',
    name: 'Standard',
    price: 299,
    period: 'one-time',
    description: 'Unlock 30% of lectures, notes, and quizzes. Ideal to get serious about Biology.',
    accessLevel: '30% of all content',
    features: [
      { text: '~30 quizzes with solutions', included: true },
      { text: 'NCERT line-by-line notes (select chapters)', included: true },
      { text: 'All audio episodes', included: true },
      { text: 'XP, streaks, and leaderboard', included: true },
      { text: 'Priya AI on Telegram', included: true },
      { text: 'PDF downloads for select topics', included: true },
      { text: 'All 93+ topic quizzes', included: false },
      { text: 'One-on-one sessions', included: false },
    ],
    cta: 'Get Standard',
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    period: 'one-time',
    description: 'Everything. Full access to all content, quizzes, and upcoming premium features.',
    accessLevel: '100% of all content',
    features: [
      { text: 'All 93+ quizzes with detailed solutions', included: true },
      { text: 'Complete NCERT notes for every chapter', included: true },
      { text: 'All audio episodes + future releases', included: true },
      { text: 'XP, streaks, and leaderboard', included: true },
      { text: 'Priya AI on Telegram', included: true },
      { text: 'All PDF materials and downloads', included: true },
      { text: 'One-on-one doubt sessions', included: true, comingSoon: true },
      { text: 'Advanced practice sets', included: true, comingSoon: true },
    ],
    cta: 'Get Premium',
    recommended: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlanAction = (plan: typeof PLANS[0]) => {
    if (plan.id === 'free') {
      router.push('/signup');
      return;
    }

    if (!user) {
      router.push(`/login?next=/pricing`);
      return;
    }

    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>Simple Pricing</p>
          <h1 className={styles.title}>
            Pick a plan.<br />Start preparing.
          </h1>
          <p className={styles.subtitle}>
            One-time payment. No subscriptions. No hidden charges. Access stays forever.
          </p>
        </div>

        {/* Plans Grid */}
        <div className={styles.grid}>
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.card} ${plan.recommended ? styles.recommended : ''}`}
            >
              {plan.recommended && (
                <div className={styles.badge}>
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              <div className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planDesc}>{plan.description}</p>
              </div>

              <div className={styles.priceBlock}>
                {plan.price === 0 ? (
                  <div className={styles.priceRow}>
                    <span className={styles.priceAmount}>Free</span>
                  </div>
                ) : (
                  <div className={styles.priceRow}>
                    <span className={styles.priceCurrency}>&#8377;</span>
                    <span className={styles.priceAmount}>{plan.price}</span>
                    <span className={styles.pricePeriod}>/ {plan.period}</span>
                  </div>
                )}
                <p className={styles.accessNote}>{plan.accessLevel}</p>
              </div>

              <button
                className={`${styles.ctaBtn} ${plan.recommended ? styles.ctaPrimary : ''} ${plan.price === 0 ? styles.ctaOutline : ''}`}
                onClick={() => handlePlanAction(plan)}
              >
                {plan.cta}
                <ArrowRight size={16} />
              </button>

              <div className={styles.divider} />

              <ul className={styles.featureList}>
                {plan.features.map((f, i) => (
                  <li key={i} className={`${styles.featureItem} ${!f.included ? styles.featureDisabled : ''}`}>
                    {f.included ? (
                      <Check size={16} className={styles.checkIcon} />
                    ) : (
                      <X size={16} className={styles.xIcon} />
                    )}
                    <span>{f.text}</span>
                    {f.comingSoon && (
                      <span className={styles.comingSoon}>Coming Soon</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className={styles.bottomNote}>
          <p>Questions? Write to <a href="mailto:support@desieducators.com">support@desieducators.com</a></p>
          <p className={styles.finePrint}>Coupon code PP99 available at checkout. Payments secured by Razorpay.</p>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && selectedPlan.price > 0 && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedPlan(null); }}
          amount={selectedPlan.price}
          planName={selectedPlan.name}
          onSuccess={handlePaymentSuccess}
          items={[{
            id: selectedPlan.id,
            name: selectedPlan.name,
            price: selectedPlan.price,
            type: 'bundle',
            targetIds: [],
          }]}
        />
      )}
    </div>
  );
}
