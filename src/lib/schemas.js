import { z } from "zod";

const FILE_SIZE_LIMIT = 5000000; // 5MB
const ALLOWED_FILE_TYPES = ["application/pdf"];
export const createProgramSchema = z.object({
  title: z.string().min(2).max(50),
  price: z.coerce.number().int("Please enter a valid price."),
  goals: z.string().min(2).max(100),
  period: z.coerce.number().int("Please enter a valid duration."),
  program: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, {
      message: "Please upload a program file.",
    })
    .refine(
      (files) => files.length === 1 && files[0].size <= FILE_SIZE_LIMIT,
      "File size should not exceed 5MB."
    ),
});
