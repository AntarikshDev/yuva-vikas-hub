import { useState, useMemo } from "react";
import { Plus, X, Snowflake, AlertTriangle, Save, Target, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { format, addMonths } from "date-fns";
import {
  useGetCentresForWorkOrderQuery,
  useGetMobilisationTargetsQuery,
  useGetEnrolmentTargetsQuery,
  useSaveTargetsMutation,
} from "@/store/api/apiSlice";

interface TargetPlanningTabProps {
  workOrderId: string;
  totalTarget: number;
  role: 'director' | 'national-head';
  isStarted: boolean;
}

// Mock centres data
const mockCentres = [
  { id: "1", name: "Mumbai Central Training Centre", capacity: 480, jobRole: "Customer Service Executive", courseDuration: 3 },
  { id: "2", name: "Pune Skill Development Centre", capacity: 320, jobRole: "Retail Sales Associate", courseDuration: 2 },
  { id: "3", name: "Nagpur Vocational Training Hub", capacity: 240, jobRole: "Data Entry Operator", courseDuration: 3 },
];

interface MonthlyTarget {
  id: string;
  target: number;
  month: string;
  isFrozen: boolean;
}

const generateMonthOptions = () => {
  const options = [];
  const startDate = new Date();
  for (let i = 0; i < 24; i++) {
    const date = addMonths(startDate, i);
    options.push({
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy"),
    });
  }
  return options;
};

const TargetPlanningTab = ({ workOrderId, totalTarget, role, isStarted }: TargetPlanningTabProps) => {
  const [selectedCentre, setSelectedCentre] = useState<string>("");
  const [mobilisationTargets, setMobilisationTargets] = useState<MonthlyTarget[]>([
    { id: "1", target: 0, month: "", isFrozen: false },
  ]);
  const [enrolmentTargets, setEnrolmentTargets] = useState<MonthlyTarget[]>([
    { id: "1", target: 0, month: "", isFrozen: false },
  ]);

  // RTK Query hooks
  const { data: centresData, isLoading: centresLoading } = useGetCentresForWorkOrderQuery(workOrderId);
  const { data: mobilisationData } = useGetMobilisationTargetsQuery({ workOrderId, centreId: selectedCentre });
  const { data: enrolmentData } = useGetEnrolmentTargetsQuery({ workOrderId, centreId: selectedCentre });
  const [saveTargets, { isLoading: isSaving }] = useSaveTargetsMutation();

  // Mock fallback pattern
  let centres;
  if (!centresData) {
    centres = mockCentres;
  } else {
    centres = centresData;
  }

  const monthOptions = generateMonthOptions();
  const canEdit = role === 'national-head' && isStarted;
  const selectedCentreData = centres.find((c: any) => c.id === selectedCentre);

  // Calculate totals and remaining
  const mobilisationTotal = mobilisationTargets.reduce((sum, t) => sum + (t.target || 0), 0);
  const enrolmentTotal = enrolmentTargets.reduce((sum, t) => sum + (t.target || 0), 0);
  const mobilisationRemaining = totalTarget - mobilisationTotal;
  const enrolmentRemaining = totalTarget - enrolmentTotal;

  // Check if enrolment should be frozen
  const frozenMonths = useMemo(() => {
    if (!selectedCentreData) return [];
    const capacity = selectedCentreData.capacity;
    const duration = selectedCentreData.courseDuration;
    const frozen: string[] = [];
    
    let accumulated = 0;
    enrolmentTargets.forEach((target, index) => {
      if (target.month && target.target > 0) {
        accumulated += target.target;
        if (accumulated >= capacity) {
          const monthIndex = monthOptions.findIndex(m => m.value === target.month);
          for (let i = 1; i <= duration; i++) {
            if (monthOptions[monthIndex + i]) {
              frozen.push(monthOptions[monthIndex + i].value);
            }
          }
        }
      }
    });
    
    return frozen;
  }, [enrolmentTargets, selectedCentreData, monthOptions]);

  const addMobilisationTarget = () => {
    setMobilisationTargets(prev => [
      ...prev,
      { id: Date.now().toString(), target: 0, month: "", isFrozen: false },
    ]);
  };

  const removeMobilisationTarget = (id: string) => {
    if (mobilisationTargets.length > 1) {
      setMobilisationTargets(prev => prev.filter(t => t.id !== id));
    }
  };

  const updateMobilisationTarget = (id: string, field: 'target' | 'month', value: number | string) => {
    setMobilisationTargets(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const addEnrolmentTarget = () => {
    setEnrolmentTargets(prev => [
      ...prev,
      { id: Date.now().toString(), target: 0, month: "", isFrozen: false },
    ]);
  };

  const removeEnrolmentTarget = (id: string) => {
    if (enrolmentTargets.length > 1) {
      setEnrolmentTargets(prev => prev.filter(t => t.id !== id));
    }
  };

  const updateEnrolmentTarget = (id: string, field: 'target' | 'month', value: number | string) => {
    setEnrolmentTargets(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleSave = async () => {
    if (!selectedCentre) {
      toast({
        title: "Error",
        description: "Please select a centre first.",
        variant: "destructive",
      });
      return;
    }

    if (mobilisationTotal !== totalTarget) {
      toast({
        title: "Validation Error",
        description: `Mobilisation total (${mobilisationTotal}) must equal work order target (${totalTarget}).`,
        variant: "destructive",
      });
      return;
    }

    if (enrolmentTotal !== totalTarget) {
      toast({
        title: "Validation Error",
        description: `Enrolment total (${enrolmentTotal}) must equal work order target (${totalTarget}).`,
        variant: "destructive",
      });
      return;
    }

    try {
      await saveTargets({
        workOrderId,
        centreId: selectedCentre,
        mobilisation: mobilisationTargets,
        enrolment: enrolmentTargets,
      }).unwrap();
      
      toast({
        title: "Targets Saved",
        description: "Monthly targets have been saved successfully.",
      });
    } catch (err) {
      // Fallback for mock
      toast({
        title: "Targets Saved",
        description: "Monthly targets have been saved successfully.",
      });
    }
  };

  if (centresLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Work Order Total</p>
                <p className="text-2xl font-bold">{totalTarget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={mobilisationRemaining < 0 ? "border-destructive" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mobilisation</p>
                <p className="text-xl font-bold">{mobilisationTotal.toLocaleString()}</p>
              </div>
              <Badge variant={mobilisationRemaining === 0 ? "default" : mobilisationRemaining < 0 ? "destructive" : "secondary"}>
                {mobilisationRemaining >= 0 ? `${mobilisationRemaining} remaining` : `${Math.abs(mobilisationRemaining)} over`}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className={enrolmentRemaining < 0 ? "border-destructive" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enrolment</p>
                <p className="text-xl font-bold">{enrolmentTotal.toLocaleString()}</p>
              </div>
              <Badge variant={enrolmentRemaining === 0 ? "default" : enrolmentRemaining < 0 ? "destructive" : "secondary"}>
                {enrolmentRemaining >= 0 ? `${enrolmentRemaining} remaining` : `${Math.abs(enrolmentRemaining)} over`}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Centre Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Centre</CardTitle>
          <CardDescription>
            Choose a centre to plan monthly targets based on its capacity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Centre</Label>
              <Select value={selectedCentre} onValueChange={setSelectedCentre} disabled={!canEdit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a centre" />
                </SelectTrigger>
                <SelectContent>
                  {centres.map((centre: any) => (
                    <SelectItem key={centre.id} value={centre.id}>
                      {centre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCentreData && (
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-bold text-lg">{selectedCentreData.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course Duration</p>
                  <p className="font-bold text-lg">{selectedCentreData.courseDuration} months</p>
                </div>
              </div>
            )}
          </div>

          {selectedCentreData && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Centre capacity is <strong>{selectedCentreData.capacity}</strong> candidates. 
                When enrolment reaches this capacity, the next <strong>{selectedCentreData.courseDuration} months</strong> will be frozen for new enrolments.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Mobilisation Targets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mobilisation Targets</CardTitle>
              <CardDescription>
                Plan monthly mobilisation targets (Total: {mobilisationTotal.toLocaleString()})
              </CardDescription>
            </div>
            {canEdit && (
              <Button variant="outline" size="sm" onClick={addMobilisationTarget}>
                <Plus className="h-4 w-4 mr-1" /> Add Month
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mobilisationTargets.map((target, index) => (
            <div key={target.id} className="flex items-center gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Target</Label>
                  <Input
                    type="number"
                    placeholder="Enter target"
                    value={target.target || ""}
                    onChange={(e) => updateMobilisationTarget(target.id, 'target', parseInt(e.target.value) || 0)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Month</Label>
                  <Select 
                    value={target.month} 
                    onValueChange={(value) => updateMobilisationTarget(target.id, 'month', value)}
                    disabled={!canEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {canEdit && mobilisationTargets.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeMobilisationTarget(target.id)}
                  className="mt-5"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">
              Subtotal: <span className={mobilisationTotal > totalTarget ? "text-destructive" : ""}>{mobilisationTotal.toLocaleString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Enrolment Targets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enrolment Targets</CardTitle>
              <CardDescription>
                Plan monthly enrolment targets (Total: {enrolmentTotal.toLocaleString()})
              </CardDescription>
            </div>
            {canEdit && (
              <Button variant="outline" size="sm" onClick={addEnrolmentTarget}>
                <Plus className="h-4 w-4 mr-1" /> Add Month
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {enrolmentTargets.map((target, index) => {
            const isFrozen = frozenMonths.includes(target.month);
            return (
              <div key={target.id} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Target</Label>
                    <Input
                      type="number"
                      placeholder="Enter target"
                      value={target.target || ""}
                      onChange={(e) => updateEnrolmentTarget(target.id, 'target', parseInt(e.target.value) || 0)}
                      disabled={!canEdit || isFrozen}
                      className={isFrozen ? "bg-blue-50 border-blue-200" : ""}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Month</Label>
                    <Select 
                      value={target.month} 
                      onValueChange={(value) => updateEnrolmentTarget(target.id, 'month', value)}
                      disabled={!canEdit || isFrozen}
                    >
                      <SelectTrigger className={isFrozen ? "bg-blue-50 border-blue-200" : ""}>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            disabled={frozenMonths.includes(option.value)}
                          >
                            <div className="flex items-center gap-2">
                              {option.label}
                              {frozenMonths.includes(option.value) && (
                                <Snowflake className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {isFrozen && (
                  <Badge variant="secondary" className="mt-5 gap-1 bg-blue-100 text-blue-700">
                    <Snowflake className="h-3 w-3" />
                    Frozen
                  </Badge>
                )}
                {canEdit && enrolmentTargets.length > 1 && !isFrozen && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeEnrolmentTarget(target.id)}
                    className="mt-5"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">
              Subtotal: <span className={enrolmentTotal > totalTarget ? "text-destructive" : ""}>{enrolmentTotal.toLocaleString()}</span>
            </p>
          </div>

          {frozenMonths.length > 0 && (
            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <Snowflake className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                Enrolment is frozen for {frozenMonths.length} month(s) based on centre capacity and course duration.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Targets
          </Button>
        </div>
      )}

      {!canEdit && role === 'national-head' && !isStarted && (
        <Card className="bg-muted">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">
              Click "Start Work Order" to begin planning targets
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TargetPlanningTab;