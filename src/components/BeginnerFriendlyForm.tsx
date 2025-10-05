import React, { useState, useCallback } from 'react';
import { businessCategories, launchSites } from '../data/enhancedNasaData';

export interface FormData {
  // Phase 1: Opportunity Definition
  businessCategory: string;
  targetRevenue: number;
  productValueDensity: number;
  targetMarket: string;
  
  // Phase 2: Operational & Technical Parameters
  constellationSize: number;
  targetAltitude: number;
  missionLifespan: number;
  launchVehicleType: string;
  inSpacePropulsion: boolean;
  selectedLaunchSite: string;
  payloadMass: number;
  leadTimeTolerance: number;
  
  // Phase 3: Risk & Sustainability
  deorbitMethod: string;
  ssaStrategy: string;
  dataLicensing: string;
}

interface BeginnerFriendlyFormProps {
  formData: FormData;
  onFormChange: (data: FormData) => void;
  onSubmit: () => void;
}

const BeginnerFriendlyForm: React.FC<BeginnerFriendlyFormProps> = ({
  formData,
  onFormChange,
  onSubmit
}) => {
  const [showTooltips, setShowTooltips] = useState(true);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Slider update handler
  const updateSlider = useCallback((field: keyof FormData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      onFormChange({ ...formData, [field]: value });
    }, [formData, onFormChange]
  );

  // Dropdown update handler
  const updateDropdown = useCallback((field: keyof FormData) => 
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onFormChange({ ...formData, [field]: field === 'targetRevenue' || field === 'missionLifespan' ? Number(value) : value });
    }, [formData, onFormChange]
  );

  const updateRadio = useCallback((field: keyof FormData, value: string | boolean) => (e?: React.ChangeEvent<HTMLInputElement> | React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onFormChange({ ...formData, [field]: value });
  }, [formData, onFormChange]);

  // Radio button update handler for business category and target market
  const updateRadioInput = useCallback((field: keyof FormData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onFormChange({ ...formData, [field]: value });
    }, [formData, onFormChange]
  );

  // Context functions with proper typing
  const getRevenueContext = (revenue: string | number) => {
    const val = typeof revenue === 'string' ? Number(revenue) : revenue;
    if (val === 0) return { text: "Select target revenue", color: "text-gray-400", bg: "bg-gray-800" };
    if (val <= 1000000) return { text: "Low risk, pilot project", color: "text-green-400", bg: "bg-green-900/20" };
    if (val <= 25000000) return { text: "Moderate scale, proven market", color: "text-blue-400", bg: "bg-blue-900/20" };
    if (val <= 100000000) return { text: "High ambition, major investment", color: "text-yellow-400", bg: "bg-yellow-900/20" };
    return { text: "Industry leader scale, extreme capital", color: "text-red-400", bg: "bg-red-900/20" };
  };

  const getConstellationContext = (size: string | number) => {
    const val = typeof size === 'string' ? Number(size) : size;
    if (val === 0) return { text: "Choose constellation size", color: "text-gray-400", bg: "bg-gray-800" };
    if (val <= 6) return { text: "Small coverage, lower cost", color: "text-green-400", bg: "bg-green-900/20" };
    if (val <= 24) return { text: "Regional coverage, moderate cost", color: "text-blue-400", bg: "bg-blue-900/20" };
    if (val <= 100) return { text: "Global coverage, high cost", color: "text-yellow-400", bg: "bg-yellow-900/20" };
    return { text: "Mega constellation, massive complexity", color: "text-red-400", bg: "bg-red-900/20" };
  };

  const getAltitudeContext = (altitude: string | number) => {
    const val = typeof altitude === 'string' ? Number(altitude) : altitude;
    if (val === 0) return { text: "Set orbital altitude", color: "text-gray-400", bg: "bg-gray-800" };
    if (val <= 400) return { text: "Low orbit, high drag, short lifespan", color: "text-red-400", bg: "bg-red-900/20" };
    if (val <= 600) return { text: "Sweet spot, good coverage vs. lifespan", color: "text-green-400", bg: "bg-green-900/20" };
    if (val <= 1000) return { text: "Higher orbit, longer lifespan, less coverage", color: "text-blue-400", bg: "bg-blue-900/20" };
    return { text: "Very high orbit, radiation concerns", color: "text-yellow-400", bg: "bg-yellow-900/20" };
  };

  const getValueDensityContext = (density: string | number) => {
    const val = typeof density === 'string' ? Number(density) : density;
    if (val === 0) return { text: "Set product value per kg", color: "text-gray-400", bg: "bg-gray-800" };
    if (val <= 100) return { text: "Low value cargo, cost sensitive", color: "text-red-400", bg: "bg-red-900/20" };
    if (val <= 1000) return { text: "Moderate value, standard pricing", color: "text-blue-400", bg: "bg-blue-900/20" };
    if (val <= 10000) return { text: "High value, premium pricing", color: "text-green-400", bg: "bg-green-900/20" };
    return { text: "Ultra-premium, cost no object", color: "text-purple-400", bg: "bg-purple-900/20" };
  };

  const getPayloadMassContext = (mass: string | number) => {
    const val = typeof mass === 'string' ? Number(mass) : mass;
    if (val === 0) return { text: "Set total payload mass", color: "text-gray-400", bg: "bg-gray-800" };
    if (val <= 200) return { text: "Small satellite class, rideshare friendly", color: "text-green-400", bg: "bg-green-900/20" };
    if (val <= 500) return { text: "Medium payload, dedicated small launcher", color: "text-blue-400", bg: "bg-blue-900/20" };
    if (val <= 1500) return { text: "Large payload, medium launcher required", color: "text-yellow-400", bg: "bg-yellow-900/20" };
    return { text: "Heavy payload, premium launch vehicle", color: "text-red-400", bg: "bg-red-900/20" };
  };

  const getLeadTimeContext = (months: string | number) => {
    const val = typeof months === 'string' ? Number(months) : months;
    if (val === 0) return { text: "Set lead time flexibility", color: "text-gray-400", bg: "bg-gray-800", tip: "Choose how flexible you can be with launch timing" };
    if (val <= 12) return { text: "Rush launch, premium pricing", color: "text-red-400", bg: "bg-red-900/20", tip: "⚡ Urgent missions pay 20-40% premium. Consider SpaceX or ULA for rapid deployment." };
    if (val <= 24) return { text: "Standard timeline, competitive rates", color: "text-blue-400", bg: "bg-blue-900/20", tip: "📅 Optimal balance of cost and schedule flexibility. All vendors competitive." };
    if (val <= 30) return { text: "Flexible timing, cost savings", color: "text-green-400", bg: "bg-green-900/20", tip: "💰 Save 15-25% by accepting rideshare opportunities. ISRO and RocketLab excel here." };
    return { text: "Very flexible, maximum cost efficiency", color: "text-purple-400", bg: "bg-purple-900/20", tip: "🎯 Maximum savings possible. Consider ISRO for lowest costs or NASA for technology demonstrations." };
  };

  const getLaunchVehicleContext = (vehicleType: string) => {
    if (!vehicleType) return { text: "Select launch vehicle class", color: "text-gray-400", bg: "bg-gray-800", tip: "Choose based on your total payload mass and mission requirements" };
    if (vehicleType === 'Small') return { text: "Small launch vehicles (≤500kg)", color: "text-green-400", bg: "bg-green-900/20", tip: "🚀 Perfect for smallsats. RocketLab Electron ideal for dedicated missions. Lower cost per launch." };
    if (vehicleType === 'Medium') return { text: "Medium launch vehicles (500kg-10t)", color: "text-blue-400", bg: "bg-blue-900/20", tip: "⚖️ Balanced option. SpaceX Falcon 9 dominates this class with high reliability and reusability." };
    if (vehicleType === 'Heavy') return { text: "Heavy launch vehicles (10t+)", color: "text-orange-400", bg: "bg-orange-900/20", tip: "🏗️ For large constellations or heavy payloads. ULA Atlas V/Delta IV for critical missions, SpaceX Falcon Heavy for cost efficiency." };
    return { text: "Rideshare opportunities", color: "text-purple-400", bg: "bg-purple-900/20", tip: "🤝 Most cost-effective but less schedule control. SpaceX and RocketLab offer regular rideshare programs." };
  };

  const getMissionLifespanContext = (years: string | number) => {
    const val = typeof years === 'string' ? Number(years) : years;
    if (val === 0) return { text: "Set mission duration", color: "text-gray-400", bg: "bg-gray-800", tip: "Consider your business model and technology refresh cycles" };
    if (val <= 1) return { text: "Technology demonstration", color: "text-yellow-400", bg: "bg-yellow-900/20", tip: "🧪 Short missions ideal for proving concepts. NASA partnerships available for novel tech." };
    if (val <= 3) return { text: "Standard commercial mission", color: "text-blue-400", bg: "bg-blue-900/20", tip: "📈 Most common duration. Balances ROI with technology evolution. All vendors experienced." };
    if (val <= 5) return { text: "Extended commercial operation", color: "text-green-400", bg: "bg-green-900/20", tip: "🎯 Longer missions require robust satellite design. Consider radiation hardening for higher orbits." };
    if (val <= 7) return { text: "Long-term infrastructure", color: "text-purple-400", bg: "bg-purple-900/20", tip: "🏗️ Infrastructure-class missions. Requires premium components and extensive ground segment." };
    return { text: "Decade+ strategic asset", color: "text-red-400", bg: "bg-red-900/20", tip: "🛰️ Strategic national/commercial asset. NASA-class requirements for redundancy and serviceability." };
  };

  const isPhaseComplete = (phase: number): boolean => {
    switch (phase) {
      case 1:
        return !!(formData.businessCategory && formData.targetRevenue && formData.targetMarket);
      case 2:
        return !!(formData.constellationSize && formData.targetAltitude && formData.missionLifespan && 
                 formData.launchVehicleType && formData.selectedLaunchSite && formData.payloadMass && formData.leadTimeTolerance);
      case 3:
        return !!(formData.deorbitMethod && formData.ssaStrategy && formData.dataLicensing);
      default:
        return false;
    }
  };

  const allPhasesComplete = isPhaseComplete(1) && isPhaseComplete(2) && isPhaseComplete(3);

  return (
    <div className="w-full bg-black text-white rounded-lg shadow-xl overflow-hidden">
      {/* Header with Stepper */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-2xl font-bold">🚀 Mission Planning Wizard</h2>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              {[1,2,3].map((step) => (
                <div key={step} className={`flex items-center px-3 py-1 rounded-full text-sm border ${
                  currentStep === step ? 'bg-white text-black border-white' : isPhaseComplete(step as 1|2|3) ? 'bg-green-700/20 text-green-300 border-green-700' : 'bg-gray-800 text-gray-300 border-gray-700'
                }`}>
                  <span className="font-semibold mr-1">{step}</span>
                  <span>{step === 1 ? 'Business' : step === 2 ? 'Technical' : 'Safety'}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setShowTooltips(!showTooltips); }}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md text-sm border border-gray-700"
              aria-label="Toggle tips"
            >
              {showTooltips ? '🔍 Hide Tips' : '💡 Show Tips'}
            </button>
          </div>
        </div>
      </div>

      {/* Content - One Section per Screen */}
      <div className="max-w-7xl mx-auto px-6 py-8 min-h-[calc(100vh-220px)] flex flex-col">
        {currentStep === 1 && (
          <div className="flex-1 max-w-4xl mx-auto">
            {/* Phase 1: Business Opportunity */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="mb-8">
                <div className="text-5xl mb-3">💼</div>
                <h3 className="text-2xl font-bold">Business Opportunity</h3>
                <p className="text-gray-400 text-base mt-2">Define your concept and market goals - this shapes your entire mission architecture</p>
              </div>

              <div className="space-y-8">
              {/* Business Category */}
              <div>
                <label className="text-base font-semibold text-white mb-4 block">
                  Business Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(businessCategories).slice(0, 3).map(([key, category]) => (
                    <label
                      key={key}
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                        formData.businessCategory === key
                          ? 'border-blue-400 bg-blue-900/20 text-white'
                          : 'border-gray-700 hover:border-gray-500 bg-gray-950 text-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="businessCategory"
                        value={key}
                        checked={formData.businessCategory === key}
                        onChange={updateRadioInput('businessCategory')}
                        className="sr-only"
                      />
                      <span className="mr-3 text-2xl">{category.icon}</span>
                      <div>
                        <div className="font-medium text-base">{category.name}</div>
                        <div className="text-sm opacity-75 mt-1">{category.description.slice(0, 60)}...</div>
                      </div>
                    </label>
                  ))}
                </div>
                {formData.businessCategory && (
                  <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <div className="text-sm text-blue-200">
                      <strong>💡 Business Impact:</strong> {formData.businessCategory === 'earthObservation' ? 'Earth observation generates revenue through data sales, analytics, and monitoring services. Consider high-resolution cameras and frequent revisit times.' : formData.businessCategory === 'communication' ? 'Communication satellites require global coverage, high uptime, and robust ground infrastructure. Focus on constellation size and redundancy.' : 'IoT/M2M satellites need low power consumption, simple protocols, and cost-effective ground terminals for device connectivity.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Target Revenue */}
              <div>
                <label className="text-base font-semibold text-white mb-4 block">
                  Annual Revenue Target <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.targetRevenue}
                  onChange={updateDropdown('targetRevenue')}
                  className="w-full p-4 bg-gray-950 border border-gray-700 rounded-xl text-white text-base focus:border-blue-400"
                >
                  <option value={0}>Select revenue target</option>
                  <option value={1000000}>$1M - Pilot Project</option>
                  <option value={5000000}>$5M - Regional Market</option>
                  <option value={25000000}>$25M - National Scale</option>
                  <option value={100000000}>$100M - Global Operation</option>
                  <option value={500000000}>$500M+ - Industry Leader</option>
                </select>
                {formData.targetRevenue > 0 && (
                  <div className={`mt-3 p-3 rounded-lg border ${getRevenueContext(formData.targetRevenue).bg}`}>
                    <div className={`text-sm font-medium ${getRevenueContext(formData.targetRevenue).color}`}>
                      {getRevenueContext(formData.targetRevenue).text}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      💰 This revenue target suggests a {formData.targetRevenue <= 5000000 ? '1-10 satellite constellation with focus on cost efficiency' : formData.targetRevenue <= 100000000 ? '10-50 satellite constellation with regional to global coverage' : '50+ satellite mega-constellation with global infrastructure'}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Value Density */}
              <div>
                <label className="text-base font-semibold text-white mb-4 block">
                  Value Density: ${formData.productValueDensity.toLocaleString()}/kg
                </label>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={100}
                  value={formData.productValueDensity}
                  onChange={updateSlider('productValueDensity')}
                  className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(formData.productValueDensity / 50000) * 100}%, #374151 ${(formData.productValueDensity / 50000) * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>$0/kg</span>
                  <span>$50k/kg</span>
                </div>
                {formData.productValueDensity > 0 && (
                  <div className={`mt-3 p-3 rounded-lg border ${getValueDensityContext(formData.productValueDensity).bg}`}>
                    <div className={`text-sm font-medium ${getValueDensityContext(formData.productValueDensity).color}`}>
                      {getValueDensityContext(formData.productValueDensity).text}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      📊 {formData.productValueDensity <= 1000 ? 'Focus on volume and cost efficiency. Consider ISRO for lowest launch costs.' : formData.productValueDensity <= 10000 ? 'Balanced value proposition. All vendors competitive.' : 'Premium product justifies higher costs. NASA partnerships may add credibility.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Target Market */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Primary Customers <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'Government', label: 'Government', icon: '🏛️' },
                    { value: 'Enterprise', label: 'Enterprise', icon: '🏢' },
                    { value: 'Consumer', label: 'Consumer', icon: '👥' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all text-sm ${
                        formData.targetMarket === option.value
                          ? 'border-blue-400 bg-blue-900/20 text-white'
                          : 'border-gray-700 hover:border-gray-500 bg-gray-950 text-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="targetMarket"
                        value={option.value}
                        checked={formData.targetMarket === option.value}
                        onChange={updateRadioInput('targetMarket')}
                        className="sr-only"
                      />
                      <span className="mr-2 text-xl">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex-1 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Phase 2: Technical Setup */}
              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-8">
                <div className="mb-8">
                  <div className="text-5xl mb-3">🛰️</div>
                  <h3 className="text-2xl font-bold">Technical Configuration</h3>
                  <p className="text-gray-400 text-base mt-2">Configure your constellation parameters - these drive cost and performance</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Constellation Size */}
                <div>
                  <label className="text-base font-semibold text-white mb-4 block">
                    Satellites: {formData.constellationSize} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    step={1}
                    value={formData.constellationSize}
                    onChange={updateSlider('constellationSize')}
                    className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(formData.constellationSize / 200) * 100}%, #374151 ${(formData.constellationSize / 200) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>1 sat</span>
                    <span>200 sats</span>
                  </div>
                  {formData.constellationSize > 0 && (
                    <div className={`mt-3 p-3 rounded-lg border ${getConstellationContext(formData.constellationSize).bg}`}>
                      <div className={`text-sm font-medium ${getConstellationContext(formData.constellationSize).color}`}>
                        {getConstellationContext(formData.constellationSize).text}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        🛰️ {formData.constellationSize <= 6 ? 'Small constellation - ideal for demos and specialized coverage. Single launch possible.' : formData.constellationSize <= 24 ? 'Regional constellation - multiple launches needed. Consider phased deployment.' : formData.constellationSize <= 100 ? 'Global constellation - requires significant launch cadence and ground infrastructure.' : 'Mega constellation - extremely complex deployment and management. Study SpaceX Starlink approach.'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Altitude */}
                <div>
                  <label className="text-base font-semibold text-white mb-4 block">
                    Altitude: {formData.targetAltitude}km <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="range"
                    min={200}
                    max={2000}
                    step={10}
                    value={formData.targetAltitude}
                    onChange={updateSlider('targetAltitude')}
                    className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((formData.targetAltitude - 200) / 1800) * 100}%, #374151 ${((formData.targetAltitude - 200) / 1800) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>200km (LEO)</span>
                    <span>2000km (MEO)</span>
                  </div>
                  {formData.targetAltitude > 0 && (
                    <div className={`mt-3 p-3 rounded-lg border ${getAltitudeContext(formData.targetAltitude).bg}`}>
                      <div className={`text-sm font-medium ${getAltitudeContext(formData.targetAltitude).color}`}>
                        {getAltitudeContext(formData.targetAltitude).text}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        🌍 {formData.targetAltitude <= 500 ? 'Low Earth Orbit - high drag, frequent passes, 2-5 year lifespan typical.' : formData.targetAltitude <= 800 ? 'Optimal LEO - balance of coverage and lifespan. Most commercial sats here.' : formData.targetAltitude <= 1200 ? 'High LEO - longer lifespan but less coverage. Good for some applications.' : 'Approaching MEO - radiation concerns, longer orbital periods, expensive to reach.'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payload Mass */}
                <div>
                  <label className="text-base font-semibold text-white mb-4 block">
                    Payload Mass: {formData.payloadMass}kg <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={5000}
                    step={50}
                    value={formData.payloadMass}
                    onChange={updateSlider('payloadMass')}
                    className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((formData.payloadMass - 50) / 4950) * 100}%, #374151 ${((formData.payloadMass - 50) / 4950) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>50kg (CubeSat)</span>
                    <span>5000kg (Large)</span>
                  </div>
                  {formData.payloadMass > 0 && (
                    <div className={`mt-3 p-3 rounded-lg border ${getPayloadMassContext(formData.payloadMass).bg}`}>
                      <div className={`text-sm font-medium ${getPayloadMassContext(formData.payloadMass).color}`}>
                        {getPayloadMassContext(formData.payloadMass).text}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        ⚖️ {formData.payloadMass <= 200 ? 'SmallSat class - RocketLab Electron perfect. Can rideshare on larger vehicles.' : formData.payloadMass <= 1000 ? 'Medium satellite - SpaceX Falcon 9 rideshare or dedicated small launcher.' : formData.payloadMass <= 3000 ? 'Large satellite - requires dedicated medium/heavy launcher. ULA Atlas V suitable.' : 'Very heavy payload - SpaceX Falcon Heavy, ULA Delta IV Heavy, or multiple launches needed.'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mission Lifespan */}
                <div>
                  <label className="text-base font-semibold text-white mb-4 block">
                    Mission Lifespan <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.missionLifespan}
                    onChange={updateDropdown('missionLifespan')}
                    className="w-full p-4 bg-gray-950 border border-gray-700 rounded-xl text-white text-base focus:border-blue-400"
                  >
                    <option value={0}>Select lifespan</option>
                    <option value={1}>1 year - Technology Demo</option>
                    <option value={3}>3 years - Standard Commercial</option>
                    <option value={5}>5 years - Extended Operation</option>
                    <option value={7}>7 years - Long-term Infrastructure</option>
                    <option value={10}>10+ years - Strategic Asset</option>
                  </select>
                  {formData.missionLifespan > 0 && (
                    <div className={`mt-3 p-3 rounded-lg border ${getMissionLifespanContext(formData.missionLifespan).bg}`}>
                      <div className={`text-sm font-medium ${getMissionLifespanContext(formData.missionLifespan).color}`}>
                        {getMissionLifespanContext(formData.missionLifespan).text}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        {getMissionLifespanContext(formData.missionLifespan).tip}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lead Time */}
                <div>
                  <label className="text-base font-semibold text-white mb-4 block">
                    Lead Time: {formData.leadTimeTolerance} months <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="range"
                    min={6}
                    max={36}
                    step={3}
                    value={formData.leadTimeTolerance}
                    onChange={updateSlider('leadTimeTolerance')}
                    className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((formData.leadTimeTolerance - 6) / 30) * 100}%, #374151 ${((formData.leadTimeTolerance - 6) / 30) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>6mo (Rush)</span>
                    <span>36mo (Flexible)</span>
                  </div>
                  {formData.leadTimeTolerance > 0 && (
                    <div className={`mt-3 p-3 rounded-lg border ${getLeadTimeContext(formData.leadTimeTolerance).bg}`}>
                      <div className={`text-sm font-medium ${getLeadTimeContext(formData.leadTimeTolerance).color}`}>
                        {getLeadTimeContext(formData.leadTimeTolerance).text}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        {getLeadTimeContext(formData.leadTimeTolerance).tip}
                      </div>
                    </div>
                  )}
                </div>

                {/* Launch Vehicle */}
                <div>
                  <label className="text-base font-semibold text-white mb-4 block">
                    Launch Vehicle <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.launchVehicleType}
                    onChange={updateDropdown('launchVehicleType')}
                    className="w-full p-4 bg-gray-950 border border-gray-700 rounded-xl text-white text-base focus:border-blue-400"
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Small">Small Launcher (≤500kg)</option>
                    <option value="Medium">Medium Launcher (500kg-10t)</option>
                    <option value="Heavy">Heavy Launcher (10t+)</option>
                    <option value="Rideshare">Rideshare Opportunity</option>
                  </select>
                  {formData.launchVehicleType && (
                    <div className={`mt-3 p-3 rounded-lg border ${getLaunchVehicleContext(formData.launchVehicleType).bg}`}>
                      <div className={`text-sm font-medium ${getLaunchVehicleContext(formData.launchVehicleType).color}`}>
                        {getLaunchVehicleContext(formData.launchVehicleType).text}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        {getLaunchVehicleContext(formData.launchVehicleType).tip}
                      </div>
                    </div>
                  )}
                </div>

              {/* Propulsion */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">In-Space Propulsion</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`flex items-center justify-center p-2 border rounded cursor-pointer transition-all text-sm ${
                    formData.inSpacePropulsion === true ? 'border-blue-400 bg-blue-900/20 text-white' : 'border-gray-700 bg-gray-900 text-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="inSpacePropulsion"
                      checked={formData.inSpacePropulsion === true}
                      onChange={updateRadio('inSpacePropulsion', true)}
                      className="sr-only"
                    />
                    <span className="mr-1">🚀</span>
                    <span>Yes</span>
                  </label>
                  <label className={`flex items-center justify-center p-2 border rounded cursor-pointer transition-all text-sm ${
                    formData.inSpacePropulsion === false ? 'border-blue-400 bg-blue-900/20 text-white' : 'border-gray-700 bg-gray-900 text-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="inSpacePropulsion"
                      checked={formData.inSpacePropulsion === false}
                      onChange={updateRadio('inSpacePropulsion', false)}
                      className="sr-only"
                    />
                    <span className="mr-1">🛰️</span>
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Launch Site */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Launch Site <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.selectedLaunchSite}
                  onChange={updateDropdown('selectedLaunchSite')}
                  className="w-full p-3 bg-gray-950 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-400"
                >
                  <option value="">Select launch site</option>
                  {launchSites.slice(0, 5).map(site => (
                    <option key={site.name} value={site.name}>
                      {site.name} - {site.country}
                    </option>
                  ))}
                </select>
              </div>
                </div>
              </div>

              {/* Vendor Capabilities Analysis - Right Column */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  🏆 Vendor Capabilities Matrix
                </h4>
                <div className="space-y-4">
                  {/* SpaceX */}
                  <div className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-white">🚀 SpaceX</h5>
                      <div className="text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded">Best Overall</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-green-400">✓ Lowest cost/kg</div>
                      <div className="text-green-400">✓ High reliability</div>
                      <div className="text-green-400">✓ Rapid cadence</div>
                      <div className="text-yellow-400">∼ Limited to Falcon 9/Heavy</div>
                    </div>
                  </div>

                  {/* NASA */}
                  <div className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-white">🌌 NASA</h5>
                      <div className="text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded">Technology Leader</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-green-400">✓ Cutting-edge tech</div>
                      <div className="text-green-400">✓ Mission assurance</div>
                      <div className="text-green-400">✓ Scientific payloads</div>
                      <div className="text-red-400">✗ Highest cost</div>
                    </div>
                  </div>

                  {/* ULA */}
                  <div className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-white">🏢 ULA</h5>
                      <div className="text-xs bg-purple-900/20 text-purple-400 px-2 py-1 rounded">Most Reliable</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-green-400">✓ 100% success rate</div>
                      <div className="text-green-400">✓ Critical missions</div>
                      <div className="text-green-400">✓ Government trusted</div>
                      <div className="text-yellow-400">∼ Premium pricing</div>
                    </div>
                  </div>

                  {/* RocketLab */}
                  <div className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-white">🎆 RocketLab</h5>
                      <div className="text-xs bg-cyan-900/20 text-cyan-400 px-2 py-1 rounded">SmallSat Specialist</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-green-400">✓ Dedicated small launches</div>
                      <div className="text-green-400">✓ Flexible scheduling</div>
                      <div className="text-green-400">✓ Rapid deployment</div>
                      <div className="text-red-400">✗ Limited to &lt;500kg</div>
                    </div>
                  </div>

                  {/* ISRO */}
                  <div className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-white">🇮🇳 ISRO</h5>
                      <div className="text-xs bg-orange-900/20 text-orange-400 px-2 py-1 rounded">Most Affordable</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-green-400">✓ Lowest absolute cost</div>
                      <div className="text-green-400">✓ High payload efficiency</div>
                      <div className="text-green-400">✓ Proven technology</div>
                      <div className="text-yellow-400">∼ Limited availability</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex-1 max-w-4xl mx-auto">
            {/* Phase 3: Safety & Compliance */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="mb-8">
                <div className="text-5xl mb-3">🛡️</div>
                <h3 className="text-2xl font-bold">Safety & Compliance</h3>
                <p className="text-gray-400 text-base mt-2">Plan for responsible space operations and regulatory compliance</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="text-base font-semibold text-white mb-4 block">
                  De-orbit Method <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.deorbitMethod}
                  onChange={updateDropdown('deorbitMethod')}
                  className="w-full p-4 bg-gray-950 border border-gray-700 rounded-xl text-white text-base focus:border-blue-400"
                >
                  <option value="">Select method</option>
                  <option value="Atmospheric Drag">Atmospheric Drag</option>
                  <option value="Propulsive">Propulsive De-orbit</option>
                  <option value="Tether">Electrodynamic Tether</option>
                  <option value="Solar Sail">Solar Sail</option>
                </select>
                {formData.deorbitMethod && (
                  <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <div className="text-sm text-blue-200">
                      💡 <strong>{formData.deorbitMethod === 'Atmospheric Drag' ? 'Natural decay' : formData.deorbitMethod === 'Propulsive' ? 'Active control' : formData.deorbitMethod === 'Tether' ? 'Innovative tech' : 'Passive method'}:</strong> 
                      {formData.deorbitMethod === 'Atmospheric Drag' ? 'Cheapest option, but uncontrolled timing. Works best below 600km.' : 
                       formData.deorbitMethod === 'Propulsive' ? 'Most reliable and controllable. Requires fuel reserves and thruster systems.' :
                       formData.deorbitMethod === 'Tether' ? 'Emerging technology using electromagnetic forces. Good for large constellations.' :
                       'Uses radiation pressure for gentle deorbit. Very long timeline but zero fuel needed.'}
                    </div>
                  </div>
                )}
              </div>

              {/* SSA Strategy */}
              <div>
                <label className="text-base font-semibold text-white mb-4 block">
                  Space Awareness Strategy <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.ssaStrategy}
                  onChange={updateDropdown('ssaStrategy')}
                  className="w-full p-4 bg-gray-950 border border-gray-700 rounded-xl text-white text-base focus:border-blue-400"
                >
                  <option value="">Select strategy</option>
                  <option value="Ground-based">Ground-based Tracking</option>
                  <option value="Commercial Service">Commercial SSA Service</option>
                  <option value="Onboard Sensors">Onboard Sensors</option>
                  <option value="Hybrid">Hybrid Approach</option>
                </select>
                {formData.ssaStrategy && (
                  <div className="mt-3 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="text-sm text-green-200">
                      🛰️ <strong>{formData.ssaStrategy === 'Ground-based' ? 'Traditional' : formData.ssaStrategy === 'Commercial Service' ? 'Outsourced' : formData.ssaStrategy === 'Onboard Sensors' ? 'Self-reliant' : 'Best of all'}:</strong> 
                      {formData.ssaStrategy === 'Ground-based' ? 'Uses radar and optical telescopes. Reliable but limited to tracked objects >10cm.' : 
                       formData.ssaStrategy === 'Commercial Service' ? 'LeoLabs, ExoAnalytic provide space traffic data. Cost-effective for small operators.' :
                       formData.ssaStrategy === 'Onboard Sensors' ? 'Satellites detect debris themselves. More expensive but autonomous.' :
                       'Combines multiple methods for comprehensive awareness. Recommended for large constellations.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Data Licensing */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Data Licensing Model <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.dataLicensing}
                  onChange={updateDropdown('dataLicensing')}
                  className="w-full p-3 bg-gray-950 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-400"
                >
                  <option value="">Select model</option>
                  <option value="Proprietary">Proprietary</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Government">Government</option>
                </select>
              </div>

              {/* Phase Completion Status */}
              <div className="mt-6 space-y-2">
                {[
                  { phase: 1, name: 'Business', icon: '💼' },
                  { phase: 2, name: 'Technical', icon: '🛰️' },
                  { phase: 3, name: 'Safety', icon: '🛡️' }
                ].map(({ phase, name, icon }) => (
                  <div
                    key={phase}
                    className={`flex items-center justify-between p-2 rounded text-sm ${
                      isPhaseComplete(phase)
                        ? 'bg-green-900/20 text-green-400'
                        : 'bg-gray-900/50 text-gray-400'
                    }`}
                  >
                    <span>{icon} {name}</span>
                    <span>{isPhaseComplete(phase) ? '✓ Complete' : '○ Pending'}</span>
                  </div>
                ))}
              </div>

              {/* Generate Analysis Button */}
            </div>
            </div>
            <div className="hidden lg:block bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Compliance Tips</h4>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                <li>Always include an end-of-life plan to reduce debris.</li>
                <li>Hybrid SSA strategies improve situational awareness.</li>
                <li>Licensing affects data sharing and revenue models.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation - fixed height area to avoid page scroll */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-400">Step {currentStep} of 3</div>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => (s === 3 ? 3 : ((s + 1) as 1 | 2 | 3)))}
                disabled={!isPhaseComplete(currentStep)}
                className={`px-6 py-3 rounded-lg font-semibold transition-transform ${
                  isPhaseComplete(currentStep) ? 'bg-white text-black hover:scale-105' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={!allPhasesComplete}
                className={`px-8 py-3 rounded-lg font-bold transition-transform ${
                  allPhasesComplete ? 'bg-green-600 text-white hover:bg-green-500 hover:scale-105' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                🚀 Generate Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginnerFriendlyForm;