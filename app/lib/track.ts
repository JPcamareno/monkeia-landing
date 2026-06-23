export function trackLead(value?: number) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", value ? { value, currency: "CRC" } : undefined);
  }
}

export function trackSchedule() {
  if (typeof window !== "undefined" && window.fbq) window.fbq("track", "Schedule");
}

export function trackContact() {
  if (typeof window !== "undefined" && window.fbq) window.fbq("track", "Contact");
}
