
import React from 'react';
import { MobileAppLayout } from '@/layouts/MobileAppLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';

const CandidateHome: React.FC = () => {
  // Mock data for candidate
  const candidateData = {
    name: 'Raj Sharma',
    registrationComplete: true,
    batch: {
      name: 'Retail Operations - B045',
      startDate: new Date('2023-06-15'),
    },
    videosRemaining: 2,
    totalVideos: 5,
    salarySlipUploaded: false,
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Please complete watching orientation videos',
      },
      {
        id: '2',
        type: 'info',
        message: 'Your offer letter is ready for download',
      },
    ],
  };

  // Calculate days until batch starts
  const today = new Date();
  const batchStartDate = candidateData.batch.startDate;
  const daysUntilStart = Math.max(
    0,
    Math.ceil((batchStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  // Calculate video progress
  const videosWatched = candidateData.totalVideos - candidateData.videosRemaining;
  const videoProgressPercentage = Math.round((videosWatched / candidateData.totalVideos) * 100);

  return (
    <MobileAppLayout role="candidate" title="Home">
      <div className="space-y-4">
        <div className="rounded-lg bg-primary-500 p-4 text-white">
          <h2 className="text-xl font-semibold">Welcome, {candidateData.name}!</h2>
          <p className="text-sm opacity-90">
            Here's your application status and next steps.
          </p>
        </div>

        <section className="space-y-3">
          {/* Registration Status */}
          <Card className="overflow-hidden border-l-4 border-l-success-500 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Registration Status</p>
                <div className="mt-1 flex items-center">
                  <span className="text-base font-medium">
                    {candidateData.registrationComplete ? 'Complete' : 'Incomplete'}
                  </span>
                  {candidateData.registrationComplete ? (
                    <span className="ml-2 text-xl">✅</span>
                  ) : (
                    <span className="ml-2 text-xl">⚠️</span>
                  )}
                </div>
              </div>
              {!candidateData.registrationComplete && (
                <Button size="sm" variant="default">Complete Now</Button>
              )}
            </div>
          </Card>

          {/* Batch Information */}
          <Card className="p-3">
            <p className="text-sm text-neutral-600">Assigned Batch</p>
            <p className="text-base font-medium">{candidateData.batch.name}</p>
            <div className="mt-2 flex items-center">
              <span className="text-sm font-medium text-primary-600">
                {daysUntilStart > 0
                  ? `Starts in ${daysUntilStart} days`
                  : 'Batch is active'}
              </span>
              {daysUntilStart > 0 && (
                <span className="ml-2 text-lg">⏱️</span>
              )}
            </div>
          </Card>

          {/* Video Progress */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600">Orientation Videos</p>
              <StatusBadge
                label={`${videosWatched}/${candidateData.totalVideos}`}
                variant="info"
              />
            </div>
            
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div 
                className="h-full rounded-full bg-primary-500" 
                style={{ width: `${videoProgressPercentage}%` }}
              />
            </div>
            
            {candidateData.videosRemaining > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
              >
                Watch Pending Videos
              </Button>
            )}
          </Card>

          {/* Salary Slip Status */}
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Salary Slip Uploaded</p>
                <div className="mt-1 flex items-center">
                  <span className="text-base font-medium">
                    {candidateData.salarySlipUploaded ? 'Yes' : 'No'}
                  </span>
                  {candidateData.salarySlipUploaded ? (
                    <span className="ml-2 text-xl">✅</span>
                  ) : (
                    <span className="ml-2 text-xl">❌</span>
                  )}
                </div>
              </div>
              {!candidateData.salarySlipUploaded && (
                <Button size="sm">Upload Now</Button>
              )}
            </div>
          </Card>

          {/* Quick Links */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button className="h-16 flex-col" variant="outline">
              <span className="text-lg">📄</span>
              <span className="text-xs">Documents</span>
            </Button>
            <Button className="h-16 flex-col" variant="outline">
              <span className="text-lg">💼</span>
              <span className="text-xs">Offer Letter</span>
            </Button>
            <Button className="h-16 flex-col" variant="outline">
              <span className="text-lg">🎥</span>
              <span className="text-xs">Videos</span>
            </Button>
            <Button className="h-16 flex-col" variant="outline">
              <span className="text-lg">🆘</span>
              <span className="text-xs">Raise SOS</span>
            </Button>
          </div>

          {/* Alerts */}
          <div className="mt-4 space-y-2">
            <p className="font-medium">Alerts & Notifications</p>
            {candidateData.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-md p-3 ${
                  alert.type === 'warning'
                    ? 'bg-warning-50 border border-warning-200'
                    : alert.type === 'info'
                    ? 'bg-info-50 border border-info-200'
                    : 'bg-neutral-50 border border-neutral-200'
                }`}
              >
                <div className="flex">
                  <span className="mr-2 text-lg">
                    {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                  </span>
                  <span className="text-sm">{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileAppLayout>
  );
};

export default CandidateHome;
