import { FormData } from '../components/BeginnerFriendlyForm';
import { businessCategories } from '../data/enhancedNasaData';

export interface Scores {
  overall: number;
  financial: number;
  debris: number;
  regulatory: number;
}

export const calculateScores = (formData: FormData): Scores => {
  // Financial Viability Score (0-100)
  const calculateFinancialScore = (): number => {
    let score = 50; // Base score
    
    // Revenue potential
    if (formData.targetRevenue >= 100000000) score += 25;
    else if (formData.targetRevenue >= 25000000) score += 20;
    else if (formData.targetRevenue >= 5000000) score += 15;
    else if (formData.targetRevenue >= 1000000) score += 10;
    
    // Value density
    if (formData.productValueDensity >= 10000) score += 15;
    else if (formData.productValueDensity >= 1000) score += 10;
    else if (formData.productValueDensity >= 100) score += 5;
    
    // Market type
    if (formData.targetMarket === 'Government') score += 15;
    else if (formData.targetMarket === 'Enterprise') score += 10;
    else if (formData.targetMarket === 'Consumer') score += 5;
    
    // Business category viability
    const category = businessCategories[formData.businessCategory as keyof typeof businessCategories];
    if (category) {
      if (category.marketSize > 50000000000) score += 10;
      else if (category.marketSize > 10000000000) score += 5;
    }
    
    return Math.min(100, Math.max(0, score));
  };

  // Debris Risk Score (0-100, higher means more risk)
  const calculateDebrisScore = (): number => {
    let riskScore = 20; // Base low risk
    
    // Altitude risk
    if (formData.targetAltitude > 800) riskScore += 40;
    else if (formData.targetAltitude > 600) riskScore += 30;
    else if (formData.targetAltitude > 400) riskScore += 20;
    else riskScore += 10;
    
    // Constellation size risk
    if (formData.constellationSize > 50) riskScore += 25;
    else if (formData.constellationSize > 20) riskScore += 15;
    else if (formData.constellationSize > 10) riskScore += 10;
    else riskScore += 5;
    
    // Mission lifespan risk
    if (formData.missionLifespan > 10) riskScore += 15;
    else if (formData.missionLifespan > 7) riskScore += 10;
    else if (formData.missionLifespan > 5) riskScore += 5;
    
    // Propulsion reduces risk
    if (formData.inSpacePropulsion) riskScore -= 15;
    
    // Deorbit method
    if (formData.deorbitMethod === 'Active Propulsion') riskScore -= 10;
    else if (formData.deorbitMethod === 'Drag Enhancement') riskScore -= 5;
    
    return Math.min(100, Math.max(0, riskScore));
  };

  // Regulatory Compliance Score (0-100)
  const calculateRegulatoryScore = (): number => {
    let score = 40; // Base score
    
    // Target market compliance
    if (formData.targetMarket === 'Government') score += 20;
    else if (formData.targetMarket === 'Enterprise') score += 15;
    else score += 10;
    
    // SSA strategy
    if (formData.ssaStrategy === 'Commercial') score += 20;
    else if (formData.ssaStrategy === 'In-house') score += 15;
    else score += 10;
    
    // Data licensing compliance
    if (formData.dataLicensing === 'Open') score += 15;
    else if (formData.dataLicensing === 'Restricted') score += 10;
    else score += 5;
    
    // Deorbit compliance
    if (formData.deorbitMethod === 'Active Propulsion') score += 15;
    else if (formData.deorbitMethod === 'Drag Enhancement') score += 10;
    else score += 5;
    
    // Mission lifespan compliance
    if (formData.missionLifespan <= 7) score += 10;
    else if (formData.missionLifespan <= 10) score += 5;
    
    return Math.min(100, Math.max(0, score));
  };

  const financialScore = calculateFinancialScore();
  const debrisScore = calculateDebrisScore();
  const regulatoryScore = calculateRegulatoryScore();

  // Overall score is weighted average
  const overallScore = Math.round(
    (financialScore * 0.35 + 
     (100 - debrisScore) * 0.25 + // Convert debris risk to safety score
     regulatoryScore * 0.25 +
     (formData.inSpacePropulsion ? 80 : 60) * 0.15) // Technical capability
  );

  return {
    overall: overallScore,
    financial: financialScore,
    debris: debrisScore,
    regulatory: regulatoryScore
  };
};