import { useEffect } from 'react';

export function useAutoAdvance(
  running: boolean,
  step: number,
  lastStep: number,
  delay: number,
  setStep: (step: number) => void,
  setRunning: (running: boolean) => void,
) {
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      const nextStep = Math.min(step + 1, lastStep);
      setStep(nextStep);
      if (nextStep === lastStep) setRunning(false);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [running, step, lastStep, delay, setStep, setRunning]);
}
