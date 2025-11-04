// src/pages/dashboard/GymManagement.jsx
import { useState, useEffect } from 'react';
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
} from '@/components/ui/dialog';
import { Edit2, Trash2, Save, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
// --- END ADDED ---
import { toast } from 'sonner';
import { EQUIPMENT_LIST } from '@/constants/equipments';

const TEST_OWNER_ID = '68fb4bc7ceef7f0d5a7c26b1';

export default function GymManagement({ gym, onGymUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(!gym);

  // Initialize equipements as object
  const initialEquipements = {};
  EQUIPMENT_LIST.forEach(item => {
    initialEquipements[item.id] = gym?.equipements?.[item.id] || false;
  });

  // State for form data
  const [formData, setFormData] = useState({
    name: gym?.name || '',
    location: gym?.location || '',
    schedule: gym?.schedule || '',
    pricing: gym?.pricing || 0,
    activities: gym?.activities?.join(', ') || '',
    equipements: initialEquipements,
  });

  // State for managing photos
  const [existingPhotos, setExistingPhotos] = useState(gym?.photos || []);
  const [newlySelectedPhotos, setNewlySelectedPhotos] = useState([]); // Stores File objects
  const [photosToRemove, setPhotosToRemove] = useState([]); // Stores URLs of existing photos to remove

  // --- ADDED FOR LIGHTBOX ---
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // --- END ADDED ---

  // Sync form data and existing photos when gym changes
  useEffect(() => {
    if (gym) {
      const newEquipements = {};
      EQUIPMENT_LIST.forEach(item => {
        newEquipements[item.id] = gym.equipements?.[item.id] || false;
      });
      setFormData({
        name: gym.name || '',
        location: gym.location || '',
        schedule: gym.schedule || '',
        pricing: gym.pricing || 0,
        activities: gym.activities?.join(', ') || '',
        equipements: newEquipements,
      });
      setExistingPhotos(gym.photos || []);
    } else {
      setFormData({
        name: '',
        location: '',
        schedule: '',
        pricing: 0,
        activities: '',
        equipements: EQUIPMENT_LIST.reduce((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {}),
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

  const toggleEquipment = (equipId) => {
    setFormData((prev) => ({
      ...prev,
      equipements: {
        ...prev.equipements,
        [equipId]: !prev.equipements[equipId],
      },
    }));
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
    formDataToSend.append('equipements', JSON.stringify(formData.equipements));
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
      const resetEquipements = {};
      EQUIPMENT_LIST.forEach(item => {
        resetEquipements[item.id] = gym.equipements?.[item.id] || false;
      });
      setFormData({
        name: gym.name,
        location: gym.location,
        schedule: gym.schedule,
        pricing: gym.pricing,
        activities: gym.activities.join(', '),
        equipements: resetEquipements,
      });
      setExistingPhotos(gym.photos || []); // Reset to original photos
    } else {
      setFormData({
        name: '',
        location: '',
        schedule: '',
        pricing: 0,
        activities: '',
        equipements: EQUIPMENT_LIST.reduce((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {}),
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

          <div className="space-y-2">
            <Label>Equipment</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EQUIPMENT_LIST.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{item.label}</span>
                  <Button
                    type="button"
                    variant={formData.equipements[item.id] ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleEquipment(item.id)}
                    className="h-7"
                  >
                    {formData.equipements[item.id] ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="text-xs">Add</span>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>

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

        <div>
          <h3 className="font-semibold text-sm text-slate-500 mb-2">Equipment</h3>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_LIST.filter(item => gym.equipements?.[item.id])
              .map((item) => (
                <Badge key={item.id} variant="outline">
                  {item.label}
                </Badge>
              ))}
            {Object.keys(gym.equipements || {}).length === 0 && (
              <span className="text-slate-400 text-sm">None</span>
            )}
          </div>
        </div>

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