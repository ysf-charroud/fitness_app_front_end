import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Calendar, DollarSign, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const ProgramFilters = ({ 
  searchQuery, 
  activeFilter, 
  periodMin,
  periodMax,
  priceMin,
  priceMax,
  onSearchChange, 
  onFilterChange,
  onPeriodChange,
  onPriceChange 
}) => {
  const [localPeriodMin, setLocalPeriodMin] = useState(periodMin || "");
  const [localPeriodMax, setLocalPeriodMax] = useState(periodMax || "");
  const [localPriceMin, setLocalPriceMin] = useState(priceMin || "");
  const [localPriceMax, setLocalPriceMax] = useState(priceMax || "");

  useEffect(() => {
    setLocalPeriodMin(periodMin || "");
    setLocalPeriodMax(periodMax || "");
  }, [periodMin, periodMax]);

  useEffect(() => {
    setLocalPriceMin(priceMin || "");
    setLocalPriceMax(priceMax || "");
  }, [priceMin, priceMax]);

  const handlePeriodMinChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setLocalPeriodMin(value);
      onPeriodChange(value, localPeriodMax);
    }
  };

  const handlePeriodMaxChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setLocalPeriodMax(value);
      onPeriodChange(localPeriodMin, value);
    }
  };

  const handlePriceMinChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setLocalPriceMin(value);
      onPriceChange(value, localPriceMax);
    }
  };

  const handlePriceMaxChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setLocalPriceMax(value);
      onPriceChange(localPriceMin, value);
    }
  };

  const getFilterLabel = () => {
    switch (activeFilter) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      default:
        return "All Programs";
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Search and Status Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
          <Input
            placeholder="Search programs by name or goal..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-2 min-w-[160px] justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{getFilterLabel()}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onFilterChange("all")}
              className={activeFilter === "all" ? "bg-accent" : ""}
            >
              All Programs
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFilterChange("active")}
              className={activeFilter === "active" ? "bg-accent" : ""}
            >
              Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onFilterChange("inactive")}
              className={activeFilter === "inactive" ? "bg-accent" : ""}
            >
              Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Period and Price Filters Card */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Period Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Period (days)</span>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Min"
                value={localPeriodMin}
                onChange={handlePeriodMinChange}
                className="h-9"
              />
              <span className="text-muted-foreground text-sm font-medium">-</span>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Max"
                value={localPeriodMax}
                onChange={handlePeriodMaxChange}
                className="h-9"
              />
            </div>
          </div>

          {/* Price Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Price ($)</span>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Min"
                value={localPriceMin}
                onChange={handlePriceMinChange}
                className="h-9"
              />
              <span className="text-muted-foreground text-sm font-medium">-</span>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Max"
                value={localPriceMax}
                onChange={handlePriceMaxChange}
                className="h-9"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramFilters;

