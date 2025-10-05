// Gemini AI integration for LEO mission analysis and recommendations
export interface GeminiReport {
  summary: string;
  recommendations: {
    mandatory: string[];
    recommended: string[];
    baseline: string[];
  };
  environmental_impact: {
    debris_risk_assessment: string;
    orbital_sustainability: string;
    collision_probability: string;
    mitigation_strategies: string[];
  };
  regulatory_notes: {
    licensing_requirements: string[];
    compliance_checklist: string[];
    international_considerations: string[];
  };
  financial_analysis: {
    cost_breakdown: string;
    risk_factors: string[];
    market_opportunities: string[];
    roi_projection: string;
  };
  technical_insights: {
    launch_window_optimization: string;
    orbital_mechanics: string;
    mission_timeline: string;
    success_probability: number;
  };
}

export interface MissionParameters {
  businessCategory: string;
  targetRevenue: number;
  productValueDensity: number;
  targetMarket: string;
  constellationSize: number;
  targetAltitude: number;
  missionLifespan: number;
  launchVehicleType: string;
  inSpacePropulsion: boolean;
  deorbitMethod: string;
  ssaStrategy: string;
  dataLicensing: string;
  selectedLaunchSite: string;
  scores: {
    overall: number;
    financial: number;
    debris: number;
    regulatory: number;
  };
}

class GeminiAIService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private createDetailedPrompt(params: MissionParameters): string {
    return `
You are a senior LEO (Low Earth Orbit) space mission analyst and consultant with expertise in commercial space ventures, orbital mechanics, space debris mitigation, and regulatory compliance. 

Analyze the following LEO commercial mission parameters and provide a comprehensive, beginner-friendly analysis:

MISSION DETAILS:
- Business Category: ${params.businessCategory}
- Target Annual Revenue: $${params.targetRevenue.toLocaleString()}
- Product Value Density: $${params.productValueDensity}/kg
- Target Market: ${params.targetMarket}
- Constellation Size/Facility Mass: ${params.constellationSize}
- Target Orbital Altitude: ${params.targetAltitude}km
- Mission Lifespan: ${params.missionLifespan} years
- Launch Vehicle: ${params.launchVehicleType}
- In-Space Propulsion: ${params.inSpacePropulsion ? 'Yes' : 'No'}
- De-orbit Method: ${params.deorbitMethod}
- Space Situational Awareness Strategy: ${params.ssaStrategy}
- Data Licensing Model: ${params.dataLicensing}
- Launch Site: ${params.selectedLaunchSite}

CURRENT ASSESSMENT SCORES:
- Overall Business Health: ${params.scores.overall}/100
- Financial Viability: ${params.scores.financial}/100
- Debris Risk: ${params.scores.debris}/100
- Regulatory Compliance: ${params.scores.regulatory}/100

Please provide a detailed analysis in JSON format with the following structure:

{
  "summary": "A comprehensive 2-3 paragraph executive summary explaining the mission viability, key strengths, and main concerns in simple terms that a business executive could understand",
  
  "recommendations": {
    "mandatory": ["Critical requirements that MUST be addressed for mission success - list 3-5 items"],
    "recommended": ["Important improvements that would significantly enhance mission success - list 3-5 items"],
    "baseline": ["Additional considerations for optimal mission performance - list 3-5 items"]
  },
  
  "environmental_impact": {
    "debris_risk_assessment": "Detailed analysis of space debris risks at the target altitude and mitigation strategies",
    "orbital_sustainability": "Assessment of the mission's impact on the long-term sustainability of the orbital environment",
    "collision_probability": "Specific collision risk analysis and probability estimates",
    "mitigation_strategies": ["List of specific debris mitigation techniques for this mission - 4-6 items"]
  },
  
  "regulatory_notes": {
    "licensing_requirements": ["Specific licenses and permits required - list 4-6 items"],
    "compliance_checklist": ["Key regulatory compliance steps - list 5-7 items"],
    "international_considerations": ["International space law and coordination requirements - list 3-5 items"]
  },
  
  "financial_analysis": {
    "cost_breakdown": "Detailed analysis of expected costs including launch, development, operations, and regulatory compliance",
    "risk_factors": ["Key financial risks and market uncertainties - list 4-6 items"],
    "market_opportunities": ["Potential revenue streams and market expansion opportunities - list 3-5 items"],
    "roi_projection": "Expected return on investment timeline and key assumptions"
  },
  
  "technical_insights": {
    "launch_window_optimization": "Analysis of optimal launch timing considering orbital mechanics and debris avoidance",
    "orbital_mechanics": "Technical considerations for the chosen orbit including perturbations and station-keeping",
    "mission_timeline": "Recommended mission phases and timeline from development to deorbit",
    "success_probability": [number between 0-100 representing mission success probability]
  }
}

Focus on making the analysis beginner-friendly while maintaining technical accuracy. Explain complex concepts in simple terms and provide actionable recommendations. Consider current space industry trends, emerging regulations, and best practices for commercial LEO operations.
`;
  }

  async generateReport(params: MissionParameters): Promise<GeminiReport> {
    if (!this.apiKey) {
      console.log('No Gemini API key provided, using mock data for demonstration');
      return this.getMockReport(params);
    }

    try {
      const prompt = this.createDetailedPrompt(params);
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const reportData = JSON.parse(jsonMatch[0]);
        return reportData as GeminiReport;
      } else {
        throw new Error('Invalid response format from Gemini');
      }
    } catch (error) {
      console.error('Error generating Gemini report:', error);
      console.log('Falling back to mock data');
      // Fallback to mock data
      return this.getMockReport(params);
    }
  }

  private getMockReport(params: MissionParameters): GeminiReport {
    const businessCategory = params.businessCategory;
    const altitude = params.targetAltitude;
    const isHighRisk = params.scores.debris > 70;
    const isFinanciallyViable = params.scores.financial > 60;

    return {
      summary: `Your ${businessCategory} mission targeting ${altitude}km altitude shows ${isFinanciallyViable ? 'strong' : 'moderate'} commercial potential with projected annual revenue of $${params.targetRevenue.toLocaleString()}. The mission design demonstrates ${params.scores.overall > 70 ? 'excellent' : params.scores.overall > 50 ? 'good' : 'challenging'} overall viability. Key considerations include ${isHighRisk ? 'significant debris risk management' : 'standard orbital safety protocols'} and comprehensive regulatory compliance. The ${params.selectedLaunchSite} launch site provides suitable access to your target orbit, though ${params.missionLifespan}-year mission duration requires robust satellite design and ${params.deorbitMethod} end-of-life planning.`,
      
      recommendations: {
        mandatory: [
          "Obtain FCC authorization for spectrum use and orbital debris mitigation plan approval",
          `Implement ${params.deorbitMethod} system with 95% reliability for end-of-mission disposal`,
          "Secure comprehensive space insurance covering launch and on-orbit operations",
          `Design constellation for ${params.missionLifespan}-year operational life with component redundancy`,
          `Establish ${params.ssaStrategy} space situational awareness monitoring system`
        ],
        recommended: [
          "Partner with established satellite manufacturer to reduce development risk",
          "Implement AI-powered predictive maintenance for satellite health monitoring",
          "Establish ground station network partnerships for global coverage",
          "Develop modular satellite design for easy component replacement and upgrades",
          "Create partnership agreements with debris removal services"
        ],
        baseline: [
          "Consider phased deployment to validate business model before full constellation",
          "Evaluate alternative launch providers for cost optimization",
          "Implement blockchain-based data licensing and revenue tracking",
          "Develop automated collision avoidance maneuver capabilities",
          "Plan for next-generation constellation with improved capabilities"
        ]
      },
      
      environmental_impact: {
        debris_risk_assessment: `At ${altitude}km altitude, your mission faces ${isHighRisk ? 'elevated' : 'moderate'} debris risk with approximately ${Math.floor(altitude/100 * 500)} tracked objects in similar orbits. Critical fragments from previous satellite collisions pose ongoing threats, particularly in the 750-850km range. Your ${params.constellationSize}-satellite constellation will contribute to orbital congestion but can be managed through proper spacing and active debris monitoring.`,
        orbital_sustainability: `The mission's ${params.missionLifespan}-year operational period with ${params.deorbitMethod} disposal aligns with international sustainability guidelines. However, constellation density requires careful orbital slot coordination to prevent interference with existing operators. Your business model supports sustainable space commerce through ${params.dataLicensing} data sharing practices.`,
        collision_probability: `Annual collision probability estimated at ${(0.001 * Math.pow(altitude/500, 2) * params.constellationSize).toFixed(4)}% per satellite based on current debris models. Risk peaks during solar maximum periods when atmospheric drag decreases and debris population increases at operational altitudes.`,
        mitigation_strategies: [
          "Implement automated conjunction assessment and collision avoidance maneuvers",
          "Design satellites with propulsion systems for active debris avoidance",
          "Use radar-absorbing materials to reduce space surveillance sensitivity",
          "Plan controlled deorbit within 25 years or less as per international guidelines",
          "Participate in Space Data Association for enhanced space situational awareness",
          "Implement satellite hardening against small debris impacts"
        ]
      },
      
      regulatory_notes: {
        licensing_requirements: [
          "FCC Part 25 satellite license for communications frequencies",
          "NOAA remote sensing license for Earth observation capabilities",
          "ITU coordination for international frequency coordination",
          "FAA launch authorization for each mission",
          "Export control license (ITAR/EAR) for technology transfer",
          "Environmental impact assessment for launch operations"
        ],
        compliance_checklist: [
          "Submit orbital debris mitigation plan to FCC within 6 months of license application",
          "Coordinate with USSTRATCOM for space object cataloging and tracking",
          "Establish 24/7 mission control with collision avoidance procedures",
          "Implement encryption and cybersecurity measures per NIST guidelines",
          "Maintain satellite tracking and control throughout mission life",
          "File annual compliance reports with all relevant agencies",
          "Ensure end-of-mission disposal compliance within regulatory timeframes"
        ],
        international_considerations: [
          "Coordinate with international partners through ITU Radio Regulations",
          "Comply with UN Outer Space Treaty and Liability Convention obligations",
          "Consider European GDPR requirements for Earth observation data",
          "Align with emerging UN Long-term Sustainability Guidelines",
          "Evaluate export control implications for international customers"
        ]
      },
      
      financial_analysis: {
        cost_breakdown: `Total mission cost estimated at $${(params.targetRevenue * 0.8).toLocaleString()} over ${params.missionLifespan} years: Launch costs ($${(params.constellationSize * 15000000).toLocaleString()}), satellite development ($${(params.constellationSize * 8000000).toLocaleString()}), ground systems ($${(params.constellationSize * 2000000).toLocaleString()}), operations ($${(params.missionLifespan * 5000000).toLocaleString()}/year), and regulatory compliance ($${(params.missionLifespan * 1000000).toLocaleString()}/year). Insurance costs approximately 10-15% of total asset value annually.`,
        risk_factors: [
          "Launch failure risk affecting constellation deployment timeline and insurance costs",
          "Regulatory delays potentially extending development schedule by 6-18 months",
          "Market competition from established players and new entrants",
          "Technology obsolescence during multi-year satellite operational life",
          "Currency fluctuation affecting international launch and component costs",
          "Space weather events potentially reducing satellite operational life"
        ],
        market_opportunities: [
          `${businessCategory} market growing at 8-12% annually with increasing demand`,
          "Government contracts providing stable revenue base and growth opportunities",
          "International expansion potential in underserved markets",
          "Value-added services and data analytics creating additional revenue streams",
          "Partnership opportunities with other space companies for shared infrastructure"
        ],
        roi_projection: `Break-even expected in year ${Math.ceil(params.missionLifespan * 0.4)} with positive cash flow thereafter. Target internal rate of return of 18-25% based on conservative revenue projections. Market expansion and technology improvements could accelerate returns by 12-18 months.`
      },
      
      technical_insights: {
        launch_window_optimization: `Optimal launch windows occur every ${Math.ceil(365/12)} days for your target ${altitude}km orbit. Consider sun-synchronous orbit for Earth observation missions or specific inclination for communication coverage. Seasonal variations affect atmospheric drag and debris density, with spring launches generally preferred for debris avoidance.`,
        orbital_mechanics: `At ${altitude}km altitude, orbital period is approximately ${(90 + altitude/20).toFixed(0)} minutes with orbital velocity of ${(7.8 - altitude/1000).toFixed(1)} km/s. Station-keeping requirements include atmospheric drag compensation (${altitude < 600 ? 'significant' : 'moderate'}), solar radiation pressure effects, and gravitational perturbations. Annual delta-V budget estimated at ${(50 + altitude/20).toFixed(0)} m/s.`,
        mission_timeline: `Development phase: 24-36 months; Launch campaign: 3-6 months; Initial operations: 6 months; Full operational capability: 12 months; Routine operations: ${params.missionLifespan - 2} years; End-of-life disposal: 6 months. Critical milestones include regulatory approval (month 18), first satellite delivery (month 30), and constellation completion (month ${36 + params.constellationSize/2}).`,
        success_probability: Math.max(40, Math.min(85, params.scores.overall - 10 + (isFinanciallyViable ? 10 : 0)))
      }
    };
  }
}

// Default to empty - will use mock data if no API key provided
const getApiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// Singleton instance
let geminiService: GeminiAIService | null = null;

export const initializeGeminiService = (apiKey?: string) => {
  const key = apiKey || getApiKey();
  geminiService = new GeminiAIService(key);
};

export const getGeminiService = (): GeminiAIService => {
  if (!geminiService) {
    // Initialize with environment API key or empty string (will use mock data)
    const key = getApiKey();
    geminiService = new GeminiAIService(key);
  }
  return geminiService;
};

export default GeminiAIService;