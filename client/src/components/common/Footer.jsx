import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Company Info */}
        <div className={styles.footerSection}>
          <h2 className={styles.logo}>DevConnect Jobs</h2>
          <p className={styles.description}>
            Connecting talented developers with <br /> innovative tech companies worldwide.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/jobs">Jobs</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footerSection}>
          <h3>Contact</h3>
          <p>
            Email: <br /> contact@devconnect.io
          </p>
          <br />
          <p>
            Phone: <br /> +1 (888) 456-7890
          </p>
          <br />
          <p>
            Address: <br /> 1200 Tech Boulevard, Suite 400<br />
            San Francisco, CA 94107
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <p>
          © {new Date().getFullYear()} DevConnect Jobs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
