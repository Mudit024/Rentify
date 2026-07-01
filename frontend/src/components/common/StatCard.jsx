const StatCard = ({ label, value, icon: Icon, accent = 'primary' }) => {
  const accents = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300',
    gold: 'bg-luxury-gold/10 text-luxury-gold',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  };

  return (
    <div className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {Icon && (
          <div className={`rounded-lg p-2 ${accents[accent]}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-gray-900 dark:text-luxury-ivory">{value}</p>
    </div>
  );
};

export default StatCard;
