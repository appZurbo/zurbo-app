
import React from 'react';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import PartnersSection from '@/components/sections/PartnersSection';

const Index = () => {
  return (
    <UnifiedLayout>
      <div className="min-h-screen">
        <HeroSection />
        <PartnersSection />
      </div>
    </UnifiedLayout>
  );
};

export default Index;
