import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookOpen, X, Image, FileText } from "lucide-react";
import { createProgramSchema } from "@/lib/schemas";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FileUpload from "./FileUpload";
import GoalTags from "./GoalTags";
import api from "@/services/axios/axiosClient";
// Form field configurations

export function CreateProgramForm() {
  const [coverPreview, setCoverPreview] = useState(null);
  const [programFile, setProgramFile] = useState(null);
  const FORM_FIELDS = [
    {
      name: "title",
      label: "Program Title",
      type: "text",
      placeholder: "enter a value",
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "enter a value",
    },
    {
      name: "goals",
      label: "Goals",
      type: "text",
      placeholder: "enter a value",
    },
    {
      name: "period",
      label: "Duration (days)",
      type: "number",
      placeholder: "enter a value",
    },
  ];

  // File upload configurations
  const FILE_CONFIGS = [
    {
      id: "cover",
      accept: "image/*",
      maxSize: "2MB",
      file: coverPreview,
      label: "Cover Image",
      icon: Image,
      onFileSelect: (files) => {
        if (coverPreview) URL.revokeObjectURL(coverPreview);
        const url = URL.createObjectURL(files[0]);
        setCoverPreview(url);
        form.setValue("image", files);
      },
      onFileDelete: () => {
        if (coverPreview) URL.revokeObjectURL(coverPreview);
        setCoverPreview(null);
        form.setValue("image", null);
      },
      preview: () => (
        <img
          src={coverPreview}
          alt="Cover preview"
          className="w-full h-[200px] object-cover rounded-lg shadow-sm"
        />
      ),
      allowedTypes: ["image/jpeg", "image/png", "image/gif"],
      dropzoneText: "PNG, JPG or GIF (max. 2MB)",
    },
    {
      id: "program",
      accept: ".pdf,.doc,.docx",
      maxSize: "10MB",
      file: programFile,
      label: "Program File",
      icon: FileText,
      onFileSelect: (files) => {
        setProgramFile(files[0]);
        form.setValue("file", files);
      },
      onFileDelete: () => {
        setProgramFile(null);
        form.setValue("file", null);
      },
      preview: () => (
        <div className="flex items-center gap-4 p-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-popover)]">
              <FileText className="w-5 h-5 text-[var(--color-muted-foreground)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-primary)] truncate">
                {programFile?.name || "No file selected"}
              </p>
            </div>
          </div>
        </div>
      ),
      allowedTypes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      dropzoneText: "PDF, DOC or DOCX (max. 10MB)",
    },
  ];

  // Form state
  const form = useForm({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      title: "",
      price: 0,
      goals: [],
      period: 0,
      program: null,
      cover: null,
    },
  });
  const goals = form.watch("goals");

  const onGoalDelete = (goal) => {
    const currentGoals = goals;
    const filteredGoals = currentGoals.filter((g) => g !== goal);
    form.setValue("goals", filteredGoals, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price);
      formData.append("goals", data.goals);
      formData.append("period", data.period);
      formData.append("file", data.file);
      formData.append("image", data.image);
      const response = await api.post("/api/programs", formData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Create New Program</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[600px] px-6 py-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle
            className={
              "flex items-center gap-2 text-2xl font-bold text-foreground mb-4"
            }
          >
            <BookOpen className="h-5 w-5" />
            <span>Add New Program</span>
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4"
          >
            {FORM_FIELDS.map((f) => {
              const wrapperClass =
                f.name === "price" || f.name === "period"
                  ? "col-span-1 sm:col-span-1"
                  : "col-span-1 sm:col-span-3";
              return (
                <div key={f.name} className={wrapperClass}>
                  <FormField
                    control={form.control}
                    name={f.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-secondary-foureground">
                          {f.label}
                        </FormLabel>
                        <FormControl>
                          {f.name === "goals" ? (
                            <div>
                              <Input
                                type={f.type}
                                placeholder="Add goal and press Enter"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const value = e.target.value.trim();
                                    e.target.value = "";
                                    if (value && !goals.includes(value)) {
                                      const updated = [...goals, value];
                                      form.setValue("goals", updated, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      });
                                    }
                                  }
                                }}
                                className="mt-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50 w-full"
                              />

                              <GoalTags
                                goals={goals}
                                onTagDelete={onGoalDelete}
                              />
                              <div className="mt-2 text-xs text-[var(--color-muted-foreground)]">
                                Press Enter to add each goal
                              </div>
                            </div>
                          ) : (
                            (() => {
                              const base =
                                "mt-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50";
                              return (
                                <Input
                                  type={f.type}
                                  placeholder={f.placeholder}
                                  {...field}
                                  className={`${base} w-full`}
                                />
                              );
                            })()
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}

            <div className="col-span-1 sm:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FILE_CONFIGS.map((config) => (
                <FileUpload
                  key={config.id}
                  config={config}
                  file={config.file}
                  onFileSelect={config.onFileSelect}
                  onFileDelete={config.onFileDelete}
                  preview={config.preview}
                />
              ))}
            </div>

            <Button type="submit" className="col-span-1 sm:col-span-4 w-full">
              Create Program
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
