import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { mockDebrisData, launchSites, generateTrajectoryData } from '../data/enhancedNasaData';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LaunchVisualizationProps {
  selectedLaunchSite: string;
  targetAltitude: number;
  showDebris: boolean;
  showTrajectory: boolean;
}

const LaunchVisualization: React.FC<LaunchVisualizationProps> = ({
  selectedLaunchSite,
  targetAltitude,
  showDebris,
  showTrajectory
}) => {
  const [trajectoryData, setTrajectoryData] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const launchSite = launchSites.find(site => site.id === selectedLaunchSite) || launchSites[0];

  useEffect(() => {
    if (showTrajectory) {
      const trajectory = generateTrajectoryData(launchSite, targetAltitude);
      setTrajectoryData(trajectory);
      setCurrentStep(0);
    }
  }, [launchSite, targetAltitude, showTrajectory]);

  useEffect(() => {
    if (showTrajectory && trajectoryData.length > 0) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= trajectoryData.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [trajectoryData, showTrajectory]);

  // Create custom icons for different types of objects
  const launchSiteIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCAxMEwxMy4wOSAxNS43NEwxMiAyMkwxMC45MSAxNS43NEw0IDEwTDEwLjkxIDguMjZMMTIgMloiIGZpbGw9IiNGRjAwMDAiLz4KPHN2Zz4K',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const debrisIcon = (riskLevel: string) => new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="6" fill="${riskLevel === 'high' ? '#EF4444' : riskLevel === 'medium' ? '#F59E0B' : '#10B981'}" stroke="white" stroke-width="2"/>
      </svg>
    `)}`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8]
  });

  const rocketIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTQgOEwxOCAxMEwxNCAEMEwxMiAyMkwxMCAxNkw2IDEwTDEwIDhMMTIgMloiIGZpbGw9IiMzQjgyRjYiLz4KPHN2Zz4K',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });

  const getTrajectoryPoints = () => {
    return trajectoryData.slice(0, currentStep + 1).map(point => [point.lat, point.lng] as [number, number]);
  };

  const getCurrentPosition = () => {
    if (currentStep < trajectoryData.length) {
      const point = trajectoryData[currentStep];
      return [point.lat, point.lng] as [number, number];
    }
    return null;
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h3 className="text-lg font-semibold">🚀 Launch Visualization & Debris Tracking</h3>
        <p className="text-sm opacity-90">
          Launch from: {launchSite.name}, {launchSite.country} | Target Altitude: {targetAltitude}km
        </p>
      </div>

      <div className="p-4 bg-gray-50 border-b">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Risk Debris</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Risk Debris</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Risk Debris</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Launch Trajectory</span>
          </div>
        </div>
      </div>

      <div style={{ height: '500px' }}>
        <MapContainer
          center={[launchSite.latitude, launchSite.longitude]}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Launch Sites */}
          {launchSites.map(site => (
            <Marker
              key={site.id}
              position={[site.latitude, site.longitude]}
              icon={site.id === selectedLaunchSite ? launchSiteIcon : launchSiteIcon}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-blue-600">{site.name}</h4>
                  <p className="text-sm text-gray-600">{site.country}</p>
                  <div className="mt-2 text-xs">
                    <p>📍 {site.latitude.toFixed(2)}°, {site.longitude.toFixed(2)}°</p>
                    <p>🚀 {site.launchesPerYear} launches/year</p>
                    <p>⭐ Since {site.operationalSince}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Debris Objects */}
          {showDebris && mockDebrisData
            .filter(debris => Math.abs(debris.altitude - targetAltitude) < 200)
            .map(debris => (
            <Marker
              key={debris.id}
              position={[debris.latitude, debris.longitude]}
              icon={debrisIcon(debris.riskLevel)}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-red-600">{debris.name}</h4>
                  <div className="mt-2 text-xs space-y-1">
                    <p><span className="font-medium">Type:</span> {debris.type}</p>
                    <p><span className="font-medium">Altitude:</span> {debris.altitude}km</p>
                    <p><span className="font-medium">Size:</span> {debris.size}cm</p>
                    <p><span className="font-medium">Velocity:</span> {debris.velocity}m/s</p>
                    <p><span className="font-medium">Risk:</span> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        debris.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                        debris.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {debris.riskLevel.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Launch Trajectory */}
          {showTrajectory && trajectoryData.length > 0 && (
            <>
              <Polyline
                positions={getTrajectoryPoints()}
                color="#3B82F6"
                weight={3}
                opacity={0.8}
              />
              
              {/* Current rocket position */}
              {getCurrentPosition() && (
                <Marker
                  position={getCurrentPosition()!}
                  icon={rocketIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-semibold text-blue-600">🚀 Launch Vehicle</h4>
                      <div className="mt-2 text-xs">
                        <p>Altitude: {trajectoryData[currentStep]?.altitude.toFixed(0)}km</p>
                        <p>Velocity: {trajectoryData[currentStep]?.velocity.toFixed(0)}m/s</p>
                        <p>Flight Time: {Math.floor(trajectoryData[currentStep]?.time / 60)}:{(trajectoryData[currentStep]?.time % 60).toFixed(0).padStart(2, '0')}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Target orbit visualization */}
              <Circle
                center={[launchSite.latitude, launchSite.longitude]}
                radius={targetAltitude * 100}
                color="#8B5CF6"
                fillColor="#8B5CF6"
                fillOpacity={0.1}
                weight={2}
                dashArray="5, 5"
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* Launch Progress */}
      {showTrajectory && trajectoryData.length > 0 && (
        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Launch Progress</span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / (trajectoryData.length - 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (trajectoryData.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {trajectoryData[currentStep] && (
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Altitude</p>
                <p className="font-semibold">{trajectoryData[currentStep].altitude.toFixed(0)} km</p>
              </div>
              <div>
                <p className="text-gray-600">Velocity</p>
                <p className="font-semibold">{trajectoryData[currentStep].velocity.toFixed(0)} m/s</p>
              </div>
              <div>
                <p className="text-gray-600">Flight Time</p>
                <p className="font-semibold">
                  {Math.floor(trajectoryData[currentStep].time / 60)}:{(trajectoryData[currentStep].time % 60).toFixed(0).padStart(2, '0')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LaunchVisualization;