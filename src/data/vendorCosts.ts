export type VendorId = 'SpaceX' | 'RocketLab' | 'Arianespace' | 'ISRO' | 'NASA' | 'ULA';

export interface StageCost {
  stage: 'Manufacturing' | 'Launch' | 'Ground Segment' | 'Operations';
  costUSD: number;
}

export interface VendorCostProfile {
  vendor: VendorId;
  stages: StageCost[];
}

export const vendorCosts: VendorCostProfile[] = [
  {
    vendor: 'SpaceX',
    stages: [
      { stage: 'Manufacturing', costUSD: 18000000 },
      { stage: 'Launch', costUSD: 55000000 },
      { stage: 'Ground Segment', costUSD: 4000000 },
      { stage: 'Operations', costUSD: 6000000 }
    ]
  },
  {
    vendor: 'ULA',
    stages: [
      { stage: 'Manufacturing', costUSD: 28000000 },
      { stage: 'Launch', costUSD: 110000000 },
      { stage: 'Ground Segment', costUSD: 7000000 },
      { stage: 'Operations', costUSD: 9000000 }
    ]
  },
  {
    vendor: 'RocketLab',
    stages: [
      { stage: 'Manufacturing', costUSD: 12000000 },
      { stage: 'Launch', costUSD: 7500000 },
      { stage: 'Ground Segment', costUSD: 3000000 },
      { stage: 'Operations', costUSD: 4500000 }
    ]
  },
  {
    vendor: 'Arianespace',
    stages: [
      { stage: 'Manufacturing', costUSD: 25000000 },
      { stage: 'Launch', costUSD: 90000000 },
      { stage: 'Ground Segment', costUSD: 6000000 },
      { stage: 'Operations', costUSD: 8000000 }
    ]
  },
  {
    vendor: 'ISRO',
    stages: [
      { stage: 'Manufacturing', costUSD: 10000000 },
      { stage: 'Launch', costUSD: 32000000 },
      { stage: 'Ground Segment', costUSD: 2500000 },
      { stage: 'Operations', costUSD: 4000000 }
    ]
  }
  ,
  {
    vendor: 'NASA',
    stages: [
      { stage: 'Manufacturing', costUSD: 30000000 },
      { stage: 'Launch', costUSD: 130000000 },
      { stage: 'Ground Segment', costUSD: 8000000 },
      { stage: 'Operations', costUSD: 12000000 }
    ]
  }
];
