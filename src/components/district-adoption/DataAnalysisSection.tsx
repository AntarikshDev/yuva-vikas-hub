import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, MapPin, Route } from 'lucide-react';
import { jharkhandDistricts, trainingCenters } from '@/data/jharkhandCensusData';
import { DistrictAnalysisData, tradeCategories } from '@/utils/districtTemplateGenerator';

interface DataAnalysisSectionProps {
  analysisData?: DistrictAnalysisData;
  selectedYear?: string;
}

export const DataAnalysisSection: React.FC<DataAnalysisSectionProps> = ({ analysisData, selectedYear = '2022-23' }) => {
  const [activeChart, setActiveChart] = useState('enrolment');

  // Use analysisData if provided, otherwise fallback to jharkhand data
  const enrolmentData = analysisData?.enrolment 
    ? analysisData.enrolment
        .map(d => ({
          name: d.district,
          total: d.total,
          ssmo: d.ssmo,
          smo: d.smo || 0,
          st: d.st || 0,
          gda: d.gda || 0,
          hha: d.hha || 0,
          it: d.it || 0,
          fma: d.fma
        }))
        .sort((a, b) => b.total - a.total)
    : jharkhandDistricts
        .map(d => ({
          name: d.name,
          total: d.historicalEnrolment.total,
          ssmo: d.historicalEnrolment.ssmo,
          smo: Math.floor(d.historicalEnrolment.ssmo * 0.8),
          st: 0,
          gda: 0,
          hha: 0,
          it: 0,
          fma: d.historicalEnrolment.fma
        }))
        .sort((a, b) => b.total - a.total);

  // Trade-wise top 5 - derive from enrolment data
  const tradeWiseData = {
    ssmo: [...enrolmentData].sort((a, b) => b.ssmo - a.ssmo).slice(0, 5),
    smo: [...enrolmentData].sort((a, b) => b.smo - a.smo).slice(0, 5),
    fma: [...enrolmentData].sort((a, b) => b.fma - a.fma).slice(0, 5)
  };

  // Density data
  const densityData = analysisData?.density
    ? [...analysisData.density]
        .sort((a, b) => b.density - a.density)
        .map(d => ({ name: d.district, density: d.density, population: d.population }))
    : [...jharkhandDistricts]
        .sort((a, b) => b.density - a.density)
        .map(d => ({ name: d.name, density: d.density, population: d.population }));

  // Distance matrix
  const distanceMatrix = analysisData?.distance
    ? analysisData.distance.map(d => ({
        district: d.district,
        tc1Distance: d.tc1Distance,
        tc2Distance: d.tc2Distance,
        tc3Distance: d.tc3Distance,
        minDistance: Math.min(d.tc1Distance, d.tc2Distance, d.tc3Distance),
        tc1Name: d.tc1Name,
        tc2Name: d.tc2Name,
        tc3Name: d.tc3Name
      })).sort((a, b) => a.minDistance - b.minDistance)
    : jharkhandDistricts.map(d => ({
        district: d.name,
        tc1Distance: d.distanceFromTC1,
        tc2Distance: d.distanceFromTC2,
        tc3Distance: d.distanceFromTC3,
        minDistance: Math.min(d.distanceFromTC1, d.distanceFromTC2, d.distanceFromTC3),
        tc1Name: trainingCenters[0].name,
        tc2Name: trainingCenters[1].name,
        tc3Name: trainingCenters[2].name
      })).sort((a, b) => a.minDistance - b.minDistance);

  const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

  const getDistanceColor = (distance: number) => {
    if (distance < 100) return 'bg-green-100 text-green-800';
    if (distance < 200) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeChart} onValueChange={setActiveChart}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="enrolment" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Enrolment
          </TabsTrigger>
          <TabsTrigger value="tradewise" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trade-wise
          </TabsTrigger>
          <TabsTrigger value="density" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Density
          </TabsTrigger>
          <TabsTrigger value="distance" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Distance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enrolment" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>District-wise Historical Enrolment (FY {selectedYear})</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={enrolmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ssmo" stackId="a" fill="#3b82f6" name="SSMO" />
                    <Bar dataKey="smo" stackId="a" fill="#10b981" name="SMO" />
                    <Bar dataKey="fma" stackId="a" fill="#8b5cf6" name="FMA" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enrolment Summary Table</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>District</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">SSMO</TableHead>
                      <TableHead className="text-right">SMO</TableHead>
                      <TableHead className="text-right">FMA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolmentData.map((d, i) => (
                      <TableRow key={d.name}>
                        <TableCell className="font-medium">
                          {i + 1}. {d.name}
                        </TableCell>
                        <TableCell className="text-right font-semibold">{d.total}</TableCell>
                        <TableCell className="text-right">{d.ssmo}</TableCell>
                        <TableCell className="text-right">{d.smo}</TableCell>
                        <TableCell className="text-right">{d.fma}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tradewise" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(['ssmo', 'smo', 'fma'] as const).map((trade) => (
              <Card key={trade}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Top 5 Districts - {trade.toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={tradeWiseData[trade].map(d => ({ name: d.name, value: d[trade] }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tradeWiseData[trade].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {tradeWiseData[trade].map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                          <span>{d.name}</span>
                        </div>
                        <Badge variant="secondary">{d[trade]}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="density" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Population Density by District</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={densityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="density" fill="#6366f1" name="Density (per sq.km)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 10 High-Density Districts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead className="text-right">Density</TableHead>
                      <TableHead className="text-right">Population</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {densityData.slice(0, 10).map((d, i) => (
                      <TableRow key={d.name}>
                        <TableCell>
                          <Badge variant={i < 3 ? 'default' : 'outline'}>{i + 1}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell className="text-right font-semibold">{d.density.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{(d.population / 100000).toFixed(1)}L</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Training Center Distance Matrix</span>
                <div className="flex gap-4 text-sm font-normal">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                    <span>&lt; 100 km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></div>
                    <span>100-200 km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
                    <span>&gt; 200 km</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>District</TableHead>
                    <TableHead className="text-center">{distanceMatrix[0]?.tc1Name || 'Training Center 1'}</TableHead>
                    <TableHead className="text-center">{distanceMatrix[0]?.tc2Name || 'Training Center 2'}</TableHead>
                    <TableHead className="text-center">{distanceMatrix[0]?.tc3Name || 'Training Center 3'}</TableHead>
                    <TableHead className="text-center">Nearest TC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distanceMatrix.map((d) => (
                    <TableRow key={d.district}>
                      <TableCell className="font-medium">{d.district}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getDistanceColor(d.tc1Distance)}>{d.tc1Distance} km</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getDistanceColor(d.tc2Distance)}>{d.tc2Distance} km</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getDistanceColor(d.tc3Distance)}>{d.tc3Distance} km</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-semibold">
                          {d.minDistance} km
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
