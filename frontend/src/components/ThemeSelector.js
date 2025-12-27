export default function ThemeSelector({ selected, onChange }) {
  const themes = ["light", "dark", "powerbi", "dark_minimal"];

  return (
    <div className="flex gap-3">
      {themes.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2 rounded-xl
            ${selected === t ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-200"}
          `}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
