const stats = [
  { value: "12+", label: "Products shipped" },
  { value: "95+", label: "Target Lighthouse" },
  { value: "0", label: "Known high vulns" },
  { value: "24h", label: "Avg feedback loop" },
] as const;

export function StatsStrip() {
  return (
    <dl className="stats-strip">
      {stats.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
