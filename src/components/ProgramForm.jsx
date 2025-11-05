import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FileUpload from "./FileUpload";
import GoalTags from "./GoalTags";
import { toast } from "sonner";
import { useEffect } from "react";

export function ProgramForm({
  createProgram,
  updateProgram,
  initialValues,
  sheetOpen,
  setSheetOpen,
}) {
  const form = useForm({
    resolver: zodResolver(
      initialValues
        ? createProgramSchema.omit({ file: true, image: true })
        : createProgramSchema
    ),
    defaultValues: {
      title: "",
      price: 0,
      goals: [],
      period: 0,
      file: null,
      image: null,
    },
  });

  useEffect(() => {
    if (!initialValues) return form.reset();

    form.setValue("title", initialValues.title);
    form.setValue("price", initialValues.price);
    form.setValue("goals", initialValues.goals);
    form.setValue("period", initialValues.period);
  }, [initialValues, form]);

  const goals = form.watch("goals");
  const file = form.watch("file");
  const image = form.watch("image");

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
  const FILE_CONFIGS = !initialValues
    ? [
        {
          id: "cover",
          accept: "image/*",
          maxSize: "2MB",
          label: "Cover Image",
          icon: Image,
          allowedTypes: ["image/jpeg", "image/png", "image/gif"],
          dropzoneText: "PNG, JPG or GIF (max. 2MB)",
          file: image,
          onFileSelect: (files) => {
            form.setValue("image", files);
          },
          onFileDelete: () => {
            form.setValue("image", null);
          },
          preview() {
            const url = URL.createObjectURL(this.file);
            return (
              <img
                src={url}
                alt="Cover preview"
                className="w-full h-[200px] object-cover rounded-lg shadow-sm"
              />
            );
          },
        },
        {
          id: "program",
          accept: ".pdf,.doc,.docx",
          maxSize: "10MB",
          label: "Program File",
          icon: FileText,
          allowedTypes: ["application/pdf", "application/msword"],
          dropzoneText: "PDF, DOC or DOCX (max. 10MB)",
          file,
          onFileSelect: (files) => {
            form.setValue("file", files);
          },
          onFileDelete: () => {
            form.setValue("file", null);
          },
          preview() {
            const name = this.file.name;
            const label = name.length > 10 ? `${name.slice(0, 10)}...` : name;
            return (
              <div className="flex items-center gap-4 p-4">
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-popover)]">
                    <FileText className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      title={name}
                      className="text-sm font-medium text-primary truncate"
                    >
                      {label}
                    </p>
                  </div>
                </div>
              </div>
            );
          },
        },
      ]
    : [];

  const onTagDelete = (goal) => {
    const currentGoals = goals || [];
    const filteredGoals = currentGoals.filter((g) => g !== goal);
    form.setValue("goals", filteredGoals, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCreateProgram = async (data) => {
    toast.promise(createProgram(data), {
      loading: "Creating program...",
      success: (data) => {
        setSheetOpen(false);
        form.reset();
        return `Program ${data.title} created successfully`;
      },
      error: "Failed to create program",
    });
  };

  const handleUpdateProgram = async (data) => {
    toast.promise(updateProgram(initialValues._id, data), {
      loading: "Updating program...",
      success: (updated) => {
        setSheetOpen(false);
        form.reset();
        return `Program ${updated.title} updated successfully`;
      },
      error: "Failed to update program",
    });
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button>Create New Program</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[600px] px-6 py-4 overflow-y-auto overflow-x-clip">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2 text-2xl font-bold text-foreground mb-4">
              <BookOpen className="h-5 w-5" />
              {initialValues ? "Edit Program" : "Add New Program"}
            </div>
          </SheetTitle>
          <SheetDescription>
            {initialValues
              ? "Update the program details"
              : "create program by filling out this form"}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              initialValues ? handleUpdateProgram : handleCreateProgram
            )}
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
                        <FormLabel className="text-sm font-medium text-secondary-foreground">
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
                <FileUpload key={config.id} config={config} />
              ))}
            </div>

            <Button type="submit" className="col-span-1 sm:col-span-4 w-full">
              {initialValues ? "Update Program" : "Create Program"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
