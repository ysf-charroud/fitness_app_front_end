import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
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
// Form field configurations
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
    label: "Cover Image",
    icon: Image,
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
    dropzoneText: "PNG, JPG or GIF (max. 2MB)",
  },
  {
    id: "program",
    accept: ".pdf,.doc,.docx",
    maxSize: "10MB",
    label: "Program File",
    icon: FileText,
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    dropzoneText: "PDF, DOC or DOCX (max. 10MB)",
  },
];

// Reusable file upload component

// Goal tag component

export function CreateProgramForm() {
  const [coverPreview, setCoverPreview] = useState(null);
  const [programFile, setProgramFile] = useState(null);

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
  // Local state

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const onTagDelete = (goal) => {
    const currentGoals = goals || [];
    const filteredGoals = currentGoals.filter((g) => g !== goal);
    form.setValue("goals", filteredGoals, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  const onSubmit = async (data) => {
    const programFormData = new FormData();
    programFormData.append("title", data.title);
    programFormData.append("price", data.price);
    programFormData.append("goals", goals.join(", "));
    programFormData.append("period", data.period);

    if (data.program?.[0]) {
      programFormData.append("program", data.program[0]);
    }
    if (data.cover?.[0]) {
      programFormData.append("cover", data.cover[0]);
    }

    console.log("Form data:", Object.fromEntries(programFormData));

    // const response = await api.post("/api/programs", programFormData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmEwYmExYjcyZDEyNDllMTI3YTE3NSIsInJvbGUiOiJjb2FjaCIsImlhdCI6MTc2MTIxNzUwNSwiZXhwIjoxNzYyNTEzNTA1fQ.7qXVLtYi2iKxYtd1129ljPd5WOUVm_RBvNrbJS11Xn4"}`,
    //   },
    // });
    // console.log("Program created:", response.data);
  };

  console.log(form.formState.errors);
  console.log(goals);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Create New Program</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[600px] px-6 py-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2 text-2xl font-bold text-foreground mb-4">
              <BookOpen className="h-5 w-5" />
              Add New Program
            </div>
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            encType="multipart/form-data"
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
                                      field.onChange(updated);
                                    }
                                  }
                                }}
                                className="mt-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50 w-full"
                              />

                              <GoalTags
                                goals={goals}
                                onTagDelete={onTagDelete}
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
                  file={config.id === "cover" ? coverPreview : programFile}
                  onFileSelect={(file) => {
                    if (config.id === "cover") {
                      if (coverPreview) URL.revokeObjectURL(coverPreview);
                      const url = URL.createObjectURL(file);
                      setCoverPreview(url);
                      form.setValue("cover", [file]);
                    } else {
                      setProgramFile(file);
                      form.setValue("program", [file]);
                    }
                  }}
                  onFileDelete={() => {
                    if (config.id === "cover") {
                      if (coverPreview) URL.revokeObjectURL(coverPreview);
                      setCoverPreview(null);
                      form.setValue("cover", null);
                    } else {
                      setProgramFile(null);
                      form.setValue("program", null);
                    }
                  }}
                  preview={(file) =>
                    config.id === "cover" ? (
                      <img
                        src={file}
                        alt="Cover preview"
                        className="w-full h-[200px] object-cover rounded-lg shadow-sm"
                      />
                    ) : (
                      <div className="flex items-center gap-4 p-4">
                        <div className="flex-1 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-popover)]">
                            <FileText className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-primary)] truncate">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  }
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
