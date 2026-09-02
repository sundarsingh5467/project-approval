"use client";

import { useState } from "react";

type IconName =
  | "radio"
  | "sun"
  | "menu"
  | "check"
  | "shield"
  | "clock"
  | "lock"
  | "star"
  | "checkCircle"
  | "plusCircle";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const sharedProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "radio":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
          <path d="M4 12h2M18 12h2M12 4v2M12 18v2" />
        </svg>
      );
    case "sun":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case "menu":
      return (
        <svg {...sharedProps}>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      );
    case "check":
      return (
        <svg {...sharedProps}>
          <path d="M5 12.5 9.5 17 19 7.5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...sharedProps}>
          <path d="M12 3.5 18 6v5.2c0 4.2-2.5 7.9-6 9.8-3.5-1.9-6-5.6-6-9.8V6l6-2.5Z" />
          <path d="m9.5 12 1.8 1.8 3.2-4.1" />
        </svg>
      );
    case "clock":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );
    case "lock":
      return (
        <svg {...sharedProps}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7.5A4 4 0 0 1 12 4a4 4 0 0 1 4 3.5V10" />
        </svg>
      );
    case "star":
      return (
        <svg {...sharedProps}>
          <path d="m12 2.8 2.4 5 5.5.8-4 3.9 1 5.5-4.9-2.6-4.9 2.6 1-5.5-4-3.9 5.5-.8 2.4-5Z" />
        </svg>
      );
    case "checkCircle":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.2 2.2 4.8-5.2" />
        </svg>
      );
    case "plusCircle":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    default:
      return null;
  }
}

const faqData = [
  {
    question: "What is USDT Verify?",
    answer:
      "USDT Verify is an automated blockchain inspection tool designed to diagnose safety risks, address history, and smart contract health.",
  },
  {
    question: "How does the verification process work?",
    answer:
      "It parses your public address via node listeners and matches historical interactions against verified security blacklists and exploit logs.",
  },
  {
    question: "Is my wallet information kept private?",
    answer:
      "Yes. We operate under a strict zero-retention policy. We never ask for private keys, seed phrases, or retain sensitive identity records.",
  },
  {
    question: "What does the risk score mean?",
    answer:
      "The risk score is a compound metric measuring exposure to flagged decentralized apps, malicious contracts, or suspicious transaction volumes.",
  },
  {
    question: "Can USDT Verify detect all types of scams?",
    answer:
      "While we catch over 99.8% of recognized on-chain attack vectors and drainer authorizations, always adhere to strict personal operational security.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="page-shell">
      <header className="hero-shell">
        <nav className="topbar" aria-label="Main navigation">
          <div className="brand-wrap">
            <div className="brand-mark">
              <div className="brand-inner">
                <Icon name="radio" className="brand-icon" />
              </div>
            </div>
            <div className="brand-copy">
              <h1>BscScan</h1>
              <span>Scan Original</span>
            </div>
          </div>

          <div className="nav-actions">
            <button className="icon-btn" aria-label="Toggle theme">
              <Icon name="sun" className="nav-icon" />
            </button>
            <button className="menu-btn" aria-label="Open menu">
              <Icon name="menu" className="nav-icon" />
            </button>
          </div>
        </nav>

        <div className="hero-badge-row">
          <span className="hero-badge">
            <Icon name="star" className="badge-star" />
            Trusted by 100K+ users worldwide
          </span>
        </div>

        <div className="hero-copy">
          <h2>
            Check Your USDT
            <br />
            Wallet Security
          </h2>
          <p>
            Advanced blockchain analysis using official BSC Scan data to determine if your USDT wallet is
            <strong> safe, valid, and free</strong> from any reported or suspicious activity.
          </p>
        </div>

        <div className="hero-points">
          <div className="point-row">
            <div className="point-bullet">
              <Icon name="check" className="bullet-icon" />
            </div>
            <span>Advanced blockchain analysis</span>
          </div>
          <div className="point-row">
            <div className="point-bullet">
              <Icon name="check" className="bullet-icon" />
            </div>
            <span>Real-time threat detection</span>
          </div>
          <div className="point-row">
            <div className="point-bullet">
              <Icon name="check" className="bullet-icon" />
            </div>
            <span>Zero data retention policy</span>
          </div>
          <div className="point-row">
            <div className="point-bullet">
              <Icon name="check" className="bullet-icon" />
            </div>
            <span>Enterprise-grade security</span>
          </div>
        </div>

        <div className="cta-row">
          <button className="primary-btn">Check Now</button>
        </div>

        <div className="hero-meta-grid">
          <div className="meta-item">
            <Icon name="shield" className="meta-icon" />
            <span>100% Secure</span>
          </div>
          <div className="meta-item">
            <Icon name="clock" className="meta-icon" />
            <span>Real-Time Scans</span>
          </div>
          <div className="meta-item">
            <Icon name="lock" className="meta-icon" />
            <span>Enterprise Grade</span>
          </div>
        </div>
      </header>

      <main className="content-wrap">
        <section className="intro-panel">
          <div className="eyebrow-wrap">
            <span className="eyebrow">
              Security Analytics • Real-Time Blockchain Verification
            </span>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <h4>500K+</h4>
              <p>Wallets Verified</p>
            </div>
            <div className="stat-box">
              <h4>99.8%</h4>
              <p>Accuracy Rate</p>
            </div>
            <div className="stat-box">
              <h4>&lt;3s</h4>
              <p>Analysis Time</p>
            </div>
            <div className="stat-box">
              <h4>24/7</h4>
              <p>Protection</p>
            </div>
          </div>

          <div className="review-card">
            <h4>Join thousands of secure users</h4>
            <div className="rating-stars" aria-label="Five star rating">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <p>4.9/5 from 5,000+ reviews</p>
          </div>
        </section>

        <section className="info-section">
          <span className="section-label">ABOUT US</span>
          <h3 className="section-title">About USDT Check</h3>
          <p className="section-subtitle">
            Protecting your digital assets through advanced verification technology.
          </p>

          <div className="mini-metrics">
            <div>
              <h5>2023</h5>
              <span>Founded</span>
            </div>
            <div>
              <h5>100K+</h5>
              <span>Users</span>
            </div>
            <div>
              <h5>99.9%</h5>
              <span>Accuracy</span>
            </div>
            <div>
              <h5>24/7</h5>
              <span>Protection</span>
            </div>
          </div>

          <div className="about-copy">
            <p>
              USDT Check was founded in 2023 by a team of blockchain security experts with a mission to make cryptocurrency safer for everyone. As Tether (USDT) became one of the most widely used stablecoins, the need for reliable verification tools grew exponentially.
            </p>
            <p>
              Our platform leverages advanced blockchain analytics and machine learning algorithms to provide comprehensive security assessments. We analyze transaction patterns, check for known vulnerabilities, and verify wallet legitimacy to protect your assets from scams.
            </p>
          </div>

          <div className="reasons-card">
            <h5>WHY CHOOSE US</h5>
            <ul>
              <li>
                <Icon name="checkCircle" className="reason-icon" />
                <span>Lightning-fast verification in under 3 seconds</span>
              </li>
              <li>
                <Icon name="checkCircle" className="reason-icon" />
                <span>Comprehensive risk and liquid detailed reports</span>
              </li>
              <li>
                <Icon name="checkCircle" className="reason-icon" />
                <span>Multi-chain support beyond just USDT networks</span>
              </li>
              <li>
                <Icon name="checkCircle" className="reason-icon" />
                <span>24/7 customer support from security experts</span>
              </li>
              <li>
                <Icon name="checkCircle" className="reason-icon" />
                <span>Regular security audits by 3rd party firms</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="info-section">
          <span className="section-label muted">CORE VALUES</span>
          <div className="core-grid">
            <div className="feature-card">
              <span className="feature-emoji">🔒</span>
              <h6>Security</h6>
              <p>Military-grade protection embedded into every feature we build.</p>
            </div>
            <div className="feature-card">
              <span className="feature-emoji">👁️</span>
              <h6>Transparency</h6>
              <p>Clear, accurate explanations about security risks and procedures.</p>
            </div>
            <div className="feature-card">
              <span className="feature-emoji">🌐</span>
              <h6>Accessibility</h6>
              <p>Essential security tools made available to everyone, regardless of expertise.</p>
            </div>
            <div className="feature-card">
              <span className="feature-emoji">🚀</span>
              <h6>Innovation</h6>
              <p>Continuous improvement and feature updates to stay ahead of threats.</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <span className="section-label muted">ACHIEVEMENTS</span>
          <div className="achievements-card">
            <div className="achievement-item">
              <span>🏆</span>
              <span>Featured in top 10 security tools of 2024</span>
            </div>
            <div className="achievement-item">
              <span>🏆</span>
              <span>Partnership with major blockchain companies</span>
            </div>
            <div className="achievement-item">
              <span>🏆</span>
              <span>Over 500k positive verified assessments</span>
            </div>
            <div className="achievement-item">
              <span>🏆</span>
              <span>Trusted by institutional clients globally</span>
            </div>
            <div className="achievement-item">
              <span>🏆</span>
              <span>ISO 27001 certified security processes</span>
            </div>
          </div>
        </section>

        <section className="process-shell">
          <span className="section-label">PROCESS</span>
          <h3 className="section-title">How It Works</h3>
          <p className="section-subtitle">Simple yet powerful — comprehensive security insights in just four easy steps:</p>

          <div className="process-list">
            <div className="process-card">
              <span className="step-badge">01</span>
              <div>
                <h5>Connect Your Wallet</h5>
                <p>Securely connect your USDT wallet address for automated blockchain analysis without compromising private keys.</p>
              </div>
            </div>
            <div className="process-card">
              <span className="step-badge">02</span>
              <div>
                <h5>Advanced Analysis</h5>
                <p>Our AI-powered system analyzes transaction patterns, security vulnerabilities, and wallet legitimacy using official BSC Scan blockchain technology.</p>
              </div>
            </div>
            <div className="process-card">
              <span className="step-badge">03</span>
              <div>
                <h5>Risk Assessment</h5>
                <p>We provide a comprehensive risk score based on multi-factor analysis, threat intelligence, and historical blockchain data.</p>
              </div>
            </div>
            <div className="process-card">
              <span className="step-badge">04</span>
              <div>
                <h5>Detailed Report</h5>
                <p>Receive a complete security report with actionable insights, recommendations, and strategies to protect your digital assets.</p>
              </div>
            </div>
          </div>

          <div className="tech-row">
            <span className="tech-label">BUILT TECHNOLOGY</span>
            <div className="tech-pills">
              <span>AI Predictive Analysis</span>
              <span>Blockchain Analytics</span>
              <span>Real-Time Threat Detection</span>
              <span className="pill-light">Smart Contract Audit</span>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <span className="section-label">QUESTIONS</span>
          <h3 className="section-title">Frequently Asked Questions</h3>
          <p className="section-subtitle">
            Find answers to common questions about our USDT wallet verification service.
          </p>

          <div className="faq-list">
            {faqData.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <Icon name="plusCircle" className={`faq-icon ${isOpen ? "rotated" : ""}`} />
                  </button>
                  <div className={`faq-answer ${isOpen ? "open" : ""}`}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="support-box">
            <h4>Still Have Questions?</h4>
            <p>Our support team is here to help you with any questions about wallet verification.</p>
            <button type="button" className="secondary-btn">Contact Support</button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <h4>USDT Verify</h4>
        </div>
        <p>
          Advanced blockchain security platform providing comprehensive USDT wallet verification. Key protection for the entire crypto ecosystem.
        </p>

        <div className="footer-columns">
          <div>
            <h6>Quick Links</h6>
            <ul>
              <li><a href="#">Wallet Verification</a></li>
              <li><a href="#">Security Audit</a></li>
              <li><a href="#">Transaction Analysis</a></li>
              <li><a href="#">Risk Assessment</a></li>
            </ul>
          </div>
          <div>
            <h6>Resources</h6>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-tags">
          <span><i className="dot" />24/7 Support</span>
          <span><i className="dot" />100% Verified</span>
        </div>

        <div className="footer-copyright">
          <p>© 2024 USDT Verify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
