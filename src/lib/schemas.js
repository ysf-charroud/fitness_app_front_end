import { z } from "zod";

const FILE_SIZE_LIMIT = 5000000; // 5MB
const ALLOWED_FILE_TYPES = ["application/pdf"];
export const createProgramSchema = z.object({
  title: z.string()
    .min(2, "Title must be at least 2 characters long")
    .max(50, "Title cannot exceed 50 characters"),
  price: z.coerce.number().int("Please enter a whole number for the price").min(5, "Price must be at least $5").max(10000, "Price cannot exceed $10,000"),
  goals: z.array(z.string()
    .min(2, "Each goal must be at least 2 characters long")
    .max(100, "Each goal cannot exceed 100 characters"))
    .min(1, "At least one goal is required"),
  period: z.coerce.number().int("Please enter a whole number for the duration").min(1, "Duration must be at least 1 day").max(365, "Duration cannot exceed 365 days"),
  program: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, {
      message: "Please select a program file",
    })
    .refine((files) => files[0].type === "application/pdf", {
      message: "Only PDF files are accepted for the program",
    })
    .refine(
      (files) => files.length === 1 && files[0].size <= FILE_SIZE_LIMIT,
      "Program file must be smaller than 5MB"
    ),
    
  cover: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, {
      message: "Please select a cover image",
    })
    .refine((files) => files[0].type.startsWith("image/"), {
      message: "Cover must be an image file (JPEG or PNG)",
    })
    .refine(
      (files) => files.length === 1 && files[0].size <= FILE_SIZE_LIMIT,
      "Cover image must be smaller than 5MB"
    ),
});
