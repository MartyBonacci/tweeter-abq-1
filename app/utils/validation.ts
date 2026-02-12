import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SigninInput = z.infer<typeof signinSchema>;

export const tweetSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Tweet cannot be empty")
    .max(140, "Tweet must be 140 characters or fewer"),
});

export type TweetInput = z.infer<typeof tweetSchema>;

export const profileEditSchema = z.object({
  bio: z.string().max(160, "Bio must be 160 characters or fewer").optional(),
});

export type ProfileEditInput = z.infer<typeof profileEditSchema>;
