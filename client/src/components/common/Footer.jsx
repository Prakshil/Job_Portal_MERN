import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Company Info */}
        <div className={styles.footerSection}>
          <h2 className={styles.logo}>Felix Job Portal .</h2>
          <p className={styles.description}>
            Building innovative tech solutions to <br /> empower businesses and
            communities.
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
            Email: <br /> <br /> contact@felixitsystem.com
          </p>
          <br />
          <p>
            Phone: <br /> <br /> +1 (555) 123-4567
          </p>
          <br />
          <p>
            Address: <br /> <br /> 304, Shitiratna Complex,Near Panchvati
            Circle, Chimanlal Girdharlal Rd, next to Radisson blu hotel,
            Ahmedabad, Gujarat 380006
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <p>
          © {new Date().getFullYear()} Felix_Job_Portal Solutions. All rights
          reserved. 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
