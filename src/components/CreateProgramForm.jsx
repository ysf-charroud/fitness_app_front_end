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
  SheetTrigger,
} from "@/components/ui/sheet";

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
    label: "Goals (comma-separated)",
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
const FILE_CONFIGS = {
  cover: {
    id: "cover",
    accept: "image/*",
    maxSize: "2MB",
    label: "Cover Image",
    icon: Image,
    allowedTypes: ["image/jpeg", "image/png", "image/gif"],
    dropzoneText: "PNG, JPG or GIF (max. 2MB)",
  },
  program: {
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
};

// Reusable delete button component
const DeleteButton = ({ onDelete, className = "" }) => (
  <button
    type="button"
    onClick={onDelete}
    className={`rounded-full bg-[var(--color-destructive)] text-white flex items-center justify-center hover:bg-[var(--color-destructive)/90] transition-colors shadow-sm ${className}`}
  >
    <X className="w-4 h-4" />
  </button>
);

// Reusable file upload component
const FileUpload = ({
  config,
  file,
  onFileSelect,
  onFileDelete,

  preview,
}) => {
  const Icon = config.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-[var(--color-primary-foreground)]">
        {config.label}
      </label>
      <div
        className={`mt-2 relative border-2 border-dashed rounded-lg p-4 transition-colors bg-card ${
          hovered ? "border-primary scale-105" : "border-border hover:border-primary "
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setHovered(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setHovered(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setHovered(false);
          const files = e.dataTransfer?.files;
          if (!files?.length) return;
          const droppedFile = files[0];
          if (config.allowedTypes.includes(droppedFile.type)) {
            onFileSelect(droppedFile);
          } else {
            console.error("Invalid file type");
          }
        }}
      >
        <input
          id={config.id}
          type="file"
          accept={config.accept}
          onClick={(e) => {
            e.target.value = "";
          }}
          onChange={(e) => {
            const files = e.target.files;
            if (!files?.length) {
              onFileDelete();
              return;
            }
            const selectedFile = files[0];
            if (config.allowedTypes.includes(selectedFile.type)) {
              onFileSelect(selectedFile);
            } else {
              e.target.value = "";
              console.error("Invalid file type");
            }
          }}
          className="hidden"
        />
        {!file ? (
          <label
            htmlFor={config.id}
            className="flex flex-col items-center gap-2 cursor-pointer p-4"
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--color-popover)]">
              <Icon className="w-6 h-6 text-[var(--color-muted-foreground)]" />
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-[var(--color-primary)]">
                Click to upload
              </span>
              <span className="text-sm text-[var(--color-muted-foreground)]">
                {" "}
                or drag and drop
              </span>
            </div>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              {config.dropzoneText}
            </span>
          </label>
        ) : (
          <div className="relative group">
            {preview(file)}
            <DeleteButton
              onDelete={(e) => {
                e.stopPropagation();
                onFileDelete();
                const fileInput = document.getElementById(config.id);
                if (fileInput) fileInput.value = "";
              }}
              className="absolute -top-2 -right-2 z-10 w-6 h-6"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Goal tag component
const GoalTag = ({ goal, onDelete }) => (
  <span
    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
    style={{
      background:
        "linear-gradient(90deg, var(--color-primary-foreground/0.08), var(--color-primary-foreground/0.03))",
      borderWidth: "1px",
      borderColor: "var(--color-primary-foreground/0.14)",
    }}
  >
    <span className="text-sm font-medium text-[var(--color-primary-foreground)]">
      {goal}
    </span>
    <DeleteButton
      onDelete={onDelete}
      className="w-4 h-4 bg-[var(--color-primary-foreground/0.1)] hover:bg-[var(--color-destructive)]"
    />
  </span>
);

export function CreateProgramForm() {
  // Form state
  const form = useForm({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      title: "",
      price: 0,
      goals: "",
      period: 0,
      program: null,
      cover: null,
    },
  });

  // Local state
  const [goals, setGoals] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [programFile, setProgramFile] = useState(null);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

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

  return (
    <Sheet>
      <SheetTrigger>
        <Button>Create New Program</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[600px] px-6 py-4 overflow-y-scroll">
        <SheetHeader>
          <BookOpen className="h-5 w-5" />
          Add New Program
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {FORM_FIELDS.map((f) => (
              <FormField
                key={f.name}
                control={form.control}
                name={f.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[var(--color-primary-foreground)]">
                      {f.label}
                    </FormLabel>
                    <FormControl>
                      {f.name === "goals" ? (
                        <>
                          <Input
                            type={f.type}
                            placeholder="Add goal and press Enter"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value && !goals.includes(value)) {
                                  setGoals((prevGoals) => [
                                    ...prevGoals,
                                    value,
                                  ]);
                                  field.onChange("");
                                }
                              }
                            }}
                            className="mt-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                          />
                          <div className="mt-3 flex flex-wrap gap-2">
                            {goals.map((goal, idx) => (
                              <GoalTag
                                key={`${goal}-${idx}`}
                                goal={goal}
                                onDelete={() => {
                                  setGoals((prevGoals) =>
                                    prevGoals.filter(
                                      (_, index) => index !== idx
                                    )
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-[var(--color-muted-foreground)]">
                            Press Enter to add each goal
                          </div>
                        </>
                      ) : (
                        <Input
                          type={f.type}
                          placeholder={f.placeholder}
                          {...field}
                          className="mt-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUpload
                config={FILE_CONFIGS.cover}
                file={coverPreview}
                onFileSelect={(file) => {
                  if (coverPreview) URL.revokeObjectURL(coverPreview);
                  const url = URL.createObjectURL(file);
                  setCoverPreview(url);
                  form.setValue("cover", [file]);
                }}
                onFileDelete={() => {
                  if (coverPreview) URL.revokeObjectURL(coverPreview);
                  setCoverPreview(null);
                  form.setValue("cover", null);
                }}
                preview={(file) => (
                  <img
                    src={file}
                    alt="Cover preview"
                    className="w-full h-[200px] object-cover rounded-lg shadow-sm"
                  />
                )}
              />

              <FileUpload
                config={FILE_CONFIGS.program}
                file={programFile}
                onFileSelect={(file) => {
                  setProgramFile(file);
                  form.setValue("program", [file]);
                }}
                onFileDelete={() => {
                  setProgramFile(null);
                  form.setValue("program", null);
                }}
                preview={(file) => (
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
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Create Program
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
