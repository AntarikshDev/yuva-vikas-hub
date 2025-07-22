import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, CheckCircle, Eye, Download, Search } from "lucide-react";

const PrePlacementCompliance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const counsellingData = [
    {
      state: "Karnataka",
      centre: "Bangalore Center A",
      batch: "Batch X",
      counsellingCompletion: 90,
      parentCounselling: 85,
      assessmentCompletion: 92,
      trainerResponsible: "Anil Sharma"
    },
    {
      state: "Maharashtra",
      centre: "Mumbai Center B",
      batch: "Batch Y",
      counsellingCompletion: 75,
      parentCounselling: 80,
      assessmentCompletion: 88,
      trainerResponsible: "Priya Patel"
    },
    {
      state: "Delhi",
      centre: "Delhi Center C",
      batch: "Batch Z",
      counsellingCompletion: 95,
      parentCounselling: 90,
      assessmentCompletion: 94,
      trainerResponsible: "Rajesh Kumar"
    }
  ];

  const centreDeclarations = [
    {
      centreName: "Bangalore Center A",
      batch: "Batch X",
      dateSubmitted: "2025-07-20",
      status: "Pending"
    },
    {
      centreName: "Mumbai Center B",
      batch: "Batch Y",
      dateSubmitted: "2025-07-19",
      status: "Verified"
    },
    {
      centreName: "Delhi Center C",
      batch: "Batch Z",
      dateSubmitted: "2025-07-21",
      status: "Pending"
    }
  ];

  const candidateDeclarations = [
    {
      candidateName: "Ravi Kumar",
      batch: "Batch X",
      company: "TechCorp India",
      status: "Pending"
    },
    {
      candidateName: "Priya Sharma",
      batch: "Batch Y",
      company: "RetailMax Ltd",
      status: "Verified"
    },
    {
      candidateName: "Amit Singh",
      batch: "Batch Z",
      company: "ServicePro Pvt",
      status: "Pending"
    }
  ];

  const documentCompliance = [
    {
      batch: "Batch X",
      totalCandidates: 25,
      missingDocs: 8,
      ofrsGenerated: 20,
      videoLogsReviewed: 22
    },
    {
      batch: "Batch Y",
      totalCandidates: 30,
      missingDocs: 5,
      ofrsGenerated: 28,
      videoLogsReviewed: 30
    },
    {
      batch: "Batch Z",
      totalCandidates: 20,
      missingDocs: 3,
      ofrsGenerated: 18,
      videoLogsReviewed: 19
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pre-Placement Compliance</h1>
          <p className="text-gray-600">Monitor counselling, assessments, and declaration compliance</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Centre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center-a">Bangalore Center A</SelectItem>
                <SelectItem value="center-b">Mumbai Center B</SelectItem>
                <SelectItem value="center-c">Delhi Center C</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="batch-x">Batch X</SelectItem>
                <SelectItem value="batch-y">Batch Y</SelectItem>
                <SelectItem value="batch-z">Batch Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="counselling" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="counselling">Counselling & Assessment</TabsTrigger>
          <TabsTrigger value="declarations">Declaration Verification</TabsTrigger>
          <TabsTrigger value="documents">Document Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="counselling">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Counselling & Assessment Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead>Centre</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Counselling %</TableHead>
                      <TableHead>Parent Counselling %</TableHead>
                      <TableHead>Assessment %</TableHead>
                      <TableHead>Trainer</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {counsellingData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.state}</TableCell>
                        <TableCell>{item.centre}</TableCell>
                        <TableCell>{item.batch}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${item.counsellingCompletion}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{item.counsellingCompletion}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${item.parentCounselling}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{item.parentCounselling}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${item.assessmentCompletion}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{item.assessmentCompletion}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.trainerResponsible}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Counselling Details - {item.batch}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p>Detailed candidate-wise counselling progress would be displayed here...</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="declarations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Centre Declarations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Centre Declaration Letters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {centreDeclarations.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{item.centreName}</h4>
                          <p className="text-sm text-gray-600">{item.batch}</p>
                          <p className="text-xs text-gray-500">Submitted: {item.dateSubmitted}</p>
                        </div>
                        <Badge variant={item.status === "Verified" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {item.status === "Pending" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Candidate Declarations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Candidate Declaration Letters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Bulk Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Bulk Reject
                    </Button>
                  </div>
                  {candidateDeclarations.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Checkbox />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{item.candidateName}</h4>
                              <p className="text-sm text-gray-600">{item.batch} • {item.company}</p>
                            </div>
                            <Badge variant={item.status === "Verified" ? "default" : "secondary"}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Compliance Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch</TableHead>
                      <TableHead>Total Candidates</TableHead>
                      <TableHead>Missing Docs %</TableHead>
                      <TableHead>OFRs Generated %</TableHead>
                      <TableHead>Video Logs Reviewed %</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentCompliance.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">{item.batch}</TableCell>
                        <TableCell>{item.totalCandidates}</TableCell>
                        <TableCell>
                          <Badge variant={Math.round((item.missingDocs / item.totalCandidates) * 100) > 20 ? "destructive" : "secondary"}>
                            {Math.round((item.missingDocs / item.totalCandidates) * 100)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={Math.round((item.ofrsGenerated / item.totalCandidates) * 100) > 80 ? "default" : "secondary"}>
                            {Math.round((item.ofrsGenerated / item.totalCandidates) * 100)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={Math.round((item.videoLogsReviewed / item.totalCandidates) * 100) > 80 ? "default" : "secondary"}>
                            {Math.round((item.videoLogsReviewed / item.totalCandidates) * 100)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
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

export default PrePlacementCompliance;