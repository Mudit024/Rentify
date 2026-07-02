const StatCard = ({ label, value, icon: Icon, accent = 'primary' }) => {
  const accents = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300',
    gold: 'bg-luxury-gold/10 text-luxury-gold',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  };

  return (
    <div className="rounded-2xl border border-gray-105 dark:border-gray-800/80 bg-white/70 dark:bg-luxury-deep/70 backdrop-blur-md p-6 shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        {Icon && (
          <div className={`rounded-xl p-2.5 shadow-sm ${accents[accent]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-extrabold text-gray-900 dark:text-luxury-ivory tracking-tight">{value}</p>
    </div>
  );
};

export default StatCard;
