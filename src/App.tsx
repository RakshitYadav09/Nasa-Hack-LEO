import { useState, useEffect, useRef, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BeginnerFriendlyForm, { FormData } from './components/BeginnerFriendlyForm';
import EnhancedDashboard from './components/EnhancedDashboard';
import { initializeGeminiService } from './services/geminiAI';

function App() {
  const [currentView, setCurrentView] = useState<'form' | 'dashboard'>('form');
  const [formData, setFormData] = useState<FormData>({
    // Phase 1: Opportunity Definition
    businessCategory: '',
    targetRevenue: 0,
    productValueDensity: 0,
    targetMarket: '',
    
    // Phase 2: Operational & Technical Parameters
    constellationSize: 12,
    targetAltitude: 550,
    missionLifespan: 0,
    launchVehicleType: '',
    inSpacePropulsion: false,
    selectedLaunchSite: '',
    payloadMass: 300,
    leadTimeTolerance: 18,
    
    // Phase 3: Risk & Sustainability
    deorbitMethod: '',
    ssaStrategy: '',
    dataLicensing: ''
  });

  const topRef = useRef<HTMLDivElement>(null);

  // Stable form data handler to prevent unnecessary re-renders
  const handleFormChange = useCallback((newData: FormData) => {
    setFormData(newData);
  }, []);

  useEffect(() => {
    // Initialize Gemini service with the API key
    initializeGeminiService();
    
    // Welcome toast
    toast.success('🌌 Welcome to LEO-Xplorer! Plan your space mission with AI-powered insights.', {
      position: 'top-right',
      autoClose: 4000,
    });
  }, []);

  // Removed programmatic scrolling to prevent scroll-to-top on interactions

  const handleFormSubmit = () => {
    setCurrentView('dashboard');
    toast.success('🚀 Mission analysis complete! Explore your comprehensive insights below.', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const handleBackToForm = () => {
    setCurrentView('form');
    toast.info('📝 Back to mission planning. Modify your parameters as needed.', {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  return (
    <div ref={topRef} className="min-h-screen relative">
      {/* Animated background meteors */}
      <div className="meteor" />
      <div className="meteor" />
      <div className="meteor" />
      
      {/* Main content */}
      <div className="relative z-10">
        {currentView === 'form' && (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="text-center mb-12">
              <div className="floating-element mb-6">
                <h1 className="text-6xl font-black text-blue-400 mb-4">
                  🌌 LEO-XPLORER
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6 font-medium">
                Your comprehensive <span className="text-cyan-400 font-bold">Low Earth Orbit</span> mission planning platform. 
                Get expert analysis, debris risk assessment, and AI-powered recommendations for your commercial space venture.
              </p>
              <div className="inline-flex items-center space-x-3 glass-panel px-6 py-3 rounded-full">
                <div className="w-3 h-3 bg-cyan-400 rounded-full pulse-glow"></div>
                <span className="text-cyan-400 font-semibold">🤖 AI Analysis Powered by Gemini</span>
              </div>
            </div>
            
            <BeginnerFriendlyForm
              formData={formData}
              onFormChange={handleFormChange}
              onSubmit={handleFormSubmit}
            />
          </div>
        )}
        
        {currentView === 'dashboard' && (
          <EnhancedDashboard
            formData={formData}
            onBack={handleBackToForm}
          />
        )}
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-dark-800/90 !text-white !border !border-space-700/50"
        progressClassName="!bg-blue-500"
      />
    </div>
  );
}

export default App;
