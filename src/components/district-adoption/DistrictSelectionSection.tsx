import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MapPin, Users, BarChart3, CheckCircle, AlertCircle, Lightbulb, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { jharkhandDistricts, calculateDistrictPriority, DistrictData, trainingCenters } from '@/data/jharkhandCensusData';

interface DistrictSelectionSectionProps {
  canEdit: boolean;
  adoptedDistricts: string[];
  onAdoptDistrict: (districtId: string) => void;
}

export const DistrictSelectionSection: React.FC<DistrictSelectionSectionProps> = ({
  canEdit,
  adoptedDistricts,
  onAdoptDistrict
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');

  const selectedDistrict = jharkhandDistricts.find(d => d.id === selectedDistrictId);
  const isAdopted = selectedDistrictId ? adoptedDistricts.includes(selectedDistrictId) : false;

  const handleAdoptDistrict = () => {
    if (selectedDistrictId && !isAdopted) {
      onAdoptDistrict(selectedDistrictId);
      toast.success(`${selectedDistrict?.name} district adopted successfully!`);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
    return num.toString();
  };

  const actionPoints = [
    { icon: MapPin, text: 'Identify high-density blocks within the district for focused mobilization' },
    { icon: Users, text: 'Plan for 2-3 blocks at a time with dedicated ground team' },
    { icon: Building2, text: 'Structure ground team: 1 DMM + 2-3 Mobilizers per block' },
    { icon: BarChart3, text: 'Create school principal lists for CRP network development' },
    { icon: CheckCircle, text: 'Panchayat-wise CRP appointments targeting influential locals' },
    { icon: AlertCircle, text: 'Plan Rozgar Mela (1/month) & Rozgar Sabha (6/month) events' }
  ];

  // Calculate priority scores for all districts
  const prioritizedDistricts = jharkhandDistricts
    .map(d => ({ ...d, priority: calculateDistrictPriority(d) }))
    .sort((a, b) => b.priority - a.priority);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Selector */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select District
            </CardTitle>
            <CardDescription>Choose a district to view details and adopt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedDistrictId} onValueChange={setSelectedDistrictId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>
              <SelectContent>
                {prioritizedDistricts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    <div className="flex items-center justify-between w-full gap-2">
                      <span>{district.name}</span>
                      {adoptedDistricts.includes(district.id) && (
                        <Badge variant="default" className="text-xs">Adopted</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedDistrict && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority Score</span>
                  <Badge variant={calculateDistrictPriority(selectedDistrict) > 60 ? 'default' : 'secondary'}>
                    {calculateDistrictPriority(selectedDistrict)}/100
                  </Badge>
                </div>
                <Progress value={calculateDistrictPriority(selectedDistrict)} className="h-2" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Population</p>
                    <p className="font-semibold">{formatNumber(selectedDistrict.population)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Density</p>
                    <p className="font-semibold">{selectedDistrict.density}/km²</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Literacy</p>
                    <p className="font-semibold">{selectedDistrict.literacy}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">BPL</p>
                    <p className="font-semibold">{selectedDistrict.bplPercentage}%</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Assigned Training Center</p>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    {trainingCenters.find(tc => tc.assignedDistricts.includes(selectedDistrictId))?.name || 'Not Assigned'}
                  </Badge>
                </div>

                <Button 
                  className="w-full" 
                  disabled={!canEdit || isAdopted}
                  onClick={handleAdoptDistrict}
                >
                  {isAdopted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      District Adopted
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Adopt District
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Block-level Data */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDistrict ? `${selectedDistrict.name} - Block Details` : 'Block-level Data'}
            </CardTitle>
            <CardDescription>
              {selectedDistrict 
                ? `${selectedDistrict.blocks.length} blocks | Total Area: ${selectedDistrict.area} sq.km`
                : 'Select a district to view block-level details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDistrict ? (
              <div className="max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Block Name</TableHead>
                      <TableHead className="text-right">Population</TableHead>
                      <TableHead className="text-right">Area (km²)</TableHead>
                      <TableHead className="text-right">Density</TableHead>
                      <TableHead className="text-right">Sex Ratio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDistrict.blocks
                      .sort((a, b) => b.density - a.density)
                      .map((block, index) => (
                        <TableRow key={block.name}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {index < 3 && (
                                <Badge variant="default" className="text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                                  {index + 1}
                                </Badge>
                              )}
                              {block.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{formatNumber(block.population)}</TableCell>
                          <TableCell className="text-right">{block.area.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={block.density > 500 ? 'default' : 'secondary'}>
                              {block.density}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{block.sexRatio}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a district to view block-level data</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            District Adoption Action Points
          </CardTitle>
          <CardDescription>Key steps to follow after adopting a district</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <div className="p-2 rounded-full bg-primary/10">
                  <point.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm">{point.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle>District Priority Ranking</CardTitle>
          <CardDescription>
            Based on density (40%), historical performance (30%), and distance from TC (30%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Priority Score</TableHead>
                <TableHead className="text-right">Density</TableHead>
                <TableHead className="text-right">FY22-23 Enrolment</TableHead>
                <TableHead className="text-right">Nearest TC</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prioritizedDistricts.map((district, index) => (
                <TableRow key={district.id}>
                  <TableCell>
                    <Badge variant={index < 3 ? 'default' : 'outline'}>{index + 1}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{district.name}</TableCell>
                  <TableCell className="text-right">
                    <Progress value={district.priority} className="h-2 w-20 inline-block mr-2" />
                    {district.priority}
                  </TableCell>
                  <TableCell className="text-right">{district.density}</TableCell>
                  <TableCell className="text-right">{district.historicalEnrolment.total}</TableCell>
                  <TableCell className="text-right">
                    {Math.min(district.distanceFromTC1, district.distanceFromTC2)} km
                  </TableCell>
                  <TableCell>
                    {adoptedDistricts.includes(district.id) ? (
                      <Badge variant="default">Adopted</Badge>
                    ) : (
                      <Badge variant="outline">Available</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
