import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Project } from '../constants';

interface ProjectMapProps {
  onSelectProject: (project: Project) => void;
  selectedProjectId?: string;
  filteredProjects?: Project[];
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 12.8797,
  lng: 121.7740
};

const PH_BOUNDS = {
  north: 21.1,
  south: 4.5,
  west: 116.9,
  east: 126.6,
};

export const ProjectMap: React.FC<ProjectMapProps> = ({ onSelectProject, selectedProjectId, filteredProjects = [] }) => {
  const rawApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || (typeof process !== 'undefined' ? process.env.VITE_GOOGLE_MAPS_API_KEY : undefined);
  // Strip quotes if the user accidentally included them in the Settings menu
  const apiKey = rawApiKey?.replace(/^["']|["']$/g, '');
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || ""
  });

  React.useEffect(() => {
    console.log("Google Maps API Key detected:", apiKey ? "YES (starts with " + apiKey.substring(0, 5) + "...)" : "NO");
    if (!apiKey) {
      console.warn("Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to the Settings menu.");
    }
    if (loadError) {
      console.error("Google Maps load error:", loadError);
    }
  }, [apiKey, loadError]);

  const [hoveredProject, setHoveredProject] = React.useState<Project | null>(null);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const allProjects = useMemo(() => {
    console.log("ProjectMap: Rendering projects:", filteredProjects.length);
    return filteredProjects;
  }, [filteredProjects]);

  // Center map on selected project
  React.useEffect(() => {
    if (map && selectedProjectId) {
      const selectedProject = allProjects.find(p => p.id === selectedProjectId);
      if (selectedProject) {
        let lat: number | null = null;
        let lng: number | null = null;
        
        if (selectedProject.coordinates && Array.isArray(selectedProject.coordinates) && selectedProject.coordinates.length >= 2) {
          lat = Number(selectedProject.coordinates[1]);
          lng = Number(selectedProject.coordinates[0]);
        } else if ((selectedProject as any).latitude !== undefined && (selectedProject as any).longitude !== undefined) {
          lat = Number((selectedProject as any).latitude);
          lng = Number((selectedProject as any).longitude);
        }

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
          console.log(`Panning map to project ${selectedProjectId} at ${lat}, ${lng}`);
          map.panTo({ lat, lng });
          map.setZoom(12); // Slightly deeper zoom for specific project
        }
      }
    }
  }, [map, selectedProjectId, allProjects]);

  const onLoad = React.useCallback(function callback(m: google.maps.Map) {
    setMap(m);
  }, []);

  const onUnmount = React.useCallback(function callback(m: google.maps.Map) {
    setMap(null);
  }, []);

  if (!apiKey) {
    return (
      <div className="w-full aspect-[3/4] bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200 p-8 text-center">
        <div className="text-amber-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <h3 className="text-slate-900 font-bold mb-2">Google Maps API Key Missing</h3>
        <p className="text-slate-500 text-sm">
          Please add your Google Maps API key to the environment variables as <code className="bg-slate-200 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> in the Settings menu.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full aspect-[3/4] bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200 p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <h3 className="text-slate-900 font-bold mb-2">Map Load Error</h3>
        <p className="text-slate-500 text-sm">
          There was an error loading the Google Maps script. Please check your API key and network connection.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full aspect-[3/4] bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
        <div className="text-slate-400 font-bold animate-pulse">Loading Map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          restriction: {
            latLngBounds: PH_BOUNDS,
            strictBounds: false,
          },
          styles: [
            {
              "featureType": "administrative",
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#444444" }]
            },
            {
              "featureType": "landscape",
              "elementType": "all",
              "stylers": [{ "color": "#f2f2f2" }]
            },
            {
              "featureType": "poi",
              "elementType": "all",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "road",
              "elementType": "all",
              "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
            },
            {
              "featureType": "road.highway",
              "elementType": "all",
              "stylers": [{ "visibility": "simplified" }]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.icon",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "transit",
              "elementType": "all",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "water",
              "elementType": "all",
              "stylers": [{ "color": "#e2e8f0" }, { "visibility": "on" }]
            }
          ]
        }}
      >
        {allProjects.map((project) => {
          let lat: number | null = null;
          let lng: number | null = null;
          
          if (project.coordinates && Array.isArray(project.coordinates) && project.coordinates.length >= 2) {
            lat = Number(project.coordinates[1]);
            lng = Number(project.coordinates[0]);
          } else if ((project as any).latitude !== undefined && (project as any).longitude !== undefined) {
            lat = Number((project as any).latitude);
            lng = Number((project as any).longitude);
          }
          
          if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
            console.warn(`Project ${project.id} has invalid coordinates:`, project.coordinates, (project as any).latitude, (project as any).longitude);
            return null;
          }

          return (
            <Marker
              key={project.id}
              position={{ lat, lng }}
              onClick={() => onSelectProject(project)}
              onMouseOver={() => setHoveredProject(project)}
              onMouseOut={() => setHoveredProject(null)}
              icon={{
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                fillColor: project.status === 'completed' ? '#10b981' : (project.status === 'ongoing' ? '#3b82f6' : '#f59e0b'),
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: project.id === selectedProjectId ? 10 : 7,
              }}
            />
          );
        })}

        {hoveredProject && (
          (() => {
            let lat: number | null = null;
            let lng: number | null = null;
            
            if (hoveredProject.coordinates && Array.isArray(hoveredProject.coordinates) && hoveredProject.coordinates.length >= 2) {
              lat = Number(hoveredProject.coordinates[1]);
              lng = Number(hoveredProject.coordinates[0]);
            } else if ((hoveredProject as any).latitude !== undefined && (hoveredProject as any).longitude !== undefined) {
              lat = Number((hoveredProject as any).latitude);
              lng = Number((hoveredProject as any).longitude);
            }

            if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) return null;

            return (
              <InfoWindow
                position={{ lat, lng }}
                options={{ pixelOffset: window.google ? new google.maps.Size(0, -10) : undefined }}
              >
                <div className="p-2 max-w-[200px]">
                  <h4 className="font-bold text-slate-900 text-sm">{hoveredProject.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{hoveredProject.location}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      hoveredProject.status === 'completed' ? 'bg-emerald-500' : 
                      (hoveredProject.status === 'ongoing' ? 'bg-blue-500' : 'bg-amber-500')
                    }`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {hoveredProject.status}
                    </span>
                  </div>
                </div>
              </InfoWindow>
            );
          })()
        )}
      </GoogleMap>

      <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-lg text-xs space-y-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <span>Ongoing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span>Proposed</span>
        </div>
      </div>
    </div>
  );
};
