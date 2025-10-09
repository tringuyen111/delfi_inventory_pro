import React from 'react';
import Header from '@/components/Header';
import ProjectConfirmation from '@/components/ProjectConfirmation';
import ActionPlan from '@/components/ActionPlan';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <Header />
      <div className="mt-8 space-y-12">
        <ProjectConfirmation />
        <ActionPlan />
      </div>
    </div>
  );
};

export default HomePage;