import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Briefcase, TrendingUp } from 'lucide-react';

const DirectorDashboard = () => {
  const navigate = useNavigate();

  const dashboardSections = [
    {
      title: 'Mobilisation',
      description: 'Track candidate mobilisation, targets, and work orders',
      icon: Users,
      path: '/director/mobilisation',
      color: 'from-blue-500 to-blue-600',
      stats: { active: 12, total: 15 }
    },
    {
      title: 'Training',
      description: 'Monitor training batches, curriculum, and trainer performance',
      icon: GraduationCap,
      path: '/director/training',
      color: 'from-green-500 to-green-600',
      stats: { active: 8, total: 10 }
    },
    {
      title: 'Placements',
      description: 'Oversee placement activities, company partnerships, and success rates',
      icon: Briefcase,
      path: '/director/placements',
      color: 'from-purple-500 to-purple-600',
      stats: { active: 5, total: 8 }
    },
    {
      title: 'Post Placements',
      description: 'Track retention, welfare, and post-placement support',
      icon: TrendingUp,
      path: '/director/post-placements',
      color: 'from-orange-500 to-orange-600',
      stats: { active: 6, total: 7 }
    }
  ];

  return (
    <MainLayout role="director">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Director Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Select an operations module to monitor and manage
          </p>
        </div>

        {/* 4-Tile Launcher Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {dashboardSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.path}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary"
                onClick={() => navigate(section.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${section.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-foreground">
                        {section.stats.active}
                      </span>
                      <span className="text-muted-foreground">Active</span>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {section.stats.total}
                      </span>
                      <span className="text-muted-foreground">Total</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats Overview */}
        <Card>
          <CardHeader>
            <CardTitle>National Overview</CardTitle>
            <CardDescription>Key metrics across all operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold">15,234</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Centers</p>
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs text-blue-600">Across 8 states</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Placement Rate</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-green-600">+5% from target</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">₹28.1Cr</p>
                <p className="text-xs text-muted-foreground">Across all programs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DirectorDashboard;
