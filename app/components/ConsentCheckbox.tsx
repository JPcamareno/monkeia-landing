"use client";

export default function ConsentCheckbox({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-left text-xs leading-relaxed text-white/50">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error}
          className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-[#378ADD]"
        />
        <span>
          Acepto la{" "}
          {/* Nueva pestaña: el quiz no guarda estado y se perdería el resultado */}
          <a
            href="/privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#378ADD] underline underline-offset-2 hover:opacity-80"
          >
            política de privacidad
          </a>{" "}
          y autorizo a Monkeia a usar mis datos para enviarme el plan y contactarme.
        </span>
      </label>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
