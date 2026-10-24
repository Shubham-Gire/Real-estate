import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { Amenity, PropertyCategory, PropertyType, TransactionType } from '../../types/property';
import { useToast } from '../../context/ToastContext';
import {
  Building,
  Upload,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Sparkles,
  MapPin,
  Layers,
  DollarSign,
} from 'lucide-react';

export const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>('SALE');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [deposit, setDeposit] = useState<number | ''>('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [builtUpSqft, setBuiltUpSqft] = useState<number | ''>('');
  const [floorNumber, setFloorNumber] = useState<number | ''>('');
  const [totalFloors, setTotalFloors] = useState<number | ''>('');
  const [furnishingStatus, setFurnishingStatus] = useState('UNFURNISHED');
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState('');
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);

  // Selected Files for Upload
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string; isPrimary: boolean }[]>([]);

  useEffect(() => {
    Promise.all([propertyService.getCategories(), propertyService.getAmenities()])
      .then(([cats, ams]) => {
        setCategories(cats);
        setAmenities(ams);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch((err) => console.error('Failed to load categories/amenities', err));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const validFiles: { file: File; preview: string; isPrimary: boolean }[] = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        error(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        isPrimary: selectedFiles.length === 0 && validFiles.length === 0,
      });
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((f) => f.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const setPrimary = (index: number) => {
    setSelectedFiles((prev) =>
      prev.map((f, i) => ({ ...f, isPrimary: i === index }))
    );
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      error('Price must be greater than zero.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create property record
      const created = await propertyService.createProperty({
        title: title.trim(),
        description: description.trim(),
        transactionType,
        propertyType,
        categoryId: categoryId || undefined,
        price: Number(price),
        deposit: deposit ? Number(deposit) : undefined,
        city: city.trim(),
        locality: locality.trim(),
        postalCode: postalCode.trim() || undefined,
        address: address.trim(),
        bedrooms,
        bathrooms,
        builtUpSqft: builtUpSqft ? Number(builtUpSqft) : undefined,
        floorNumber: floorNumber ? Number(floorNumber) : undefined,
        totalFloors: totalFloors ? Number(totalFloors) : undefined,
        furnishingStatus,
        parkingAvailable,
        availabilityDate: availabilityDate || undefined,
        amenityIds: selectedAmenityIds,
      });

      // 2. Upload images if selected
      if (selectedFiles.length > 0) {
        for (const f of selectedFiles) {
          try {
            await propertyService.uploadImage(created.id, f.file, f.isPrimary);
          } catch (uploadErr) {
            console.error('Image upload failed', uploadErr);
          }
        }
      }

      success('Property created successfully! It is now under administrative review.');
      navigate('/dashboard/properties');
    } catch (err: any) {
      error(err.message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          List a New Property
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete the details below. All submissions are moderated before going live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Particulars */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center">
            <Building className="w-5 h-5 mr-2 text-primary-600" />
            Basic Property Information
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Property Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern High-Rise Penthouse with Skyline Terrace"
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Transaction Type *
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-hidden"
              >
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Property Type *
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-hidden"
              >
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House / Townhome</option>
                <option value="VILLA">Villa</option>
                <option value="OFFICE">Office</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="PLOT">Plot</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {transactionType === 'SALE' ? 'Asking Price ($) *' : 'Monthly Rent ($) *'}
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 850000"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-hidden"
                />
              </div>
            </div>

            {transactionType === 'RENT' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Security Deposit ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 5000"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the architectural highlights, interior finishes, sunlight, view, and neighborhood..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary-600" />
            Location & Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. San Francisco"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Neighborhood *</label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Pacific Heights"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="94115"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 2480 Washington Street, Suite 4B"
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
            />
          </div>
        </div>

        {/* Section 3: Physical Specifications */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-primary-600" />
            Specifications & Amenities
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Area (sqft)</label>
              <input
                type="number"
                min="0"
                value={builtUpSqft}
                onChange={(e) => setBuiltUpSqft(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 2100"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Furnishing</label>
              <select
                value={furnishingStatus}
                onChange={(e) => setFurnishingStatus(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-hidden"
              >
                <option value="UNFURNISHED">Unfurnished</option>
                <option value="SEMI_FURNISHED">Semi Furnished</option>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Floor Number</label>
              <input
                type="number"
                value={floorNumber}
                onChange={(e) => setFloorNumber(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 4"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Floors in Building</label>
              <input
                type="number"
                value={totalFloors}
                onChange={(e) => setTotalFloors(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 12"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <input
                type="checkbox"
                id="parkingAvailable"
                checked={parkingAvailable}
                onChange={(e) => setParkingAvailable(e.target.checked)}
                className="w-5 h-5 rounded-lg text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="parkingAvailable" className="text-xs font-bold text-slate-800">
                Dedicated Parking Available
              </label>
            </div>
          </div>

          {/* Amenities Multi-Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Included Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {amenities.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                    selectedAmenityIds.includes(amenity.id)
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{amenity.name}</span>
                  {selectedAmenityIds.includes(amenity.id) && (
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Image Upload Dropzone */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-primary-600" />
            Property Photos & Media
          </h2>

          <div className="border-2 border-dashed border-slate-200 hover:border-primary-400 rounded-3xl p-8 text-center transition-colors bg-slate-50/50">
            <input
              type="file"
              id="fileUpload"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-white text-primary-600 flex items-center justify-center shadow-xs mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800">
                Click to browse property photos
              </span>
              <span className="text-xs text-slate-400 mt-1">
                JPEG, PNG or WebP images up to 10MB each
              </span>
            </label>
          </div>

          {/* Selected Previews */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {selectedFiles.map((fileObj, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl overflow-hidden border-2 aspect-4/3 group ${
                    fileObj.isPrimary ? 'border-primary-600 ring-2 ring-primary-500/25' : 'border-slate-200'
                  }`}
                >
                  <img src={fileObj.preview} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    {!fileObj.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimary(idx)}
                        className="px-2 py-1 bg-white text-[10px] font-bold text-slate-900 rounded-lg shadow-xs"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1.5 bg-rose-600 text-white rounded-lg shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {fileObj.isPrimary && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-md">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/properties')}
            className="px-6 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-primary-500/25 transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center space-x-2"
          >
            <span>{submitting ? 'Submitting Property...' : 'Submit for Moderation'}</span>
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};
