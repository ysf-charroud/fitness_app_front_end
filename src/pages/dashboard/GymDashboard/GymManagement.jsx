// src/pages/dashboard/GymManagement.jsx
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
// --- ADDED FOR LIGHTBOX ---
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle, // ✅ Import DialogTitle
  DialogDescription, // ✅ Import DialogDescription
  DialogFooter, // ✅ Import DialogFooter
} from '@/components/ui/dialog';
// --- END ADDED ---
// --- ADDED FOR EQUIPMENT MULTISELECT ---
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
// --- END ADDED ---
import { Edit2, Trash2, Save, X, Check, ChevronLeft, ChevronRight, Plus, Search, Filter, X as LucideX, ChevronDown } from 'lucide-react'; // ✅ Correctly import ChevronDown
import { toast } from 'sonner';
import { EQUIPMENT_CATALOG } from '@/constants/equipmentCatalog'; // Import the catalog

const TEST_OWNER_ID = '68fb4bc7ceef7f0d5a7c26b1';

export default function GymManagement({ gym, onGymUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(!gym);

  // State for form data
  const [formData, setFormData] = useState({
    name: gym?.name || '',
    location: gym?.location || '',
    schedule: gym?.schedule || '',
    pricing: gym?.pricing || 0,
    activities: gym?.activities?.join(', ') || '',
    // Change: equipements is now an array of objects
    equipements: gym?.equipements || [], // Use the new array format
  });

  // State for managing photos
  const [existingPhotos, setExistingPhotos] = useState(gym?.photos || []);
  const [newlySelectedPhotos, setNewlySelectedPhotos] = useState([]); // Stores File objects
  const [photosToRemove, setPhotosToRemove] = useState([]); // Stores URLs of existing photos to remove

  // --- ADDED FOR EQUIPMENT MULTISELECT ---
  const [openEquipmentSelector, setOpenEquipmentSelector] = useState(false); // ✅ State for Popover open state
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [equipmentFilterType, setEquipmentFilterType] = useState('All'); // Default filter
  const [customEquipmentModalOpen, setCustomEquipmentModalOpen] = useState(false); // State for custom equipment dialog
  const [newCustomEquipment, setNewCustomEquipment] = useState({ title: '', picture: '', details: '', type: '' });

  // Get unique types for filter dropdown
  const equipmentTypes = ['All', ...new Set(EQUIPMENT_CATALOG.map(item => item.type).filter(Boolean))];

  // Filter equipment based on search term and type
  const filteredCatalog = EQUIPMENT_CATALOG.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(equipmentSearchTerm.toLowerCase());
    const matchesType = equipmentFilterType === 'All' || item.type === equipmentFilterType;
    return matchesSearch && matchesType;
  });

  // Check if an item is already selected
  const isSelected = (item) => formData.equipements.some(eq => eq.title === item.title);

  const toggleEquipmentSelection = (item) => {
    setFormData(prev => {
      const existingIndex = prev.equipements.findIndex(eq => eq.title === item.title);
      if (existingIndex >= 0) {
        // Remove if already selected
        return {
          ...prev,
          equipements: prev.equipements.filter((_, index) => index !== existingIndex)
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          equipements: [...prev.equipements, item]
        };
      }
    });
  };

  const removeEquipmentFromForm = (titleToRemove) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.filter(eq => eq.title !== titleToRemove)
    }));
  };

  const addCustomEquipment = () => {
    if (newCustomEquipment.title && newCustomEquipment.picture) {
      const customEquipment = {
        title: newCustomEquipment.title,
        picture: newCustomEquipment.picture,
        details: newCustomEquipment.details,
        type: newCustomEquipment.type
      };
      setFormData(prev => ({
        ...prev,
        equipements: [...prev.equipements, customEquipment]
      }));
      setNewCustomEquipment({ title: '', picture: '', details: '', type: '' });
      setCustomEquipmentModalOpen(false); // Close the modal after adding
    } else {
      alert("Please fill in the title and picture for the custom equipment.");
    }
  };

  // --- END ADDED ---

  // --- ADDED FOR LIGHTBOX ---
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // --- END ADDED ---

  // Sync form data and existing photos when gym changes
  useEffect(() => {
    if (gym) {
      setFormData({
        name: gym.name || '',
        location: gym.location || '',
        schedule: gym.schedule || '',
        pricing: gym.pricing || 0,
        activities: gym.activities?.join(', ') || '',
        equipements: gym.equipements || [], // Use the new array format
      });
      setExistingPhotos(gym.photos || []);
    } else {
      setFormData({
        name: '',
        location: '',
        schedule: '',
        pricing: 0,
        activities: '',
        equipements: [], // Initialize as empty array
      });
      setExistingPhotos([]);
    }
    // Reset new selections and removals when switching between edit/create or on cancel
    setNewlySelectedPhotos([]);
    setPhotosToRemove([]);
    // --- ADDED FOR LIGHTBOX ---
    setLightboxOpen(false); // Close lightbox when switching modes or cancelling
    // --- END ADDED ---
  }, [gym]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Add new files to the list of newly selected photos
    setNewlySelectedPhotos(prev => [...prev, ...files]);
  };

  const removeNewlySelectedPhoto = (indexToRemove) => {
    setNewlySelectedPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeExistingPhoto = (urlToRemove) => {
    setExistingPhotos(prev => prev.filter(url => url !== urlToRemove));
    setPhotosToRemove(prev => [...prev, urlToRemove]); // Mark for removal on save
  };

  // --- ADDED FOR LIGHTBOX ---
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setLightboxIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : existingPhotos.length + newlySelectedPhotos.length - 1));
  };

  const goToNext = () => {
    setLightboxIndex(prevIndex => (prevIndex < existingPhotos.length + newlySelectedPhotos.length - 1 ? prevIndex + 1 : 0));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  // Get the list of all photos (existing + newly selected) for lightbox navigation
  const allPhotos = [...existingPhotos, ...newlySelectedPhotos.map(f => URL.createObjectURL(f))];

  // --- END ADDED ---

  const handleSave = async () => {
    const formDataToSend = new FormData();

    // Append text fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('schedule', formData.schedule);
    formDataToSend.append('pricing', formData.pricing.toString());
    formDataToSend.append('activities', formData.activities);
    // --- CHANGE: Send equipment as JSON string ---
    formDataToSend.append('equipements', JSON.stringify(formData.equipements));
    // --- END CHANGE ---
    formDataToSend.append('owner', TEST_OWNER_ID);

    // --- CRITICAL PART: Send the final list of existing photos to keep ---
    // The `existingPhotos` state in the frontend should now reflect the list
    // after the user has clicked the 'X' button on photos they want to remove.
    // We send this final list to the backend.
    // It's important to send only the URLs, not the File objects from `newlySelectedPhotos`.
    // The backend will handle the new uploads from `req.files`.
    // Calculate the final list: the ones the user wants to keep from the existing list.
    // `existingPhotos` state is updated by `removeExistingPhoto` function when 'X' is clicked.
    // So, `existingPhotos` at this point should be the list of URLs to keep.
    const existingPhotosToKeep = existingPhotos.filter(url => url && typeof url === 'string');
    console.log("Sending finalPhotos to backend:", existingPhotosToKeep); // Debug log
    formDataToSend.append('finalPhotos', JSON.stringify(existingPhotosToKeep));
    // --- END CRITICAL PART ---

    // Append newly selected photos (these will be processed by Multer on the backend)
    // These will be added to the list provided by `finalPhotos`.
    newlySelectedPhotos.forEach(photo => {
      formDataToSend.append('photos', photo); // Append File object
    });

    try {
      const url = gym
        ? `http://localhost:5000/api/gyms/${gym._id}`
        : 'http://localhost:5000/api/gyms';

      const response = await fetch(url, {
        method: gym ? 'PATCH' : 'POST',
        body: formDataToSend,
        // Do NOT set Content-Type — browser handles it
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save gym');
      }

      const savedGym = await response.json();

      onGymUpdate(savedGym);

      toast.success(gym ? 'Gym updated successfully' : 'Gym created successfully');
      setIsEditing(false);
      setIsCreating(false);
      // States are reset by the useEffect triggered by the gym update
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'An error occurred while saving');
    }
  };

  const handleDelete = async () => {
    if (!gym) return;
    try {
      const response = await fetch(`http://localhost:5000/api/gyms/${gym._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete gym');
      }
      onGymUpdate(null);
      toast.success('Gym deleted successfully');
      setIsCreating(true);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete gym');
    }
  };

  const handleCancel = () => {
    // Reset form data, existing photos, and selections to original state
    if (gym) {
      setFormData({
        name: gym.name,
        location: gym.location,
        schedule: gym.schedule,
        pricing: gym.pricing,
        activities: gym.activities.join(', '),
        equipements: gym.equipements || [], // Reset to original equipment list
      });
      setExistingPhotos(gym.photos || []); // Reset to original photos
    } else {
      setFormData({
        name: '',
        location: '',
        schedule: '',
        pricing: 0,
        activities: '',
        equipements: [], // Reset to empty array
      });
      setExistingPhotos([]);
    }
    setNewlySelectedPhotos([]); // Clear new selections
    setPhotosToRemove([]); // Clear removals
    // --- ADDED FOR LIGHTBOX ---
    setLightboxOpen(false); // Close lightbox when cancelling
    // --- END ADDED ---
    setIsEditing(false);
  };

  if (isCreating || isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{gym ? 'Edit Gym' : 'Create Your Gym'}</CardTitle>
          <CardDescription>
            {gym ? 'Update your gym information' : 'Fill in the details to create your gym'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6"> {/* Increased space-y for clarity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Gym Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="FitClub Casablanca"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricing">Pricing (per month)</Label>
              <Input
                id="pricing"
                type="number"
                step="0.01"
                value={formData.pricing}
                onChange={(e) => handleInputChange('pricing', e.target.value)}
                placeholder="39.99"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="10 Rue de Ghandi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e) => handleInputChange('schedule', e.target.value)}
              placeholder="Lun-Sam: 07:00-22:00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activities">Activities (comma-separated)</Label>
            <Textarea
              id="activities"
              value={formData.activities}
              onChange={(e) => handleInputChange('activities', e.target.value)}
              placeholder="musculation, cardio, yoga"
              rows={2}
            />
          </div>

          {/* --- EQUIPMENT MANAGEMENT SECTION --- */}
          <div className="space-y-4">
            <Label>Equipment</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Select Equipment:</h4>
                {/* --- MODAL TRIGGER BUTTON --- */}
                <Dialog open={customEquipmentModalOpen} onOpenChange={setCustomEquipmentModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Custom
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* --- CORRECTED DIALOG STRUCTURE --- */}
                    <DialogTitle>Add Custom Equipment</DialogTitle>
                    <DialogDescription>
                      Enter the details for the equipment not found in the catalog.
                    </DialogDescription>
                    {/* --- END CORRECTED DIALOG STRUCTURE --- */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="custom-title">Title *</Label>
                        <Input
                          id="custom-title"
                          value={newCustomEquipment.title}
                          onChange={(e) => setNewCustomEquipment(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Smith Machine Pro"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-picture">Image URL *</Label>
                        <Input
                          id="custom-picture"
                          value={newCustomEquipment.picture}
                          onChange={(e) => setNewCustomEquipment(prev => ({ ...prev, picture: e.target.value }))}
                          placeholder="https://example.com/equipment-image.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-details">Details (optional)</Label>
                        <Textarea
                          id="custom-details"
                          value={newCustomEquipment.details}
                          onChange={(e) => setNewCustomEquipment(prev => ({ ...prev, details: e.target.value }))}
                          placeholder="Describe the equipment..."
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-type">Type/Category (optional)</Label>
                        <Input
                          id="custom-type"
                          value={newCustomEquipment.type}
                          onChange={(e) => setNewCustomEquipment(prev => ({ ...prev, type: e.target.value }))}
                          placeholder="e.g., Strength, Cardio"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCustomEquipmentModalOpen(false);
                          setNewCustomEquipment({ title: '', picture: '', details: '', type: '' }); // Reset form on close
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={addCustomEquipment} // Call the function to add the equipment
                      >
                        Add Equipment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* --- END MODAL TRIGGER BUTTON --- */}
              </div>

              {/* Multi-Select Popover */}
              <Popover open={openEquipmentSelector} onOpenChange={setOpenEquipmentSelector}> {/* ✅ Bind open state */}
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openEquipmentSelector}
                    className="w-full justify-between"
                  >
                    {formData.equipements.length > 0 ? (
                      <span>{formData.equipements.length} selected</span>
                    ) : (
                      <span>Select equipment...</span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> {/* ✅ Correctly use ChevronDown */}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <div className="flex items-center px-3">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <CommandInput
                        placeholder="Search equipment..."
                        value={equipmentSearchTerm}
                        onValueChange={setEquipmentSearchTerm}
                      />
                    </div>
                    <div className="flex items-center px-3 py-2">
                      <Filter className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <select
                        value={equipmentFilterType}
                        onChange={(e) => setEquipmentFilterType(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm"
                      >
                        {equipmentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <Separator />
                    <CommandList>
                      <CommandEmpty>No equipment found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCatalog.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              toggleEquipmentSelection(item);
                              // Optional: Keep selector open after selection
                              // setOpenEquipmentSelector(true);
                            }}
                          >
                            <Checkbox
                              checked={isSelected(item)}
                              onCheckedChange={() => toggleEquipmentSelection(item)}
                              className="mr-2"
                            />
                            <div className="flex items-center gap-2">
                              <img
                                src={item.picture}
                                alt={item.title}
                                className="w-6 h-6 object-cover rounded"
                              />
                              <span>{item.title}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected Equipment Badges */}
              {formData.equipements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.equipements.map((eq, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <img
                        src={eq.picture}
                        alt={eq.title}
                        className="w-4 h-4 object-cover rounded"
                      />
                      {eq.title}
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-4 w-4 p-0 ml-1 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeEquipmentFromForm(eq.title)}
                      >
                        <LucideX className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* --- END EQUIPMENT MANAGEMENT SECTION --- */}

          {/* Photo Management Section */}
          <div className="space-y-4">
            <Label>Photos</Label>
            {/* Input for new photos */}
            <div className="space-y-2">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              {newlySelectedPhotos.length > 0 && (
                <div className="text-sm text-slate-500">
                  {newlySelectedPhotos.length} new photo{newlySelectedPhotos.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>

            {/* Display newly selected photos with remove option */}
            {newlySelectedPhotos.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Newly Selected Photos:</h4>
                <div className="flex flex-wrap gap-2">
                  {newlySelectedPhotos.map((file, index) => (
                    <div key={index} className="relative group">
                      {/* --- LIGHTBOX WRAPPER FOR NEW PHOTOS --- */}
                      <Dialog open={lightboxOpen && lightboxIndex === existingPhotos.length + index} onOpenChange={(open) => {
                          if (!open) closeLightbox();
                      }}>
                        <DialogTrigger asChild>
                          <img
                            src={URL.createObjectURL(file)} // Create a preview URL for the File object
                            alt={`New ${index + 1}`}
                            className="w-20 h-20 object-cover rounded border cursor-pointer" // Added cursor-pointer
                            onClick={() => openLightbox(existingPhotos.length + index)} // Open lightbox for this photo
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] flex items-center justify-center p-0 border-0"> {/* Adjust max-w as needed */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2"
                            onClick={(e) => { e.stopPropagation(); goToPrevious(); }} // Prevent closing dialog
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="max-h-[80vh] max-w-full object-contain" // Ensure image fits
                            onKeyDown={handleKeyDown}
                            tabIndex={0} // Make focusable for key events
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2"
                            onClick={(e) => { e.stopPropagation(); goToNext(); }} // Prevent closing dialog
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </DialogContent>
                      </Dialog>
                      {/* --- END LIGHTBOX WRAPPER --- */}
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewlySelectedPhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display existing photos with remove option */}
            {existingPhotos.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Existing Photos (click to remove):</h4>
                <div className="flex flex-wrap gap-2">
                  {existingPhotos.map((url, index) => (
                    <div key={index} className="relative group">
                      {/* --- LIGHTBOX WRAPPER FOR EXISTING PHOTOS --- */}
                      <Dialog open={lightboxOpen && lightboxIndex === index} onOpenChange={(open) => {
                          if (!open) closeLightbox();
                      }}>
                        <DialogTrigger asChild>
                          <img
                            src={url}
                            alt={`Existing ${index + 1}`}
                            className="w-20 h-20 object-cover rounded border cursor-pointer" // Added cursor-pointer
                            onClick={() => openLightbox(index)} // Open lightbox for this photo
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] flex items-center justify-center p-0 border-0"> {/* Adjust max-w as needed */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2"
                            onClick={(e) => { e.stopPropagation(); goToPrevious(); }} // Prevent closing dialog
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                          <img
                            src={url}
                            alt={`Existing ${index + 1}`}
                            className="max-h-[80vh] max-w-full object-contain" // Ensure image fits
                            onKeyDown={handleKeyDown}
                            tabIndex={0} // Make focusable for key events
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2"
                            onClick={(e) => { e.stopPropagation(); goToNext(); }} // Prevent closing dialog
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </DialogContent>
                      </Dialog>
                      {/* --- END LIGHTBOX WRAPPER --- */}
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExistingPhoto(url)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show photos marked for removal (optional, for confirmation) */}
            {photosToRemove.length > 0 && (
              <div className="text-sm text-yellow-600">
                <p>Photos marked for removal:</p>
                <ul>
                  {photosToRemove.map((url, idx) => (
                    <li key={idx} className="truncate max-w-xs">- {url}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {gym ? 'Save Changes' : 'Create Gym'}
            </Button>
            {gym && (
              <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gym) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{gym.name}</CardTitle>
            <CardDescription className="mt-2">{gym.location}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)} variant="outline" size="icon">
              <Edit2 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Gym</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this gym? This action cannot be undone and will also delete all associated coaches and athletes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm text-slate-500 mb-2">Schedule</h3>
            <p className="text-slate-900">{gym.schedule}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-500 mb-2">Pricing</h3>
            <p className="text-slate-900 text-2xl font-bold">
              {gym.pricing.toFixed(2)}Dh
              <span className="text-sm font-normal text-slate-500">/month</span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-slate-500 mb-2">Activities</h3>
          <div className="flex flex-wrap gap-2">
            {gym.activities?.map((activity, index) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {activity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Display existing equipment in view mode */}
        {gym.equipements && gym.equipements.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm text-slate-500 mb-2">Equipment</h3>
            <div className="flex flex-wrap gap-2">
              {gym.equipements.map((eq, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <img
                    src={eq.picture}
                    alt={eq.title}
                    className="w-4 h-4 object-cover rounded"
                  />
                  {eq.title}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Display existing photos in view mode */}
        {gym.photos && gym.photos.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm text-slate-500 mb-2">Photos</h3>
            <div className="flex flex-wrap gap-2">
              {gym.photos.map((url, index) => (
                <div key={index} className="relative group">
                  {/* --- LIGHTBOX WRAPPER FOR VIEW MODE PHOTOS --- */}
                  <Dialog open={lightboxOpen && lightboxIndex === index} onOpenChange={(open) => {
                      if (!open) closeLightbox();
                  }}>
                    <DialogTrigger asChild>
                      <img
                        src={url}
                        alt={`Gym photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border cursor-pointer" // Added cursor-pointer
                        onClick={() => openLightbox(index)} // Open lightbox for this photo
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] flex items-center justify-center p-0 border-0"> {/* Adjust max-w as needed */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2"
                        onClick={(e) => { e.stopPropagation(); goToPrevious(); }} // Prevent closing dialog
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <img
                        src={url}
                        alt={`Gym photo ${index + 1}`}
                        className="max-h-[80vh] max-w-full object-contain" // Ensure image fits
                        onKeyDown={handleKeyDown}
                        tabIndex={0} // Make focusable for key events
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2"
                        onClick={(e) => { e.stopPropagation(); goToNext(); }} // Prevent closing dialog
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </DialogContent>
                  </Dialog>
                  {/* --- END LIGHTBOX WRAPPER --- */}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}