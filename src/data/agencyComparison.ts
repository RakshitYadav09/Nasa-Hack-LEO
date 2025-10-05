export type AgencyId = 'NASA' | 'SpaceX' | 'ISRO';

export interface AgencyMetrics {
  agency: AgencyId;
  launchCostPerKgUSD: number; // approximate to LEO
  annualLaunches: number;
  reliabilityRatePct: number; // success percentage
  typicalLeadTimeMonths: number;
  notableVehicles: string[];
}

export const agencyComparison: AgencyMetrics[] = [
  {
    agency: 'NASA',
    launchCostPerKgUSD: 20000, // Mixed providers/programs
    annualLaunches: 4,
    reliabilityRatePct: 97,
    typicalLeadTimeMonths: 24,
    notableVehicles: ['SLS', 'Commercial Crew (providers)', 'Commercial Cargo']
  },
  {
    agency: 'SpaceX',
    launchCostPerKgUSD: 2700, // Falcon 9 rideshare ballpark
    annualLaunches: 100,
    reliabilityRatePct: 99,
    typicalLeadTimeMonths: 6,
    notableVehicles: ['Falcon 9', 'Falcon Heavy', 'Starship (dev)']
  },
  {
    agency: 'ISRO',
    launchCostPerKgUSD: 5000, // PSLV/SSLV estimates
    annualLaunches: 6,
    reliabilityRatePct: 96,
    typicalLeadTimeMonths: 12,
    notableVehicles: ['PSLV', 'GSLV', 'SSLV']
  }
];
