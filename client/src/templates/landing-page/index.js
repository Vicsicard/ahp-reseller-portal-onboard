import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './LandingPage.module.css';
import CustomerSignupForm from '../../components/customer/CustomerSignupForm';

/**
 * Customizable Landing Page Template for Resellers
 * Based on the land5.aihandshake.org design
 */
const ResellerLandingPage = ({ reseller }) => {
  const {
    companyName,
    logoUrl,
    primaryColor,
    contactEmail,
    contactPhone,
    portalUrl,
    // Add any other reseller data needed for customization
  } = reseller;

  // Generate custom CSS variables for the reseller's branding
  const customStyles = {
    '--primary': primaryColor || '#8b5cf6',
    '--primary-light': adjustColor(primaryColor, 20) || '#a78bfa',
    '--primary-dark': adjustColor(primaryColor, -20) || '#7c3aed',
    '--primary-gradient': `linear-gradient(135deg, var(--primary-light), var(--primary-dark))`,
  };

  return (
    <>
      <Head>
        <title>{companyName} - AHP Module 2.0</title>
        <meta name="description" content={`Make your website AI-ready with AHP Module 2.0. Provided by ${companyName}.`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.landingPage} style={customStyles}>
        <header className={styles.header}>
          <div className={styles.container}>
            <nav className={styles.nav}>
              <div className={styles.logo}>
                {logoUrl ? (
                  <img src={logoUrl} alt={`${companyName} Logo`} />
                ) : (
                  <img src="/images/ahp-logo-new.jpg" alt="AHP Module 2.0 Logo" />
                )}
              </div>
              <div className={styles.navLinks}>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#installation">Installation</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className={styles.navCta}>
                <a href="#installation" className={`${styles.btn} ${styles.btnPrimary}`}>Get Started</a>
              </div>
            </nav>
            
            <div className={styles.hero}>
              <div className={styles.heroContent}>
                <h1>The Protocol That Powers Human-AI Communication</h1>
                <p className={styles.subheadline}>
                  Make your website AI-ready and start benefiting from enhanced visibility with actionable insights 
                  on how AI systems see and interact with your content.
                </p>
                <div className={styles.heroCta}>
                  <a href="#installation" className={`${styles.btn} ${styles.btnPrimary}`}>Install Now</a>
                  <a href="#how-it-works" className={`${styles.btn} ${styles.btnSecondary}`}>Learn More</a>
                </div>
              </div>
              <div className={styles.heroImage}>
                <div className={styles.floatingElement}>
                  <img src="/images/hero-illustration.svg" alt="AHP Module Illustration" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="features" className={`${styles.features} ${styles.sectionPadding}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Be Visible to AI</h2>
            <p className={styles.sectionSubtitle}>AHP Module 2.0 shows you what AI sees—and how to fix it.</p>
            
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <img src="/images/icon-visibility.svg" alt="Visibility Icon" />
                </div>
                <h3>AI Visibility</h3>
                <p>Understand how AI systems see and interpret your website content in real-time.</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <img src="/images/icon-analytics.svg" alt="Analytics Icon" />
                </div>
                <h3>Crawler Analytics</h3>
                <p>Track AI crawler behavior and learn which content elements attract AI attention.</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <img src="/images/icon-reports.svg" alt="Reports Icon" />
                </div>
                <h3>Weekly Reports</h3>
                <p>Receive actionable insights and optimization recommendations every week.</p>
              </div>
              
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <img src="/images/icon-solutions.svg" alt="Solutions Icon" />
                </div>
                <h3>Tailored Solutions</h3>
                <p>Get data-driven fixes based on real crawler behavior and metadata analysis.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={`${styles.howItWorks} ${styles.sectionPadding} ${styles.darkSection}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSubtitle}>AI Isn't Clicking. It's Summarizing.</p>
            
            <div className={styles.processSteps}>
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h3>Install the Script</h3>
                  <p>Add a single line of code to your website's &lt;head&gt; section.</p>
                </div>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h3>Track AI Interactions</h3>
                  <p>The module automatically detects and monitors AI crawler activity.</p>
                </div>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h3>Analyze Performance</h3>
                  <p>Our system analyzes how AI systems interact with your content.</p>
                </div>
              </div>
              
              <div className={styles.processStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h3>Get Insights</h3>
                  <p>Receive weekly reports with actionable recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.metrics} ${styles.sectionPadding}`}>
          <div className={styles.container}>
            <div className={styles.metricsGrid}>
              <div className={styles.metric}>
                <div className={styles.metricValue}>87%</div>
                <div className={styles.metricLabel}>Increased AI visibility</div>
              </div>
              
              <div className={styles.metric}>
                <div className={styles.metricValue}>3.5x</div>
                <div className={styles.metricLabel}>More AI crawler visits</div>
              </div>
              
              <div className={styles.metric}>
                <div className={styles.metricValue}>92%</div>
                <div className={styles.metricLabel}>User satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        <section id="installation" className={`${styles.installation} ${styles.sectionPadding}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Get Started with AHP Module 2.0</h2>
            <p className={styles.sectionSubtitle}>Follow these simple steps to make your website AI-ready and start benefiting from enhanced visibility.</p>
            
            <div className={styles.installationGrid}>
              <div className={styles.installationSteps}>
                <div className={styles.installationStep}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h3>Add the AHP script to your website</h3>
                    <p>Copy and paste this code snippet into the &lt;head&gt; section of your website:</p>
                    <div className={styles.codeBlock}>
                      <pre><code>&lt;script src="https://cdn.aihandshake.org/module/v2.0/module.js" data-auto-init="true" data-reseller="{portalUrl}"&gt;&lt;/script&gt;</code></pre>
                      <button className={styles.copyBtn} onClick={() => window.copyCode()}>Copy</button>
                    </div>
                  </div>
                </div>
                
                <div className={styles.installationStep}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h3>Complete the registration</h3>
                    <p>After installation, a popup will appear asking for your name and email. Simply fill in these details to complete the registration.</p>
                  </div>
                </div>
                
                <div className={styles.installationStep}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h3>Start receiving weekly reports</h3>
                    <p>That's it! You'll automatically begin receiving free weekly AI visibility reports with actionable insights for your website.</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.signupFormContainer}>
                <CustomerSignupForm 
                  resellerId={reseller._id || reseller.vanityUrl} 
                  resellerName={companyName} 
                  onSuccess={(data) => {
                    // Optional: Track successful signup or show additional information
                    console.log('Customer signup successful:', data);
                  }} 
                />
              </div>
            </div>
          </div>
        </section>
        
        <section id="testimonials" className={`${styles.testimonials} ${styles.sectionPadding} ${styles.darkSection}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What Our Users Say</h2>
            
            <div className={styles.testimonialSlider}>
              <div className={styles.testimonial}>
                <div className={styles.testimonialContent}>
                  <p>"AHP Module 2.0 has transformed how AI interacts with our content. We've seen a 92% increase in visibility across major AI platforms."</p>
                </div>
                <div className={styles.testimonialAuthor}>
                  <img src="/images/testimonial-1.jpg" alt="Sarah Johnson" />
                  <div>
                    <h4>Sarah Johnson</h4>
                    <p>Marketing Director, TechCorp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className={`${styles.faq} ${styles.sectionPadding}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h3>What is AHP Module 2.0?</h3>
                <p>AHP Module 2.0 is a lightweight JavaScript module that helps make your website more visible to AI systems by tracking how they interact with your content and providing actionable insights.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>Will it slow down my website?</h3>
                <p>No, AHP Module 2.0 is designed to be extremely lightweight (under 15KB) and loads asynchronously, so it won't impact your website's performance or loading speed.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>How does it detect AI crawlers?</h3>
                <p>The module uses advanced pattern recognition to identify AI crawlers based on their behavior and user agent strings, allowing it to track interactions from major AI systems.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3>Is there a free version?</h3>
                <p>Yes! The basic installation provides free weekly reports with essential insights. Premium features are available for more comprehensive analytics and automated fixes.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.ctaSection} ${styles.sectionPadding}`}>
          <div className={styles.container}>
            <div className={styles.ctaContent}>
              <h2>Ready to be visible to AI?</h2>
              <p>Join thousands of websites already optimized for AI visibility.</p>
              <a href="#installation" className={`${styles.btn} ${styles.btnPrimary}`}>Get Started Now</a>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerGrid}>
              <div className={styles.footerBrand}>
                {logoUrl ? (
                  <img src={logoUrl} alt={`${companyName} Logo`} />
                ) : (
                  <img src="/images/ahp-logo-new.jpg" alt="AHP Module 2.0 Logo" />
                )}
                <p>The Protocol That Powers Human-AI Communication</p>
                <p>Provided by {companyName}</p>
              </div>
              
              <div className={styles.footerLinks}>
                <h3>Product</h3>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><a href="#installation">Installation</a></li>
                </ul>
              </div>
              
              <div className={styles.footerLinks}>
                <h3>Resources</h3>
                <ul>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#">Documentation</a></li>
                  <li><a href="#">Support</a></li>
                </ul>
              </div>
              
              <div className={styles.footerLinks}>
                <h3>Contact</h3>
                <ul>
                  <li><a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
                  {contactPhone && <li><a href={`tel:${contactPhone}`}>{contactPhone}</a></li>}
                  <li><a href={portalUrl}>Reseller Portal</a></li>
                </ul>
              </div>
            </div>
            
            <div className={styles.footerBottom}>
              <p>&copy; {new Date().getFullYear()} {companyName} | AI Handshake Protocol. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      <Script id="copy-code">
        {`
          function copyCode() {
            const codeText = '<script src="https://cdn.aihandshake.org/module/v2.0/module.js" data-auto-init="true" data-reseller="${portalUrl}"><\\/script>';
            navigator.clipboard.writeText(codeText);
            
            const copyBtn = document.querySelector('.${styles.copyBtn}');
            copyBtn.textContent = 'Copied!';
            
            setTimeout(() => {
              copyBtn.textContent = 'Copy';
            }, 2000);
          }
        `}
      </Script>
    </>
  );
};

/**
 * Helper function to adjust a hex color by a percentage
 * @param {string} color - Hex color code
 * @param {number} percent - Percentage to lighten (positive) or darken (negative)
 * @returns {string} - Adjusted hex color
 */
function adjustColor(color, percent) {
  if (!color) return null;
  
  // Remove the # if present
  color = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Adjust the color
  const adjustR = Math.min(255, Math.max(0, Math.round(r * (1 + percent / 100))));
  const adjustG = Math.min(255, Math.max(0, Math.round(g * (1 + percent / 100))));
  const adjustB = Math.min(255, Math.max(0, Math.round(b * (1 + percent / 100))));
  
  // Convert back to hex
  return '#' + 
    ((1 << 24) + (adjustR << 16) + (adjustG << 8) + adjustB)
    .toString(16)
    .slice(1);
}

export default ResellerLandingPage;
