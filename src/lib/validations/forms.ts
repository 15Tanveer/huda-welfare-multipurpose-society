import { z } from "zod";
import { VOLUNTEER_AREAS } from "@/lib/constants";

export const volunteerFormSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{10,15}$/, "Please enter a valid phone number."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  city: z.string().trim().min(2, "Please enter your city.").max(100),
  area_of_interest: z.enum(VOLUNTEER_AREAS, {
    error: "Please select an area of interest.",
  }),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type VolunteerFormInput = z.infer<typeof volunteerFormSchema>;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "Name is too long."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{10,15}$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .min(3, "Please enter a subject.")
    .max(150, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Please share a few more details in your message.")
    .max(2000, "Message is too long."),
  /** Honeypot field: real users never fill this in. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const newsletterFormSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
});

export type NewsletterFormInput = z.infer<typeof newsletterFormSchema>;
