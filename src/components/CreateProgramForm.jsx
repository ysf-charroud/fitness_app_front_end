import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BookOpen } from "lucide-react";
import { createProgramSchema } from "@/lib/schemas";
import api from "@/services/axios/axiosClient";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components//ui/sheet";

export function CreateProgramForm() {
  const fields = [
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

  const form = useForm({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      title: "",
      price: 0,
      goals: "",
      period: 0,
      program: null,
    },
  });

  const onSubmit = async (data) => {
    const programFormData = new FormData();
    programFormData.append("title", data.title);
    programFormData.append("price", data.price);
    programFormData.append("goals", data.goals);
    programFormData.append("period", data.period);
    programFormData.append("program", data.program[0]);

    const response = await api.post("/api/programs", programFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmEwYmExYjcyZDEyNDllMTI3YTE3NSIsInJvbGUiOiJjb2FjaCIsImlhdCI6MTc2MTIxNzUwNSwiZXhwIjoxNzYyNTEzNTA1fQ.7qXVLtYi2iKxYtd1129ljPd5WOUVm_RBvNrbJS11Xn4"}`,
      },
    });
    console.log("Program created:", response.data);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Button>Create New Program</Button>
      </SheetTrigger>
      <SheetContent className={"w-[900px]"}>
        <SheetHeader>
          <BookOpen className="h-5 w-5" />
          Add New Program
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-8"
          >
            {fields.map((f) => (
              <FormField
                key={f.title}
                control={form.control}
                name={f.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{f.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={f.type}
                        placeholder={f.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{f.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <input
              id={"program"}
              name="program"
              type="file"
              {...form.register("program")}
              className="hidden"
            />
            <label htmlFor="program"> upload file</label>

            <Button type="submit" className="w-full">
              Create New Program
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
