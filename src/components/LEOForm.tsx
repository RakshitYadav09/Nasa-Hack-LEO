import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Tooltip } from '@/components/ui/tooltip';
import { FormData } from '@/lib/scoring';
import { HelpCircle } from 'lucide-react';

interface LEOFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function LEOForm({ onSubmit, isLoading = false }: LEOFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const tooltips = {
    businessCategory: "Choose the primary focus of your LEO venture. Each category has different market dynamics, cost structures, and regulatory requirements.",
    targetAnnualRevenue: "Your projected annual revenue once fully operational. This helps assess financial viability and market positioning.",
    productValueDensity: "Revenue generated per kilogram of payload. Higher density indicates more profitable use of limited launch capacity.",
    targetMarket: "Your primary customer base. Government contracts offer stability, Enterprise provides scale, Direct-to-Consumer allows flexibility.",
    constellationSize: "Total number of satellites or mass of infrastructure. Larger constellations provide better coverage but increase complexity.",
    targetOrbitalAltitude: "Operating altitude in kilometers. Lower orbits have less debris but require more maintenance. Higher orbits last longer but cost more to reach.",
    requiredMissionLifespan: "How long your assets must remain operational. Longer missions need better deorbit planning and component reliability.",
    launchVehicleType: "Launch method affects cost and environmental impact. Reusable vehicles are cheaper but newer, expendable are proven but costly.",
    inSpacePropulsion: "Ability to change orbit or perform station-keeping. Increases capability and safety but adds complexity and cost.",
    deorbitMethod: "How you'll safely dispose of assets at end-of-life. Active propulsion is most reliable, drag enhancement is cheapest.",
    ssaStrategy: "How you'll track space objects to avoid collisions. Commercial services balance cost and capability, in-house offers control.",
    dataLicensingModel: "How openly you'll share data. Open models aid science and reduce regulatory burden, private models protect IP."
  };

  const FormField = ({ 
    name, 
    label, 
    tooltip, 
    children 
  }: { 
    name: string; 
    label: string; 
    tooltip: string; 
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={name}>{label}</Label>
        <Tooltip content={tooltip}>
          <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
        </Tooltip>
      </div>
      {children}
      {errors[name as keyof FormData] && (
        <p className="text-sm text-red-600">This field is required</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Phase 1: Opportunity Definition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-space-700">Phase 1: Opportunity Definition</CardTitle>
          <CardDescription>
            Define your business model and market positioning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              name="businessCategory" 
              label="Business Category" 
              tooltip={tooltips.businessCategory}
            >
              <Select {...register('businessCategory', { required: true })}>
                <option value="">Select a category</option>
                <option value="SatCom">Satellite Communications</option>
                <option value="EarthObservation">Earth Observation</option>
                <option value="InSpaceManufacturing">In-Space Manufacturing</option>
                <option value="LEOInfrastructure">LEO Infrastructure/Servicing</option>
              </Select>
            </FormField>

            <FormField 
              name="targetMarket" 
              label="Target Market/Customer" 
              tooltip={tooltips.targetMarket}
            >
              <Select {...register('targetMarket', { required: true })}>
                <option value="">Select target market</option>
                <option value="Government">Government</option>
                <option value="Enterprise">Enterprise/B2B</option>
                <option value="DirectConsumer">Direct-to-Consumer/D2C</option>
              </Select>
            </FormField>

            <FormField 
              name="targetAnnualRevenue" 
              label="Target Annual Revenue (USD)" 
              tooltip={tooltips.targetAnnualRevenue}
            >
              <Input
                type="number"
                {...register('targetAnnualRevenue', { required: true, min: 1000000 })}
                placeholder="e.g., 100000000"
              />
            </FormField>

            <FormField 
              name="productValueDensity" 
              label="Product Value Density (USD/kg)" 
              tooltip={tooltips.productValueDensity}
            >
              <Input
                type="number"
                {...register('productValueDensity', { required: true, min: 1000 })}
                placeholder="e.g., 50000"
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Phase 2: Operational & Technical Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-space-700">Phase 2: Operational & Technical Parameters</CardTitle>
          <CardDescription>
            Specify your technical requirements and operational constraints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              name="constellationSize" 
              label="Constellation Size / Facility Mass (count or kg)" 
              tooltip={tooltips.constellationSize}
            >
              <Input
                type="number"
                {...register('constellationSize', { required: true, min: 1 })}
                placeholder="e.g., 100"
              />
            </FormField>

            <FormField 
              name="targetOrbitalAltitude" 
              label="Target Orbital Altitude (km)" 
              tooltip={tooltips.targetOrbitalAltitude}
            >
              <Input
                type="number"
                {...register('targetOrbitalAltitude', { required: true, min: 200, max: 2000 })}
                placeholder="e.g., 550"
              />
            </FormField>

            <FormField 
              name="requiredMissionLifespan" 
              label="Required Mission Lifespan (years)" 
              tooltip={tooltips.requiredMissionLifespan}
            >
              <Input
                type="number"
                {...register('requiredMissionLifespan', { required: true, min: 1, max: 25 })}
                placeholder="e.g., 5"
              />
            </FormField>

            <FormField 
              name="launchVehicleType" 
              label="Launch Vehicle Type" 
              tooltip={tooltips.launchVehicleType}
            >
              <Select {...register('launchVehicleType', { required: true })}>
                <option value="">Select launch vehicle</option>
                <option value="Reusable">Reusable</option>
                <option value="Expendable">Expendable</option>
                <option value="SmallDedicated">Small Dedicated Launch</option>
              </Select>
            </FormField>

            <FormField 
              name="inSpacePropulsion" 
              label="In-Space Propulsion Required" 
              tooltip={tooltips.inSpacePropulsion}
            >
              <Select {...register('inSpacePropulsion', { required: true })}>
                <option value="">Select option</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Phase 3: Risk & Sustainability Commitments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-space-700">Phase 3: Risk & Sustainability Commitments</CardTitle>
          <CardDescription>
            Define your approach to space sustainability and risk management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              name="deorbitMethod" 
              label="De-orbit Method" 
              tooltip={tooltips.deorbitMethod}
            >
              <Select {...register('deorbitMethod', { required: true })}>
                <option value="">Select de-orbit method</option>
                <option value="ActivePropulsion">Active Propulsion</option>
                <option value="DragEnhancement">Drag Enhancement</option>
                <option value="DebrisRemovalService">Debris Removal Service</option>
              </Select>
            </FormField>

            <FormField 
              name="ssaStrategy" 
              label="Space Situational Awareness (SSA) Strategy" 
              tooltip={tooltips.ssaStrategy}
            >
              <Select {...register('ssaStrategy', { required: true })}>
                <option value="">Select SSA strategy</option>
                <option value="Commercial">Commercial</option>
                <option value="InHouse">In-house</option>
                <option value="PublicData">Public Data</option>
              </Select>
            </FormField>

            <FormField 
              name="dataLicensingModel" 
              label="Data Licensing/Sharing Model" 
              tooltip={tooltips.dataLicensingModel}
            >
              <Select {...register('dataLicensingModel', { required: true })}>
                <option value="">Select licensing model</option>
                <option value="Open">Open</option>
                <option value="Restricted">Restricted</option>
                <option value="Private">Private</option>
              </Select>
            </FormField>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3"
        >
          {isLoading ? 'Generating Analysis...' : 'Generate LEO Strategic Analysis'}
        </Button>
      </div>
    </form>
  );
}