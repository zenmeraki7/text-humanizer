import React, { useState, useEffect } from 'react';
import { CheckIcon, ChevronDownIcon, CrownIcon, StarIcon, ZapIcon } from '../components/Icons';
import Navigation from './Layout/Navigation';
import './Pricing.css';

const TeamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function PricingPage() {
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initialize floating particles (fewer on mobile)
    const particleCount = windowWidth < 768 ? 15 : windowWidth < 1024 ? 20 : 30;
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setParticles(newParticles);

    // Animate particles
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          
          if (newX > window.innerWidth) newX = 0;
          if (newX < 0) newX = window.innerWidth;
          if (newY > window.innerHeight) newY = 0;
          if (newY < 0) newY = window.innerHeight;
          
          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 100);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]);

  const handleMouseMove = (e) => {
    // Reduce mouse parallax effect on mobile
    const intensity = windowWidth < 768 ? 5 : 20;
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * intensity,
      y: (e.clientY / window.innerHeight - 0.5) * intensity
    });
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      icon: ZapIcon,
      color: 'rgba(148, 163, 184, 0.3)',
      features: [
        '5,000 words per month',
        'Basic AI humanization',
        'Standard processing speed',
        'Email support',
        'Basic export options'
      ],
      limitations: [
        'Limited to 500 words per request',
        'No priority support',
        'Basic features only'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 10, yearly: 120 },
      description: 'Best for professionals and content creators',
      icon: StarIcon,
      color: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      popular: true,
      features: [
        'Unlimited words',
        'Advanced AI humanization',
        'Priority processing',
        '24/7 priority support',
        'All export formats',
        'Plagiarism checker',
        'Advanced analytics',
        'Custom templates',
        'API access'
      ]
    },
    {
      id: 'team',
      name: 'Team',
      price: { monthly: 25, yearly: 250 },
      description: 'Perfect for teams and agencies',
      icon: TeamIcon,
      color: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Team collaboration tools',
        'Advanced user management',
        'White-label options',
        'Custom integrations',
        'Dedicated account manager',
        'Custom training',
        'Advanced security features'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 50, yearly: 350 },
      description: 'For large organizations with custom needs',
      icon: CrownIcon,
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      features: [
        'Everything in Team',
        'Unlimited team members',
        'Custom deployment options',
        'Advanced security & compliance',
        'Custom AI model training',
        'SLA guarantees',
        'On-premise installation',
        '24/7 dedicated support',
        'Custom contracts'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How does the billing work?',
      answer: 'You can choose between monthly and yearly billing. Yearly plans come with a 17% discount. All plans automatically renew unless cancelled.'
    },
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the charges accordingly.'
    },
    {
      question: 'What happens if I exceed my word limit?',
      answer: 'Free users will need to upgrade to continue. Pro and Team users have unlimited words, so there are no overage charges.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.'
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial.'
    },
    {
      question: 'How secure is my data?',
      answer: 'We use enterprise-grade security with end-to-end encryption. Your data is never stored permanently and is deleted after processing.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time from your account settings. Your plan remains active until the end of the billing period.'
    },
    {
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Yes! Our Enterprise plan includes custom deployment, on-premise installation, and tailored solutions for large organizations.'
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const getPrice = (plan) => {
    if (typeof plan.price[billingPeriod] === 'number') {
      return billingPeriod === 'yearly' 
        ? `$${Math.round(plan.price.yearly / 12)}/mo`
        : `$${plan.price.monthly}/mo`;
    }
    return plan.price[billingPeriod];
  };

  const getFullPrice = (plan) => {
    if (typeof plan.price[billingPeriod] === 'number') {
      return billingPeriod === 'yearly' 
        ? `$${plan.price.yearly}/year`
        : `$${plan.price.monthly}/month`;
    }
    return 'Contact Sales';
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <div 
      className="pricing-page"
      onMouseMove={handleMouseMove}
    >
      <Navigation/>
      
      {/* Floating Particles */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className="particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}

      {/* Header */}
      <div className={`header ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
        <h1 
          className="main-title"
          style={{
            transform: isMobile ? 'none' : `rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
          }}
        >
          Choose Your Plan
        </h1>
        <p className="subtitle">
          Unlock the power of AI-driven content transformation with our flexible pricing plans
        </p>

        {/* Billing Toggle */}
        <div className={`billing-toggle-container ${isMobile ? 'mobile' : ''}`}>
          <div className={`billing-toggle ${isMobile ? 'mobile' : ''}`}>
            <button
              className={`billing-btn ${billingPeriod === 'monthly' ? 'active' : ''} ${isMobile ? 'mobile' : ''}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={`billing-btn ${billingPeriod === 'yearly' ? 'active' : ''} ${isMobile ? 'mobile' : ''}`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
              <span className="save-badge">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Pricing Plans */}
        <div className={`pricing-grid ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? 'popular' : ''} ${isMobile ? 'mobile' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className={`popular-badge ${isMobile ? 'mobile' : ''}`}>
                  Most Popular
                </div>
              )}

              <div className={`plan-header ${isMobile ? 'mobile' : ''}`}>
                <div className={`plan-icon ${isMobile ? 'mobile' : ''}`} style={{ background: plan.color }}>
                  <plan.icon />
                </div>
                <div>
                  <h3 className={`plan-name ${isMobile ? 'mobile' : ''}`}>
                    {plan.name}
                  </h3>
                  <p className={`plan-description ${isMobile ? 'mobile' : ''}`}>
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className={`plan-pricing ${isMobile ? 'mobile' : ''}`}>
                <div className={`price-main ${isMobile ? 'mobile' : ''}`}>
                  {getPrice(plan)}
                </div>
                <div className={`price-sub ${isMobile ? 'mobile' : ''}`}>
                  {getFullPrice(plan)}
                </div>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index} className={`feature-item ${isMobile ? 'mobile' : ''}`}>
                    <span className="check-icon">
                      <CheckIcon/>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                className={`cta-button ${plan.popular ? 'popular' : ''} ${isMobile ? 'mobile' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (plan.id === 'enterprise') {
                    alert('Contact our sales team for Enterprise pricing');
                  } else {
                    alert(`Starting ${plan.name} plan...`);
                  }
                }}
              >
                {plan.id === 'free' ? 'Get Started' : 
                 plan.id === 'enterprise' ? 'Contact Sales' : 
                 'Start Free Trial'}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison Table */}
        {!isMobile && (
          <div className="comparison-section">
            <h2 className={`comparison-title ${isTablet ? 'tablet' : ''}`}>
              Feature Comparison
            </h2>

            <div className="comparison-table">
              <div className="table-header">
                <div className={`table-header-grid ${isTablet ? 'tablet' : ''}`}>
                  <div>Features</div>
                  <div>Free</div>
                  <div>Pro</div>
                  <div>Team</div>
                  <div>Enterprise</div>
                </div>
              </div>

              {[
                ['Word Limit', '5,000/month', 'Unlimited', 'Unlimited', 'Unlimited'],
                ['AI Humanization', 'Basic', 'Advanced', 'Advanced', 'Custom'],
                ['Processing Speed', 'Standard', 'Priority', 'Priority', 'Dedicated'],
                ['Support', 'Email', '24/7 Priority', '24/7 Priority', 'Dedicated Manager'],
                ['Team Members', '1', '1', '10', 'Unlimited'],
                ['API Access', '❌', '✅', '✅', '✅'],
                ['Custom Training', '❌', '❌', '❌', '✅'],
                ['White Label', '❌', '❌', '✅', '✅'],
              ].map((row, index) => (
                <div key={index} className={`table-row ${isTablet ? 'tablet' : ''}`}>
                  <div className="feature-name">{row[0]}</div>
                  <div className="feature-value">{row[1]}</div>
                  <div className="feature-value">{row[2]}</div>
                  <div className="feature-value">{row[3]}</div>
                  <div className="feature-value">{row[4]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className={`faq-section ${isMobile ? 'mobile' : ''}`}>
          <h2 className={`faq-title ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
            Frequently Asked Questions
          </h2>

          <div className={`faq-container ${isMobile ? 'mobile' : ''}`}>
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${isMobile ? 'mobile' : ''}`}
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <span className="question-text">{faq.question}</span>
                  <div className={`chevron ${openFAQ === index ? 'open' : ''}`}>
                    <ChevronDownIcon />
                  </div>
                </button>
                {openFAQ === index && (
                  <div className={`faq-answer ${isMobile ? 'mobile' : ''}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`cta-section ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
          <h3 className={`cta-title ${isMobile ? 'mobile' : isTablet ? 'tablet' : ''}`}>
            Ready to transform your content?
          </h3>
          <p className={`cta-description ${isMobile ? 'mobile' : ''}`}>
            Join thousands of content creators who trust our AI humanization technology to create authentic, engaging content.
          </p>
          <div className={`cta-buttons ${isMobile ? 'mobile' : ''}`}>
            <button
              className={`cta-primary ${isMobile ? 'mobile' : ''}`}
              onClick={() => alert('Starting Pro trial...')}
            >
              Start Free Trial
            </button>
            <button
              className={`cta-secondary ${isMobile ? 'mobile' : ''}`}
              onClick={() => alert('Contacting sales...')}
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={`trust-section ${isMobile ? 'mobile' : ''}`}>
          <p className={`trust-text ${isMobile ? 'mobile' : ''}`}>
            Trusted by over 50,000+ content creators worldwide
          </p>
          <div className={`trust-features ${isMobile ? 'mobile' : ''}`}>
            {[
              '🔒 Enterprise Security',
              '💳 Secure Payments',
              '🔄 30-Day Refund',
              '📞 24/7 Support',
              '🌍 Global CDN'
            ].map((feature, index) => (
              <div key={index} className={`trust-feature ${isMobile ? 'mobile' : ''}`}>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;a