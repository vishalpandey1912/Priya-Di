'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.grid}>
        <div>
          <div className={styles.brand}>Desi Educators</div>
          <p className={styles.tagline}>NEET Preparation. Taught correctly.</p>
          <a href="mailto:desieducators@outlook.com" className={styles.email}>
            desieducators@outlook.com
          </a>
        </div>

        <div>
          <div className={styles.colTitle}>Learn</div>
          <Link href="/neet" className={styles.colLink}>Lectures</Link>
          <Link href="/episodes" className={styles.colLink}>Episodes</Link>
          <Link href="/priya-ai" className={styles.colLink}>Priya AI</Link>
          <Link href="/dashboard" className={styles.colLink}>Dashboard</Link>
        </div>

        <div>
          <div className={styles.colTitle}>Research</div>
          <Link href="/about" className={styles.colLink}>About Us</Link>
          <Link href="/#ncert" className={styles.colLink}>NCERT Corrections</Link>
          <a href="https://doi.org/10.5281/zenodo.18619351" target="_blank" rel="noopener noreferrer" className={styles.colLink}>White Paper</a>
          <Link href="/pricing" className={styles.colLink}>Pricing</Link>
        </div>

        <div>
          <div className={styles.colTitle}>Connect</div>
          <a href="https://instagram.com/desi_educators_" target="_blank" rel="noopener noreferrer" className={styles.colLink}>Instagram</a>
          <a href="https://youtube.com/@desieducators" target="_blank" rel="noopener noreferrer" className={styles.colLink}>YouTube</a>
          <a href="https://t.me/ProfPriyaPandeybot" target="_blank" rel="noopener noreferrer" className={styles.colLink}>Telegram</a>
          <Link href="/contact" className={styles.colLink}>Contact</Link>
        </div>

        <div>
          <div className={styles.colTitle}>Legal</div>
          <Link href="/terms" className={styles.colLink}>Terms of Service</Link>
          <Link href="/privacy-policy" className={styles.colLink}>Privacy Policy</Link>
          <Link href="/refund-policy" className={styles.colLink}>Refund Policy</Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>&copy; 2026 Desi Educators. All rights reserved.</span>
        <span>Powered by Summit Neuro</span>
      </div>
    </div>
  </footer>
);
