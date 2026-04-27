import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export function RealtimeMockEngine() {
  const tickRealtime = useAppStore((state) => state.tickRealtime);

  useEffect(() => {
    tickRealtime();
    const timer = window.setInterval(tickRealtime, 2400);

    return () => window.clearInterval(timer);
  }, [tickRealtime]);

  return null;
}
