"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  contactFormSchema,
  newsletterFormSchema,
  volunteerFormSchema,
} from "@/lib/validations/forms";
import type { ActionResult } from "@/types";

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  return z.flattenError(error).fieldErrors as Record<string, string[]>;
}

const NOT_CONFIGURED_MESSAGE =
  "This form isn't connected yet. Please try again later or reach out via the contact details on this page.";

export async function submitVolunteerForm(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    city: formData.get("city"),
    area_of_interest: formData.get("area_of_interest"),
    message: formData.get("message"),
  };

  const parsed = volunteerFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, message: NOT_CONFIGURED_MESSAGE };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("volunteer_submissions").insert({
    full_name: parsed.data.full_name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    city: parsed.data.city,
    area_of_interest: parsed.data.area_of_interest,
    message: parsed.data.message || null,
  });

  if (error) {
    return {
      success: false,
      message: "Something went wrong while submitting your details. Please try again.",
    };
  }

  return {
    success: true,
    message:
      "Thank you for your interest in volunteering with HUDA. Our team will get in touch with you.",
  };
}

export async function submitContactForm(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    company: formData.get("company"),
  };

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  // Honeypot: bots fill every field, real visitors never see or fill this.
  if (parsed.data.company) {
    return {
      success: true,
      message: "Thank you for contacting HUDA. Your message has been received.",
    };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, message: NOT_CONFIGURED_MESSAGE };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    return {
      success: false,
      message: "Something went wrong while sending your message. Please try again.",
    };
  }

  return {
    success: true,
    message: "Thank you for contacting HUDA. Your message has been received.",
  };
}

export async function subscribeNewsletter(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const parsed = newsletterFormSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, message: NOT_CONFIGURED_MESSAGE };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: parsed.data.email });

  if (error && error.code !== "23505") {
    return { success: false, message: "Something went wrong. Please try again." };
  }

  return { success: true, message: "Thank you for subscribing." };
}
