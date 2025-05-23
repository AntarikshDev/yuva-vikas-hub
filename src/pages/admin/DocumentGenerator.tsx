
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
import { Upload, FilePlus, FileEdit, FileCheck, Mail, Eye, Download, Trash2 } from 'lucide-react';

const DocumentGenerator = () => {
  // Dummy data for document templates
  const templates = [
    { id: 1, name: 'Candidate Declaration', type: 'PDF', fields: 12, lastUpdated: '2023-10-15', autoEmail: true },
    { id: 2, name: 'Center Declaration', type: 'DOCX', fields: 8, lastUpdated: '2023-09-22', autoEmail: false },
    { id: 3, name: 'Offer Letter Template', type: 'PDF', fields: 15, lastUpdated: '2023-11-05', autoEmail: true },
    { id: 4, name: 'Travel Letter', type: 'PDF', fields: 10, lastUpdated: '2023-08-30', autoEmail: true },
    { id: 5, name: 'Attendance Sheet', type: 'XLSX', fields: 5, lastUpdated: '2023-10-10', autoEmail: false },
  ];

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

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Document Generator</h1>
            <p className="text-muted-foreground">
              Manage and generate document templates for various purposes.
            </p>
          </div>
          <Button className="gap-2">
            <FilePlus className="h-4 w-4" />
            Upload Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
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
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{activeTemplate.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <FileEdit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
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
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Field Mappings</h3>
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
                    <Switch id="auto-email" checked={activeTemplate.autoEmail} />
                    <Label htmlFor="auto-email" className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      Auto Email On Generation
                    </Label>
                  </div>
                </div>
                <Button size="sm" className="h-8 gap-1">
                  <FileCheck className="h-3.5 w-3.5" />
                  Test Generate
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DocumentGenerator;
