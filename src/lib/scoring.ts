import nasaData from '@/data/nasa-mock-data.json';

export interface FormData {
  // Phase 1: Opportunity Definition
  businessCategory: string;
  targetAnnualRevenue: number;
  productValueDensity: number;
  targetMarket: string;
  
  // Phase 2: Operational & Technical Parameters
  constellationSize: number;
  targetOrbitalAltitude: number;
  requiredMissionLifespan: number;
  launchVehicleType: string;
  inSpacePropulsion: boolean;
  
  // Phase 3: Risk & Sustainability Commitments
  deorbitMethod: string;
  ssaStrategy: string;
  dataLicensingModel: string;
}

export interface ScoreResult {
  overallScore: number;
  financialScore: number;
  debrisScore: number;
  regulatoryScore: number;
  technicalScore: number;
  recommendations: {
    mandatory: string[];
    recommended: string[];
    baseline: string[];
  };
}

export function calculateScores(formData: FormData): ScoreResult {
  const category = nasaData.businessCategories[formData.businessCategory as keyof typeof nasaData.businessCategories];
  const launchVehicle = nasaData.launchVehicles[formData.launchVehicleType as keyof typeof nasaData.launchVehicles];
  const deorbitMethod = nasaData.deorbitMethods[formData.deorbitMethod as keyof typeof nasaData.deorbitMethods];
  const ssaStrategy = nasaData.ssaStrategies[formData.ssaStrategy as keyof typeof nasaData.ssaStrategies];
  const targetMarket = nasaData.targetMarkets[formData.targetMarket as keyof typeof nasaData.targetMarkets];

  // Calculate Financial Score
  const revenueRatio = formData.targetAnnualRevenue / category.typicalRevenue.max;
  const costEfficiency = (formData.productValueDensity * category.averagePayloadMass) / 
                        (category.averageLaunchCost * launchVehicle.costMultiplier);
  const marketStability = targetMarket.contractStability * targetMarket.paymentReliability / 100;
  
  const financialScore = Math.min(100, 
    category.baseScoreBias.financial * 
    (0.4 * Math.min(1, revenueRatio * 2) + 
     0.4 * Math.min(1, costEfficiency * 0.1) + 
     0.2 * marketStability / 100) * 1.2
  );

  // Calculate Debris Risk Score (higher is better - less risk)
  const altitudeKey = getAltitudeKey(formData.targetOrbitalAltitude);
  const altitudeData = nasaData.orbitalAltitudes[altitudeKey as keyof typeof nasaData.orbitalAltitudes];
  
  const debrisRiskFactor = category.debrisRiskFactor * 
                          altitudeData.debrisRiskFactor * 
                          (1 + launchVehicle.debrisRiskModifier);
  
  const deorbitReliability = deorbitMethod.reliabilityScore / 100;
  const ssaAccuracy = ssaStrategy.accuracyScore / 100;
  const lifespanPenalty = Math.max(0, (formData.requiredMissionLifespan - 5) * 0.1);
  
  const debrisScore = Math.max(0, 
    (category.baseScoreBias.debris - (debrisRiskFactor * 20) + 
     (deorbitReliability * 20) + (ssaAccuracy * 15) - lifespanPenalty)
  );

  // Calculate Regulatory Compliance Score
  const regulatoryComplexity = targetMarket.regulatoryComplexity;
  const deorbitBonus = deorbitMethod.regulatoryBonus;
  const ssaBonus = ssaStrategy.regulatoryBonus;
  const dataLicensingPenalty = formData.dataLicensingModel === 'Private' ? -10 : 
                              formData.dataLicensingModel === 'Restricted' ? -5 : 0;
  
  const regulatoryScore = Math.min(100, 
    (category.baseScoreBias.regulatory / regulatoryComplexity) + 
    deorbitBonus + ssaBonus + dataLicensingPenalty
  );

  // Calculate Technical Score
  const constellationComplexity = Math.log10(formData.constellationSize + 1) * 10;
  const propulsionBonus = formData.inSpacePropulsion ? 15 : 0;
  const vehicleReliability = launchVehicle.reliabilityScore;
  const operationalComplexity = altitudeData.operationalComplexity;
  
  const technicalScore = Math.max(0, Math.min(100,
    (vehicleReliability - constellationComplexity + propulsionBonus) / operationalComplexity
  ));

  // Calculate Overall Score
  const weights = nasaData.scoringWeights;
  const overallScore = 
    financialScore * weights.financial +
    debrisScore * weights.debris +
    regulatoryScore * weights.regulatory +
    technicalScore * weights.technical;

  // Generate Recommendations
  const recommendations = generateRecommendations({
    financialScore,
    debrisScore,
    regulatoryScore,
    technicalScore,
    overallScore,
    formData
  });

  return {
    overallScore: Math.round(overallScore),
    financialScore: Math.round(financialScore),
    debrisScore: Math.round(debrisScore),
    regulatoryScore: Math.round(regulatoryScore),
    technicalScore: Math.round(technicalScore),
    recommendations
  };
}

function getAltitudeKey(altitude: number): string {
  if (altitude < 400) return "200-400";
  if (altitude < 600) return "400-600";
  if (altitude < 1000) return "600-1000";
  return "1000+";
}

function generateRecommendations(scores: {
  financialScore: number;
  debrisScore: number;
  regulatoryScore: number;
  technicalScore: number;
  overallScore: number;
  formData: FormData;
}) {
  const mandatory: string[] = [];
  const recommended: string[] = [];
  const baseline: string[] = [];

  // Mandatory recommendations (critical issues)
  if (scores.debrisScore < 50) {
    mandatory.push("Implement active debris mitigation strategy");
    mandatory.push("Upgrade space situational awareness capabilities");
  }
  if (scores.regulatoryScore < 60) {
    mandatory.push("Ensure full regulatory compliance before launch");
    mandatory.push("Establish clear data licensing framework");
  }
  if (scores.financialScore < 40) {
    mandatory.push("Reassess business model viability");
    mandatory.push("Consider alternative revenue streams");
  }

  // Recommended improvements
  if (scores.technicalScore < 70) {
    recommended.push("Consider constellation size optimization");
    recommended.push("Evaluate launch vehicle alternatives");
  }
  if (scores.financialScore < 70) {
    recommended.push("Explore cost reduction opportunities");
    recommended.push("Consider strategic partnerships");
  }
  if (scores.debrisScore < 80) {
    recommended.push("Implement enhanced deorbit capabilities");
    recommended.push("Consider commercial SSA services");
  }

  // Baseline best practices
  baseline.push("Maintain regular stakeholder communication");
  baseline.push("Implement comprehensive testing protocols");
  baseline.push("Establish emergency response procedures");
  baseline.push("Monitor industry regulatory developments");
  baseline.push("Plan for end-of-mission disposal");

  return { mandatory, recommended, baseline };
}