import React, { useState } from 'react';
import { Wand2, Brain } from 'lucide-react';
import { 
  containerStyles, 
  cardStyles, 
  headerStyles, 
  titleStyles, 
  chipStyles, 
  tabsContainerStyles, 
  getTabStyles, 
  tabIconStyles, 
  tabContentStyles, 
  tabNameStyles, 
  tabDescStyles 
} from '../components/ToneComponents/styles';
import Navigation from './Layout/Navigation';
import Mode from '../components/ToneComponents/Mode';
import Summary from '../components/ToneComponents/Summary';

export default function AdvancedTools() {
  const [activeTab, setActiveTab] = useState('Tones');

  const tabs = ['Tones', 'Summarize'];

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'Tones': return <Wand2 size={20} />;
      case 'Summarize': return <Brain size={20} />;
      default: return <Wand2 size={20} />;
    }
  };

  const getTabDescription = (tab) => {
    switch (tab) {
      case 'Tones': return 'Humanize content & check plagiarism with different processing modes';
      case 'Summarize': return 'Generate concise summaries with key insights extraction';
      default: return 'Advanced AI text processing';
    }
  };

  return (
    <div style={containerStyles}>
      <Navigation />
      <div style={cardStyles}>
        {/* Header */}
        <div style={headerStyles}>
          <h1 style={titleStyles}>Advanced Tools</h1>
          <div style={chipStyles}>
          ✨ Make It Human • Keep It Clear • Summarize Smart 🎯          
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={tabsContainerStyles}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={getTabStyles(activeTab === tab)}
            >
              <div style={tabIconStyles}>
                {getTabIcon(tab)}
              </div>
              <div style={tabContentStyles}>
                <div style={tabNameStyles}>{tab}</div>
                <div style={tabDescStyles}>
                  {getTabDescription(tab)}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Tones' && <Mode />}
        {activeTab === 'Summarize' && <Summary />}
      </div>
    </div>
  );
}

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .input-output-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(style);