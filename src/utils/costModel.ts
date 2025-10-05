import { vendorCosts, type VendorCostProfile } from '../data/vendorCosts';
import type { FormData } from '../components/BeginnerFriendlyForm';

export type CostAnalysis = ReturnType<typeof computeCostAnalysis>;

export function computeCostAnalysis(effectiveFormData: Partial<FormData>) {
  const STAGES: VendorCostProfile['stages'][number]['stage'][] = ['Manufacturing', 'Launch', 'Ground Segment', 'Operations'];

  const constellationSize = effectiveFormData?.constellationSize ?? 1;
  const targetAltitude = effectiveFormData?.targetAltitude ?? 400;
  const missionLifespan = effectiveFormData?.missionLifespan ?? 3;
  const payloadMass = effectiveFormData?.payloadMass ?? 200;
  const leadTimeTolerance = effectiveFormData?.leadTimeTolerance ?? 18;
  const targetRevenue = effectiveFormData?.targetRevenue ?? 5000000;

  // Dynamic weight calculation
  const massMultiplier = Math.max(0.5, Math.min(2, payloadMass / 500));
  const urgencyMultiplier = Math.max(0.8, Math.min(1.5, (36 - leadTimeTolerance) / 24));
  const altitudeMultiplier = Math.max(0.9, Math.min(1.3, targetAltitude / 800));
  const scaleMultiplier = Math.max(0.7, Math.min(1.4, constellationSize / 50));

  const weights: Record<typeof STAGES[number], number> = {
    Manufacturing: 1 * massMultiplier * scaleMultiplier,
    Launch: 1 * massMultiplier * urgencyMultiplier * altitudeMultiplier,
    'Ground Segment': 1 * scaleMultiplier,
    Operations: 1 * (missionLifespan / 5) * scaleMultiplier
  };

  // Adjust costs based on mission requirements
  const adjustedCosts = vendorCosts.map(vendor => ({
    ...vendor,
    stages: vendor.stages.map(stage => {
      let adjustedCost = stage.costUSD;

      if (stage.stage === 'Launch') {
        if (payloadMass > 1000 && vendor.vendor === 'RocketLab') adjustedCost *= 1.8;
        if (Math.max(0.8, Math.min(1.5, (36 - leadTimeTolerance) / 24)) > 1.2 && ['NASA', 'ULA'].includes(vendor.vendor)) adjustedCost *= 0.9;
        if (leadTimeTolerance > 24) adjustedCost *= 0.85;
      }
      if (stage.stage === 'Manufacturing') {
        if (constellationSize > 50) adjustedCost *= 0.92;
        if (payloadMass < 100) adjustedCost *= 0.8;
      }
      if (stage.stage === 'Operations') {
        if ((effectiveFormData?.targetRevenue ?? 0) < 10000000 && vendor.vendor === 'ISRO') adjustedCost *= 0.85;
        if (missionLifespan > 7) adjustedCost *= 1.1;
      }

      return { ...stage, costUSD: Math.round(adjustedCost) };
    })
  }));

  const totals = adjustedCosts.map(v => ({
    vendor: v.vendor,
    total: v.stages.reduce((sum, s) => sum + s.costUSD * weights[s.stage], 0),
    breakdown: Object.fromEntries(v.stages.map(s => [s.stage, s.costUSD * weights[s.stage]])) as Record<string, number>
  })).sort((a, b) => a.total - b.total);

  const totalBudget = targetRevenue * 0.4; // Assume 40% of revenue goes to mission costs
  const avgCost = totals.reduce((sum, v) => sum + v.total, 0) / totals.length;
  const budgetFitRatio = avgCost > 0 ? totalBudget / avgCost : 0;
  const budgetFit = budgetFitRatio > 1.2 ? 'comfortable' : budgetFitRatio > 0.8 ? 'tight' : 'challenging';

  const riskFactors: string[] = [];
  if (payloadMass > 1500) riskFactors.push('Heavy payload increases launch complexity');
  if (leadTimeTolerance < 12) riskFactors.push('Tight timeline may limit vendor options');
  if (constellationSize > 100) riskFactors.push('Large constellation requires proven mass production');
  if (targetAltitude > 1200) riskFactors.push('High altitude increases radiation and debris risk');

  const bestByStage: Record<string, { vendor: string; cost: number }> = {};
  STAGES.forEach(stage => {
    const entries = adjustedCosts.map(v => ({ vendor: v.vendor, cost: v.stages.find(s => s.stage === stage)!.costUSD }));
    const min = entries.reduce((acc, cur) => cur.cost < acc.cost ? cur : acc, entries[0]);
    bestByStage[stage] = min;
  });

  const insights = {
    budgetFit,
    budgetRatio: budgetFitRatio,
    riskFactors,
    bestVendor: totals[0],
    worstVendor: totals[totals.length - 1],
    savings: totals[totals.length - 1].total - totals[0].total,
  } as const;

  return { weights, adjustedCosts, totalByVendor: totals, insights, bestByStage };
}
