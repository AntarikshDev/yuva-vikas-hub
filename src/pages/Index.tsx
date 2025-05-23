
import React from 'react';
import { MobileAppLayout } from '@/layouts/MobileAppLayout';

const Index = () => {
  return (
    <MobileAppLayout role="mobilizer" title="Yuva Vikas Hub">
      <div className="flex flex-col space-y-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Welcome to Yuva Vikas Hub</h2>
          <p className="text-gray-600">
            Your platform for mobilizer and candidate management.
          </p>
        </div>
        
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-md font-medium">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded bg-primary-50 p-3 text-center text-sm font-medium text-primary-700">
              Register New Candidate
            </button>
            <button className="rounded bg-primary-50 p-3 text-center text-sm font-medium text-primary-700">
              View Candidate List
            </button>
            <button className="rounded bg-primary-50 p-3 text-center text-sm font-medium text-primary-700">
              Training Videos
            </button>
            <button className="rounded bg-primary-50 p-3 text-center text-sm font-medium text-primary-700">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default Index;
