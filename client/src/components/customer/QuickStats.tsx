export default function QuickStats() {
  const stats = [
    { value: "50,000+", label: "Satisfied Customers" },
    { value: "100+", label: "Branch Locations" },
    { value: "25+", label: "Years Experience" },
    { value: "4.8/5", label: "Customer Rating" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div 
                className="text-4xl font-bold text-bank-blue mb-2"
                data-testid={`text-stat-value-${index}`}
              >
                {stat.value}
              </div>
              <div 
                className="text-bank-gray font-medium"
                data-testid={`text-stat-label-${index}`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
