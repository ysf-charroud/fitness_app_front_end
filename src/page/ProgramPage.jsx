import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import ProgramCard from "../components/PorgramCard";
import { CreateProgramForm } from "../components/CreateProgramForm";
import CoachSideBar from "@/components/CoachSideBar";

const initialPrograms = [
  {
    title: "30-Day Muscle Builder Pro",
    path: "/programs/muscle-builder-pro",
    creator: "507f1f77bcf86cd799439011",
    bought_by: [
      "507f1f77bcf86cd799439012",
      "507f1f77bcf86cd799439013",
      "507f1f77bcf86cd799439014",
    ],
    program_goals: ["Muscle Gain", "Strength", "Hypertrophy"],
    price: 59.99,
    period: 30,
    active: true,
    status: "approved",
    createdAt: "2025-09-24T08:00:00Z",
    updatedAt: "2025-09-24T08:00:00Z",
  },
  {
    title: "Advanced HIIT Training",
    path: "/programs/hiit-training",
    creator: "507f1f77bcf86cd799439011",
    bought_by: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
    program_goals: ["Cardio", "Endurance", "Fat Loss"],
    price: 49.99,
    period: 21,
    active: true,
    status: "approved",
    createdAt: "2025-09-20T08:00:00Z",
    updatedAt: "2025-09-24T08:00:00Z",
  },
  {
    title: "Yoga & Flexibility",
    path: "/programs/yoga-flexibility",
    creator: "507f1f77bcf86cd799439011",
    bought_by: ["507f1f77bcf86cd799439012"],
    program_goals: ["Flexibility", "Mindfulness", "Recovery"],
    price: 39.99,
    period: 14,
    active: false,
    status: "approved",
    createdAt: "2025-09-15T08:00:00Z",
    updatedAt: "2025-09-24T08:00:00Z",
  },
  {
    title: "Beginner Weight Loss",
    path: "/programs/weight-loss",
    creator: "507f1f77bcf86cd799439011",
    bought_by: [
      "507f1f77bcf86cd799439012",
      "507f1f77bcf86cd799439013",
      "507f1f77bcf86cd799439014",
      "507f1f77bcf86cd799439015",
    ],
    program_goals: ["Weight Loss", "Cardio", "Nutrition"],
    price: 44.99,
    period: 28,
    active: true,
    status: "approved",
    createdAt: "2025-09-10T08:00:00Z",
    updatedAt: "2025-09-24T08:00:00Z",
  },
  {
    title: "Core Strength Bootcamp",
    path: "/programs/core-strength",
    creator: "507f1f77bcf86cd799439011",
    bought_by: ["507f1f77bcf86cd799439012"],
    program_goals: ["Core", "Strength", "Stability"],
    price: 34.99,
    period: 21,
    active: true,
    status: "pending",
    createdAt: "2025-09-05T08:00:00Z",
    updatedAt: "2025-09-24T08:00:00Z",
  },
];

export default function ProgramPage() {
  const [programs, setPrograms] = useState(initialPrograms);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.program_goals.some((goal) =>
          goal.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "active" && program.active) ||
        (activeFilter === "inactive" && !program.active);

      return matchesSearch && matchesFilter;
    });
  }, [programs, searchQuery, activeFilter]);

  const handleProgramCreate = (newProgram) => {
    setPrograms((prev) => [newProgram, ...prev]);
  };

  const handleUpdate = (program) => {
    alert("Edit program: " + program.title);
  };

  const handleDelete = (program) => {
    setPrograms((prev) => prev.filter((p) => p.title !== program.title));
  };

  const handleToggleActive = async (newActiveState) => {
    console.log("Toggling active state to:", newActiveState);
  };

  return (
      <div className="w-full px-6 pt-8 dd overflow-y-scroll">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Program Management
            </h1>
            <p className="text-muted-foreground">
              Manage your fitness programs with ease
            </p>
          </div>
          <CreateProgramForm onProgramCreate={handleProgramCreate} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search programs by name or goal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => setActiveFilter("all")}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              All
            </Button>
            <Button
              variant={activeFilter === "active" ? "default" : "outline"}
              onClick={() => setActiveFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={activeFilter === "inactive" ? "default" : "outline"}
              onClick={() => setActiveFilter("inactive")}
            >
              Inactive
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredPrograms.length} of {programs.length} programs
        </div>

        {/* Programs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program, index) => (
              <ProgramCard
                key={index}
                program={program}
                onUpdate={() => handleUpdate(program)}
                onDelete={() => handleDelete(program)}
                onToggleActive={handleToggleActive}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No programs found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
  );
}
