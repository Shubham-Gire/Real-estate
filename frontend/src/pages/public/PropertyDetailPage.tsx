import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { favoriteService } from '../../services/favoriteService';
import { inquiryService } from '../../services/inquiryService';
import { crmService } from '../../services/crmService';
import { PropertyDetail, PropertySummary } from '../../types/property';
import { PropertyCard } from '../../components/common/PropertyCard';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  Phone,
  Mail,
  ShieldAlert,
  Send,
  CheckCircle2,
  Building,
  User as UserIcon,
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [similarProperties, setSimilarProperties] = useState<PropertySummary[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // Inquiry Form Modal
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState(user?.firstName ? `${user.firstName} ${user.lastName}` : '');
  const [inquiryEmail, setInquiryEmail] = useState(user?.email || '');
  const [inquiryPhone, setInquiryPhone] = useState(user?.phone || '');
  const [inquiryMessage, setInquiryMessage] = useState(
    'Hi, I am interested in this listing. Please contact me regarding private viewings and additional details.'
  );
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Private Tour Modal
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [tourDate, setTourDate] = useState('');
  const [tourType, setTourType] = useState<'IN_PERSON' | 'VIRTUAL_TOUR'>('IN_PERSON');
  const [tourNotes, setTourNotes] = useState('');
  const [submittingTour, setSubmittingTour] = useState(false);

  // Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inaccurate Information');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const data = await propertyService.getPropertyDetail(id);
        setProperty(data);

        // Check if favorited
        if (user) {
          const favIds = await favoriteService.getFavoriteIds();
          setIsFavorited(favIds.includes(data.id));
        }

        // Fetch similar properties
        const recent = await propertyService.getRecent();
        setSimilarProperties(recent.filter((p) => p.id !== data.id).slice(0, 3));
      } catch (err: any) {
        error(err.message || 'Property not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!property) return;

    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(property.id);
        setIsFavorited(false);
        success('Removed from saved properties');
      } else {
        await favoriteService.addFavorite(property.id);
        setIsFavorited(true);
        success('Saved to your favorites');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update favorite');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    info('Property link copied to clipboard!');
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setSubmittingInquiry(true);
    try {
      await inquiryService.createInquiry({
        propertyId: property.id,
        name: inquiryName.trim(),
        email: inquiryEmail.trim(),
        phone: inquiryPhone.trim(),
        message: inquiryMessage.trim(),
      });
      success('Your inquiry was delivered directly to the property agent!');
      setInquiryModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to submit inquiry');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !tourDate) return;

    setSubmittingTour(true);
    try {
      await crmService.requestShowing({
        propertyId: property.id,
        clientName: inquiryName.trim() || 'Interested Buyer',
        clientEmail: inquiryEmail.trim() || 'buyer@example.com',
        clientPhone: inquiryPhone.trim() || undefined,
        showingTime: new Date(tourDate).toISOString(),
        showingType: tourType,
        notes: tourNotes.trim() || undefined,
      });
      success('Walkthrough appointment requested! The agent will confirm shortly.');
      setTourModalOpen(false);
      setTourNotes('');
    } catch (err: any) {
      error(err.message || 'Failed to request tour');
    } finally {
      setSubmittingTour(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    if (!user) {
      navigate('/login');
      return;
    }

    setSubmittingReport(true);
    try {
      await inquiryService.submitReport(property.id, reportReason, reportDescription);
      success('Report submitted for administrative review. Thank you for keeping our marketplace clean.');
      setReportModalOpen(false);
      setReportDescription('');
    } catch (err: any) {
      error(err.message || 'Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading property particulars...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-slate-800">Property Listing Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          This property may have been removed, archived, or is awaiting moderation approval.
        </p>
        <Link
          to="/properties"
          className="bg-primary-600 text-white font-bold px-6 py-3 rounded-2xl shadow-sm hover:bg-primary-700"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const images = property.images.length > 0
    ? property.images
    : [
        {
          id: 'placeholder',
          imageUrl:
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          displayOrder: 1,
          primary: true,
        },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                property.transactionType === 'SALE' ? 'bg-slate-900 text-white' : 'bg-primary-600 text-white'
              }`}
            >
              For {property.transactionType === 'SALE' ? 'Sale' : 'Rent'}
            </span>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
              {property.categoryName || property.propertyType}
            </span>
            <StatusBadge status={property.status} />
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <p className="flex items-center text-sm text-slate-500 mt-2">
            <MapPin className="w-4 h-4 mr-1 text-slate-400 flex-shrink-0" />
            <span>
              {property.address}, {property.locality}, {property.city} {property.postalCode}
            </span>
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-left sm:text-right">
            <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Asking Price</p>
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              {formatPrice(property.price)}
              {property.transactionType === 'RENT' && (
                <span className="text-sm font-normal text-slate-500"> /month</span>
              )}
            </div>
            {property.deposit && property.deposit > 0 && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Security Deposit: {formatPrice(property.deposit)}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleFavoriteToggle}
              className={`p-3 rounded-2xl border transition-all ${
                isFavorited
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Save favorite"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setInquiryModalOpen(true)}
              className="flex-1 sm:flex-initial px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-primary-500/25 transition-all"
            >
              Inquire Now
            </button>
          </div>
        </div>
      </div>

      {/* 2. Photo Gallery Showcase */}
      <section className="space-y-4">
        {/* Main Displayed Image */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-3xl overflow-hidden bg-slate-900 shadow-xl">
          <img
            src={images[selectedImageIndex]?.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-white">
            Photo {selectedImageIndex + 1} of {images.length}
          </div>
        </div>

        {/* Thumbnail Selector Carousel */}
        {images.length > 1 && (
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImageIndex === idx
                    ? 'border-primary-600 ring-2 ring-primary-500/30 scale-95'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 3. Specs & Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details, Description, Amenities */}
        <div className="lg:col-span-2 space-y-10">
          {/* Quick Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Bedrooms</p>
                <p className="text-base font-black text-slate-900">{property.bedrooms} Beds</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Bathrooms</p>
                <p className="text-base font-black text-slate-900">{property.bathrooms} Baths</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Living Area</p>
                <p className="text-base font-black text-slate-900">
                  {property.builtUpSqft ? `${property.builtUpSqft} sqft` : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Floor</p>
                <p className="text-base font-black text-slate-900">
                  {property.floorNumber ? `${property.floorNumber} of ${property.totalFloors || 'N/A'}` : 'Ground'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About This Property</h2>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </div>

          {/* Key Facts & Features Table */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Property Details & Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Property Category</span>
                <span className="font-bold text-slate-800">{property.categoryName || 'Residential'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Property Type</span>
                <span className="font-bold text-slate-800">{property.propertyType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Furnishing</span>
                <span className="font-bold text-slate-800">{property.furnishingStatus || 'Unfurnished'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Parking</span>
                <span className="font-bold text-slate-800">{property.parkingAvailable ? 'Yes (Reserved)' : 'Street'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Availability</span>
                <span className="font-bold text-slate-800">
                  {property.availabilityDate ? property.availabilityDate : 'Immediate'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Listing ID</span>
                <span className="font-mono text-xs font-bold text-slate-500">{property.id.substring(0, 8)}</span>
              </div>
            </div>
          </div>

          {/* Amenities & Features */}
          {property.amenities.length > 0 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Amenities & Conveniences</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center space-x-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Owner/Agent Card & Action Sidebar */}
        <div className="space-y-6">
          {/* Agent / Owner Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-5 sticky top-28">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Listing Representative
            </h3>

            <div className="flex items-center space-x-4">
              {property.ownerAvatar ? (
                <img
                  src={property.ownerAvatar}
                  alt={property.ownerName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-500/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                  <UserIcon className="w-8 h-8" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{property.ownerName}</h4>
                <p className="text-xs font-semibold text-primary-600">
                  {property.ownerAgency || (property.ownerRole === 'ROLE_AGENT' ? 'Certified Agent' : 'Property Owner')}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                  Verified Contact
                </span>
              </div>
            </div>

            {property.ownerPhone && (
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center space-x-3 text-xs font-bold text-slate-800">
                <Phone className="w-4 h-4 text-primary-600" />
                <span>{property.ownerPhone}</span>
              </div>
            )}

            {property.ownerEmail && (
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center space-x-3 text-xs font-bold text-slate-800 truncate">
                <Mail className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <span className="truncate">{property.ownerEmail}</span>
              </div>
            )}

            <button
              onClick={() => setTourModalOpen(true)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Private Walkthrough</span>
            </button>

            <button
              onClick={() => setInquiryModalOpen(true)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Direct Inquiry</span>
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report Inaccurate Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Similar Properties Recommendation */}
      {similarProperties.length > 0 && (
        <section className="pt-10 border-t border-slate-100">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Similar Properties You May Like</h2>
            <p className="text-xs text-slate-500">Other fine properties available in similar prime areas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </section>
      )}

      {/* Contact Inquiry Modal */}
      <Modal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        title={`Contact Agent for "${property.title}"`}
      >
        <form onSubmit={handleInquirySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={inquiryName}
              onChange={(e) => setInquiryName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Email</label>
              <input
                type="email"
                required
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Phone (Optional)</label>
              <input
                type="tel"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                placeholder="+1 555-0192"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message or Tour Request</label>
            <textarea
              required
              rows={4}
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setInquiryModalOpen(false)}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingInquiry}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 disabled:opacity-50"
            >
              {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Book Private Tour Modal */}
      <Modal
        isOpen={tourModalOpen}
        onClose={() => setTourModalOpen(false)}
        title="Schedule Private Walkthrough / Tour"
      >
        <form onSubmit={handleTourSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Book an exclusive viewing for <strong>{property.title}</strong> directly with the assigned listing broker.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                placeholder="eleanor@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tour Format</label>
              <select
                value={tourType}
                onChange={(e) => setTourType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="IN_PERSON">In-Person Walkthrough</option>
                <option value="VIRTUAL_TOUR">Live Interactive Video Tour</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Notes / Requests</label>
            <textarea
              rows={2}
              value={tourNotes}
              onChange={(e) => setTourNotes(e.target.value)}
              placeholder="e.g. Sunset viewing requested, bring building bylaw docs..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setTourModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingTour}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {submittingTour ? 'Scheduling...' : 'Confirm Tour Request'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Suspicious or Inaccurate Listing"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Report</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
            >
              <option value="Inaccurate Information">Inaccurate Information or Specs</option>
              <option value="Fraudulent or Duplicate">Fraudulent or Duplicate Listing</option>
              <option value="Unavailable / Already Sold">Unavailable or Already Sold</option>
              <option value="Inappropriate Content">Inappropriate Media or Description</option>
              <option value="Other">Other Violation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Provide Detailed Explanation</label>
            <textarea
              required
              rows={4}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Please describe why this listing violates marketplace standards..."
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReport}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 disabled:opacity-50"
            >
              {submittingReport ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
