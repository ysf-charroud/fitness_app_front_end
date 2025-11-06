  import { Users, TrendingUp, Download } from "lucide-react";
  import React, { useMemo, useState } from "react";
  import { useSelector } from "react-redux";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
  import { Link } from "react-router-dom";
  import placeHolder from '@/public/images/program-placeholder.png'
  import { toast } from "sonner";
  import api from "@/services/api";

  console.log(placeHolder)
  const ProgramCard = ({ program, showUpdateForm, updateProgram, deleteProgram }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const user = useSelector((s) => s.auth.user);

    const programId = useMemo(() => program?._id || program?.id, [program]);
    const isOwned = useMemo(() => {
      const uid = user?._id || user?.id;
      if (!uid) return false;
      const buyers = program?.bought_by || [];
      return buyers.some((b) => (b?._id || b?.id || b) === uid);
    }, [program, user]);

    const handleBuy = () => {
      if (!programId) return;
      const role = (user?.role || "").toLowerCase();
      if (!user) {
        setLoginDialogOpen(true);
        return;
      }
      if (role !== "athlete") {
        toast.error("Only athletes can purchase programs");
        return;
      }
      const base = api.defaults.baseURL?.replace(/\/$/, "") || "";
      window.location.href = `${base}/payments/programs/${programId}/checkout`;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const handleDownload = async () => {
      const fileUrl = program.file;
      if (!fileUrl) return;

      setIsDownloading(true);
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("Failed to fetch file");
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = program.title ? `${program.title}.pdf` : "program.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);
        
        toast.success("Program file downloaded successfully");
      } catch (error) {
        console.error("Error downloading file:", error);
        toast.error("Failed to download program file");
      } finally {
        setIsDownloading(false);
      }
    };

    return (
      <>
      <div className="group relative flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 max-w-sm border bg-card text-card-foreground dark:bg-neutral-900 dark:text-white border-border dark:border-neutral-800">
        <div className="relative w-full h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src={program.image || placeHolder}
            alt={program.title || "Program"}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105"
            onError={(e) => {
              e.target.src = placeHolder;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent dark:from-neutral-900 dark:via-neutral-900/60" />

          {program.bought_by?.length >= 5 && (
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
              <Badge className="h-7 px-3 bg-green-500/90 backdrop-blur-md hover:bg-green-500 border-0 rounded-full shadow-lg text-white">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-white" />
                <span className="text-xs font-bold text-white">Popular</span>
              </Badge>
            </div>
          )}

          {/* Admin action buttons hidden as requested */}

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
                {program?.bought_by?.length || 0}{" "}
                {program?.bought_by?.length === 1 ? "person" : "people"}
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

          {isOwned && program.file ? (
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "Downloading..." : "Download Program File"}
            </Button>
          ) : (
            <Button
              onClick={handleBuy}
              className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              Buy Program
            </Button>
          )}
        </div>
    </div>
    {/* Auth required dialog */}
    <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in required</DialogTitle>
          <DialogDescription>
            You need to register or log in before purchasing a program.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-2 justify-end w-full">
            <Button asChild variant="outline"><Link to="/register">Register</Link></Button>
            <Button asChild><Link to="/login">Log in</Link></Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ProgramCard;