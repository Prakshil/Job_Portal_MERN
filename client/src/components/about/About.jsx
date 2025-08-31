import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>About Our Job Portal</h1>
        <p className={styles.heroSubtitle}>
          Connecting talented professionals with amazing opportunities
        </p>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.missionSection}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.sectionText}>
            We are dedicated to bridging the gap between talented professionals and innovative companies.
            Our platform serves as a comprehensive job portal that empowers both job seekers and employers
            to find their perfect match in today's competitive job market.
          </p>
        </div>

        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>What We Offer</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Smart Job Matching</h3>
              <p>Advanced algorithms to match candidates with the most suitable job opportunities</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏢</div>
              <h3>Company Profiles</h3>
              <p>Comprehensive company information to help you make informed career decisions</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Application Tracking</h3>
              <p>Track your job applications and manage your career journey effectively</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Secure Platform</h3>
              <p>Your data is protected with industry-standard security measures</p>
            </div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Our Impact</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10,000+</div>
              <div className={styles.statLabel}>Active Users</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Partner Companies</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>25,000+</div>
              <div className={styles.statLabel}>Jobs Posted</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>Success Rate</div>
            </div>
          </div>
        </div>

        <div className={styles.teamSection}>
          <h2 className={styles.sectionTitle}>Our Team</h2>
          <p className={styles.sectionText}>
            Our dedicated team of professionals works tirelessly to ensure that both job seekers and employers
            have the best possible experience on our platform. We combine technology expertise with deep
            understanding of the job market to create innovative solutions.
          </p>
        </div>

        <div className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Get in Touch</h2>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📧</div>
              <div>
                <h4>Email</h4>
                <p>support@jobportal.com</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📞</div>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📍</div>
              <div>
                <h4>Address</h4>
                <p>123 Career Street, Tech City, TC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;