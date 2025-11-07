import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, UserCog } from 'lucide-react';
import GymManagement from './GymManagement';
import CoachesManagement from './CoachesManagement';
import AthletesManagement from './AthletesManagement';
import { Profile } from "@/pages/Profile"
// === CONFIGURATION FOR TESTING ===
const TEST_OWNER_ID = '68fb4bc7ceef7f0d5a7c26b1';
// ===================================

export default function GymDashboard() {
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGym();
  }, []);

  const fetchGym = async () => {
    setLoading(true);
    try {
      // 📡 Fetch gym from your Express backend
      const response = await fetch(`http://localhost:5000/api/gyms?owner=${TEST_OWNER_ID}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const gyms = await response.json();

      // Assume your API returns an array; take the first gym (or null)
      const gymData = Array.isArray(gyms) && gyms.length > 0 ? gyms[0] : null;
      setGym(gymData);
    } catch (error) {
      console.error('Error fetching gym:', error);
      // Optionally show toast.error if you keep sonner
    } finally {
      setLoading(false);
    }
  };

  const handleGymUpdate = (updatedGym) => {
    setGym(updatedGym);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 max-w-7xl">
       <div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold text-slate-900 mb-2">
      Gym Owner Dashboard
    </h1>
    <p className="text-slate-600">
      Manage your gym, coaches, and athletes
    </p>
  </div>

  {/* Profile aligned right */}
  <div className="flex-shrink-0">
    <Profile />
  </div>
</div>

        {!gym ? (
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                No Gym Found
              </CardTitle>
              <CardDescription>
                Create your gym to start managing coaches and athletes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GymManagement gym={null} onGymUpdate={handleGymUpdate} />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="gym" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="gym" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Gym
              </TabsTrigger>
              <TabsTrigger value="coaches" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Coaches
              </TabsTrigger>
              <TabsTrigger value="athletes" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Athletes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gym" className="space-y-4">
              <GymManagement gym={gym} onGymUpdate={handleGymUpdate} />
            </TabsContent>

            <TabsContent value="coaches" className="space-y-4">
              <CoachesManagement gymId={gym._id || gym.id} />
            </TabsContent>

            <TabsContent value="athletes" className="space-y-4">
              <AthletesManagement gymId={gym._id || gym.id} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}