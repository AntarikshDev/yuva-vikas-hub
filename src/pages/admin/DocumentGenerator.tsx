
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, FilePlus, FileEdit, FileCheck, Mail, Eye, 
  Download, Trash2, AlertCircle, HelpCircle, Info, Search, Send
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DocumentGenerator = () => {
  // State for dialogs and active tabs
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  const { toast } = useToast();

  // Dummy data for document templates
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Candidate Declaration', type: 'PDF', fields: 12, lastUpdated: '2023-10-15', autoEmail: true },
    { id: 2, name: 'Center Declaration', type: 'DOCX', fields: 8, lastUpdated: '2023-09-22', autoEmail: false },
    { id: 3, name: 'Offer Letter Template', type: 'PDF', fields: 15, lastUpdated: '2023-11-05', autoEmail: true },
    { id: 4, name: 'Travel Letter', type: 'PDF', fields: 10, lastUpdated: '2023-08-30', autoEmail: true },
    { id: 5, name: 'Attendance Sheet', type: 'XLSX', fields: 5, lastUpdated: '2023-10-10', autoEmail: false },
  ]);

  // Dummy users/recipients data
  const recipients = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@example.com', role: 'Candidate', batchId: 'B-2023-01' },
    { id: 2, name: 'Priya Patel', email: 'priya.patel@example.com', role: 'Candidate', batchId: 'B-2023-01' },
    { id: 3, name: 'Amit Kumar', email: 'amit.kumar@example.com', role: 'Candidate', batchId: 'B-2023-02' },
    { id: 4, name: 'Deepika Singh', email: 'deepika.singh@example.com', role: 'Candidate', batchId: 'B-2023-02' },
    { id: 5, name: 'Rajesh Gupta', email: 'rajesh.gupta@example.com', role: 'Center Manager', centerId: 'C-001' },
    { id: 6, name: 'Anjali Verma', email: 'anjali.verma@example.com', role: 'Trainer', centerId: 'C-001' },
  ];
  
  // State for selected recipient
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter recipients based on search query
  const filteredRecipients = recipients.filter(recipient => 
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    recipient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dummy document field mappings
  const fields = [
    { id: 1, placeholder: '<<CandidateName>>', description: 'Full name of candidate', required: true },
    { id: 2, placeholder: '<<CandidateID>>', description: 'Unique ID assigned to candidate', required: true },
    { id: 3, placeholder: '<<BatchCode>>', description: 'Batch code for training', required: true },
    { id: 4, placeholder: '<<JobRole>>', description: 'Selected job role', required: true },
    { id: 5, placeholder: '<<CenterName>>', description: 'Training center name', required: true },
    { id: 6, placeholder: '<<StartDate>>', description: 'Training start date', required: true },
    { id: 7, placeholder: '<<EndDate>>', description: 'Expected training completion date', required: true },
    { id: 8, placeholder: '<<CompanyName>>', description: 'Placement company name', required: false },
    { id: 9, placeholder: '<<Salary>>', description: 'Offered salary', required: false },
    { id: 10, placeholder: '<<JoiningDate>>', description: 'Expected joining date', required: false },
  ];

  // State for active template
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");

  // Handle template upload
  const handleTemplateUpload = (e) => {
    e.preventDefault();
    // In a real application, this would upload the file to the server
    toast({
      title: "Template Uploaded",
      description: "Your document template has been uploaded successfully.",
    });
    setUploadDialogOpen(false);
  };

  // Handle test generate
  const handleTestGenerate = () => {
    setGenerateDialogOpen(true);
  };

  // Handle document generation with recipient
  const handleGenerateDocument = () => {
    if (!selectedRecipient) {
      toast({
        title: "Recipient Required",
        description: "Please select a recipient for the document.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Document Generated",
      description: `${activeTemplate.name} has been generated for ${selectedRecipient.name} and sent to ${selectedRecipient.email}.`,
    });
    setGenerateDialogOpen(false);
    setSelectedRecipient(null);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      // Save changes
      setActiveTemplate({...activeTemplate, name: editedName});
      const updatedTemplates = templates.map(t => 
        t.id === activeTemplate.id ? {...t, name: editedName} : t
      );
      setTemplates(updatedTemplates);
      toast({
        title: "Template Updated",
        description: "Template details have been updated successfully.",
      });
    } else {
      // Enter edit mode
      setEditedName(activeTemplate.name);
    }
    setIsEditMode(!isEditMode);
  };

  // Toggle auto email option
  const handleAutoEmailToggle = (checked) => {
    setActiveTemplate({...activeTemplate, autoEmail: checked});
    const updatedTemplates = templates.map(t => 
      t.id === activeTemplate.id ? {...t, autoEmail: checked} : t
    );
    setTemplates(updatedTemplates);
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Document Generator</h1>
            <p className="text-muted-foreground">
              Create, manage and generate document templates for various purposes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setHelpDialogOpen(true)}
              className="h-8 w-8"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
            <Button className="gap-2" onClick={() => setUploadDialogOpen(true)}>
              <FilePlus className="h-4 w-4" />
              Upload Template
            </Button>
          </div>
        </div>

        <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="templates">Document Templates</TabsTrigger>
            <TabsTrigger value="history">Generation History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            {templates.length === 0 ? (
              <Card className="border-dashed border-2 p-8">
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="bg-muted rounded-full p-3">
                    <FilePlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">No templates yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Upload your first document template to start generating documents for candidates, centers, and more.
                    </p>
                  </div>
                  <Button onClick={() => setUploadDialogOpen(true)}>Upload Template</Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Template Library</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {templates.map((template) => (
                          <div 
                            key={template.id} 
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${activeTemplate.id === template.id ? 'bg-gray-50' : ''}`}
                            onClick={() => setActiveTemplate(template)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{template.name}</h3>
                                <div className="text-xs text-gray-500 mt-1">Updated: {template.lastUpdated}</div>
                              </div>
                              <Badge variant={template.type === 'PDF' ? "default" : template.type === 'DOCX' ? "outline" : "secondary"}>
                                {template.type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 border-t bg-gray-50/50">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs w-full" onClick={() => setUploadDialogOpen(true)}>
                        <Upload className="h-3 w-3" />
                        Upload New Template
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {isEditMode ? (
                            <Input 
                              value={editedName} 
                              onChange={(e) => setEditedName(e.target.value)} 
                              className="font-bold text-lg"
                            />
                          ) : (
                            <CardTitle>{activeTemplate.name}</CardTitle>
                          )}
                          <div className="text-sm text-muted-foreground">
                            Last updated on {activeTemplate.lastUpdated}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-1"
                            onClick={toggleEditMode}
                          >
                            {isEditMode ? (
                              <React.Fragment>
                                <FileCheck className="h-3.5 w-3.5" />
                                Save
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <FileEdit className="h-3.5 w-3.5" />
                                Edit
                              </React.Fragment>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-1"
                            onClick={() => setPreviewDialogOpen(true)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="bg-gray-100 text-gray-700 rounded-md px-2 py-1 text-xs flex items-center">
                            Type: <span className="font-medium ml-1">{activeTemplate.type}</span>
                          </div>
                          <div className="bg-gray-100 text-gray-700 rounded-md px-2 py-1 text-xs flex items-center">
                            Fields: <span className="font-medium ml-1">{activeTemplate.fields}</span>
                          </div>
                          <div className="bg-gray-100 text-gray-700 rounded-md px-2 py-1 text-xs flex items-center">
                            Last Updated: <span className="font-medium ml-1">{activeTemplate.lastUpdated}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {isEditMode && (
                            <div className="mb-4 p-4 border rounded-md bg-amber-50 border-amber-200">
                              <div className="flex items-start">
                                <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                                <div>
                                  <h4 className="text-sm font-medium text-amber-800 mb-1">Editing Template</h4>
                                  <p className="text-xs text-amber-700">
                                    You can edit the template name and settings. To edit the template file itself, 
                                    you'll need to upload a new version with your changes.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <h3 className="text-sm font-medium">Field Mappings</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            These placeholders will be automatically replaced with actual data when generating documents.
                          </p>
                          <Table>
                            <TableCaption>Available field placeholders for this template</TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Placeholder</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Required</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {fields.map((field) => (
                                <TableRow key={field.id}>
                                  <TableCell className="font-mono">{field.placeholder}</TableCell>
                                  <TableCell>{field.description}</TableCell>
                                  <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t bg-gray-50/50 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="auto-email" 
                            checked={activeTemplate.autoEmail} 
                            onCheckedChange={handleAutoEmailToggle}
                          />
                          <Label htmlFor="auto-email" className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            Auto Email On Generation
                          </Label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 gap-1"
                          onClick={() => {
                            // Placeholder for download functionality
                            toast({
                              title: "Template Downloaded",
                              description: "The template has been downloaded successfully.",
                            });
                          }}
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-8 gap-1"
                          onClick={handleTestGenerate}
                        >
                          <FileCheck className="h-3.5 w-3.5" />
                          Generate Document
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Document Generation History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Generated For</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Offer_Letter_rahul_sharma.pdf</TableCell>
                      <TableCell>Offer Letter Template</TableCell>
                      <TableCell>Rahul Sharma</TableCell>
                      <TableCell>2023-11-20</TableCell>
                      <TableCell><Badge>Sent</Badge></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Declaration_priya_patel.pdf</TableCell>
                      <TableCell>Candidate Declaration</TableCell>
                      <TableCell>Priya Patel</TableCell>
                      <TableCell>2023-11-18</TableCell>
                      <TableCell><Badge>Sent</Badge></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Travel_amit_kumar.pdf</TableCell>
                      <TableCell>Travel Letter</TableCell>
                      <TableCell>Amit Kumar</TableCell>
                      <TableCell>2023-11-15</TableCell>
                      <TableCell><Badge variant="outline">Draft</Badge></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upload Template Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Upload Document Template</DialogTitle>
              <DialogDescription>
                Upload a new template file with placeholder fields for dynamic document generation.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTemplateUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input id="templateName" placeholder="E.g. Candidate Offer Letter" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="templateType">Template Type</Label>
                <select 
                  id="templateType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="PDF">PDF Template</option>
                  <option value="DOCX">Word Document (DOCX)</option>
                  <option value="XLSX">Excel Spreadsheet (XLSX)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="templateFile">Template File</Label>
                <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                  <Upload className="h-8 w-8 mb-2 text-gray-400" />
                  <div className="text-sm text-center space-y-1">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOCX or XLSX (Max 10MB)</p>
                  </div>
                  <Input
                    id="templateFile"
                    type="file"
                    className="mt-4 w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  placeholder="Description of this template and its usage"
                  id="description"
                  className="resize-none"
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload Template</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Generate Document Dialog with Recipient Selection */}
        <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Generate {activeTemplate?.name}</DialogTitle>
              <DialogDescription>
                Select a recipient to generate and send this document.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientSearch">Search Recipients</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recipientSearch"
                    placeholder="Search by name or email..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="border rounded-md">
                <div className="p-2 bg-muted/50 border-b flex items-center justify-between text-sm font-medium">
                  <div>Select Recipient</div>
                  {selectedRecipient && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => setSelectedRecipient(null)}
                    >
                      Clear Selection
                    </Button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredRecipients.length > 0 ? (
                    filteredRecipients.map(recipient => (
                      <div
                        key={recipient.id}
                        className={`p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 flex items-center justify-between ${
                          selectedRecipient?.id === recipient.id ? 'bg-muted/50' : ''
                        }`}
                        onClick={() => setSelectedRecipient(recipient)}
                      >
                        <div>
                          <div className="font-medium">{recipient.name}</div>
                          <div className="text-sm text-muted-foreground">{recipient.email}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {recipient.role} {recipient.batchId ? `• Batch: ${recipient.batchId}` : recipient.centerId ? `• Center: ${recipient.centerId}` : ''}
                          </div>
                        </div>
                        {selectedRecipient?.id === recipient.id && (
                          <Badge className="ml-2" variant="outline">Selected</Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No recipients found. Try adjusting your search.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailSubject">Email Subject</Label>
                <Input 
                  id="emailSubject" 
                  defaultValue={`Your ${activeTemplate?.name} Document`}
                  placeholder="Enter email subject" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailMessage">Email Message (Optional)</Label>
                <Textarea
                  id="emailMessage"
                  placeholder="Enter a message to be included in the email"
                  className="resize-none"
                  rows={3}
                  defaultValue={`Please find attached your ${activeTemplate?.name} document.`}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGenerateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleGenerateDocument}
                disabled={!selectedRecipient}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Generate & Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>
                {activeTemplate.name} Preview
              </DialogTitle>
              <DialogDescription>
                This is a preview of how the document will look with sample data.
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-white border rounded-md p-6 min-h-[400px] shadow-sm">
              {/* This would be replaced by an actual document preview in a real app */}
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold mb-2">CERTIFICATE OF COMPLETION</h2>
                  <p className="text-sm text-gray-600">This is to certify that</p>
                </div>
                
                <div className="text-center my-4">
                  <h3 className="text-lg font-semibold">{'<<CandidateName>>'}</h3>
                  <p>(ID: {'<<CandidateID>>'})</p>
                </div>
                
                <p className="text-center">
                  has successfully completed training for the role of <b>{'<<JobRole>>'}</b> 
                  at <b>{'<<CenterName>>'}</b> from <b>{'<<StartDate>>'}</b> to <b>{'<<EndDate>>'}</b> 
                  as part of the <b>{'<<BatchCode>>'}</b> training batch.
                </p>
                
                <div className="mt-12 flex justify-between">
                  <div className="text-center">
                    <div className="h-px w-32 bg-gray-400 mb-1"></div>
                    <p className="text-sm">Trainer Signature</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="h-px w-32 bg-gray-400 mb-1"></div>
                    <p className="text-sm">Center Manager</p>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground my-2">
              <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
              This is a sample preview. Values in {'<<brackets>>'} will be replaced with actual data during generation.
            </p>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>Close</Button>
              <Button onClick={handleTestGenerate}>Generate Document</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Help Dialog */}
        <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>How Document Generator Works</DialogTitle>
              <DialogDescription>
                Learn how to use this tool efficiently.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">What is Document Generator?</h4>
                <p className="text-sm text-muted-foreground">
                  Document Generator allows you to create templates with placeholders that will be automatically
                  filled with candidate, batch, or company data to generate personalized documents.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">How to Use:</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li><span className="font-medium">Upload Templates:</span> Start by uploading document templates (PDF, DOCX, XLSX) with placeholders.</li>
                  <li><span className="font-medium">Define Placeholders:</span> Use placeholders like {'<<CandidateName>>'} in your documents where dynamic content should appear.</li>
                  <li><span className="font-medium">Generate Documents:</span> Select a template, choose recipients, and generate personalized documents automatically.</li>
                  <li><span className="font-medium">Auto Email:</span> Enable automatic emailing to send documents directly to candidates or partners.</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Supported Placeholders:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>{'<<CandidateName>>'}</div>
                  <div>{'<<CandidateID>>'}</div>
                  <div>{'<<BatchCode>>'}</div>
                  <div>{'<<CenterName>>'}</div>
                  <div>{'<<JobRole>>'}</div>
                  <div>{'<<StartDate>>'}</div>
                  <div>{'<<EndDate>>'}</div>
                  <div>and many more...</div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setHelpDialogOpen(false)}>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default DocumentGenerator;
