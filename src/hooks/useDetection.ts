import { useEffect, useState } from 'react';
import { detectVPN, detectAdBlocker } from '@/utils/detection';

// Custom hook to use VPN detection
export const useVPNDetection = (): { isVPN: boolean, confidence: number, reason?: string } => {
  const [result, setResult] = useState<{ isVPN: boolean, confidence: number, reason?: string }>({
    isVPN: false,
    confidence: 0,
    reason: ''
  });

  useEffect(() => {
    const checkVPN = async () => {
      try {
        const res = await detectVPN();
        setResult(res);
      } catch (error) {
        console.error('Error in useVPNDetection:', error);
        setResult({ isVPN: false, confidence: 0, reason: 'Detection failed' });
      }
    };
    checkVPN();
  }, []);

  return result;
};

// Custom hook to use AdBlocker detection
export const useAdBlockerDetection = (): boolean => {
  const [isAdBlocker, setIsAdBlocker] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdBlocker = async () => {
      try {
        const result = await detectAdBlocker();
        if (mounted) {
          setIsAdBlocker(result);
        }
      } catch (error) {
        console.error('Error in useAdBlockerDetection:', error);
        if (mounted) {
          setIsAdBlocker(false);
        }
      }
    };

    checkAdBlocker();

    return () => {
      mounted = false;
    };
  }, []);

  return isAdBlocker;
};
