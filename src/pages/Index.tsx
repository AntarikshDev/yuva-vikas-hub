import React, { useState } from 'react';
import { MobileAppLayout } from '@/layouts/MobileAppLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight, AtSign, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Login schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Demo accounts for easy login
const demoAccounts = {
  super_admin: { email: 'admin@lnjskills.com', password: 'admin123' },
  state_head: { email: 'statemanager@lnjskills.com', password: 'state123' },
  center_manager: { email: 'center@lnjskills.com', password: 'center123' },
  mobilizer: { email: 'mobilizer@lnjskills.com', password: 'mobile123' },
  candidate: { email: 'candidate@lnjskills.com', password: 'candi123' },
  company_hr: { email: 'hr@company.com', password: 'hrcomp123' },
};

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); 
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle role selection and navigation for mobile roles
  const handleRoleSelect = (role: string) => {
    switch (role) {
      case 'mobilizer':
        setSelectedRole('mobilizer');
        break;
      case 'candidate':
        navigate('/candidate');
        break;
      default:
        setSelectedRole(role);
        // Fill form with demo account credentials
        if (demoAccounts[role as keyof typeof demoAccounts]) {
          const account = demoAccounts[role as keyof typeof demoAccounts];
          form.setValue('email', account.email);
          form.setValue('password', account.password);
        }
    }
  };

  // Handle login form submission
  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    // Show loading toast
    toast({
      title: "Logging in...",
      description: "Please wait while we verify your credentials.",
    });

    // Simulate API call with timeout
    setTimeout(() => {
      // Check credentials against demo accounts
      const role = Object.entries(demoAccounts).find(
        ([_, account]) => account.email === data.email && account.password === data.password
      )?.[0];

      if (role) {
        toast({
          title: "Login Successful",
          description: `Welcome to LNJ Skills Hub!`,
          variant: "default",
        });

        // Navigate based on role
        switch (role) {
          case 'super_admin':
            navigate('/admin/dashboard');
            break;
          case 'state_head':
            navigate('/state-head/dashboard');
            break;
          case 'center_manager':
            navigate('/center-manager/dashboard');
            break;
          case 'mobilizer':
            navigate('/mobilizer/new');
            break;
          case 'candidate':
            navigate('/candidate');
            break;
          case 'company_hr':
            navigate('/company/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    }, 1500);
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row shadow-xl rounded-xl overflow-hidden">
          {/* Brand Section */}
          <div className="bg-gradient-to-br from-indigo-900 to-violet-800 p-8 text-white md:w-2/5 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-3">LNJ Skills Hub</h1>
              <p className="text-indigo-100 mb-6">Empowering youth through skill development and sustainable employment opportunities.</p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center mr-3">
                    <span className="text-xl">👥</span>
                  </div>
                  <div>
                    <h3 className="font-medium">15,000+ Candidates</h3>
                    <p className="text-xs text-indigo-200">Trained across India</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center mr-3">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="font-medium">300+ Companies</h3>
                    <p className="text-xs text-indigo-200">Employment partners</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center mr-3">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-medium">85% Success Rate</h3>
                    <p className="text-xs text-indigo-200">Placement rate for our graduates</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-sm text-indigo-200">
              © 2025 LNJ Skills Hub. All rights reserved.
            </div>
          </div>
          
          {/* Form Section */}
          <div className="bg-white p-8 md:w-3/5">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="demo">Quick Demo Access</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
                  <p className="text-gray-600">Sign in to your account to continue</p>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                className="pl-10" 
                                {...field} 
                              />
                            </FormControl>
                            <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter your password" 
                                className="pl-10 pr-10" 
                                {...field} 
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <button 
                              type="button" 
                              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="remember" 
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                      </div>
                      <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Forgot password?</a>
                    </div>
                    
                    <Button type="submit" className="w-full flex items-center justify-center gap-2">
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="demo" className="mt-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Quick Demo Access</h2>
                  <p className="text-gray-600">Select a role to quickly explore the platform</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <RoleCard 
                    title="Super Admin" 
                    description="Full system access" 
                    icon="⚙️" 
                    onClick={() => handleRoleSelect('super_admin')} 
                  />
                  <RoleCard 
                    title="State Head" 
                    description="State-level operations" 
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
                    description="Candidate registration" 
                    icon="📱" 
                    onClick={() => handleRoleSelect('mobilizer')} 
                  />
                  <RoleCard 
                    title="Candidate" 
                    description="Training tracking" 
                    icon="👤" 
                    onClick={() => handleRoleSelect('candidate')} 
                  />
                  <RoleCard 
                    title="Company HR" 
                    description="Recruitment & placement" 
                    icon="💼" 
                    onClick={() => handleRoleSelect('company_hr')} 
                  />
                </div>
                
                <p className="mt-4 text-xs text-gray-500">
                  *Demo accounts are pre-filled with sample data for demonstration purposes.
                </p>
              </TabsContent>
            </Tabs>
          </div>
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
      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
      onClick={onClick}
    >
      <span className="text-2xl mr-3 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">{icon}</span>
      <div>
        <h3 className="text-md font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default Index;
