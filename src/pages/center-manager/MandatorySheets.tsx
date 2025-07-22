import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Send, FileText, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MandatorySheets = () => {
  const { toast } = useToast();

  // Pre-Placement Documents State
  const [prePlacementData, setPrePlacementData] = useState([
    { 
      id: 'C-001', 
      name: 'Ravi Kumar', 
      counsellingStatus: 'completed', 
      documents: {
        aadhaar: true,
        bankPassbook: true,
        bpl: false,
        education: true
      },
      orientationComplete: false 
    },
    { 
      id: 'C-002', 
      name: 'Priya Sharma', 
      counsellingStatus: 'pending', 
      documents: {
        aadhaar: true,
        bankPassbook: false,
        bpl: true,
        education: true
      },
      orientationComplete: true 
    }
  ]);

  // Counselling Sheet State
  const [counsellingData, setCounsellingData] = useState([
    {
      id: 'C-001',
      candidate: 'Ravi Kumar',
      session1Date: '2024-01-10',
      session2Date: '2024-01-15',
      session3Date: '',
      outcome: 'positive',
      parentConsent: true,
      remarks: 'Good progress in all sessions'
    }
  ]);

  // Declaration by Centre Manager State
  const [declarationChecklist, setDeclarationChecklist] = useState({
    prePlacement: false,
    counselling: false,
    videos: false,
    orientation: false,
    bankAccounts: false,
    parentCounselling: false,
    documentCompliance: false,
    attendanceTracking: false,
    placementReadiness: false
  });

  // Declaration Letter State
  const [declarationLetters, setDeclarationLetters] = useState([
    {
      id: 'C-001',
      candidate: 'Ravi Kumar',
      company: 'Tech Solutions Pvt Ltd',
      ctc: '15000',
      lodging: 'Provided',
      fooding: 'Provided',
      employmentTerms: 'Permanent'
    }
  ]);

  const handleSaveDraft = (sheetType: string) => {
    toast({
      title: "Draft Saved",
      description: `${sheetType} draft has been saved successfully.`,
    });
  };

  const handleSubmit = (sheetType: string) => {
    toast({
      title: "Sheet Submitted",
      description: `${sheetType} has been submitted for review.`,
    });
  };

  const updateDeclarationChecklist = (key: string, checked: boolean) => {
    setDeclarationChecklist(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Mandatory Sheets & Declarations</h1>

        <Tabs defaultValue="pre-placement" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pre-placement">Pre-Placement</TabsTrigger>
            <TabsTrigger value="counselling">Counselling Sheet</TabsTrigger>
            <TabsTrigger value="declaration">Declaration by CM</TabsTrigger>
            <TabsTrigger value="candidate-wise">Candidate Declaration</TabsTrigger>
          </TabsList>

          {/* Pre-Placement Documents */}
          <TabsContent value="pre-placement">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pre-Placement Document Submission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Mirroring Pre-Placement Documents Format.xlsx
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleSaveDraft('Pre-Placement Documents')}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button onClick={() => handleSubmit('Pre-Placement Documents')}>
                        <Send className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate Name</TableHead>
                        <TableHead>Counselling Status</TableHead>
                        <TableHead>Aadhaar</TableHead>
                        <TableHead>Bank Passbook</TableHead>
                        <TableHead>BPL Certificate</TableHead>
                        <TableHead>Education Docs</TableHead>
                        <TableHead>Orientation Complete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prePlacementData.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">{candidate.name}</TableCell>
                          <TableCell>
                            <Select defaultValue={candidate.counsellingStatus}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={candidate.documents.aadhaar} />
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={candidate.documents.bankPassbook} />
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={candidate.documents.bpl} />
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={candidate.documents.education} />
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={candidate.orientationComplete} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Counselling Sheet */}
          <TabsContent value="counselling">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Placement & Counselling Sheet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Mirroring Placement & Counselling Sheet.xlsx
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleSaveDraft('Counselling Sheet')}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button onClick={() => handleSubmit('Counselling Sheet')}>
                        <Send className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Session 1 Date</TableHead>
                        <TableHead>Session 2 Date</TableHead>
                        <TableHead>Session 3 Date</TableHead>
                        <TableHead>Counselling Outcome</TableHead>
                        <TableHead>Parent Consent</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {counsellingData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.candidate}</TableCell>
                          <TableCell>
                            <Input type="date" defaultValue={record.session1Date} />
                          </TableCell>
                          <TableCell>
                            <Input type="date" defaultValue={record.session2Date} />
                          </TableCell>
                          <TableCell>
                            <Input type="date" defaultValue={record.session3Date} />
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={record.outcome}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="positive">Positive</SelectItem>
                                <SelectItem value="needs-improvement">Needs Improvement</SelectItem>
                                <SelectItem value="ready">Ready for Placement</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Checkbox checked={record.parentConsent} />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue={record.remarks} placeholder="Add remarks..." />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Declaration by Centre Manager */}
          <TabsContent value="declaration">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Declaration by Centre Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Mirroring Declaration by Centre Manager.docx
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Signature
                      </Button>
                      <Button onClick={() => handleSubmit('Centre Manager Declaration')}>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Declaration
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Checklist Items (1-9)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="pre-placement"
                            checked={declarationChecklist.prePlacement}
                            onCheckedChange={(checked) => updateDeclarationChecklist('prePlacement', checked as boolean)}
                          />
                          <label htmlFor="pre-placement" className="text-sm">
                            1. Pre-Placement documentation completed
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="counselling"
                            checked={declarationChecklist.counselling}
                            onCheckedChange={(checked) => updateDeclarationChecklist('counselling', checked as boolean)}
                          />
                          <label htmlFor="counselling" className="text-sm">
                            2. Counselling sessions completed for all candidates
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="videos"
                            checked={declarationChecklist.videos}
                            onCheckedChange={(checked) => updateDeclarationChecklist('videos', checked as boolean)}
                          />
                          <label htmlFor="videos" className="text-sm">
                            3. Training videos logged and reviewed
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="orientation"
                            checked={declarationChecklist.orientation}
                            onCheckedChange={(checked) => updateDeclarationChecklist('orientation', checked as boolean)}
                          />
                          <label htmlFor="orientation" className="text-sm">
                            4. Orientation by PPC team completed
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="bank-accounts"
                            checked={declarationChecklist.bankAccounts}
                            onCheckedChange={(checked) => updateDeclarationChecklist('bankAccounts', checked as boolean)}
                          />
                          <label htmlFor="bank-accounts" className="text-sm">
                            5. Bank accounts verified for all candidates
                          </label>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="parent-counselling"
                            checked={declarationChecklist.parentCounselling}
                            onCheckedChange={(checked) => updateDeclarationChecklist('parentCounselling', checked as boolean)}
                          />
                          <label htmlFor="parent-counselling" className="text-sm">
                            6. Parent counselling completed
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="document-compliance"
                            checked={declarationChecklist.documentCompliance}
                            onCheckedChange={(checked) => updateDeclarationChecklist('documentCompliance', checked as boolean)}
                          />
                          <label htmlFor="document-compliance" className="text-sm">
                            7. Document compliance verified
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="attendance-tracking"
                            checked={declarationChecklist.attendanceTracking}
                            onCheckedChange={(checked) => updateDeclarationChecklist('attendanceTracking', checked as boolean)}
                          />
                          <label htmlFor="attendance-tracking" className="text-sm">
                            8. Attendance tracking maintained
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="placement-readiness"
                            checked={declarationChecklist.placementReadiness}
                            onCheckedChange={(checked) => updateDeclarationChecklist('placementReadiness', checked as boolean)}
                          />
                          <label htmlFor="placement-readiness" className="text-sm">
                            9. All candidates ready for placement
                          </label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Additional Comments</label>
                      <Textarea 
                        placeholder="Add any additional comments or observations..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Digital Signature</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500">Click to upload digital signature or drag and drop</p>
                        <Button variant="outline" className="mt-2">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Signature
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Declaration Letter - Candidate Wise */}
          <TabsContent value="candidate-wise">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Declaration Letter - Candidate Wise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Mirroring Declaration Letter.docx
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Bulk Upload (XLSX)
                      </Button>
                      <Button variant="outline" onClick={() => handleSaveDraft('Candidate Declaration Letters')}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button onClick={() => handleSubmit('Candidate Declaration Letters')}>
                        <Send className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>CTC (Monthly)</TableHead>
                        <TableHead>Lodging</TableHead>
                        <TableHead>Fooding</TableHead>
                        <TableHead>Employment Terms</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {declarationLetters.map((letter) => (
                        <TableRow key={letter.id}>
                          <TableCell className="font-medium">{letter.candidate}</TableCell>
                          <TableCell>
                            <Input defaultValue={letter.company} />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue={letter.ctc} />
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={letter.lodging}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Provided">Provided</SelectItem>
                                <SelectItem value="Not Provided">Not Provided</SelectItem>
                                <SelectItem value="Allowance Given">Allowance Given</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={letter.fooding}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Provided">Provided</SelectItem>
                                <SelectItem value="Not Provided">Not Provided</SelectItem>
                                <SelectItem value="Allowance Given">Allowance Given</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={letter.employmentTerms}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Permanent">Permanent</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                                <SelectItem value="Probation">Probation</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Generate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default MandatorySheets;