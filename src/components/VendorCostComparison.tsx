import React, { useMemo } from 'react';
import { vendorCosts, type VendorCostProfile } from '../data/vendorCosts';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FormData } from './BeginnerFriendlyForm';
import { CurrencyDollarIcon, SparklesIcon } from '@heroicons/react/24/outline';

const STAGES: VendorCostProfile['stages'][number]['stage'][] = ['Manufacturing', 'Launch', 'Ground Segment', 'Operations'];

const VendorCostComparison: React.FC<{ formData?: FormData }> = ({ formData }) => {
  const effectiveFormData = useMemo(() => formData || ({} as FormData), [formData]);

  // Advanced cost modeling with payload mass, lead time, and market factors
  const { weights, adjustedCosts, insights, totalByVendor } = useMemo(() => {
    const constellationSize = effectiveFormData?.constellationSize || 1;
    const targetAltitude = effectiveFormData?.targetAltitude || 400;
    const missionLifespan = effectiveFormData?.missionLifespan || 3;
    const payloadMass = effectiveFormData?.payloadMass || 200;
    const leadTimeTolerance = effectiveFormData?.leadTimeTolerance || 18;
    const targetRevenue = effectiveFormData?.targetRevenue || 5000000;

    // Dynamic weight calculation
    const massMultiplier = Math.max(0.5, Math.min(2, payloadMass / 500));
    const urgencyMultiplier = Math.max(0.8, Math.min(1.5, (36 - leadTimeTolerance) / 24));
    const altitudeMultiplier = Math.max(0.9, Math.min(1.3, targetAltitude / 800));
    const scaleMultiplier = Math.max(0.7, Math.min(1.4, constellationSize / 50));

    const baseWeights = {
      Manufacturing: 1 * massMultiplier * scaleMultiplier,
      Launch: 1 * massMultiplier * urgencyMultiplier * altitudeMultiplier,
      'Ground Segment': 1 * scaleMultiplier,
      Operations: 1 * (missionLifespan / 5) * scaleMultiplier
    };

    // Adjust costs based on mission requirements
    const adjustedVendorCosts = vendorCosts.map(vendor => ({
      ...vendor,
      stages: vendor.stages.map(stage => {
        let adjustedCost = stage.costUSD;
        
        // Launch cost adjustments
        if (stage.stage === 'Launch') {
          if (payloadMass > 1000 && vendor.vendor === 'RocketLab') adjustedCost *= 1.8; // RocketLab not ideal for heavy payloads
          if (urgencyMultiplier > 1.2 && ['NASA', 'ULA'].includes(vendor.vendor)) adjustedCost *= 0.9; // Government vendors better for urgent missions
          if (leadTimeTolerance > 24) adjustedCost *= 0.85; // Flexible timing discount
        }
        
        // Manufacturing adjustments
        if (stage.stage === 'Manufacturing') {
          if (constellationSize > 50) adjustedCost *= 0.92; // Bulk manufacturing discount
          if (payloadMass < 100) adjustedCost *= 0.8; // Small sat efficiency
        }
        
        // Operations adjustments
        if (stage.stage === 'Operations') {
          if (targetRevenue < 10000000 && vendor.vendor === 'ISRO') adjustedCost *= 0.85; // ISRO cost efficiency for smaller budgets
          if (missionLifespan > 7) adjustedCost *= 1.1; // Extended ops complexity
        }

        return { ...stage, costUSD: Math.round(adjustedCost) };
      })
    }));

    // Calculate weighted totals
    const totalsWithWeights = adjustedVendorCosts.map(v => ({
      vendor: v.vendor,
      total: v.stages.reduce((sum, s) => sum + s.costUSD * baseWeights[s.stage], 0),
      breakdown: Object.fromEntries(v.stages.map(s => [s.stage, s.costUSD * baseWeights[s.stage]]))
    })).sort((a, b) => a.total - b.total);

    // Generate insights
    const totalBudget = targetRevenue * 0.4; // Assume 40% of revenue goes to mission costs
    const avgCost = totalsWithWeights.reduce((sum, v) => sum + v.total, 0) / totalsWithWeights.length;
    const budgetFit = totalBudget / avgCost;
    
    const riskFactors = [];
    if (payloadMass > 1500) riskFactors.push('Heavy payload increases launch complexity');
    if (leadTimeTolerance < 12) riskFactors.push('Tight timeline may limit vendor options');
    if (constellationSize > 100) riskFactors.push('Large constellation requires proven mass production');
    if (targetAltitude > 1200) riskFactors.push('High altitude increases radiation and debris risk');
    
    return {
      weights: baseWeights,
      adjustedCosts: adjustedVendorCosts,
      totalByVendor: totalsWithWeights,
      insights: {
        budgetFit: budgetFit > 1.2 ? 'comfortable' : budgetFit > 0.8 ? 'tight' : 'challenging',
        budgetRatio: budgetFit,
        riskFactors,
        bestVendor: totalsWithWeights[0],
        worstVendor: totalsWithWeights[totalsWithWeights.length - 1],
        savings: totalsWithWeights[totalsWithWeights.length - 1].total - totalsWithWeights[0].total,
        recommendations: budgetFit < 0.9 ? ['Consider phased deployment', 'Explore rideshare options'] : ['Full deployment viable', 'Consider premium options for reliability']
      }
    };
  }, [effectiveFormData]);

  const bestByStage = useMemo(() => {
    const best: Record<string, { vendor: string; cost: number }> = {};
    STAGES.forEach(stage => {
      const entries = adjustedCosts.map(v => ({ 
        vendor: v.vendor, 
        cost: v.stages.find(s => s.stage === stage)!.costUSD 
      }));
      const min = entries.reduce((acc, cur) => cur.cost < acc.cost ? cur : acc, entries[0]);
      best[stage] = min;
    });
    return best;
  }, [adjustedCosts]);

  // removed LiveControl & local controls per user request

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md text-white">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5" />
            <span>Smart Vendor Cost Comparison</span>
            <SparklesIcon className="h-4 w-4 text-yellow-400" />
          </h3>
          <p className="text-sm text-gray-400 mt-1">AI-powered cost optimization based on your mission parameters</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-300">Optimal Choice:</div>
          <div className="font-semibold text-green-400">{insights.bestVendor.vendor}</div>
          <div className="text-xs text-gray-400">${insights.bestVendor.total.toLocaleString()}</div>
        </div>
      </div>
      {/* Removed Live Controls and budget cards per request */}

      {/* Horizontal stage-by-vendor comparison */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-300 border-b border-gray-700">
              <th className="py-3 pr-4 font-semibold">Stage</th>
              <th className="py-3 pr-2 text-center">Weight</th>
              {adjustedCosts.map((v) => (
                <th key={v.vendor} className="py-3 pr-4 text-center">
                  <div className="font-semibold">{v.vendor}</div>
                  <div className="text-xs text-gray-400 font-normal">
                    ${totalByVendor.find(t => t.vendor === v.vendor)?.total.toLocaleString()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAGES.map((stage) => (
              <tr key={stage} className="border-t border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 pr-4 text-white font-medium">
                  <div>{stage}</div>
                  <div className="text-xs text-green-400">
                    Best: {bestByStage[stage].vendor}
                  </div>
                </td>
                <td className="py-3 pr-2 text-center text-gray-400">
                  {weights[stage].toFixed(1)}x
                </td>
                {adjustedCosts.map((v) => {
                  const cost = v.stages.find((s) => s.stage === stage)!.costUSD;
                  const weightedCost = cost * weights[stage];
                  const isBest = bestByStage[stage].vendor === v.vendor;
                  const isWorst = adjustedCosts.every(other => 
                    other.vendor === v.vendor || 
                    other.stages.find(s => s.stage === stage)!.costUSD <= cost
                  );
                  return (
                    <td key={`${v.vendor}-${stage}`} className={`py-3 pr-4 text-center ${
                      isBest ? 'text-green-400 font-semibold bg-green-900/20' : 
                      isWorst ? 'text-red-400' : 'text-gray-200'
                    }`}>
                      <div className="font-medium">${cost.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">
                        ${weightedCost.toLocaleString()} weighted
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Weighted totals chart */}
      <div className="h-64 mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Weighted Total Cost Comparison</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={totalByVendor}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="vendor" tick={{ fill: '#9CA3AF' }} />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', color: '#F9FAFB' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Weighted Total']}
            />
            <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-400 mb-3 flex items-center space-x-2">
            <SparklesIcon className="h-4 w-4" />
            <span>AI Recommendations</span>
          </h4>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-gray-200 flex items-start space-x-2">
                <span className="text-yellow-400 text-xs mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
            <div className="text-sm text-blue-200">
              <strong>Recommendation:</strong> Based on your {effectiveFormData.constellationSize || 0}-satellite constellation 
              at {effectiveFormData.targetAltitude || 0}km with {effectiveFormData.payloadMass || 0}kg payload, 
              <span className="font-semibold text-white"> {insights.bestVendor.vendor}</span> offers 
              the best cost-performance balance for your {effectiveFormData.leadTimeTolerance || 0}-month timeline.
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-red-400 mb-3">Risk Factors</h4>
          {insights.riskFactors.length > 0 ? (
            <ul className="space-y-2">
              {insights.riskFactors.map((risk, idx) => (
                <li key={idx} className="text-sm text-gray-200 flex items-start space-x-2">
                  <span className="text-red-400 text-xs mt-1">⚠</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-400">✓ No significant risk factors identified for your mission profile.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Costs adjust dynamically based on mission requirements. Real-world pricing varies by payload mass, schedule, contract terms, and current market conditions. 
        Use live controls above to explore different scenarios.
      </p>
    </div>
  );
};

export default VendorCostComparison;
