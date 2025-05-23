
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, Send, Clock, MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';

const PPCScheduleMonitor: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [activeTab, setActiveTab] = useState<string>('schedule');
  const [reminderDialogOpen, setReminderDialogOpen] = useState<boolean>(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const { toast } = useToast();

  // Mock data for PPC visits
  const ppcVisits = [
    {
      id: 1,
      center: "Mumbai Central Training Hub",
      district: "Mumbai",
      date: format(addDays(currentWeekStart, 1), 'yyyy-MM-dd'),
      time: "10:30 AM",
      purpose: "Monthly Review",
      ppcOfficer: "Rajesh Kumar",
      status: "Scheduled",
      reportSubmitted: false
    },
    {
      id: 2,
      center: "Andheri Skill Center",
      district: "Mumbai",
      date: format(addDays(currentWeekStart, 1), 'yyyy-MM-dd'),
      time: "2:00 PM",
      purpose: "Candidate Verification",
      ppcOfficer: "Priya Sharma",
      status: "Scheduled",
      reportSubmitted: false
    },
    {
      id: 3,
      center: "Pune Central Institute",
      district: "Pune",
      date: format(addDays(currentWeekStart, 2), 'yyyy-MM-dd'),
      time: "11:00 AM",
      purpose: "Assessment Monitoring",
      ppcOfficer: "Amit Patel",
      status: "Completed",
      reportSubmitted: true
    },
    {
      id: 4,
      center: "Nagpur Training Academy",
      district: "Nagpur",
      date: format(addDays(currentWeekStart, 4), 'yyyy-MM-dd'),
      time: "1:00 PM",
      purpose: "Center Inspection",
      ppcOfficer: "Sunita Joshi",
      status: "Scheduled",
      reportSubmitted: false
    },
    {
      id: 5,
      center: "Nashik Vocational Center",
      district: "Nashik",
      date: format(addDays(currentWeekStart, 5), 'yyyy-MM-dd'),
      time: "10:00 AM",
      purpose: "Placement Verification",
      ppcOfficer: "Rahul Deshmukh",
      status: "Scheduled",
      reportSubmitted: false
    }
  ];

  // Mock data for missed visits
  const missedVisits = [
    {
      id: 101,
      center: "Thane Training Center",
      district: "Thane",
      scheduledDate: "2023-05-15",
      ppcOfficer: "Vikram Mehta",
      purpose: "Monthly Review",
      reason: "PPC Officer on leave",
      rescheduled: true,
      newDate: "2023-05-22"
    },
    {
      id: 102,
      center: "Kolhapur Skill Hub",
      district: "Kolhapur",
      scheduledDate: "2023-05-17",
      ppcOfficer: "Anjali Singh",
      purpose: "Candidate Verification",
      reason: "Transport issues",
      rescheduled: false,
      newDate: null
    }
  ];

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, -1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleSendReminder = () => {
    toast({
      title: "Reminder Sent",
      description: `Reminder sent to ${selectedVisit.ppcOfficer} for the visit to ${selectedVisit.center}.`,
    });
    setReminderDialogOpen(false);
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

  return (
    <MainLayout role="state_head">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PPC Schedule Monitor</h1>
            <p className="text-muted-foreground">
              Track and manage PPC visit schedules across training centers
            </p>
          </div>
          
          <div className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1 text-sm text-indigo-800 border border-indigo-200">
            <Calendar className="mr-2 h-4 w-4 text-indigo-600" />
            Schedule Monitor | Phase 2 Feature
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-blue-500/20 p-2">
                  <Calendar className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Scheduled Visits</div>
                  <div className="text-2xl font-bold">12</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-amber-500/20 p-2">
                  <AlertCircle className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Pending Reports</div>
                  <div className="text-2xl font-bold">3</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-red-500/20 p-2">
                  <Clock className="h-6 w-6 text-red-700" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Missed Visits</div>
                  <div className="text-2xl font-bold">2</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="schedule" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="missed">Missed Visits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Week
              </Button>
              <div className="text-lg font-medium">
                {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
              </div>
              <Button variant="outline" onClick={handleNextWeek}>
                Next Week
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <div key={index} className="border rounded-lg bg-white">
                  <div className={`text-center py-2 font-medium ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-50 text-blue-700 rounded-t-lg' : 'bg-gray-50'}`}>
                    {format(day, 'EEE')}
                    <div className="text-sm text-gray-500">{format(day, 'MMM d')}</div>
                  </div>
                  <div className="p-2 space-y-2 min-h-[150px]">
                    {ppcVisits
                      .filter(visit => visit.date === format(day, 'yyyy-MM-dd'))
                      .map(visit => (
                        <div key={visit.id} className="p-2 border rounded-md bg-blue-50 text-xs">
                          <div className="font-medium">{visit.center}</div>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {visit.time}
                          </div>
                          <div className="flex items-center text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {visit.district}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <StatusBadge
                              variant={
                                visit.status === 'Completed' ? 'success' : 
                                visit.status === 'In Progress' ? 'info' : 'warning'
                              }
                              size="sm"
                              label={visit.status}
                            />
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => {
                              setSelectedVisit(visit);
                              setReminderDialogOpen(true);
                            }}>
                              <Send className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <div className="rounded-md border bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-neutral-50 text-sm">
                    <th className="p-3 text-left font-medium">Center</th>
                    <th className="p-3 text-left font-medium">District</th>
                    <th className="p-3 text-left font-medium">Date & Time</th>
                    <th className="p-3 text-left font-medium">Purpose</th>
                    <th className="p-3 text-left font-medium">PPC Officer</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ppcVisits.map(visit => (
                    <tr key={visit.id} className="border-b hover:bg-neutral-50">
                      <td className="p-3 font-medium">{visit.center}</td>
                      <td className="p-3">{visit.district}</td>
                      <td className="p-3">
                        <div>{visit.date}</div>
                        <div className="text-xs text-gray-500">{visit.time}</div>
                      </td>
                      <td className="p-3">{visit.purpose}</td>
                      <td className="p-3">{visit.ppcOfficer}</td>
                      <td className="p-3">
                        <StatusBadge
                          variant={
                            visit.status === 'Completed' ? 'success' : 
                            visit.status === 'In Progress' ? 'info' : 'warning'
                          }
                          label={visit.status}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => {
                              setSelectedVisit(visit);
                              setReminderDialogOpen(true);
                            }}
                          >
                            <Send className="h-3 w-3" />
                            Remind
                          </Button>
                          {visit.reportSubmitted ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              View Report
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600"
                            >
                              Flag Missing
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="missed" className="space-y-4">
            <div className="rounded-md border bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-neutral-50 text-sm">
                    <th className="p-3 text-left font-medium">Center</th>
                    <th className="p-3 text-left font-medium">District</th>
                    <th className="p-3 text-left font-medium">Scheduled Date</th>
                    <th className="p-3 text-left font-medium">PPC Officer</th>
                    <th className="p-3 text-left font-medium">Purpose</th>
                    <th className="p-3 text-left font-medium">Reason</th>
                    <th className="p-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {missedVisits.map(visit => (
                    <tr key={visit.id} className="border-b hover:bg-neutral-50">
                      <td className="p-3 font-medium">{visit.center}</td>
                      <td className="p-3">{visit.district}</td>
                      <td className="p-3">{visit.scheduledDate}</td>
                      <td className="p-3">{visit.ppcOfficer}</td>
                      <td className="p-3">{visit.purpose}</td>
                      <td className="p-3">{visit.reason}</td>
                      <td className="p-3">
                        {visit.rescheduled ? (
                          <div>
                            <StatusBadge
                              variant="info"
                              label="Rescheduled"
                            />
                            <div className="text-xs mt-1">New: {visit.newDate}</div>
                          </div>
                        ) : (
                          <StatusBadge
                            variant="error"
                            label="Not Rescheduled"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Reminder</DialogTitle>
            <DialogDescription>
              {selectedVisit && (
                <>
                  Send a reminder to {selectedVisit.ppcOfficer} about the scheduled visit to {selectedVisit.center}.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message (Optional)</label>
              <Textarea 
                placeholder="Add a note to the reminder"
                rows={4}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReminderDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSendReminder}>
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PPCScheduleMonitor;
