// Enhanced NASA mock data with debris tracking and orbital positions
export interface DebrisObject {
  id: string;
  name: string;
  altitude: number;
  latitude: number;
  longitude: number;
  velocity: number;
  riskLevel: 'low' | 'medium' | 'high';
  size: number; // in cm
  type: 'satellite' | 'rocket_body' | 'fragment' | 'unknown';
  lastUpdated: string;
}

export interface LaunchSite {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  operationalSince: number;
  launchesPerYear: number;
  supportedVehicles: string[];
}

export interface OrbitData {
  altitude: number;
  inclination: number;
  eccentricity: number;
  period: number; // in minutes
  debrisCount: number;
  averageDebrisSize: number;
  riskScore: number;
}

// Mock debris data (real-world would come from NASA's debris tracking)
export const mockDebrisData: DebrisObject[] = [
  {
    id: "DEB-001",
    name: "Cosmos 2251 Fragment",
    altitude: 790,
    latitude: 74.0,
    longitude: -101.5,
    velocity: 7500,
    riskLevel: 'high',
    size: 15.2,
    type: 'fragment',
    lastUpdated: "2025-10-04T10:30:00Z"
  },
  {
    id: "DEB-002", 
    name: "Iridium 33 Debris",
    altitude: 785,
    latitude: 72.8,
    longitude: -98.2,
    velocity: 7480,
    riskLevel: 'medium',
    size: 8.7,
    type: 'fragment',
    lastUpdated: "2025-10-04T10:25:00Z"
  },
  {
    id: "SAT-001",
    name: "Defunct Weather Satellite",
    altitude: 850,
    latitude: 45.2,
    longitude: 12.8,
    velocity: 7600,
    riskLevel: 'medium',
    size: 180.5,
    type: 'satellite',
    lastUpdated: "2025-10-04T09:45:00Z"
  },
  {
    id: "RB-001",
    name: "Falcon 9 Upper Stage",
    altitude: 620,
    latitude: 28.5,
    longitude: -80.6,
    velocity: 7200,
    riskLevel: 'low',
    size: 950.0,
    type: 'rocket_body',
    lastUpdated: "2025-10-04T11:00:00Z"
  },
  {
    id: "DEB-003",
    name: "Fengyun-1C Fragment",
    altitude: 865,
    latitude: 98.7,
    longitude: 165.3,
    velocity: 7650,
    riskLevel: 'high',
    size: 12.1,
    type: 'fragment',
    lastUpdated: "2025-10-04T10:15:00Z"
  }
];

// Major launch sites around the world
export const launchSites: LaunchSite[] = [
  {
    id: "KSC",
    name: "Kennedy Space Center",
    country: "USA",
    latitude: 28.5721,
    longitude: -80.6480,
    operationalSince: 1968,
    launchesPerYear: 25,
    supportedVehicles: ["Falcon 9", "Falcon Heavy", "SLS", "Atlas V"]
  },
  {
    id: "BAI",
    name: "Baikonur Cosmodrome",
    country: "Kazakhstan",
    latitude: 45.9650,
    longitude: 63.3050,
    operationalSince: 1957,
    launchesPerYear: 18,
    supportedVehicles: ["Soyuz", "Proton", "Zenit"]
  },
  {
    id: "CSG",
    name: "Guiana Space Centre",
    country: "French Guiana",
    latitude: 5.2389,
    longitude: -52.7683,
    operationalSince: 1968,
    launchesPerYear: 12,
    supportedVehicles: ["Ariane 5", "Ariane 6", "Soyuz", "Vega"]
  },
  {
    id: "VAFB",
    name: "Vandenberg Space Force Base",
    country: "USA",
    latitude: 34.7420,
    longitude: -120.5724,
    operationalSince: 1958,
    launchesPerYear: 15,
    supportedVehicles: ["Falcon 9", "Atlas V", "Delta IV"]
  },
  {
    id: "JSC",
    name: "Jiuquan Satellite Launch Center",
    country: "China",
    latitude: 40.9580,
    longitude: 100.2917,
    operationalSince: 1970,
    launchesPerYear: 20,
    supportedVehicles: ["Long March 2", "Long March 3", "Long March 5"]
  }
];

// Orbital debris data by altitude bands
export const orbitBands: OrbitData[] = [
  {
    altitude: 400,
    inclination: 51.6,
    eccentricity: 0.0001,
    period: 92.8,
    debrisCount: 1250,
    averageDebrisSize: 5.2,
    riskScore: 35
  },
  {
    altitude: 600,
    inclination: 98.2,
    eccentricity: 0.0015,
    period: 96.8,
    debrisCount: 2800,
    averageDebrisSize: 8.7,
    riskScore: 65
  },
  {
    altitude: 800,
    inclination: 86.4,
    eccentricity: 0.0012,
    period: 101.2,
    debrisCount: 4200,
    averageDebrisSize: 12.1,
    riskScore: 85
  },
  {
    altitude: 1000,
    inclination: 99.1,
    eccentricity: 0.0008,
    period: 105.8,
    debrisCount: 1850,
    averageDebrisSize: 15.8,
    riskScore: 72
  }
];

// Enhanced business categories with more detailed metrics
export const businessCategories = {
  'SatCom': {
    name: 'Satellite Communications',
    description: 'Providing internet, voice, and data services via satellite networks',
    icon: '📡',
    avgLaunchCost: 62000000,
    avgPayloadMass: 4500,
    debrisRiskMultiplier: 1.2,
    regulatoryComplexity: 8,
    marketSize: 145000000000,
    preferredAltitudes: [550, 1200, 35786],
    keyMetrics: ['Signal Coverage', 'Data Throughput', 'Latency', 'Network Capacity']
  },
  'EarthObservation': {
    name: 'Earth Observation',
    description: 'Monitoring Earth\'s surface, atmosphere, and climate for scientific and commercial use',
    icon: '🌍',
    avgLaunchCost: 45000000,
    avgPayloadMass: 3200,
    debrisRiskMultiplier: 0.9,
    regulatoryComplexity: 6,
    marketSize: 8200000000,
    preferredAltitudes: [400, 600, 800],
    keyMetrics: ['Image Resolution', 'Revisit Time', 'Spectral Bands', 'Data Volume']
  },
  'InSpaceManufacturing': {
    name: 'In-Space Manufacturing',
    description: 'Manufacturing products in the unique environment of space (microgravity, vacuum)',
    icon: '🏭',
    avgLaunchCost: 95000000,
    avgPayloadMass: 8000,
    debrisRiskMultiplier: 1.5,
    regulatoryComplexity: 9,
    marketSize: 2500000000,
    preferredAltitudes: [400, 500],
    keyMetrics: ['Manufacturing Quality', 'Production Rate', 'Material Purity', 'Power Requirements']
  },
  'LEOInfrastructure': {
    name: 'LEO Infrastructure & Servicing',
    description: 'Building and maintaining infrastructure in Low Earth Orbit, including satellite servicing',
    icon: '🛠️',
    avgLaunchCost: 78000000,
    avgPayloadMass: 6200,
    debrisRiskMultiplier: 1.1,
    regulatoryComplexity: 7,
    marketSize: 4800000000,
    preferredAltitudes: [500, 700, 900],
    keyMetrics: ['Service Capability', 'Orbital Mobility', 'Tool Precision', 'Mission Duration']
  }
};

// Generate realistic trajectory data for launches
export const generateTrajectoryData = (launchSite: LaunchSite, targetAltitude: number) => {
  const points = [];
  const steps = 20;
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const altitude = Math.pow(progress, 1.5) * targetAltitude;
    const latOffset = progress * 10 * (Math.random() - 0.5);
    const lngOffset = progress * 15 * (Math.random() - 0.5);
    
    points.push({
      lat: launchSite.latitude + latOffset,
      lng: launchSite.longitude + lngOffset,
      altitude: altitude,
      time: progress * 600, // 10 minutes to orbit
      velocity: 1000 + progress * 6500 // 1km/s to 7.5km/s
    });
  }
  
  return points;
};

export default {
  businessCategories,
  mockDebrisData,
  launchSites,
  orbitBands,
  generateTrajectoryData
};