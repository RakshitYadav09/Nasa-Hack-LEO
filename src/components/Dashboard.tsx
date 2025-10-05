import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { ScoreResult } from '@/lib/scoring';
import { Download, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface DashboardProps {
  scores: ScoreResult;
  onExportPDF: () => void;
  aiReport?: {
    summary: string;
    recommendations: string;
    environmental_impact: string;
    regulatory_notes: string;
  };
}

export function Dashboard({ scores, onExportPDF, aiReport }: DashboardProps) {
  const barData = [
    { name: 'Financial Viability', score: scores.financialScore },
    { name: 'Debris Risk Mgmt', score: scores.debrisScore },
    { name: 'Regulatory Compliance', score: scores.regulatoryScore },
    { name: 'Technical Feasibility', score: scores.technicalScore }
  ];

  const radarData = [
    { subject: 'Financial', A: scores.financialScore, fullMark: 100 },
    { subject: 'Debris Risk', A: scores.debrisScore, fullMark: 100 },
    { subject: 'Regulatory', A: scores.regulatoryScore, fullMark: 100 },
    { subject: 'Technical', A: scores.technicalScore, fullMark: 100 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <Info className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  // Circular progress component for overall score
  const CircularProgress = ({ score }: { score: number }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
    );
  };

  const RecommendationSection = ({ 
    title, 
    items, 
    icon, 
    bgColor 
  }: { 
    title: string; 
    items: string[]; 
    icon: React.ReactNode; 
    bgColor: string;
  }) => (
    <div className={`p-4 rounded-lg ${bgColor}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-semibold">{title}</h4>
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6" id="dashboard-content">
      {/* Header with Overall Score */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-space-700">LEO Strategic Analysis Results</CardTitle>
          <CardDescription>Comprehensive assessment of your Low Earth Orbit venture</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-4">
            <CircularProgress score={scores.overallScore} />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Overall Business Health Score</h3>
              <p className="text-sm text-gray-500">
                Based on financial viability, risk management, and regulatory compliance
              </p>
            </div>
          </div>
          <Button onClick={onExportPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF Report
          </Button>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis domain={[0, 100]} />
                <RechartsTooltip />
                <Bar dataKey="score" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar 
                  name="Score" 
                  dataKey="A" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Individual Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Financial Viability', score: scores.financialScore },
          { name: 'Debris Risk Management', score: scores.debrisScore },
          { name: 'Regulatory Compliance', score: scores.regulatoryScore },
          { name: 'Technical Feasibility', score: scores.technicalScore }
        ].map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{item.name}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                    {item.score}
                  </p>
                </div>
                {getScoreIcon(item.score)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Key Recommendations</CardTitle>
          <CardDescription>Actionable insights based on your assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RecommendationSection
              title="MANDATORY"
              items={scores.recommendations.mandatory}
              icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
              bgColor="bg-red-50 border border-red-200"
            />
            <RecommendationSection
              title="RECOMMENDED"
              items={scores.recommendations.recommended}
              icon={<Info className="h-5 w-5 text-yellow-500" />}
              bgColor="bg-yellow-50 border border-yellow-200"
            />
            <RecommendationSection
              title="BASELINE"
              items={scores.recommendations.baseline}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              bgColor="bg-green-50 border border-green-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Report */}
      {aiReport && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Strategic Report</CardTitle>
            <CardDescription>Detailed analysis powered by advanced AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Executive Summary</h4>
              <p className="text-gray-700 leading-relaxed">{aiReport.summary}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Strategic Recommendations</h4>
              <p className="text-gray-700 leading-relaxed">{aiReport.recommendations}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Environmental Impact Assessment</h4>
              <p className="text-gray-700 leading-relaxed">{aiReport.environmental_impact}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Regulatory Considerations</h4>
              <p className="text-gray-700 leading-relaxed">{aiReport.regulatory_notes}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}