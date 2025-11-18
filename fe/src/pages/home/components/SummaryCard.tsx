interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
}

export default function SummaryCard({ title, value, subtitle, icon, color = 'orange' }: SummaryCardProps) {
  const colorClasses = {
    orange: 'bg-orange-50 border-orange-200',
    teal: 'bg-teal-50 border-teal-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200'
  };

  const iconColorClasses = {
    orange: 'text-orange-500',
    teal: 'text-teal-500',
    blue: 'text-blue-500',
    green: 'text-green-500'
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border-2 rounded-lg p-6 flex flex-col items-center justify-center`}>
      {icon && (
        <div className="mb-3">
          <i className={`${icon} text-3xl ${iconColorClasses[color as keyof typeof iconColorClasses]}`}></i>
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
    </div>
  );
}