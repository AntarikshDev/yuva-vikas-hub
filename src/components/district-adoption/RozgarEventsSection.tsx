import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Users, MapPin, FileText, Target, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { jharkhandDistricts, deskWorkFormFields, eventTargets } from '@/data/jharkhandCensusData';

interface RozgarEvent {
  id: string;
  type: 'mela' | 'sabha';
  districtId: string;
  gramPanchayat: string;
  village: string;
  date: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  expectedFootfall: number;
  actualFootfall?: number;
  ofrFilled?: number;
  counselled?: number;
  interested?: number;
  migrated?: number;
  deskWorkCompleted: boolean;
  deskWorkData?: Record<string, any>;
}

interface RozgarEventsSectionProps {
  canEdit: boolean;
  adoptedDistricts: string[];
}

export const RozgarEventsSection: React.FC<RozgarEventsSectionProps> = ({ canEdit, adoptedDistricts }) => {
  const [events, setEvents] = useState<RozgarEvent[]>([
    {
      id: '1',
      type: 'mela',
      districtId: 'ranchi',
      gramPanchayat: 'Kanke',
      village: 'Kanke Village',
      date: '2024-02-15',
      status: 'completed',
      expectedFootfall: 100,
      actualFootfall: 95,
      ofrFilled: 78,
      counselled: 62,
      interested: 31,
      migrated: 24,
      deskWorkCompleted: true
    },
    {
      id: '2',
      type: 'sabha',
      districtId: 'hazaribagh',
      gramPanchayat: 'Bishnugarh',
      village: 'Bishnugarh Main',
      date: '2024-02-18',
      status: 'in_progress',
      expectedFootfall: 40,
      actualFootfall: 38,
      ofrFilled: 30,
      deskWorkCompleted: true
    },
    {
      id: '3',
      type: 'mela',
      districtId: 'dhanbad',
      gramPanchayat: 'Jharia',
      village: 'Jharia Central',
      date: '2024-02-25',
      status: 'planned',
      expectedFootfall: 100,
      deskWorkCompleted: false
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeskWorkOpen, setIsDeskWorkOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<RozgarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<RozgarEvent>>({ type: 'mela' });
  const [deskWorkData, setDeskWorkData] = useState<Record<string, any>>({});

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'planned': return <Badge className="bg-amber-500">Planned</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateEvent = () => {
    if (!newEvent.districtId || !newEvent.gramPanchayat || !newEvent.date) {
      toast.error('Please fill all required fields');
      return;
    }

    const event: RozgarEvent = {
      id: Date.now().toString(),
      type: newEvent.type as 'mela' | 'sabha',
      districtId: newEvent.districtId!,
      gramPanchayat: newEvent.gramPanchayat!,
      village: newEvent.village || '',
      date: newEvent.date!,
      status: 'planned',
      expectedFootfall: newEvent.type === 'mela' ? eventTargets.rozgarMela.expectedFootfall : eventTargets.rozgarSabha.expectedFootfall,
      deskWorkCompleted: false
    };

    setEvents([...events, event]);
    setIsCreateOpen(false);
    setNewEvent({ type: 'mela' });
    toast.success('Rozgar event created successfully!');
  };

  const handleSaveDeskWork = () => {
    if (!selectedEvent) return;

    setEvents(events.map(e => {
      if (e.id === selectedEvent.id) {
        return { ...e, deskWorkCompleted: true, deskWorkData };
      }
      return e;
    }));

    setIsDeskWorkOpen(false);
    setDeskWorkData({});
    toast.success('Desk work saved successfully!');
  };

  const openDeskWork = (event: RozgarEvent) => {
    setSelectedEvent(event);
    setDeskWorkData(event.deskWorkData || {});
    setIsDeskWorkOpen(true);
  };

  const melaEvents = events.filter(e => e.type === 'mela');
  const sabhaEvents = events.filter(e => e.type === 'sabha');

  return (
    <div className="space-y-6">
      {/* Event Targets Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-purple-500" />
              Rozgar Mela Targets
            </CardTitle>
            <CardDescription>1 event per district per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">Expected Footfall</p>
                <p className="font-semibold">{eventTargets.rozgarMela.expectedFootfall}</p>
              </div>
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">OFR Target (80%)</p>
                <p className="font-semibold">{eventTargets.rozgarMela.ofrTarget}</p>
              </div>
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">Counselled (80%)</p>
                <p className="font-semibold">{eventTargets.rozgarMela.counselledTarget}</p>
              </div>
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">Migrated (75%)</p>
                <p className="font-semibold">{eventTargets.rozgarMela.migratedTarget}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Rozgar Sabha Targets
            </CardTitle>
            <CardDescription>6 events per district per month (3 days × 2 sessions)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">Expected Footfall</p>
                <p className="font-semibold">{eventTargets.rozgarSabha.expectedFootfall}</p>
              </div>
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">OFR Target (80%)</p>
                <p className="font-semibold">{eventTargets.rozgarSabha.ofrTarget}</p>
              </div>
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">Counselled (80%)</p>
                <p className="font-semibold">{eventTargets.rozgarSabha.counselledTarget}</p>
              </div>
              <div className="p-2 rounded bg-muted">
                <p className="text-muted-foreground">Migrated (75%)</p>
                <p className="font-semibold">{eventTargets.rozgarSabha.migratedTarget}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rozgar Events</CardTitle>
            <CardDescription>Plan and track mobilization events</CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canEdit || adoptedDistricts.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Rozgar Event</DialogTitle>
                <DialogDescription>Schedule a new Rozgar Mela or Sabha</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={newEvent.type} onValueChange={(v) => setNewEvent({ ...newEvent, type: v as 'mela' | 'sabha' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mela">Rozgar Mela</SelectItem>
                      <SelectItem value="sabha">Rozgar Sabha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select value={newEvent.districtId} onValueChange={(v) => setNewEvent({ ...newEvent, districtId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {adoptedDistricts.map(id => {
                        const district = jharkhandDistricts.find(d => d.id === id);
                        return <SelectItem key={id} value={id}>{district?.name}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gram Panchayat</Label>
                  <Input value={newEvent.gramPanchayat || ''} onChange={(e) => setNewEvent({ ...newEvent, gramPanchayat: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Village</Label>
                  <Input value={newEvent.village || ''} onChange={(e) => setNewEvent({ ...newEvent, village: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Input type="date" value={newEvent.date || ''} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                </div>
                <Button className="w-full" onClick={handleCreateEvent}>Create Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({events.length})</TabsTrigger>
              <TabsTrigger value="mela">Mela ({melaEvents.length})</TabsTrigger>
              <TabsTrigger value="sabha">Sabha ({sabhaEvents.length})</TabsTrigger>
            </TabsList>

            {(['all', 'mela', 'sabha'] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(tab === 'all' ? events : tab === 'mela' ? melaEvents : sabhaEvents).map((event) => {
                    const district = jharkhandDistricts.find(d => d.id === event.districtId);
                    return (
                      <Card key={event.id} className="relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${event.type === 'mela' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Badge variant={event.type === 'mela' ? 'default' : 'secondary'}>
                                {event.type === 'mela' ? 'Rozgar Mela' : 'Rozgar Sabha'}
                              </Badge>
                              {getStatusBadge(event.status)}
                            </div>
                          </div>

                          <h4 className="font-semibold">{district?.name}</h4>
                          <div className="text-sm text-muted-foreground space-y-1 mt-2">
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {event.gramPanchayat}, {event.village}
                            </p>
                            <p className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 rounded bg-muted text-center">
                              <p className="text-xs text-muted-foreground">Footfall</p>
                              <p className="font-semibold">{event.actualFootfall || '-'}/{event.expectedFootfall}</p>
                            </div>
                            <div className="p-2 rounded bg-muted text-center">
                              <p className="text-xs text-muted-foreground">OFR</p>
                              <p className="font-semibold">{event.ofrFilled || '-'}</p>
                            </div>
                            <div className="p-2 rounded bg-muted text-center">
                              <p className="text-xs text-muted-foreground">Counselled</p>
                              <p className="font-semibold">{event.counselled || '-'}</p>
                            </div>
                            <div className="p-2 rounded bg-muted text-center">
                              <p className="text-xs text-muted-foreground">Migrated</p>
                              <p className="font-semibold">{event.migrated || '-'}</p>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Button
                              variant={event.deskWorkCompleted ? 'outline' : 'default'}
                              size="sm"
                              className="flex-1"
                              onClick={() => openDeskWork(event)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              {event.deskWorkCompleted ? 'View Desk Work' : 'Fill Desk Work'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Desk Work Dialog */}
      <Dialog open={isDeskWorkOpen} onOpenChange={setIsDeskWorkOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Desk Work Form (Annexure-1)</DialogTitle>
            <DialogDescription>Pre-event preparation checklist</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deskWorkFormFields.map((field) => (
                <div key={field.id} className={`space-y-2 ${field.type === 'checkbox' ? '' : ''}`}>
                  <Label className="flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {field.type === 'select' ? (
                    <Select
                      value={deskWorkData[field.id] || ''}
                      onValueChange={(v) => setDeskWorkData({ ...deskWorkData, [field.id]: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={deskWorkData[field.id] || false}
                        onCheckedChange={(v) => setDeskWorkData({ ...deskWorkData, [field.id]: v })}
                      />
                      <span className="text-sm text-muted-foreground">Required</span>
                    </div>
                  ) : (
                    <Input
                      type={field.type}
                      value={deskWorkData[field.id] || ''}
                      onChange={(e) => setDeskWorkData({ ...deskWorkData, [field.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={handleSaveDeskWork} disabled={!canEdit}>
              Save Desk Work
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
