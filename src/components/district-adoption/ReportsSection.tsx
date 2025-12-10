import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Target, Users, TrendingUp, Calendar } from 'lucide-react';
import { jharkhandDistricts, conversionRates, eventTargets } from '@/data/jharkhandCensusData';

interface ReportsSectionProps {
  adoptedDistricts: string[];
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ adoptedDistricts }) => {
  const [selectedMonth, setSelectedMonth] = useState('2024-02');

  // Mock data for Annexure-3: Target vs Achievement
  const targetVsAchievement = [
    { location: 'Rozgar Sabha 1', events: 2, expectedFootfall: 80, actualFootfall: 75, ofrFilled: 60, counselled: 48, interested: 24, migrated: 18 },
    { location: 'Rozgar Sabha 2', events: 2, expectedFootfall: 80, actualFootfall: 78, ofrFilled: 62, counselled: 50, interested: 25, migrated: 19 },
    { location: 'Rozgar Sabha 3', events: 2, expectedFootfall: 80, actualFootfall: 72, ofrFilled: 58, counselled: 46, interested: 23, migrated: 17 },
    { location: 'Rozgar Mela', events: 1, expectedFootfall: 100, actualFootfall: 95, ofrFilled: 78, counselled: 62, interested: 31, migrated: 24 },
  ];

  const totalRow = {
    location: 'Total',
    events: targetVsAchievement.reduce((sum, r) => sum + r.events, 0),
    expectedFootfall: targetVsAchievement.reduce((sum, r) => sum + r.expectedFootfall, 0),
    actualFootfall: targetVsAchievement.reduce((sum, r) => sum + r.actualFootfall, 0),
    ofrFilled: targetVsAchievement.reduce((sum, r) => sum + r.ofrFilled, 0),
    counselled: targetVsAchievement.reduce((sum, r) => sum + r.counselled, 0),
    interested: targetVsAchievement.reduce((sum, r) => sum + r.interested, 0),
    migrated: targetVsAchievement.reduce((sum, r) => sum + r.migrated, 0),
  };

  // Mock data for Annexure-4: Daily Migration Report
  const dailyMigration = adoptedDistricts.slice(0, 5).map((districtId, index) => {
    const district = jharkhandDistricts.find(d => d.id === districtId);
    return {
      district: district?.name || districtId,
      responsibleLeader: ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sunita Devi', 'Vikash Yadav'][index],
      day1: Math.floor(Math.random() * 5),
      day2: Math.floor(Math.random() * 5),
      day3: Math.floor(Math.random() * 5),
      day4: Math.floor(Math.random() * 5),
      day5: Math.floor(Math.random() * 5),
      day6: Math.floor(Math.random() * 5),
      day7: Math.floor(Math.random() * 5),
      day8: Math.floor(Math.random() * 5),
    };
  });

  // Mock data for Annexure-5: CRP Appointment Report
  const crpAppointment = [
    { event: 'Rozgar Mela', leadTeamMember: 'Rajesh Kumar', crpsIdentified: 12, crpsAppointed: 10, crpsOnApp: 8 },
    { event: 'Rozgar Sabha 1', leadTeamMember: 'Priya Sharma', crpsIdentified: 8, crpsAppointed: 6, crpsOnApp: 5 },
    { event: 'Rozgar Sabha 2', leadTeamMember: 'Amit Singh', crpsIdentified: 10, crpsAppointed: 8, crpsOnApp: 6 },
    { event: 'Rozgar Sabha 3', leadTeamMember: 'Sunita Devi', crpsIdentified: 9, crpsAppointed: 7, crpsOnApp: 5 },
  ];

  const handleExport = (reportType: string) => {
    // Mock export - in real implementation, this would generate PDF/Excel
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Reporting Period:</span>
              </div>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-02">February 2024</SelectItem>
                  <SelectItem value="2024-01">January 2024</SelectItem>
                  <SelectItem value="2023-12">December 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="annexure3">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="annexure3" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Target vs Achievement
          </TabsTrigger>
          <TabsTrigger value="annexure4" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Daily Migration
          </TabsTrigger>
          <TabsTrigger value="annexure5" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            CRP Appointment
          </TabsTrigger>
        </TabsList>

        {/* Annexure-3: Target vs Achievement */}
        <TabsContent value="annexure3" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Annexure-3: Target vs Achievement Report
                </CardTitle>
                <CardDescription>
                  Conversion rates: OFR {conversionRates.ofrFilled * 100}% | Counselled {conversionRates.counselled * 100}% | Interested {conversionRates.interested * 100}% | Migrated {conversionRates.migrated * 100}%
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport('target-vs-achievement')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-center">Events</TableHead>
                    <TableHead className="text-center">Expected Footfall</TableHead>
                    <TableHead className="text-center">Actual Footfall</TableHead>
                    <TableHead className="text-center">OFR Filled (80%)</TableHead>
                    <TableHead className="text-center">Counselled (80%)</TableHead>
                    <TableHead className="text-center">Interested (50%)</TableHead>
                    <TableHead className="text-center">Migrated (75%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {targetVsAchievement.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.location}</TableCell>
                      <TableCell className="text-center">{row.events}</TableCell>
                      <TableCell className="text-center">{row.expectedFootfall}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={row.actualFootfall >= row.expectedFootfall * 0.9 ? 'default' : 'destructive'}>
                          {row.actualFootfall}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{row.ofrFilled}</TableCell>
                      <TableCell className="text-center">{row.counselled}</TableCell>
                      <TableCell className="text-center">{row.interested}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-semibold">{row.migrated}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>{totalRow.location}</TableCell>
                    <TableCell className="text-center">{totalRow.events}</TableCell>
                    <TableCell className="text-center">{totalRow.expectedFootfall}</TableCell>
                    <TableCell className="text-center">{totalRow.actualFootfall}</TableCell>
                    <TableCell className="text-center">{totalRow.ofrFilled}</TableCell>
                    <TableCell className="text-center">{totalRow.counselled}</TableCell>
                    <TableCell className="text-center">{totalRow.interested}</TableCell>
                    <TableCell className="text-center">{totalRow.migrated}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Conversion Metrics */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">Footfall Achievement</p>
                    <p className="text-2xl font-bold">{Math.round((totalRow.actualFootfall / totalRow.expectedFootfall) * 100)}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">OFR Conversion</p>
                    <p className="text-2xl font-bold">{Math.round((totalRow.ofrFilled / totalRow.actualFootfall) * 100)}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">Counselling Rate</p>
                    <p className="text-2xl font-bold">{Math.round((totalRow.counselled / totalRow.ofrFilled) * 100)}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">Migration Rate</p>
                    <p className="text-2xl font-bold">{Math.round((totalRow.migrated / totalRow.interested) * 100)}%</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Annexure-4: Daily Migration Report */}
        <TabsContent value="annexure4" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Annexure-4: Daily Migration Report
                </CardTitle>
                <CardDescription>District-wise daily candidate migration tracking</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport('daily-migration')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>District</TableHead>
                    <TableHead>Responsible Leader</TableHead>
                    <TableHead className="text-center">Day 1</TableHead>
                    <TableHead className="text-center">Day 2</TableHead>
                    <TableHead className="text-center">Day 3</TableHead>
                    <TableHead className="text-center">Day 4</TableHead>
                    <TableHead className="text-center">Day 5</TableHead>
                    <TableHead className="text-center">Day 6</TableHead>
                    <TableHead className="text-center">Day 7</TableHead>
                    <TableHead className="text-center">Day 8</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyMigration.map((row, index) => {
                    const total = row.day1 + row.day2 + row.day3 + row.day4 + row.day5 + row.day6 + row.day7 + row.day8;
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.district}</TableCell>
                        <TableCell>{row.responsibleLeader}</TableCell>
                        <TableCell className="text-center">{row.day1}</TableCell>
                        <TableCell className="text-center">{row.day2}</TableCell>
                        <TableCell className="text-center">{row.day3}</TableCell>
                        <TableCell className="text-center">{row.day4}</TableCell>
                        <TableCell className="text-center">{row.day5}</TableCell>
                        <TableCell className="text-center">{row.day6}</TableCell>
                        <TableCell className="text-center">{row.day7}</TableCell>
                        <TableCell className="text-center">{row.day8}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-semibold">{total}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Annexure-5: CRP Appointment Report */}
        <TabsContent value="annexure5" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Annexure-5: CRP Appointment Report
                </CardTitle>
                <CardDescription>Event-wise CRP identification and appointment tracking</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExport('crp-appointment')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Lead Team Member</TableHead>
                    <TableHead className="text-center">CRPs Identified</TableHead>
                    <TableHead className="text-center">CRPs Appointed (LOI)</TableHead>
                    <TableHead className="text-center">CRPs on App</TableHead>
                    <TableHead className="text-center">Conversion %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crpAppointment.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.event}</TableCell>
                      <TableCell>{row.leadTeamMember}</TableCell>
                      <TableCell className="text-center">{row.crpsIdentified}</TableCell>
                      <TableCell className="text-center">{row.crpsAppointed}</TableCell>
                      <TableCell className="text-center">{row.crpsOnApp}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={row.crpsOnApp / row.crpsIdentified >= 0.6 ? 'default' : 'secondary'}>
                          {Math.round((row.crpsOnApp / row.crpsIdentified) * 100)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-center">{crpAppointment.reduce((s, r) => s + r.crpsIdentified, 0)}</TableCell>
                    <TableCell className="text-center">{crpAppointment.reduce((s, r) => s + r.crpsAppointed, 0)}</TableCell>
                    <TableCell className="text-center">{crpAppointment.reduce((s, r) => s + r.crpsOnApp, 0)}</TableCell>
                    <TableCell className="text-center">
                      <Badge>
                        {Math.round((crpAppointment.reduce((s, r) => s + r.crpsOnApp, 0) / crpAppointment.reduce((s, r) => s + r.crpsIdentified, 0)) * 100)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
