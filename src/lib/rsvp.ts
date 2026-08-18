import type { Project } from "@/types/invitation";

export interface RsvpContact {
  phone: string;
  label: string;
}

export function getRsvpContacts(project: Project): RsvpContact[] {
  const extra = (project.extra_config?.rsvp_phones as RsvpContact[] | undefined) ?? [];
  if (extra.length > 0) return extra;
  return project.rsvp_phone ? [{ phone: project.rsvp_phone, label: "" }] : [];
}

export function getRsvpEmail(project: Project): string | null {
  return (project.extra_config?.rsvp_email as string) || null;
}
