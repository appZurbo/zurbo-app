
import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
};

// Hook specifically for tablet detection (768px to 1024px)
export const useTablet = () => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkIfTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };

    checkIfTablet();
    window.addEventListener('resize', checkIfTablet);

    return () => window.removeEventListener('resize', checkIfTablet);
  }, []);

  return isTablet;
};

// Hook for mobile or tablet (up to 1024px)
export const useMobileOrTablet = () => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkIfMobileOrTablet = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };

    checkIfMobileOrTablet();
    window.addEventListener('resize', checkIfMobileOrTablet);

    return () => window.removeEventListener('resize', checkIfMobileOrTablet);
  }, []);

  return isMobileOrTablet;
};

// Hook for responsive breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);

    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
};
