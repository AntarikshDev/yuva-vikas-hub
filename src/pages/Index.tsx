
import React, { useState } from 'react';
import { MobileAppLayout } from '@/layouts/MobileAppLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle role selection and navigation
  const handleRoleSelect = (role: string) => {
    switch (role) {
      case 'super_admin':
        navigate('/admin/dashboard');
        break;
      case 'state_head':
        navigate('/state-head/dashboard');
        break;
      case 'mobilizer':
        setSelectedRole('mobilizer');
        break;
      case 'candidate':
        navigate('/candidate');
        break;
      default:
        setSelectedRole(role);
    }
  };

  // If a mobile role is selected, show mobile interface
  if (selectedRole === 'mobilizer') {
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
  }

  // Default landing page with role selection
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Yuva Vikas Hub</h1>
          <p className="text-xl text-neutral-600">Select your role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <RoleCard 
            title="Super Admin" 
            description="Full system access and management" 
            icon="⚙️" 
            onClick={() => handleRoleSelect('super_admin')} 
          />
          <RoleCard 
            title="State Head" 
            description="State-level operations management" 
            icon="🏛️" 
            onClick={() => handleRoleSelect('state_head')} 
          />
          <RoleCard 
            title="Center Manager" 
            description="Training center management" 
            icon="🏢" 
            onClick={() => handleRoleSelect('center_manager')} 
          />
          <RoleCard 
            title="Mobilizer" 
            description="Candidate registration and tracking" 
            icon="📱" 
            onClick={() => handleRoleSelect('mobilizer')} 
          />
          <RoleCard 
            title="Candidate" 
            description="Training and placement tracking" 
            icon="👤" 
            onClick={() => handleRoleSelect('candidate')} 
          />
          <RoleCard 
            title="Company HR" 
            description="Recruitment and placement" 
            icon="💼" 
            onClick={() => handleRoleSelect('company_hr')} 
          />
        </div>
      </div>
    </div>
  );
};

// Role selection card component
interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <div 
      className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-neutral-600 mb-3">{description}</p>
      <Button className="w-full">Enter as {title}</Button>
    </div>
  );
};

export default Index;
