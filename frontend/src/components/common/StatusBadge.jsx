const StatusBadge = ({ status, colorMap }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${colorMap[status] || 'bg-gray-100 text-gray-700'}`}>
    {status}
  </span>
);

export default StatusBadge;
