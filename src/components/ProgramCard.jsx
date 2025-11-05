import {
  CheckIcon,
  PencilIcon,
  Trash2Icon,
  Users,
  TrendingUp,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import api from "@/services/axios/axiosClient";
import { toast } from "sonner";

const ProgramCard = ({ program, onUpdate, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [localActive, setLocalActive] = useState(Boolean(program?.active));

  const programId = useMemo(() => program?._id || program?.id, [program]);

  const handleToggleActive = async () => {
    const nextActive = !localActive;
    try {
      await api.patch(`/api/programs/${programId}`, { active: nextActive });
      setLocalActive(nextActive);
      toast.success(`Program ${nextActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update program status");
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
    if (program?.bought_by?.length) {
      toast.warning("This program has purchases and cannot be deleted");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!programId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/programs/${programId}`);
      toast.success("Program deleted");
      onDelete?.(program);
    } catch {
      toast.error("Failed to delete program");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
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
    <div className="group relative flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 max-w-sm border bg-card text-card-foreground dark:bg-neutral-900 dark:text-white border-border dark:border-neutral-800">
      <div className="relative w-full h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={program.image || "/program-placeholder.png"}
          alt={program.title || "Program"}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105"
          onError={(e) => {
            e.target.src = "/placeholder-program.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent dark:from-neutral-900 dark:via-neutral-900/60" />

        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
          <Badge className="h-7 px-3 bg-green-500/90 backdrop-blur-md hover:bg-green-500 border-0 rounded-full shadow-lg text-white">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-white" />
            <span className="text-xs font-bold text-white">Popular</span>
          </Badge>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[10px] group-hover:translate-x-0 z-10">
          <Button
            size="icon"
            onClick={handleToggleActive}
            className={`h-9 w-9 rounded-full shadow-md cursor-pointer transition-all duration-300 hover:scale-110 ${
              localActive
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-muted hover:bg-muted/80 text-foreground"
            }`}
            title={localActive ? "Deactivate" : "Activate"}
          >
            <CheckIcon className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleUpdate}
            className="h-9 w-9 bg-white/70 cursor-pointer text-black hover:bg-white rounded-full transition-all duration-300 hover:scale-110 dark:bg-white/10 dark:text-white dark:hover:bg-white/25"
            title="Edit program"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>

          {program.bought_by.length === 0 && (
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="h-9 w-9 bg-white/70 cursor-pointer text-black hover:bg-red-500 hover:text-white rounded-full transition-all duration-300 hover:scale-110 dark:bg-white/10 dark:text-white"
                  title="Delete program"
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete program?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the program.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 flex-wrap">
            {program.goals && program.goals.length > 0 ? (
              program.goals.map((tag, index) => (
                <Badge
                  key={index}
                  className="h-7 px-3 bg-black/30 text-white backdrop-blur-md hover:bg-black/40 border border-white/20 rounded-full transition-all duration-300 hover:scale-105 dark:bg-white/10"
                >
                  <span className="text-xs font-semibold drop-shadow-lg capitalize">
                    {tag}
                  </span>
                </Badge>
              ))
            ) : (
              <Badge className="h-7 px-3 bg-black/30 text-white backdrop-blur-md border border-white/20 rounded-full dark:bg-white/10">
                <span className="text-xs font-semibold drop-shadow-lg">
                  No goals
                </span>
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-5 p-6 bg-gradient-to-b from-transparent to-muted/30 dark:to-neutral-950/50">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold leading-tight flex-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
            {program.title}
          </h2>
          <div className="flex flex-col items-end gap-1">
            <span className="text-3xl font-bold bg-gradient-to-br from-green-600 to-green-700 bg-clip-text text-transparent dark:from-green-400 dark:to-green-600">
              ${program.price || 0}
            </span>
            {program.period && (
              <span className="text-xs text-muted-foreground">
                {program.period} days
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm rounded-xl p-3 border bg-muted/30 border-border dark:bg-neutral-800/40 dark:border-neutral-700/50">
          <div className="flex items-center justify-center w-8 h-8 bg-green-500/15 rounded-full">
            <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-xs text-muted-foreground font-medium">
              Purchased by
            </span>
            <span className="text-sm font-semibold">
              {program.bought_by?.length || 0}{" "}
              {program.bought_by?.length === 1 ? "person" : "people"}
            </span>
          </div>

          {program.bought_by && program.bought_by.length > 0 && (
            <div className="flex items-center -space-x-3">
              {program.bought_by.slice(0, 3).map((buyer, index) => (
                <Avatar
                  key={buyer._id || index}
                  className="w-9 h-9 border-2 border-white dark:border-neutral-900 ring-2 ring-green-500/20 transition-all duration-300 hover:scale-125 hover:z-10 hover:ring-green-500/50"
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
                <div className="w-9 h-9 border-2 border-white dark:border-neutral-900 rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-white flex items-center justify-center text-xs font-bold">
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
                  ? "bg-green-500/15 text-green-700 border-green-500/30 dark:text-green-400"
                  : program.status === "pending"
                  ? "bg-yellow-500/15 text-yellow-700 border-yellow-500/30 dark:text-yellow-400"
                  : "bg-red-500/15 text-red-700 border-red-500/30 dark:text-red-400"
              } capitalize`}
            >
              {program.status}
            </Badge>
            {program.createdAt && (
              <span className="text-xs text-muted-foreground">
                Created {formatDate(program.createdAt)}
              </span>
            )}
          </div>
        )}

        <Button className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default ProgramCard;
