import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card } from '@/components/ui/card';

const NationalHeadProfile = () => {
  return (
    <MainLayout role="national-head">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Card className="p-6">
          <p>Profile management coming soon...</p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NationalHeadProfile;
