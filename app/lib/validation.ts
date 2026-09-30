// Reglas compartidas entre el quiz (navegador) y /api/submit-quiz (servidor).

function str(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

// Número completo con código de país: entre 9 y 15 dígitos (límite E.164).
export function phoneError(v: unknown): string | undefined {
  const s = str(v);
  const digits = s.replace(/\D/g, "");
  if (!digits) return "Ingresa tu número de WhatsApp.";
  if (/[^\d\s()+-]/.test(s) || digits.length < 9 || digits.length > 15)
    return "Número inválido. Incluye el código de país, por ejemplo +506 8888 8888.";
}

export function consentError(v: unknown): string | undefined {
  if (v !== true) return "Debes aceptar la política de privacidad para continuar.";
}
