import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

const ProgramFilters = ({ searchQuery, activeFilter, onSearchChange, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search programs by name or goal..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => onFilterChange("all")}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          All
        </Button>
        <Button
          variant={activeFilter === "active" ? "default" : "outline"}
          onClick={() => onFilterChange("active")}
        >
          Active
        </Button>
        <Button
          variant={activeFilter === "inactive" ? "default" : "outline"}
          onClick={() => onFilterChange("inactive")}
        >
          Inactive
        </Button>
      </div>
    </div>
  );
};

export default ProgramFilters;

