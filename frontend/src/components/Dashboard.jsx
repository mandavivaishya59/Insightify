export default function Dashboard({ charts }) {
  return (
    <div className="grid grid-cols-12 gap-6 mt-8">
      {charts.map((c, i) => (
        <div
          key={i}
          className={`bg-white rounded-xl shadow p-4
            ${c.type === "kpi" ? "col-span-3" : "col-span-6"}
          `}
        >
          <h4 className="font-semibold mb-2">{c.title}</h4>
          <img src={c.url} className="w-full" />
        </div>
      ))}
    </div>
  );
}
