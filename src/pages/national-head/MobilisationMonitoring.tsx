import React, { useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchNHMobilisation, fetchMobiliserLeaderboard } from '@/store/slices/nationalHeadSlice';
import { Button } from '@/components/ui/button';
import { Download, Bell, Target } from 'lucide-react';
import { NHClusterPerformanceTable } from '@/components/national-head/NHClusterPerformanceTable';
import { NHMobiliserLeaderboard } from '@/components/national-head/NHMobiliserLeaderboard';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const NationalHeadMobilisationMonitoring = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mobilisation, filters, isLoading } = useAppSelector((state) => state.nationalHead);

  useEffect(() => {
    dispatch(fetchNHMobilisation(filters));
    dispatch(fetchMobiliserLeaderboard(filters));
  }, [dispatch, filters]);

  const handleClusterDrillDown = (clusterId: string) => {
    navigate(`/cluster/${clusterId}/dashboard`);
  };

  const handleClusterExport = (clusterId: string) => {
    toast({
      title: 'Export Started',
      description: `Exporting data for cluster ${clusterId}...`,
    });
  };

  const handleSendMessage = (id: string) => {
    toast({
      title: 'Message Dialog',
      description: 'Message functionality will open here',
    });
  };

  const handleMobiliserProfile = (mobiliserId: string) => {
    navigate(`/mobiliser/${mobiliserId}/profile`);
  };

  const handleCall = (mobiliserId: string) => {
    toast({
      title: 'Call Initiated',
      description: `Calling mobiliser ${mobiliserId}...`,
    });
  };

  return (
    <MainLayout role="national-head">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mobilisation Monitoring</h1>
            <p className="text-muted-foreground">Track mobilisation performance across states and clusters</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Assign Targets
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </div>
        </div>

        <NHClusterPerformanceTable
          clusters={mobilisation?.clusters || []}
          isLoading={isLoading}
          onDrillDown={handleClusterDrillDown}
          onExport={handleClusterExport}
          onSendMessage={handleSendMessage}
        />

        <NHMobiliserLeaderboard
          mobilisers={mobilisation?.mobiliserLeaderboard || []}
          isLoading={isLoading}
          onViewProfile={handleMobiliserProfile}
          onSendMessage={handleSendMessage}
          onCall={handleCall}
        />
      </div>
    </MainLayout>
  );
};

export default NationalHeadMobilisationMonitoring;
