import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Camera as CameraIcon, MapPin, AlertCircle, Map as MapIcon, Loader } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../store/hooks';
import { createReportThunk } from '../store/slices/reportSlice';
import { reportSchema } from '../utils/validators';
import { ENV } from '../config/env';
import { useTheme } from '../hooks/useTheme';
import { pageVariants } from '../utils/animations';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

type ReportFormValues = z.infer<typeof reportSchema>;

// Map click handler component
const LocationPicker = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const customIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EF4444" width="32" height="32"><path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 4.5 12 4.5 15.5 6.07 15.5 8 13.93 11.5 12 11.5z"/></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const locationData: Record<string, Record<string, { lat: number; lng: number }>> = {
  "Maharashtra": {
    "Mumbai": { lat: 19.0760, lng: 72.8777 },
    "Pune": { lat: 18.5204, lng: 73.8567 },
  },
  "Delhi": {
    "New Delhi": { lat: 28.6139, lng: 77.2090 },
  },
  "Karnataka": {
    "Bengaluru": { lat: 12.9716, lng: 77.5946 },
  },
  "Telangana": {
    "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  },
  "Tamil Nadu": {
    "Chennai": { lat: 13.0827, lng: 80.2707 },
  },
  "West Bengal": {
    "Kolkata": { lat: 22.5726, lng: 88.3639 },
  },
  "Gujarat": {
    "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  }
};

const MapRefocuser = ({ lat, lng }: { lat: number | null, lng: number | null }) => {
  const map = useMapEvents({});
  React.useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 12);
  }, [lat, lng, map]);
  return null;
};

export const ReportIssue = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      severity: undefined as any,
      state: '',
      city: '',
      area: '',
    }
  });

  const lat = watch('lat');
  const lng = watch('lng');
  const selectedState = watch('state');
  const selectedCity = watch('city');

  // Handle city change to update map coordinates
  React.useEffect(() => {
    if (selectedState && selectedCity && locationData[selectedState]?.[selectedCity]) {
      const coords = locationData[selectedState][selectedCity];
      setValue('lat', coords.lat, { shouldValidate: true });
      setValue('lng', coords.lng, { shouldValidate: true });
    }
  }, [selectedState, selectedCity, setValue]);

  const availableCities = selectedState ? Object.keys(locationData[selectedState]) : [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const takeNativePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        width: 800
      });
      
      const base64String = `data:image/jpeg;base64,${image.base64String}`;
      setImagePreview(base64String);
      
      // Convert to File object to seamlessly integrate with our existing compression/upload flow
      const res = await fetch(base64String);
      const blob = await res.blob();
      const file = new File([blob], "mobile_upload.jpg", { type: "image/jpeg" });
      setValue('image', file, { shouldValidate: true });
      
    } catch (error) {
      console.log('Camera error or user cancelled', error);
    }
  };

  const handleLocationSelect = (selectedLat: number, selectedLng: number) => {
    setValue('lat', selectedLat, { shouldValidate: true });
    setValue('lng', selectedLng, { shouldValidate: true });
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleLocationSelect(position.coords.latitude, position.coords.longitude);
          toast.success('Location updated');
        },
        (error) => {
          console.error(error);
          toast.error('Location access denied. Enter coordinates manually or click on map.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const onSubmit = async (data: ReportFormValues) => {
    try {
      await toast.promise(
        dispatch(createReportThunk(data as any)).unwrap(),
        {
          loading: 'Submitting your report...',
          success: 'Report submitted! Thank you.',
          error: 'Failed to submit. Please try again.',
        }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      // Toast already handled by promise
    }
  };

  const tileUrl = isDark ? ENV.MAP_TILE_URL : ENV.MAP_TILE_URL_LIGHT;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-4xl mx-auto space-y-6 pb-10"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Report an Issue</h1>
        <p className="text-text-secondary">Help us fix the city by providing details about the road damage.</p>
      </div>

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">Issue Details</h3>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">Issue Title</label>
                <input
                  id="title"
                  {...register('title')}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder:text-text-muted"
                  placeholder="e.g., Deep pothole on SV Road"
                  aria-invalid={!!errors.title}
                />
                {errors.title && <p className="text-sm text-danger mt-1 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder:text-text-muted custom-scrollbar"
                  placeholder="Describe the exact location, size of the damage, and any potential hazards..."
                  aria-invalid={!!errors.description}
                />
                {errors.description && <p className="text-sm text-danger mt-1 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-text-primary mb-1">Severity Level</label>
                  <select
                    id="severity"
                    {...register('severity')}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none"
                    aria-invalid={!!errors.severity}
                  >
                    <option value="" disabled>Select severity</option>
                    <option value="critical">Critical (Immediate danger)</option>
                    <option value="moderate">Moderate (Needs repair soon)</option>
                    <option value="low">Low (Minor damage)</option>
                  </select>
                  {errors.severity && <p className="text-sm text-danger mt-1 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.severity.message}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-text-primary mb-1">State</label>
                  <select
                    id="state"
                    {...register('state')}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none"
                    aria-invalid={!!errors.state}
                  >
                    <option value="" disabled>Select state</option>
                    {Object.keys(locationData).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-sm text-danger mt-1 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.state.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-text-primary mb-1">City</label>
                  <select
                    id="city"
                    {...register('city')}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none"
                    aria-invalid={!!errors.city}
                    disabled={!selectedState}
                  >
                    <option value="" disabled>Select city</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-sm text-danger mt-1 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.city.message}</p>}
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-text-primary mb-1">Area / Locality (Optional)</label>
                  <input
                    id="area"
                    {...register('area')}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder:text-text-muted"
                    placeholder="e.g., Andheri West"
                    aria-invalid={!!errors.area}
                  />
                  {errors.area && <p className="text-sm text-danger mt-1 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.area.message}</p>}
                </div>
              </div>
            </div>

            {/* Location Picker */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-border pb-2">
                <h3 className="text-lg font-semibold text-text-primary">Location</h3>
                <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation} leftIcon={<MapPin size={16} />}>
                  Use My Location
                </Button>
              </div>
              
              <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border z-0">
                <MapContainer
                  center={[ENV.MAP_DEFAULT_LAT, ENV.MAP_DEFAULT_LNG]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer url={tileUrl} />
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                  <MapRefocuser lat={lat} lng={lng} />
                  {lat && lng && (
                    <Marker position={[lat, lng]} icon={customIcon} />
                  )}
                </MapContainer>
              </div>
              <p className="text-sm text-text-muted">Click on the map to pinpoint the exact location.</p>
              {(errors.lat || errors.lng) && (
                <p className="text-sm text-danger mt-1 flex items-center"><AlertCircle size={14} className="mr-1" />{errors.lat?.message || errors.lng?.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">Photo Evidence</h3>
              
              <div className="flex items-center justify-center w-full">
                {Capacitor.isNativePlatform() ? (
                  <div 
                    onClick={takeNativePicture}
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer hover:bg-elevated/50 transition-colors ${imagePreview ? 'border-primary' : 'border-border'}`}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full p-2">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                          <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">Click to retake</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                          <CameraIcon size={24} />
                        </div>
                        <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold text-primary">Tap to take photo</span> or choose from gallery</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <label htmlFor="image-upload" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer hover:bg-elevated/50 transition-colors ${imagePreview ? 'border-primary' : 'border-border'}`}>
                    {imagePreview ? (
                      <div className="relative w-full h-full p-2">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                          <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">Click to change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                          <CameraIcon size={24} />
                        </div>
                        <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-text-muted">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                    )}
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 flex justify-end space-x-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<AlertCircle size={18} />}>
                Submit Report
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ReportIssue;
