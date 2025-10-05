import React, { useState, useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';
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
    if (val === 0) return { text: "Set lead time flexibility", color: "text-gray-400", bg: "bg-gray-800" };
    if (val <= 12) return { text: "Rush launch, premium pricing", color: "text-red-400", bg: "bg-red-900/20" };
    if (val <= 24) return { text: "Standard timeline, competitive rates", color: "text-blue-400", bg: "bg-blue-900/20" };
    if (val <= 30) return { text: "Flexible timing, cost savings", color: "text-green-400", bg: "bg-green-900/20" };
    return { text: "Very flexible, maximum cost efficiency", color: "text-purple-400", bg: "bg-purple-900/20" };
  };

  const nextPhase = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (currentPhase < 3) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const prevPhase = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const phases = [
    {
      id: 1,
      title: "Business Opportunity",
      description: "Define your space business concept and market goals",
      icon: "💼"
    },
    {
      id: 2,
      title: "Technical Setup",
      description: "Configure your satellites and mission parameters", 
      icon: "🛰️"
    },
    {
      id: 3,
      title: "Safety & Compliance",
      description: "Plan for responsible space operations",
      icon: "🛡️"
    }
  ];

  const FieldWrapper = ({ label, tooltip, children, required = false }: {
    label: string;
    tooltip: string;
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-semibold text-white flex items-center space-x-1">
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </label>
        {showTooltips && (
          <Tooltip content={tooltip}>
            <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-white cursor-help transition-colors duration-200" />
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );

  const SliderField = ({ 
    label, 
    tooltip, 
    value, 
    min, 
    max, 
    step = 1, 
    onChange, 
    contextFn, 
    required = false,
    unit = ""
  }: {
    label: string;
    tooltip: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    contextFn: (value: number) => { text: string; color: string; bg: string };
    required?: boolean;
    unit?: string;
  }) => {
    const context = contextFn(value);
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
      <FieldWrapper label={label} tooltip={tooltip} required={required}>
        <div className="space-y-3">
          <div className="relative">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={onChange}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #4b5563 ${percentage}%, #4b5563 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{min}{unit}</span>
              <span className="font-semibold text-white">{value}{unit}</span>
              <span>{max}{unit}</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg border border-gray-600 ${context.bg}`}>
            <div className={`text-sm font-medium ${context.color} flex items-center space-x-2`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>{context.text}</span>
            </div>
          </div>
        </div>
      </FieldWrapper>
    );
  };

  const DropdownField = ({ 
    label, 
    tooltip, 
    value, 
    options, 
    onChange, 
    contextFn, 
    required = false,
    placeholder = "Select option..."
  }: {
    label: string;
    tooltip: string;
    value: string | number;
    options: Array<{ value: string | number; label: string; context?: string }>;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    contextFn?: (value: string | number) => { text: string; color: string; bg: string };
    required?: boolean;
    placeholder?: string;
  }) => {
    const selectedOption = options.find(opt => opt.value === value);
    const context = contextFn ? contextFn(value) : null;
    
    return (
      <FieldWrapper label={label} tooltip={tooltip} required={required}>
        <div className="space-y-3">
          <select
            value={value}
            onChange={onChange}
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors duration-300 focus:outline-none"
          >
            <option value="" className="bg-gray-900 text-gray-400">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
          {(selectedOption?.context || context) && (
            <div className={`px-4 py-2 rounded-lg border border-gray-600 ${context?.bg || 'bg-blue-900/20'}`}>
              <div className={`text-sm font-medium ${context?.color || 'text-blue-400'} flex items-center space-x-2`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>{selectedOption?.context || context?.text}</span>
              </div>
            </div>
          )}
        </div>
      </FieldWrapper>
    );
  };

  const renderPhase1 = () => (
    <motion.div
      key="phase1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">💼</div>
        <h3 className="text-2xl font-bold text-white mb-2">Business Opportunity</h3>
        <p className="text-gray-300 text-lg">Tell us about your space business idea</p>
      </div>

      <FieldWrapper
        label="What type of space business are you planning?"
        tooltip="Different space businesses have different requirements, costs, and regulatory needs. Choose the category that best matches your planned service."
        required
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(businessCategories).map(([key, category]) => (
            <label
              key={key}
              className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                formData.businessCategory === key
                  ? 'border-blue-400 bg-blue-900/20'
                  : 'border-gray-700 hover:border-gray-500 bg-gray-900'
              }`}
            >
              <input
                type="radio"
                name="businessCategory"
                id={`businessCategory-${key}`}
                value={key}
                checked={formData.businessCategory === key}
                onChange={updateRadioInput('businessCategory')}
                className="sr-only"
              />
              <div className="flex items-center space-x-4 w-full">
                <span className="text-3xl">{category.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white text-lg">{category.name}</div>
                  <div className="text-sm text-gray-300 leading-relaxed">{category.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </FieldWrapper>

      <DropdownField
        label="How much revenue do you want to generate annually?"
        tooltip="Your target annual revenue helps us understand the scale of your business and recommend appropriate satellite constellation sizes and operational strategies."
        value={formData.targetRevenue}
        onChange={updateDropdown('targetRevenue')}
        contextFn={getRevenueContext}
        required
        options={[
          { value: 1000000, label: "$1M - Small pilot project", context: "Low risk, proven technology focus" },
          { value: 5000000, label: "$5M - Regional service", context: "Moderate scale, established market" },
          { value: 25000000, label: "$25M - National coverage", context: "Significant investment, proven demand" },
          { value: 100000000, label: "$100M - Global operation", context: "Major infrastructure, high competition" },
          { value: 500000000, label: "$500M+ - Industry leader", context: "Massive scale, extreme complexity" }
        ]}
      />

      <SliderField
        label="Product value per kilogram"
        tooltip="This helps us understand how valuable your space-based product or service is. Higher value products can justify more expensive satellite operations."
        value={formData.productValueDensity}
        min={0}
        max={50000}
        step={100}
        onChange={updateSlider('productValueDensity')}
        contextFn={getValueDensityContext}
        unit="$/kg"
      />

      <FieldWrapper
        label="Who are your primary customers?"
        tooltip="Different customer types have different requirements for service quality, security, and pricing. This affects your satellite design and operational approach."
        required
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[ 
            { value: 'Government', label: 'Government', desc: 'Military, NASA, agencies', icon: '🏛️', context: 'High security, long procurement cycles' },
            { value: 'Enterprise', label: 'Enterprise/B2B', desc: 'Companies, industries', icon: '🏢', context: 'Proven ROI, reliability critical' },
            { value: 'Consumer', label: 'Direct-to-Consumer', desc: 'Individual customers', icon: '👥', context: 'Price sensitive, mass market' }
          ].map((option) => (
            <label
              key={option.value}
              className={`flex flex-col items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                formData.targetMarket === option.value
                  ? 'border-blue-400 bg-blue-900/20'
                  : 'border-gray-700 hover:border-gray-500 bg-gray-900'
              }`}
            >
              <input
                type="radio"
                name="targetMarket"
                id={`targetMarket-${option.value}`}
                value={option.value}
                checked={formData.targetMarket === option.value}
                onChange={updateRadioInput('targetMarket')}
                className="sr-only"
              />
              <span className="text-3xl mb-3">{option.icon}</span>
              <span className="font-semibold text-center text-white text-lg">{option.label}</span>
              <span className="text-sm text-gray-300 text-center leading-relaxed">{option.desc}</span>
              {formData.targetMarket === option.value && (
                <div className="mt-3 px-3 py-1 bg-blue-900/40 rounded-lg">
                  <span className="text-xs text-blue-300">{option.context}</span>
                </div>
              )}
            </label>
          ))}
        </div>
      </FieldWrapper>
    </motion.div>
  );

  const renderPhase2 = () => (
    <motion.div
      key="phase2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🛰️</div>
        <h3 className="text-2xl font-bold text-white mb-2">Technical Setup</h3>
        <p className="text-gray-300 text-lg">Configure your satellites and mission parameters</p>
      </div>

      <SliderField
        label="Number of satellites in your constellation"
        tooltip="Larger constellations provide better coverage but cost more to deploy and operate."
        value={formData.constellationSize}
        min={1}
        max={200}
        step={1}
        onChange={updateSlider('constellationSize')}
        contextFn={getConstellationContext}
        required
        unit=" sats"
      />

      <SliderField
        label="Target orbital altitude"
        tooltip="Lower orbits have shorter coverage but less debris. Higher orbits provide longer coverage but face more space junk."
        value={formData.targetAltitude}
        min={200}
        max={2000}
        step={10}
        onChange={updateSlider('targetAltitude')}
        contextFn={getAltitudeContext}
        required
        unit=" km"
      />

      <SliderField
        label="Total payload mass"
        tooltip="Total mass of all satellites affects launch vehicle selection and costs significantly."
        value={formData.payloadMass}
        min={50}
        max={5000}
        step={50}
        onChange={updateSlider('payloadMass')}
        contextFn={getPayloadMassContext}
        required
        unit=" kg"
      />

      <SliderField
        label="Lead time tolerance"
        tooltip="How flexible are you with launch timing? Shorter lead times cost more but get you to market faster."
        value={formData.leadTimeTolerance}
        min={6}
        max={36}
        step={3}
        onChange={updateSlider('leadTimeTolerance')}
        contextFn={getLeadTimeContext}
        required
        unit=" months"
      />

      <DropdownField
        label="Mission lifespan"
        tooltip="How long do you plan to operate your satellites before replacing them?"
        value={formData.missionLifespan}
        onChange={updateDropdown('missionLifespan')}
        required
        options={[
          { value: 1, label: "1 year - Technology demonstration", context: "Proof of concept, high risk tolerance" },
          { value: 3, label: "3 years - Short commercial mission", context: "Fast ROI, emerging market" },
          { value: 5, label: "5 years - Standard operation", context: "Balanced risk/reward, proven technology" },
          { value: 7, label: "7 years - Extended operation", context: "Mature technology, stable revenue" },
          { value: 10, label: "10+ years - Long-term infrastructure", context: "Critical infrastructure, maximum reliability" }
        ]}
      />

      <DropdownField
        label="Launch Vehicle Type"
        tooltip="Different launch vehicles have different costs, capabilities, and availability."
        value={formData.launchVehicleType}
        onChange={updateDropdown('launchVehicleType')}
        required
        options={[
          { value: "Small", label: "Small (Electron, LauncherOne) - Up to 500kg", context: "Lower cost, limited payload capacity" },
          { value: "Medium", label: "Medium (Falcon 9, Atlas V) - 500kg to 10t", context: "Versatile, proven reliability" },
          { value: "Heavy", label: "Heavy (Falcon Heavy, Delta IV Heavy) - 10t+", context: "Maximum capacity, highest cost" },
          { value: "Rideshare", label: "Rideshare - Cost-effective for small payloads", context: "Lowest cost, limited schedule control" }
        ]}
      />

      <FieldWrapper
        label="In-Space Propulsion Required?"
        tooltip="Propulsion allows satellites to change orbits, avoid debris, and deorbit safely."
      >
        <div className="grid grid-cols-2 gap-4">
          <label className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
            formData.inSpacePropulsion === true
              ? 'border-blue-400 bg-blue-900/20'
              : 'border-gray-700 hover:border-gray-500 bg-gray-900'
          }`}>
            <input
              type="radio"
              name="inSpacePropulsion"
              checked={formData.inSpacePropulsion === true}
              onChange={updateRadio('inSpacePropulsion', true)}
              className="sr-only"
            />
            <span className="text-2xl">🚀</span>
            <div>
              <div className="text-white font-semibold">Yes - Active maneuvering</div>
              <div className="text-sm text-gray-300">Higher cost, collision avoidance</div>
            </div>
          </label>
          <label className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
            formData.inSpacePropulsion === false
              ? 'border-blue-400 bg-blue-900/20'
              : 'border-gray-700 hover:border-gray-500 bg-gray-900'
          }`}>
            <input
              type="radio"
              name="inSpacePropulsion"
              checked={formData.inSpacePropulsion === false}
              onChange={updateRadio('inSpacePropulsion', false)}
              className="sr-only"
            />
            <span className="text-2xl">🛰️</span>
            <div>
              <div className="text-white font-semibold">No - Passive operation</div>
              <div className="text-sm text-gray-300">Lower cost, limited flexibility</div>
            </div>
          </label>
        </div>
      </FieldWrapper>

      <DropdownField
        label="Launch Site"
        tooltip="Launch site affects orbital inclination options and regulatory requirements."
        value={formData.selectedLaunchSite}
        onChange={updateDropdown('selectedLaunchSite')}
        required
        options={launchSites.map(site => ({
          value: site.name,
          label: `${site.name} - ${site.country}`,
          context: `${site.launchesPerYear} launches/year, supports ${site.supportedVehicles.join(', ')}`
        }))}
      />
    </motion.div>
  );

  const renderPhase3 = () => (
    <motion.div
      key="phase3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🛡️</div>
        <h3 className="text-2xl font-bold text-white mb-2">Safety & Compliance</h3>
        <p className="text-gray-300 text-lg">Plan for responsible space operations</p>
      </div>

      <DropdownField
        label="De-orbit Method"
        tooltip="How will you safely dispose of satellites at end-of-life to reduce space debris?"
        value={formData.deorbitMethod}
        onChange={updateDropdown('deorbitMethod')}
        required
        options={[
          { value: "Atmospheric Drag", label: "Atmospheric Drag - Natural decay", context: "Passive, altitude dependent, 25+ years at high altitudes" },
          { value: "Propulsive", label: "Propulsive - Controlled re-entry", context: "Active, expensive, precise control" },
          { value: "Tether", label: "Electrodynamic Tether - Electromagnetic braking", context: "Innovative, complex deployment, promising" },
          { value: "Solar Sail", label: "Solar Sail - Radiation pressure", context: "Passive, slow, requires deployment mechanism" }
        ]}
      />

      <DropdownField
        label="Space Situational Awareness Strategy"
        tooltip="How will you track and avoid space debris and other satellites?"
        value={formData.ssaStrategy}
        onChange={updateDropdown('ssaStrategy')}
        required
        options={[
          { value: "Ground-based", label: "Ground-based Tracking - Radar/optical", context: "Established, limited resolution, weather dependent" },
          { value: "Commercial Service", label: "Commercial SSA Service - Third-party", context: "Outsourced, ongoing cost, reliable" },
          { value: "Onboard Sensors", label: "Onboard Sensors - Autonomous detection", context: "Real-time, expensive, limited range" },
          { value: "Hybrid", label: "Hybrid Approach - Multiple methods", context: "Best coverage, highest cost, complex integration" }
        ]}
      />

      <DropdownField
        label="Data Licensing Model"
        tooltip="How will you license and distribute the data from your satellites?"
        value={formData.dataLicensing}
        onChange={updateDropdown('dataLicensing')}
        required
        options={[
          { value: "Proprietary", label: "Proprietary - Exclusive data rights", context: "Maximum control, limited reach, high margins" },
          { value: "Commercial", label: "Commercial - Subscription/pay-per-use", context: "Scalable revenue, competitive pricing" },
          { value: "Open Source", label: "Open Source - Freely available", context: "Maximum impact, requires alternative revenue" },
          { value: "Freemium", label: "Freemium - Basic free, premium paid", context: "Market penetration, conversion optimization" },
          { value: "Government", label: "Government - Public sector focus", context: "Stable contracts, long procurement cycles" }
        ]}
      />
    </motion.div>
  );

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
    <div className="w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">🚀 Mission Planning Wizard</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              Progress: {Object.values({ phase1: isPhaseComplete(1), phase2: isPhaseComplete(2), phase3: isPhaseComplete(3) }).filter(Boolean).length}/3
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowTooltips(!showTooltips);
              }}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm font-medium text-white transition-colors"
            >
              {showTooltips ? '🔍 Hide Tips' : '💡 Show Tips'}
            </button>
          </div>
        </div>
      </div>

      {/* Single-page three-column layout */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)] min-h-[600px]">
          
          {/* Phase 1: Business Opportunity */}
          <div className="bg-gray-800 rounded-lg p-4 overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">💼</div>
              <h3 className="text-lg font-bold text-white">Business Opportunity</h3>
              <div className={`w-3 h-3 rounded-full mx-auto mt-2 ${isPhaseComplete(1) ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            </div>

            <div className="space-y-4">
              {/* Business Category */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Business Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(businessCategories).slice(0, 3).map(([key, category]) => (
                    <label
                      key={key}
                      className={`flex items-center p-2 border rounded cursor-pointer transition-all text-sm ${
                        formData.businessCategory === key
                          ? 'border-blue-400 bg-blue-900/20 text-white'
                          : 'border-gray-700 hover:border-gray-500 bg-gray-900 text-gray-300'
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
                      <span className="mr-2">{category.icon}</span>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs opacity-75">{category.description.slice(0, 40)}...</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Revenue */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Annual Revenue Target <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.targetRevenue}
                  onChange={updateDropdown('targetRevenue')}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:border-blue-400"
                >
                  <option value={0}>Select revenue target</option>
                  <option value={1000000}>$1M - Pilot</option>
                  <option value={5000000}>$5M - Regional</option>
                  <option value={25000000}>$25M - National</option>
                  <option value={100000000}>$100M - Global</option>
                  <option value={500000000}>$500M+ - Industry Leader</option>
                </select>
                {formData.targetRevenue > 0 && (
                  <div className="mt-1 text-xs text-gray-400">
                    {getRevenueContext(formData.targetRevenue).text}
                  </div>
                )}
              </div>

              {/* Product Value Density */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Value Density ($/kg): {formData.productValueDensity}
                </label>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={100}
                  value={formData.productValueDensity}
                  onChange={updateSlider('productValueDensity')}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span>
                  <span>$50k</span>
                </div>
                {formData.productValueDensity > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {getValueDensityContext(formData.productValueDensity).text}
                  </div>
                )}
              </div>

              {/* Target Market */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Primary Customers <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { value: 'Government', label: 'Government', icon: '🏛️' },
                    { value: 'Enterprise', label: 'Enterprise', icon: '🏢' },
                    { value: 'Consumer', label: 'Consumer', icon: '👥' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-2 border rounded cursor-pointer transition-all text-sm ${
                        formData.targetMarket === option.value
                          ? 'border-blue-400 bg-blue-900/20 text-white'
                          : 'border-gray-700 hover:border-gray-500 bg-gray-900 text-gray-300'
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
                      <span className="mr-2">{option.icon}</span>
                      <span className="font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2: Technical Setup */}
          <div className="bg-gray-800 rounded-lg p-4 overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🛰️</div>
              <h3 className="text-lg font-bold text-white">Technical Setup</h3>
              <div className={`w-3 h-3 rounded-full mx-auto mt-2 ${isPhaseComplete(2) ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            </div>

            <div className="space-y-4">
              {/* Constellation Size */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Satellites: {formData.constellationSize} <span className="text-red-400">*</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={200}
                  step={1}
                  value={formData.constellationSize}
                  onChange={updateSlider('constellationSize')}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1</span>
                  <span>200</span>
                </div>
                {formData.constellationSize > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {getConstellationContext(formData.constellationSize).text}
                  </div>
                )}
              </div>

              {/* Target Altitude */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Altitude: {formData.targetAltitude}km <span className="text-red-400">*</span>
                </label>
                <input
                  type="range"
                  min={200}
                  max={2000}
                  step={10}
                  value={formData.targetAltitude}
                  onChange={updateSlider('targetAltitude')}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>200km</span>
                  <span>2000km</span>
                </div>
                {formData.targetAltitude > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {getAltitudeContext(formData.targetAltitude).text}
                  </div>
                )}
              </div>

              {/* Payload Mass */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Payload Mass: {formData.payloadMass}kg <span className="text-red-400">*</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={5000}
                  step={50}
                  value={formData.payloadMass}
                  onChange={updateSlider('payloadMass')}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>50kg</span>
                  <span>5000kg</span>
                </div>
                {formData.payloadMass > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {getPayloadMassContext(formData.payloadMass).text}
                  </div>
                )}
              </div>

              {/* Mission Lifespan */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Mission Lifespan <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.missionLifespan}
                  onChange={updateDropdown('missionLifespan')}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:border-blue-400"
                >
                  <option value={0}>Select lifespan</option>
                  <option value={1}>1 year - Demo</option>
                  <option value={3}>3 years - Commercial</option>
                  <option value={5}>5 years - Standard</option>
                  <option value={7}>7 years - Extended</option>
                  <option value={10}>10+ years - Infrastructure</option>
                </select>
              </div>

              {/* Lead Time */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Lead Time: {formData.leadTimeTolerance} months <span className="text-red-400">*</span>
                </label>
                <input
                  type="range"
                  min={6}
                  max={36}
                  step={3}
                  value={formData.leadTimeTolerance}
                  onChange={updateSlider('leadTimeTolerance')}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>6mo</span>
                  <span>36mo</span>
                </div>
                {formData.leadTimeTolerance > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {getLeadTimeContext(formData.leadTimeTolerance).text}
                  </div>
                )}
              </div>

              {/* Launch Vehicle */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Launch Vehicle <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.launchVehicleType}
                  onChange={updateDropdown('launchVehicleType')}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:border-blue-400"
                >
                  <option value="">Select vehicle type</option>
                  <option value="Small">Small (≤500kg)</option>
                  <option value="Medium">Medium (500kg-10t)</option>
                  <option value="Heavy">Heavy (10t+)</option>
                  <option value="Rideshare">Rideshare</option>
                </select>
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
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:border-blue-400"
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

          {/* Phase 3: Safety & Compliance */}
          <div className="bg-gray-800 rounded-lg p-4 overflow-y-auto">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="text-lg font-bold text-white">Safety & Compliance</h3>
              <div className={`w-3 h-3 rounded-full mx-auto mt-2 ${isPhaseComplete(3) ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            </div>

            <div className="space-y-4">
              {/* De-orbit Method */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  De-orbit Method <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.deorbitMethod}
                  onChange={updateDropdown('deorbitMethod')}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:border-blue-400"
                >
                  <option value="">Select method</option>
                  <option value="Atmospheric Drag">Atmospheric Drag</option>
                  <option value="Propulsive">Propulsive</option>
                  <option value="Tether">Electrodynamic Tether</option>
                  <option value="Solar Sail">Solar Sail</option>
                </select>
              </div>

              {/* SSA Strategy */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Space Awareness Strategy <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.ssaStrategy}
                  onChange={updateDropdown('ssaStrategy')}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:border-blue-400"
                >
                  <option value="">Select strategy</option>
                  <option value="Ground-based">Ground-based Tracking</option>
                  <option value="Commercial Service">Commercial SSA Service</option>
                  <option value="Onboard Sensors">Onboard Sensors</option>
                  <option value="Hybrid">Hybrid Approach</option>
                </select>
              </div>

              {/* Data Licensing */}
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">
                  Data Licensing Model <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.dataLicensing}
                  onChange={updateDropdown('dataLicensing')}
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:border-blue-400"
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
                <div className="text-sm font-medium text-gray-300 mb-3">Completion Status:</div>
                {[
                  { phase: 1, name: "Business", icon: "💼" },
                  { phase: 2, name: "Technical", icon: "🛰️" },
                  { phase: 3, name: "Safety", icon: "🛡️" }
                ].map(({ phase, name, icon }) => (
                  <div key={phase} className={`flex items-center justify-between p-2 rounded text-sm ${
                    isPhaseComplete(phase) ? 'bg-green-900/20 text-green-400' : 'bg-gray-900/50 text-gray-400'
                  }`}>
                    <span>{icon} {name}</span>
                    <span>{isPhaseComplete(phase) ? '✓ Complete' : '○ Pending'}</span>
                  </div>
                ))}
              </div>

              {/* Generate Analysis Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!allPhasesComplete}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all text-sm ${
                    allPhasesComplete
                      ? 'bg-green-600 text-white hover:bg-green-500 hover:scale-105'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {allPhasesComplete ? '🚀 Generate Analysis' : '⏳ Complete All Phases'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginnerFriendlyForm;