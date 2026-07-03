import { useRef, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (callback, hasMore) => {
  const observerRef = useRef(null);

  const sentinelRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [callback, hasMore]
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return sentinelRef;
};
