import {
  CheckIcon,
  PencilIcon,
  Trash2Icon,
  Users,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProgramCard = ({ program, onUpdate, onDelete, onToggleActive }) => {
  

  const handleToggleActive = (e) => {
    e.stopPropagation();
    if (onToggleActive) {
      onToggleActive(program, !program.active);
    }
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group relative flex flex-col bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 max-w-sm border border-neutral-800/50 hover:border-green-500/20">
      <div className="relative w-full h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={program.image || "/placeholder-program.jpg"}
          alt={program.title || "Program"}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          onError={(e) => {
            e.target.src = "/placeholder-program.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />

        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
          <Badge className="h-7 px-3 bg-green-500/90 backdrop-blur-md hover:bg-green-500 border-0 rounded-full shadow-lg">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-white" />
            <span className="text-xs font-bold text-white">Popular</span>
          </Badge>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[10px] group-hover:translate-x-0">
          <Button
            size="icon"
            onClick={handleToggleActive}
            className={`h-9 w-9 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 ${
              program.active
                ? "bg-green-500 hover:bg-green-600"
                : "bg-neutral-600 hover:bg-neutral-700"
            }`}
            title={program.active ? "Deactivate" : "Activate"}
          >
            <CheckIcon className="w-4 h-4 text-white" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleUpdate}
            className="h-9 w-9 bg-white/10 backdrop-blur-md hover:bg-white/25 rounded-full transition-all duration-300 hover:scale-110"
            title="Edit program"
          >
            <PencilIcon className="w-4 h-4 text-white" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-9 w-9 bg-white/10 backdrop-blur-md hover:bg-red-500 rounded-full transition-all duration-300 hover:scale-110"
            title="Delete program"
          >
            <Trash2Icon className="w-4 h-4 text-white" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 flex-wrap">
            {program.goals && program.goals.length > 0 ? (
              program.goals.map((tag, index) => (
                <Badge
                  key={index}
                  className="h-7 px-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <span className="text-xs font-semibold text-white drop-shadow-lg capitalize">
                    {tag}
                  </span>
                </Badge>
              ))
            ) : (
              <Badge className="h-7 px-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <span className="text-xs font-semibold text-white drop-shadow-lg">
                  No goals
                </span>
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-5 p-6 bg-gradient-to-b from-transparent to-neutral-950/50">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-white leading-tight flex-1 group-hover:text-green-400 transition-colors duration-300">
            {program.title}
          </h2>
          <div className="flex flex-col items-end gap-1">
            <span className="text-3xl font-bold bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent">
              ${program.price || 0}
            </span>
            {program.period && (
              <span className="text-xs text-neutral-400">
                {program.period} days
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm bg-neutral-800/40 rounded-xl p-3 border border-neutral-700/50">
          <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full">
            <Users className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-xs text-neutral-400 font-medium">
              Purchased by
            </span>
            <span className="text-sm text-white font-semibold">
              {program.bought_by?.length || 0} {program.bought_by?.length === 1 ? "person" : "people"}
            </span>
          </div>

          {program.bought_by && program.bought_by.length > 0 && (
            <div className="flex items-center -space-x-3">
              {program.bought_by.slice(0, 3).map((buyer, index) => (
                <Avatar
                  key={buyer._id || index}
                  className="w-9 h-9 border-2 border-neutral-900 ring-2 ring-green-500/20 transition-all duration-300 hover:scale-125 hover:z-10 hover:ring-green-500/50"
                >
                  <AvatarImage
                    src={buyer.avatar || buyer.image}
                    alt={buyer.name || `User ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-700 text-white text-xs font-bold">
                    {buyer.name?.[0]?.toUpperCase() || `U${index + 1}`}
                  </AvatarFallback>
                </Avatar>
              ))}
              {program.bought_by.length > 3 && (
                <div className="w-9 h-9 border-2 border-neutral-900 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-white font-bold">
                  +{program.bought_by.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {program.status && (
          <div className="flex items-center gap-2">
            <Badge
              className={`${
                program.status === "approved"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : program.status === "pending"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              } capitalize`}
            >
              {program.status}
            </Badge>
            {program.createdAt && (
              <span className="text-xs text-neutral-500">
                Created {formatDate(program.createdAt)}
              </span>
            )}
          </div>
        )}

        <Button className="w-full h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-[1.02]">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default ProgramCard;
