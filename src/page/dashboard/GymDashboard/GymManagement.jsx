import { useState } from 'react';
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
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

// 🔧 Hardcoded owner ID for testing (replace with real one from auth later)
const TEST_OWNER_ID = '68fb4bc7ceef7f0d5a7c26b1';

export default function GymManagement({ gym, onGymUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(!gym);
  const [formData, setFormData] = useState({
    name: gym?.name || '',
    location: gym?.location || '',
    schedule: gym?.schedule || '',
    pricing: gym?.pricing || 0,
    activities: gym?.activities?.join(', ') || '',
    equipements: gym?.equipements?.join(', ') || '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const gymData = {
        name: formData.name,
        location: formData.location,
        schedule: formData.schedule,
        pricing: Number(formData.pricing),
        activities: formData.activities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        equipements: formData.equipements
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean),
        owner: TEST_OWNER_ID,
      };

      let response;

      if (gym) {
        // ✅ Use PATCH instead of PUT
        response = await fetch(`http://localhost:5000/api/gyms/${gym._id || gym.id}`, {
          method: 'PATCH', // ← changed from 'PUT' to 'PATCH'
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gymData),
        });
      } else {
        // Create new gym
        response = await fetch('http://localhost:5000/api/gyms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gymData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save gym');
      }

      const savedGym = await response.json();

      onGymUpdate(savedGym);
      toast.success(gym ? 'Gym updated successfully' : 'Gym created successfully');
      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message || 'An error occurred while saving');
    }
  };

  const handleDelete = async () => {
    if (!gym) return;

    try {
      const response = await fetch(`http://localhost:5000/api/gyms/${gym._id || gym.id}`, {
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
    if (gym) {
      setFormData({
        name: gym.name,
        location: gym.location,
        schedule: gym.schedule,
        pricing: gym.pricing,
        activities: gym.activities.join(', '),
        equipements: gym.equipements.join(', '),
      });
      setIsEditing(false);
    }
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
        <CardContent className="space-y-4">
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
            <Label htmlFor="equipements">Equipment IDs (comma-separated)</Label>
            <Textarea
              id="equipements"
              value={formData.equipements}
              onChange={(e) => handleInputChange('equipements', e.target.value)}
              placeholder="660a1b2c3d4e5f6a7b8c9d0e, ..."
              rows={2}
            />
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
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
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
              ${gym.pricing.toFixed(2)}
              <span className="text-sm font-normal text-slate-500">/month</span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-slate-500 mb-2">Activities</h3>
          <div className="flex flex-wrap gap-2">
            {gym.activities.map((activity, index) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {activity}
              </Badge>
            ))}
          </div>
        </div>

        {gym.equipements?.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm text-slate-500 mb-2">Equipment IDs</h3>
            <div className="flex flex-wrap gap-2">
              {gym.equipements.map((equip, index) => (
                <Badge key={index} variant="outline">
                  {equip}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}