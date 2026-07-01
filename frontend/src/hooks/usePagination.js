import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);

  const nextPage = useCallback((totalPages) => setPage((p) => Math.min(p + 1, totalPages || p + 1)), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(p - 1, 1)), []);
  const goToPage = useCallback((p) => setPage(Math.max(p, 1)), []);
  const reset = useCallback(() => setPage(1), []);

  return { page, nextPage, prevPage, goToPage, reset };
};
