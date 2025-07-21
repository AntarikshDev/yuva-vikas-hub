import { useState } from "react";
import { Upload, FileText, Check, X, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documents = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const requiredDocs = [
    {
      id: 1,
      name: "Aadhaar Card",
      description: "Government issued identity proof",
      status: "verified",
      uploadDate: "2025-06-01",
      fileName: "aadhaar_card.pdf",
      required: true
    },
    {
      id: 2,
      name: "Educational Certificate",
      description: "10th/12th marksheet or graduation certificate",
      status: "verified",
      uploadDate: "2025-06-01", 
      fileName: "education_cert.pdf",
      required: true
    },
    {
      id: 3,
      name: "Bank Passbook",
      description: "First page of bank passbook or cancelled cheque",
      status: "pending",
      uploadDate: "2025-06-05",
      fileName: "bank_details.pdf",
      required: true
    },
    {
      id: 4,
      name: "Passport Size Photo",
      description: "Recent colored photograph",
      status: "verified",
      uploadDate: "2025-06-01",
      fileName: "passport_photo.jpg",
      required: true
    },
    {
      id: 5,
      name: "Medical Certificate",
      description: "Medical fitness certificate",
      status: "rejected",
      uploadDate: "2025-06-03",
      fileName: "medical_cert.pdf",
      rejectionReason: "Document is not clear, please upload a clearer version",
      required: true
    }
  ];

  const optionalDocs = [
    {
      id: 6,
      name: "Experience Certificate",
      description: "Previous work experience (if any)",
      status: "not_uploaded",
      required: false
    },
    {
      id: 7,
      name: "Caste Certificate", 
      description: "For reservation benefits (if applicable)",
      status: "not_uploaded",
      required: false
    },
    {
      id: 8,
      name: "Income Certificate",
      description: "Family income proof (if applicable)",
      status: "not_uploaded", 
      required: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "default";
      case "pending": return "secondary";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <Check className="h-4 w-4" />;
      case "pending": return <Upload className="h-4 w-4" />;
      case "rejected": return <X className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const getCompletionStats = () => {
    const totalRequired = requiredDocs.length;
    const verified = requiredDocs.filter(doc => doc.status === "verified").length;
    return { verified, total: totalRequired, percentage: Math.round((verified / totalRequired) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <Button variant="outline">
          Download All Documents
        </Button>
      </div>

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle>Document Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{stats.verified}/{stats.total}</div>
              <div className="text-sm text-muted-foreground">Required documents verified</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.percentage}%</div>
              <div className="text-sm text-muted-foreground">Completion rate</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full" 
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            {stats.verified === stats.total 
              ? "✅ All required documents verified!" 
              : `${stats.total - stats.verified} documents pending verification`
            }
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="required" className="space-y-6">
        <TabsList>
          <TabsTrigger value="required">Required Documents</TabsTrigger>
          <TabsTrigger value="optional">Optional Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="required" className="space-y-6">
          <div className="space-y-4">
            {requiredDocs.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(doc.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                        {doc.uploadDate && (
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {doc.uploadDate}
                          </p>
                        )}
                        {doc.status === "rejected" && doc.rejectionReason && (
                          <p className="text-xs text-red-600 mt-1">
                            Rejection reason: {doc.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(doc.status)}>
                        {doc.status.replace("_", " ")}
                      </Badge>
                      
                      <div className="flex gap-2">
                        {doc.fileName && doc.status !== "not_uploaded" && (
                          <>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </>
                        )}
                        
                        {(doc.status === "not_uploaded" || doc.status === "rejected") && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Upload className="h-4 w-4 mr-1" />
                                {doc.status === "rejected" ? "Re-upload" : "Upload"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Upload {doc.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>{doc.description}</Label>
                                </div>
                                <div>
                                  <Label htmlFor="file">Select File</Label>
                                  <Input 
                                    type="file" 
                                    id="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileSelect}
                                    className="mt-1"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Supported formats: PDF, JPG, PNG (Max 5MB)
                                  </p>
                                </div>
                                {selectedFile && (
                                  <p className="text-sm text-muted-foreground">
                                    Selected: {selectedFile.name}
                                  </p>
                                )}
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button disabled={!selectedFile}>
                                    Upload Document
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optional" className="space-y-6">
          <div className="space-y-4">
            {optionalDocs.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(doc.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                        <Badge variant="outline" className="mt-1">Optional</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(doc.status)}>
                        {doc.status === "not_uploaded" ? "Not uploaded" : doc.status}
                      </Badge>
                      
                      {doc.status === "not_uploaded" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Upload {doc.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>{doc.description}</Label>
                              </div>
                              <div>
                                <Label htmlFor="file">Select File</Label>
                                <Input 
                                  type="file" 
                                  id="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={handleFileSelect}
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button disabled={!selectedFile}>
                                  Upload Document
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• All documents must be clear and readable</p>
            <p>• File size should not exceed 5MB per document</p>
            <p>• Supported formats: PDF, JPG, PNG</p>
            <p>• Document verification may take 2-3 working days</p>
            <p>• Contact support if you face any issues with document upload</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;