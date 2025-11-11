import React, { useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { fetchNHMobilisation } from '@/store/slices/nationalHeadSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Bell, Target } from 'lucide-react';

const NationalHeadMobilisationMonitoring = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mobilisation, filters, isLoading } = useAppSelector((state) => state.nationalHead);

  useEffect(() => {
    dispatch(fetchNHMobilisation(filters));
  }, [dispatch, filters]);

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

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Mobilisation Overview</h2>
          <p className="text-muted-foreground">Detailed monitoring features coming soon...</p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default NationalHeadMobilisationMonitoring;
