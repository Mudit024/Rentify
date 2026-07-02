import { useEffect, useState } from 'react';
import api from '../../services/api.js';



const ApiStatus = () => {
  const [status, setStatus] = useState('checking');
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api.get('/health')
      .then((res) => {
        setStatus('ok');
        setInfo(res);
      })
      .catch(() => setStatus('error'));
  }, []);

  if (import.meta.env.PROD) return null;

  const colors = {
    checking: 'bg-amber-100 text-amber-800 border-amber-200',
    ok:       'bg-emerald-100 text-emerald-800 border-emerald-200',
    error:    'bg-red-100 text-red-800 border-red-200',
  };

  const labels = {
    checking: '⏳ Connecting to API…',
    ok:       '✅ API connected',
    error:    '❌ API unreachable — is the backend running on port 5000?',
  };

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 rounded-xl border px-4 py-2 text-xs font-medium shadow-lg ${colors[status]}`}
    >
      {labels[status]}
      {info?.timestamp && (
        <span className="ml-2 opacity-60">{new Date(info.timestamp).toLocaleTimeString()}</span>
      )}
    </div>
  );
};

export default ApiStatus;
