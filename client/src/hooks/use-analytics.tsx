import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string | null>(null);
  
  useEffect(() => {
    // Track initial page load (prevLocationRef.current is null on first render)
    // Track navigation changes (when location differs from previous)
    if (prevLocationRef.current === null || location !== prevLocationRef.current) {
      trackPageView(location);
      prevLocationRef.current = location;
    }
  }, [location]);
};
