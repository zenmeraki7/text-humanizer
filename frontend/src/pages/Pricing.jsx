import React, { useState, useEffect } from 'react';
import './Pricing.css';
import { CheckIcon, ChevronDownIcon, CrownIcon, StarIcon, TeamIcon, ZapIcon } from '../components/Icons';
import { useOutletContext } from 'react-router-dom';
function PricingPage ()  {
const { sidebarOpen } = useOutletContext();
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFAQ, setOpenFAQ] = useState(null);

// Constants for sidebar positioning
  const drawerWidth = 220;
  const collapsedDrawerWidth = 60;

  useEffect(() => {
    // Initialize floating particles
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
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
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20
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

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        marginLeft: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
        `,
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Floating Particles */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className="floating-particle"
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
      <div style={{
        marginBottom: '60px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2',
          textShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
          transform: `rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
          transition: 'transform 0.3s ease-out',
        }}>
          Choose Your Plan
        </h1>
        <p style={{
          color: '#94a3b8',
          fontSize: '20px',
          fontWeight: 400,
          maxWidth: '700px',
          margin: '0 auto 40px auto',
          lineHeight: '1.6',
        }}>
          Unlock the power of AI-driven content transformation with our flexible pricing plans
        </p>

        {/* Billing Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="billing-toggle">
            <button
              className={`billing-option ${billingPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={`billing-option ${billingPeriod === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
              <span style={{
                background: '#10b981',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '10px',
                marginLeft: '8px',
                fontWeight: '700'
              }}>
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="pricing-container" style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Pricing Plans */}
        <div className="plans-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '32px',
          marginBottom: '80px',
          maxWidth: '800px', // Add max width to control card sizing
          margin: '0 auto 80px auto',
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="popular-badge">
                  Most Popular
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: plan.color,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  <plan.icon />
                </div>
                <div>
                  <h3 style={{
                    color: '#f8fafc',
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: 0
                  }}>
                    {plan.name}
                  </h3>
                  <p style={{
                    color: '#94a3b8',
                    fontSize: '14px',
                    margin: '4px 0 0 0'
                  }}>
                    {plan.description}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  color: '#f8fafc',
                  lineHeight: '1'
                }}>
                  {getPrice(plan)}
                </div>
                <div style={{
                  color: '#64748b',
                  fontSize: '14px',
                  marginTop: '4px'
                }}>
                  {getFullPrice(plan)}
                </div>
              </div>

              <ul className="feature-list" style={{ marginBottom: '32px' }}>
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-icon">
                      <CheckIcon />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`plan-button ${plan.popular ? 'primary' : 'secondary'}`}
                onClick={() => {
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
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#f8fafc',
            textAlign: 'center',
            marginBottom: '40px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Feature Comparison
          </h2>

          <div className="comparison-table">
            <div className="table-header">
              <div className="table-row" style={{
                fontWeight: '700',
                color: '#f8fafc',
                borderBottom: 'none'
              }}>
                <div>Features</div>
                <div style={{ textAlign: 'center' }}>Free</div>
                <div style={{ textAlign: 'center' }}>Pro</div>
                <div style={{ textAlign: 'center' }}>Team</div>
                <div style={{ textAlign: 'center' }}>Enterprise</div>
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
              <div key={index} className="table-row">
                <div style={{ fontWeight: '600', color: '#f8fafc' }}>{row[0]}</div>
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>{row[1]}</div>
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>{row[2]}</div>
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>{row[3]}</div>
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>{row[4]}</div>
              </div>
            ))}
          </div>
        </div>
        {/* FAQ Section */}
        <div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#f8fafc',
            textAlign: 'center',
            marginBottom: '40px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Frequently Asked Questions
          </h2>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  {faq.question}
                  <div style={{
                    transform: openFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    <ChevronDownIcon />
                  </div>
                </button>
                {openFAQ === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: '80px',
          padding: '60px 40px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
          borderRadius: '24px',
          border: '2px solid rgba(99, 102, 241, 0.3)',
          backdropFilter: 'blur(20px)',
        }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#f8fafc',
            marginBottom: '16px'
          }}>
            Ready to transform your content?
          </h3>
          <p style={{
            color: '#94a3b8',
            fontSize: '18px',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px auto'
          }}>
            Join thousands of content creators who trust our AI humanization technology to create authentic, engaging content.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
              }}
              onClick={() => alert('Starting Pro trial...')}
            >
              Start Free Trial
            </button>
            <button
              style={{
                padding: '16px 32px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                color: '#6366f1',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(99, 102, 241, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
              onClick={() => alert('Contacting sales...')}
            >
              Contact Sales
            </button>
          </div>
        </div>
        {/* Trust Indicators */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
        }}>
          <p style={{
            color: '#64748b',
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            Trusted by over 50,000+ content creators worldwide
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            {[
              '🔒 Enterprise Security',
              '💳 Secure Payments',
              '🔄 30-Day Refund',
              '📞 24/7 Support',
              '🌍 Global CDN'
            ].map((feature, index) => (
              <div key={index} style={{
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PricingPage;