import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { Amenity, PropertyCategory, PropertyDetail, PropertyType, TransactionType } from '../../types/property';
import { useToast } from '../../context/ToastContext';
import {
  Building,
  Upload,
  CheckCircle2,
  Trash2,
  ArrowRight,
  MapPin,
  Layers,
  DollarSign,
} from 'lucide-react';

export const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [builtUpSqft, setBuiltUpSqft] = useState<number | ''>('');
  const [floorNumber, setFloorNumber] = useState<number | ''>('');
  const [totalFloors, setTotalFloors] = useState<number | ''>('');
  const [furnishingStatus, setFurnishingStatus] = useState('UNFURNISHED');
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      propertyService.getPropertyDetail(id),
      propertyService.getCategories(),
      propertyService.getAmenities(),
    ])
      .then(([prop, cats, ams]) => {
        setProperty(prop);
        setCategories(cats);
        setAmenities(ams);

        setTitle(prop.title);
        setDescription(prop.description);
        setTransactionType(prop.transactionType);
        setPropertyType(prop.propertyType);
        setCategoryId(prop.categoryId || '');
        setPrice(prop.price);
        setDeposit(prop.deposit || '');
        setCity(prop.city);
        setLocality(prop.locality);
        setPostalCode(prop.postalCode || '');
        setAddress(prop.address);
        setBedrooms(prop.bedrooms);
        setBathrooms(prop.bathrooms);
        setBuiltUpSqft(prop.builtUpSqft || '');
        setFloorNumber(prop.floorNumber || '');
        setTotalFloors(prop.totalFloors || '');
        setFurnishingStatus(prop.furnishingStatus || 'UNFURNISHED');
        setParkingAvailable(prop.parkingAvailable);
        setSelectedAmenityIds(prop.amenities.map((a) => a.id));
      })
      .catch((err) => error(err.message || 'Failed to load property'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(amenityId) ? prev.filter((item) => item !== amenityId) : [...prev, amenityId]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !property) return;
    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      error('File size exceeds 10MB limit.');
      return;
    }

    try {
      const uploaded = await propertyService.uploadImage(property.id, file);
      setProperty({
        ...property,
        images: [...property.images, uploaded],
      });
      success('Image uploaded successfully');
    } catch (err: any) {
      error(err.message || 'Image upload failed');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!property) return;
    try {
      await propertyService.deleteImage(property.id, imageId);
      setProperty({
        ...property,
        images: property.images.filter((img) => img.id !== imageId),
      });
      success('Image removed');
    } catch (err: any) {
      error(err.message || 'Failed to delete image');
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    if (!property) return;
    try {
      await propertyService.setPrimaryImage(property.id, imageId);
      setProperty({
        ...property,
        images: property.images.map((img) => ({
          ...img,
          primary: img.id === imageId,
        })),
      });
      success('Primary photo updated');
    } catch (err: any) {
      error(err.message || 'Failed to set primary image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !price || Number(price) <= 0) {
      error('Price must be greater than zero.');
      return;
    }

    setSubmitting(true);
    try {
      await propertyService.updateProperty(property.id, {
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
        amenityIds: selectedAmenityIds,
      });

      success('Property updated successfully!');
      navigate('/dashboard/properties');
    } catch (err: any) {
      error(err.message || 'Failed to update property');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400 font-bold">Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Edit Property Listing
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Update specifications, price terms, or add new property photos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center">
            <Building className="w-5 h-5 mr-2 text-primary-600" />
            General Information
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transaction Type</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              >
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price ($) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold"
            ></textarea>
          </div>
        </div>

        {/* Existing Photos and Uploader */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-primary-600" />
            Manage Photos
          </h2>

          {property && property.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.images.map((img) => (
                <div
                  key={img.id}
                  className={`relative rounded-2xl overflow-hidden border-2 aspect-4/3 group ${
                    img.primary ? 'border-primary-600 ring-2 ring-primary-500/25' : 'border-slate-200'
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    {!img.primary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id)}
                        className="px-2 py-1 bg-white text-[10px] font-bold text-slate-900 rounded-lg shadow-xs"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="p-1.5 bg-rose-600 text-white rounded-lg shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {img.primary && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-md">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <input
              type="file"
              id="newImageUpload"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="newImageUpload"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Additional Photo</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/properties')}
            className="px-6 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all"
          >
            {submitting ? 'Saving Changes...' : 'Save & Update'}
          </button>
        </div>
      </form>
    </div>
  );
};
