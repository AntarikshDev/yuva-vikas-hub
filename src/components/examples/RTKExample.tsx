import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { loginUser, logoutUser, clearError } from '@/store/slices/authSlice';
import { fetchDashboardStats, setFilters } from '@/store/slices/dashboardSlice';
import { toast } from '@/hooks/use-toast';

const RTKExample: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Access state from Redux store
  const { user, isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const { stats, filters } = useAppSelector(state => state.dashboard);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleFetchStats = () => {
    dispatch(fetchDashboardStats(filters));
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>RTK Authentication Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated ? (
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                onClick={handleLogin} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p>Welcome, {user?.name || 'User'}!</p>
              <p>Email: {user?.email}</p>
              <p>Role: {user?.role}</p>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RTK Dashboard Stats Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleFetchStats}>
            Fetch Dashboard Stats
          </Button>
          
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h3 className="font-semibold">Total Candidates</h3>
                <p className="text-2xl">{stats.totalCandidates}</p>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold">Active Batches</h3>
                <p className="text-2xl">{stats.activeBatches}</p>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold">Placed Candidates</h3>
                <p className="text-2xl">{stats.placedCandidates}</p>
              </div>
              <div className="p-4 border rounded">
                <h3 className="font-semibold">Completion Rate</h3>
                <p className="text-2xl">{stats.completionRate}%</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-semibold">Current Filters:</h4>
            <p>District: {filters.district || 'All'}</p>
            <p>Center: {filters.center || 'All'}</p>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFilterChange({ district: 'District A' })}
              >
                Set District A
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFilterChange({ center: 'Center 1' })}
              >
                Set Center 1
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFilterChange({ district: '', center: '' })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RTKExample;