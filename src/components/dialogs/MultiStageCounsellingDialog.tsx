import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Upload, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MultiStageCounsellingDialogProps {
  candidate: any;
  open: boolean;
  onClose: () => void;
  onUpdate?: (sessionData: any) => void;
}

const mockSessionHistory = [
  {
    id: 1,
    stage: "Stage 1",
    date: "2025-01-10",
    outcome: "Good progress, candidate shows interest",
    readinessLevel: "Good"
  },
  {
    id: 2,
    stage: "Stage 2", 
    date: "2025-01-15",
    outcome: "Some concerns about attendance",
    readinessLevel: "Average"
  }
];

export function MultiStageCounsellingDialog({ candidate, open, onClose, onUpdate }: MultiStageCounsellingDialogProps) {
  const [activeTab, setActiveTab] = useState("stage1");
  const [sessionData, setSessionData] = useState({
    stage1: { date: "", notes: "", readiness: "", document: null },
    stage2: { date: "", notes: "", readiness: "", document: null },
    stage3: { date: "", notes: "", readiness: "", document: null }
  });
  const { toast } = useToast();

  const handleSave = (stage: string) => {
    const stageKey = stage.toLowerCase().replace(' ', '');
    const stageData = sessionData[stageKey as keyof typeof sessionData];
    
    if (stageData.date && stageData.notes && stageData.readiness) {
      // Update current stage based on completed sessions
      let currentStage = "Stage 1";
      if (sessionData.stage3.date && sessionData.stage3.notes && sessionData.stage3.readiness) {
        currentStage = "Stage 3";
      } else if (sessionData.stage2.date && sessionData.stage2.notes && sessionData.stage2.readiness) {
        currentStage = "Stage 2";
      }
      
      const completeSessionData = {
        ...sessionData,
        currentStage,
        lastUpdated: new Date().toISOString()
      };
      
      onUpdate?.(completeSessionData);
      
      toast({
        title: "Session Saved",
        description: `${stage} counselling session has been saved successfully.`,
      });
    } else {
      toast({
        title: "Incomplete Data",
        description: "Please fill all required fields before saving.",
        variant: "destructive"
      });
    }
  };

  const handleNextStage = () => {
    const stages = ["stage1", "stage2", "stage3"];
    const currentIndex = stages.indexOf(activeTab);
    if (currentIndex < stages.length - 1) {
      setActiveTab(stages[currentIndex + 1]);
    }
  };

  const updateSessionData = (stage: string, field: string, value: any) => {
    setSessionData(prev => ({
      ...prev,
      [stage]: {
        ...prev[stage as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const getStageStatus = (stage: string) => {
    const data = sessionData[stage as keyof typeof sessionData];
    if (data.date && data.notes && data.readiness) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
    }
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            Multi-Stage Counselling - {candidate.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Counselling Form */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stage1" className="flex items-center gap-2">
                  Stage 1 {getStageStatus("stage1")}
                </TabsTrigger>
                <TabsTrigger value="stage2" className="flex items-center gap-2">
                  Stage 2 {getStageStatus("stage2")}
                </TabsTrigger>
                <TabsTrigger value="stage3" className="flex items-center gap-2">
                  Stage 3 {getStageStatus("stage3")}
                </TabsTrigger>
              </TabsList>

              {["stage1", "stage2", "stage3"].map((stage, index) => (
                <TabsContent key={stage} value={stage} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stage {index + 1} Counselling Session</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Session Date</Label>
                        <Input
                          type="date"
                          value={sessionData[stage as keyof typeof sessionData].date}
                          onChange={(e) => updateSessionData(stage, "date", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Notes & Outcome</Label>
                        <Textarea
                          placeholder="Enter session notes and outcomes..."
                          value={sessionData[stage as keyof typeof sessionData].notes}
                          onChange={(e) => updateSessionData(stage, "notes", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label>Readiness Level</Label>
                        <Select
                          value={sessionData[stage as keyof typeof sessionData].readiness}
                          onValueChange={(value) => updateSessionData(stage, "readiness", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select readiness level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="average">Average</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Supporting Documents</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Upload JPEG/PDF files</p>
                          <Input type="file" className="mt-2" accept=".jpg,.jpeg,.pdf" />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleSave(`Stage ${index + 1}`)}
                          className="flex-1"
                        >
                          Save Session
                        </Button>
                        {index < 2 && (
                          <Button 
                            onClick={handleNextStage}
                            variant="outline"
                          >
                            Save & Next Stage
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Session History Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Session History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSessionHistory.map((session) => (
                  <div key={session.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{session.stage}</Badge>
                      <span className="text-xs text-muted-foreground">{session.date}</span>
                    </div>
                    <p className="text-sm mb-2">{session.outcome}</p>
                    <Badge className={
                      session.readinessLevel === "Good" ? "bg-green-100 text-green-800" :
                      session.readinessLevel === "Average" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }>
                      {session.readinessLevel}
                    </Badge>
                  </div>
                ))}
                
                {mockSessionHistory.length === 0 && (
                  <p className="text-center text-muted-foreground">No previous sessions</p>
                )}
              </CardContent>
            </Card>

            {/* Progress Indicator */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Stage 1</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Stage 2</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Stage 3</span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Stage 2 of 3 Completed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}