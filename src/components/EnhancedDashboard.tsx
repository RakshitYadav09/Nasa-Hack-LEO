import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Line, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon, MapIcon, ChartBarIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { FormData } from './BeginnerFriendlyForm';
import AgencyComparison from './AgencyComparison';
import VendorCostComparison from './VendorCostComparison';
import LaunchVisualization from './LaunchVisualization';
import { getGeminiService, type GeminiReport } from '../services/geminiAI';
import { calculateScores } from '../utils/scoring';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface EnhancedDashboardProps {
  formData: FormData;
  onBack: () => void;
  onFormDataChange?: (data: FormData) => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ formData, onBack, onFormDataChange }) => {
  const [scores, setScores] = useState({ overall: 0, financial: 0, debris: 0, regulatory: 0 });
  const [aiReport, setAiReport] = useState<GeminiReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'visualization' | 'report'>('overview');
  const [showDebris, setShowDebris] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(false);

  useEffect(() => {
    const calculateAndGenerateReport = async () => {
      setLoading(true);
      
      // Calculate scores
      const calculatedScores = calculateScores(formData);
      setScores(calculatedScores);

      // Generate AI report
      try {
        const geminiService = getGeminiService();
        const report = await geminiService.generateReport({
          ...formData,
          scores: calculatedScores
        });
        setAiReport(report);
      } catch (error) {
        console.error('Error generating AI report:', error);
      }
      
      setLoading(false);
    };

    calculateAndGenerateReport();
  }, [formData]);

  const exportToPDF = async () => {
    const element = document.getElementById('dashboard-content');
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`LEO-Mission-Analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const scoreData = [
    { name: 'Financial Viability', score: scores.financial, maxScore: 100 },
    { name: 'Debris Risk', score: 100 - scores.debris, maxScore: 100 }, // Inverted for better UX
    { name: 'Regulatory Compliance', score: scores.regulatory, maxScore: 100 },
    { name: 'Overall Health', score: scores.overall, maxScore: 100 }
  ];

  const radarData = [
    { subject: 'Financial', A: scores.financial, fullMark: 100 },
    { subject: 'Safety', A: 100 - scores.debris, fullMark: 100 },
    { subject: 'Regulatory', A: scores.regulatory, fullMark: 100 },
    { subject: 'Technical', A: scores.overall, fullMark: 100 },
    { subject: 'Market', A: Math.min(100, formData.targetRevenue / 1000000 * 20), fullMark: 100 },
    { subject: 'Innovation', A: formData.inSpacePropulsion ? 85 : 65, fullMark: 100 }
  ];

  const timelineData = [
    { phase: 'Development', months: 24, cost: 40, risk: 30 },
    { phase: 'Regulatory', months: 18, cost: 10, risk: 60 },
    { phase: 'Manufacturing', months: 12, cost: 30, risk: 20 },
    { phase: 'Launch', months: 6, cost: 15, risk: 40 },
    { phase: 'Operations', months: formData.missionLifespan * 12, cost: 5, risk: 10 }
  ];

  const ScoreGauge: React.FC<{ score: number; label: string; subtitle?: string }> = ({ score, label, subtitle }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center">
        <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>{score}</div>
        <div className="text-sm text-gray-600 mb-2">{label}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <motion.div
            className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );

  const RecommendationCard: React.FC<{ 
    type: 'mandatory' | 'recommended' | 'baseline';
    items: string[];
  }> = ({ type, items }) => {
    const config = {
      mandatory: { classes: 'bg-red-900/30 border-red-700 text-red-200', icon: ExclamationTriangleIcon, title: 'MANDATORY' },
      recommended: { classes: 'bg-yellow-900/30 border-yellow-700 text-yellow-200', icon: CheckCircleIcon, title: 'RECOMMENDED' },
      baseline: { classes: 'bg-blue-900/30 border-blue-700 text-blue-200', icon: ClockIcon, title: 'BASELINE' }
    } as const;
    const { classes, icon: Icon, title } = config[type];
    return (
      <div className={`rounded-lg p-4 border ${classes}`}>
        <div className="flex items-center space-x-2 mb-3">
          <Icon className="h-5 w-5" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="text-sm flex items-start space-x-2">
              <span className="text-xs">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Analyzing Your Mission</h2>
          <p className="text-gray-500">Calculating scores and generating AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black text-white border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🚀 LEO Mission Analysis</h1>
              <p className="text-gray-300">
                {formData.businessCategory} • {formData.constellationSize} satellites • {formData.targetAltitude}km altitude
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportToPDF}
                className="flex items-center space-x-2 border border-gray-700 hover:bg-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={onBack}
                className="border border-gray-700 hover:bg-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                ← Back to Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-white">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'visualization', label: 'Launch & Debris', icon: MapIcon },
              { id: 'report', label: 'AI Analysis', icon: CheckCircleIcon }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'overview' | 'visualization' | 'report')}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="dashboard-content" className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ScoreGauge score={scores.overall} label="Overall Health" subtitle="Mission Viability" />
              <ScoreGauge score={scores.financial} label="Financial Score" subtitle="Business Viability" />
              <ScoreGauge score={100 - scores.debris} label="Safety Score" subtitle="Debris Risk Mitigation" />
              <ScoreGauge score={scores.regulatory} label="Compliance Score" subtitle="Regulatory Readiness" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Breakdown */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-white">📊 Score Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', color: '#F9FAFB' }} />
                    <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-white">🎯 Mission Profile</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" fontSize={12} tick={{ fill: '#9CA3AF' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} tick={{ fill: '#9CA3AF' }} />
                    <Radar name="Mission" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Agency Comparison */}
            <AgencyComparison />

            {/* Vendor Cost Comparison by Stage */}
            <VendorCostComparison formData={formData} onFormDataChange={onFormDataChange} />

            {/* Mission Timeline */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-white">⏱️ Mission Timeline</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="phase" fontSize={12} tick={{ fill: '#9CA3AF' }} />
                  <YAxis yAxisId="left" tick={{ fill: '#9CA3AF' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', color: '#F9FAFB' }} />
                  <Area yAxisId="left" type="monotone" dataKey="cost" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Line yAxisId="right" type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Recommendations */}
            {aiReport && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RecommendationCard type="mandatory" items={aiReport.recommendations.mandatory.slice(0, 3)} />
                <RecommendationCard type="recommended" items={aiReport.recommendations.recommended.slice(0, 3)} />
                <RecommendationCard type="baseline" items={aiReport.recommendations.baseline.slice(0, 3)} />
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'visualization' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Controls */}
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showDebris}
                    onChange={(e) => setShowDebris(e.target.checked)}
                    className="rounded border-gray-600 bg-black"
                  />
                  <span className="text-sm font-medium text-white">Show Debris Objects</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showTrajectory}
                    onChange={(e) => setShowTrajectory(e.target.checked)}
                    className="rounded border-gray-600 bg-black"
                  />
                  <span className="text-sm font-medium text-white">Show Launch Trajectory</span>
                </label>
                <button
                  onClick={() => setShowTrajectory(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  🚀 Simulate Launch
                </button>
              </div>
            </div>

            {/* Launch Visualization */}
            <LaunchVisualization
              selectedLaunchSite={formData.selectedLaunchSite}
              targetAltitude={formData.targetAltitude}
              showDebris={showDebris}
              showTrajectory={showTrajectory}
            />
          </motion.div>
        )}

        {activeTab === 'report' && aiReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Executive Summary */}
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                <span className="mr-2">🤖</span>
                AI Executive Summary
              </h3>
              <p className="text-gray-200 leading-relaxed">{aiReport.summary}</p>
            </div>

            {/* Detailed Recommendations */}
            <div className="grid grid-cols-1 gap-6">
              <RecommendationCard type="mandatory" items={aiReport.recommendations.mandatory} />
              <RecommendationCard type="recommended" items={aiReport.recommendations.recommended} />
              <RecommendationCard type="baseline" items={aiReport.recommendations.baseline} />
            </div>

            {/* Detailed Analysis Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Environmental Impact */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                  <span className="mr-2">🌍</span>
                  Environmental Impact
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Debris Risk Assessment</h4>
                    <p className="text-sm text-gray-300">{aiReport.environmental_impact.debris_risk_assessment}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Orbital Sustainability</h4>
                    <p className="text-sm text-gray-300">{aiReport.environmental_impact.orbital_sustainability}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Collision Probability</h4>
                    <p className="text-sm text-gray-300">{aiReport.environmental_impact.collision_probability}</p>
                  </div>
                </div>
              </div>

              {/* Financial Analysis */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                  <span className="mr-2">💰</span>
                  Financial Analysis
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Cost Breakdown</h4>
                    <p className="text-sm text-gray-300">{aiReport.financial_analysis.cost_breakdown}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">ROI Projection</h4>
                    <p className="text-sm text-gray-300">{aiReport.financial_analysis.roi_projection}</p>
                  </div>
                </div>
              </div>

              {/* Technical Insights */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                  <span className="mr-2">⚙️</span>
                  Technical Insights
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Launch Window Optimization</h4>
                    <p className="text-sm text-gray-300">{aiReport.technical_insights.launch_window_optimization}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Mission Timeline</h4>
                    <p className="text-sm text-gray-300">{aiReport.technical_insights.mission_timeline}</p>
                  </div>
                  <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">Success Probability</span>
                      <span className="text-2xl font-bold text-blue-400">{aiReport.technical_insights.success_probability}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regulatory Notes */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
                  <span className="mr-2">📋</span>
                  Regulatory Compliance
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Licensing Requirements</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {aiReport.regulatory_notes.licensing_requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-xs mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Compliance Checklist</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {aiReport.regulatory_notes.compliance_checklist.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-xs mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;