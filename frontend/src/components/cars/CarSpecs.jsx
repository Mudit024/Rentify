import { Calendar, Fuel, Settings2, Users, Gauge, Palette } from 'lucide-react';

const CarSpecs = ({ car }) => {
  const specs = [
    { icon: Calendar, label: 'Year', value: car.year },
    { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
    { icon: Settings2, label: 'Transmission', value: car.transmission },
    { icon: Users, label: 'Seats', value: car.seats },
    { icon: Gauge, label: 'Mileage', value: `${car.mileage} mi` },
    { icon: Palette, label: 'Color', value: car.color },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {specs.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 text-center">
          <Icon className="mx-auto h-5 w-5 text-primary-600" />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="font-medium text-gray-900 dark:text-luxury-ivory">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default CarSpecs;
