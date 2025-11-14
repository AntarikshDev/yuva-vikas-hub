import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const OFRMonitoring = () => {
  return (
    <MainLayout role="director">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">OFR Monitoring</h1>
          <p className="text-muted-foreground">Monitor and track Offer For Registration (OFR) across the nation</p>
        </div>

        {/* Placeholder Content */}
        <Card className="p-12">
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <Construction className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                OFR Monitoring page is under construction and will be available soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default OFRMonitoring;
