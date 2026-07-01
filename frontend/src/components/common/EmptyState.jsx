const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-gray-200 dark:border-gray-800 px-6 py-16 text-center">
    {Icon && (
      <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    )}
    <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-luxury-ivory">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
