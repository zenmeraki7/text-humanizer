import React, { useState, useEffect } from 'react';
import { CheckIcon, ChevronDownIcon, CrownIcon, StarIcon, ZapIcon } from '../components/Icons';
import Navigation from './Layout/Navigation';

// Icon components


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
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
        `,
        padding: isMobile ? '16px' : isTablet ? '24px' : '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Navigation/>
      {/* Floating Particles */}
      {particles.map((particle, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: `particle-float 8s ease-in-out infinite ${index * 0.2}s`,
          }}
        />
      ))}

      {/* Header */}
      <div style={{
        marginBottom: isMobile ? '40px' : isTablet ? '50px' : '60px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <h1 style={{
          fontSize: isMobile ? '2.5rem' : isTablet ? '3rem' : '4rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: isMobile ? '12px' : '20px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2',
          textShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
          transform: isMobile ? 'none' : `rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
          transition: 'transform 0.3s ease-out',
          padding: isMobile ? '0 10px' : '0',
        }}>
          Choose Your Plan
        </h1>
        <p style={{
          color: '#94a3b8',
          fontSize: isMobile ? '16px' : isTablet ? '18px' : '20px',
          fontWeight: 400,
          maxWidth: isMobile ? '100%' : '700px',
          margin: `0 auto ${isMobile ? '30px' : '40px'} auto`,
          lineHeight: '1.6',
          padding: isMobile ? '0 10px' : '0',
        }}>
          Unlock the power of AI-driven content transformation with our flexible pricing plans
        </p>

        {/* Billing Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '20px',
          padding: isMobile ? '0 10px' : '0',
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '2px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            padding: '8px',
            display: 'flex',
            gap: '8px',
            backdropFilter: 'blur(10px)',
            flexDirection: isMobile ? 'column' : 'row',
            width: isMobile ? '100%' : 'auto',
            maxWidth: isMobile ? '300px' : 'none',
          }}>
            <button
              style={{
                padding: isMobile ? '14px 20px' : '12px 24px',
                borderRadius: '12px',
                background: billingPeriod === 'monthly' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                border: 'none',
                color: billingPeriod === 'monthly' ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                position: 'relative',
                boxShadow: billingPeriod === 'monthly' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
              }}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              style={{
                padding: isMobile ? '14px 20px' : '12px 24px',
                borderRadius: '12px',
                background: billingPeriod === 'yearly' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent',
                border: 'none',
                color: billingPeriod === 'yearly' ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                position: 'relative',
                boxShadow: billingPeriod === 'yearly' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
              <span style={{
                background: '#10b981',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '10px',
                fontWeight: '700'
              }}>
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Pricing Plans */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
          gap: isMobile ? '20px' : isTablet ? '24px' : '32px',
          marginBottom: isMobile ? '60px' : '80px',
          maxWidth: isMobile ? '100%' : '800px',
          margin: `0 auto ${isMobile ? '60px' : '80px'} auto`,
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(22, 33, 62, 0.5) 50%, rgba(15, 15, 35, 0.6) 100%)',
                backdropFilter: 'blur(20px)',
                border: plan.popular ? '2px solid rgba(99, 102, 241, 0.6)' : '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '24px',
                padding: isMobile ? '24px' : '32px',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transform: plan.popular && !isMobile ? 'scale(1.05)' : 'scale(1)',
                animation: plan.popular ? 'popular-pulse 3s ease-in-out infinite' : 'none',
                boxShadow: plan.popular ? '0 0 30px rgba(99, 102, 241, 0.4)' : 'none',
              }}
              onClick={() => handlePlanSelect(plan.id)}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.transform = plan.popular ? 'scale(1.05) translateY(-8px)' : 'translateY(-8px)';
                  e.target.style.boxShadow = '0 32px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 80px rgba(99, 102, 241, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.transform = plan.popular ? 'scale(1.05)' : 'scale(1)';
                  e.target.style.boxShadow = plan.popular ? '0 0 30px rgba(99, 102, 241, 0.4)' : 'none';
                }
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                  zIndex: 10,
                }}>
                  Most Popular
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
                flexDirection: isMobile ? 'column' : 'row',
                textAlign: isMobile ? 'center' : 'left',
              }}>
                <div style={{
                  width: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px',
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
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: '700',
                    margin: 0
                  }}>
                    {plan.name}
                  </h3>
                  <p style={{
                    color: '#94a3b8',
                    fontSize: isMobile ? '12px' : '14px',
                    margin: '4px 0 0 0'
                  }}>
                    {plan.description}
                  </p>
                </div>
              </div>

              <div style={{ 
                marginBottom: '24px',
                textAlign: isMobile ? 'center' : 'left',
              }}>
                <div style={{
                  fontSize: isMobile ? '36px' : '48px',
                  fontWeight: '900',
                  color: '#f8fafc',
                  lineHeight: '1'
                }}>
                  {getPrice(plan)}
                </div>
                <div style={{
                  color: '#64748b',
                  fontSize: isMobile ? '12px' : '14px',
                  marginTop: '4px'
                }}>
                  {getFullPrice(plan)}
                </div>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 32px 0',
              }}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '6px 0',
                    color: '#e2e8f0',
                    fontSize: isMobile ? '12px' : '14px',
                  }}>
                    <span style={{ color: '#10b981', flexShrink: 0 }}>
                      <CheckIcon/>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                style={{
                  width: '100%',
                  padding: isMobile ? '14px' : '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: isMobile ? '14px' : '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  background: plan.popular ? 
                    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 
                    'rgba(99, 102, 241, 0.1)',
                  color: plan.popular ? '#fff' : '#6366f1',
                  boxShadow: plan.popular ? '0 8px 25px rgba(99, 102, 241, 0.3)' : 'none',
                  ...(plan.popular ? {} : { border: '2px solid rgba(99, 102, 241, 0.3)' })
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (plan.id === 'enterprise') {
                    alert('Contact our sales team for Enterprise pricing');
                  } else {
                    alert(`Starting ${plan.name} plan...`);
                  }
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = plan.popular ? 
                      '0 12px 35px rgba(99, 102, 241, 0.4)' : 
                      '0 4px 15px rgba(99, 102, 241, 0.2)';
                    if (!plan.popular) {
                      e.target.style.background = 'rgba(99, 102, 241, 0.2)';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = plan.popular ? '0 8px 25px rgba(99, 102, 241, 0.3)' : 'none';
                    if (!plan.popular) {
                      e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                    }
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
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{
              fontSize: isTablet ? '2rem' : '2.5rem',
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

            <div style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(22, 33, 62, 0.5) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '20px',
              overflow: 'hidden',
            }}>
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '20px',
                borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isTablet ? '2fr 1fr 1fr 1fr 1fr' : '2fr 1fr 1fr 1fr 1fr',
                  padding: '0',
                  alignItems: 'center',
                  fontWeight: '700',
                  color: '#f8fafc',
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
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: isTablet ? '2fr 1fr 1fr 1fr 1fr' : '2fr 1fr 1fr 1fr 1fr',
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
                  alignItems: 'center',
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(99, 102, 241, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
                >
                  <div style={{ fontWeight: '600', color: '#f8fafc' }}>{row[0]}</div>
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>{row[1]}</div>
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>{row[2]}</div>
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>{row[3]}</div>
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>{row[4]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div style={{ marginBottom: isMobile ? '60px' : '80px' }}>
          <h2 style={{
            fontSize: isMobile ? '2rem' : isTablet ? '2.25rem' : '2.5rem',
            fontWeight: '700',
            color: '#f8fafc',
            textAlign: 'center',
            marginBottom: isMobile ? '30px' : '40px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Frequently Asked Questions
          </h2>

          <div style={{ 
            maxWidth: isMobile ? '100%' : '800px', 
            margin: '0 auto',
          }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(22, 33, 62, 0.5) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '16px',
                marginBottom: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                }
              }}
              >
                <button
                  style={{
                    width: '100%',
                    padding: isMobile ? '16px 20px' : '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.target.style.color = '#6366f1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.target.style.color = '#f8fafc';
                    }
                  }}
                >
                  <span style={{ paddingRight: '16px' }}>{faq.question}</span>
                  <div style={{
                    transform: openFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    flexShrink: 0,
                  }}>
                    <ChevronDownIcon />
                  </div>
                </button>
                {openFAQ === index && (
                  <div style={{
                    padding: isMobile ? '0 20px 16px 20px' : '0 24px 20px 24px',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                    fontSize: isMobile ? '13px' : '14px',
                    animation: 'fadeIn 0.3s ease-in-out',
                  }}>
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
          marginTop: isMobile ? '60px' : '80px',
          padding: isMobile ? '40px 20px' : isTablet ? '50px 30px' : '60px 40px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
          borderRadius: '24px',
          border: '2px solid rgba(99, 102, 241, 0.3)',
          backdropFilter: 'blur(20px)',
        }}>
          <h3 style={{
            fontSize: isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem',
            fontWeight: '700',
            color: '#f8fafc',
            marginBottom: '16px'
          }}>
            Ready to transform your content?
          </h3>
          <p style={{
            color: '#94a3b8',
            fontSize: isMobile ? '14px' : '18px',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6',
          }}>
            Join thousands of content creators who trust our AI humanization technology to create authentic, engaging content.
          </p>
          <div style={{
            display: 'flex',
            gap: isMobile ? '12px' : '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
          }}>
            <button
              style={{
                padding: isMobile ? '14px 24px' : '16px 32px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                width: isMobile ? '100%' : 'auto',
                maxWidth: isMobile ? '280px' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                }
              }}
              onClick={() => alert('Starting Pro trial...')}
            >
              Start Free Trial
            </button>
            <button
              style={{
                padding: isMobile ? '14px 24px' : '16px 32px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '2px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                color: '#6366f1',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                width: isMobile ? '100%' : 'auto',
                maxWidth: isMobile ? '280px' : 'none',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(99, 102, 241, 0.2)';
                if (!isMobile) {
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                if (!isMobile) {
                  e.target.style.transform = 'translateY(0)';
                }
              }}
              onClick={() => alert('Contacting sales...')}
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div style={{
          marginTop: isMobile ? '40px' : '60px',
          textAlign: 'center',
        }}>
          <p style={{
            color: '#64748b',
            fontSize: isMobile ? '12px' : '14px',
            marginBottom: '20px'
          }}>
            Trusted by over 50,000+ content creators worldwide
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '16px' : '32px',
            flexWrap: 'wrap',
            flexDirection: isMobile ? 'column' : 'row',
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
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: '500'
              }}>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(120deg);
          }
          66% {
            transform: translateY(8px) rotate(240deg);
          }
        }

        @keyframes popular-pulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
          }
          50% {
            box-shadow: 0 0 50px rgba(99, 102, 241, 0.6);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default PricingPage;