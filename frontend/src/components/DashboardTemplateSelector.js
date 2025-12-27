export default function DashboardTemplateSelector({ selected, onChange }) {
  const templates = ["general", "sales", "marketing", "finance"];

  return (
    <div className="flex gap-3">
      {templates.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2 rounded-xl
            ${selected === t ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}
          `}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
