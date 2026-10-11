type FormFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "email";
  autoComplete?: string;
};

export default function FormField({
  id,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="min-h-12 w-full rounded-xl border border-(--bronze)/45 sm:bg-(--cream)/20 bg-(--cream)/60 px-4 text-base outline-none transition placeholder:text-(--bronze)/80 focus:border-[var(--ink)] focus:bg-[var(--cream)]/60 focus:ring-2 focus:ring-(--bronze)/15"
      />
    </div>
  );
}
