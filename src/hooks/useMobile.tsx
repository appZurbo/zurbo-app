
import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check immediately
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
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

    // Check immediately
    checkIfTablet();
    
    // Add event listener
    window.addEventListener('resize', checkIfTablet);
    
    // Cleanup
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

    // Check immediately
    checkIfMobileOrTablet();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobileOrTablet);
    
    // Cleanup
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

    // Check immediately
    checkBreakpoint();
    
    // Add event listener
    window.addEventListener('resize', checkBreakpoint);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
};
