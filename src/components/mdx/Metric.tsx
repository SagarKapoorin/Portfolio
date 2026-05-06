type MetricProps = {
  label: string;
  value: string;
};

export function Metric({ label, value }: MetricProps) {
  return (
    <div className="portfolio-panel-flat p-4">
      <p className="text-2xl font-semibold text-[#f7f8f8]">{value}</p>
      <p className="mt-2 text-sm text-[#8a8f98]">{label}</p>
    </div>
  );
}

