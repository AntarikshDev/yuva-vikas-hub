import React, { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Check, X, Search, Filter, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockParentConsents = [
  {
    id: 1,
    candidateName: "John Doe",
    parentName: "Robert Doe",
    consent: "yes",
    date: "2025-01-15",
    remarks: "Parent fully supportive of placement",
    contactNumber: "+91 9876543210",
    batch: "Batch 2025-01"
  },
  {
    id: 2,
    candidateName: "Jane Smith",
    parentName: "Mary Smith",
    consent: "no",
    date: "2025-01-14",
    remarks: "Concerns about location distance",
    contactNumber: "+91 9876543211",
    batch: "Batch 2025-01"
  },
  {
    id: 3,
    candidateName: "Mike Johnson",
    parentName: "David Johnson",
    consent: "yes",
    date: "2025-01-13",
    remarks: "Eager for child's career growth",
    contactNumber: "+91 9876543212",
    batch: "Batch 2025-02"
  },
  {
    id: 4,
    candidateName: "Sarah Wilson",
    parentName: "Linda Wilson",
    consent: "pending",
    date: "",
    remarks: "Awaiting counselling session",
    contactNumber: "+91 9876543213",
    batch: "Batch 2025-01"
  },
  {
    id: 5,
    candidateName: "Alex Brown",
    parentName: "James Brown",
    consent: "yes",
    date: "2025-01-12",
    remarks: "Happy with job role and salary",
    contactNumber: "+91 9876543214",
    batch: "Batch 2025-02"
  }
];

export default function ParentConsentSummary() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [consentFilter, setConsentFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");

  const filteredConsents = mockParentConsents.filter(consent => {
    const matchesSearch = consent.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consent.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConsent = consentFilter === "all" || consent.consent === consentFilter;
    const matchesBatch = batchFilter === "all" || consent.batch === batchFilter;
    return matchesSearch && matchesConsent && matchesBatch;
  });

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Parent consent summary is being exported to Excel.",
    });
  };

  const getConsentBadge = (consent: string) => {
    switch (consent) {
      case "yes":
        return <Badge variant="default" className="bg-green-100 text-green-800">Consented</Badge>;
      case "no":
        return <Badge variant="destructive">Not Consented</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getConsentIcon = (consent: string) => {
    switch (consent) {
      case "yes":
        return <Check className="h-4 w-4 text-green-600" />;
      case "no":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-orange-600" />;
    }
  };

  const consentStats = {
    total: mockParentConsents.length,
    consented: mockParentConsents.filter(c => c.consent === "yes").length,
    notConsented: mockParentConsents.filter(c => c.consent === "no").length,
    pending: mockParentConsents.filter(c => c.consent === "pending").length
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Parent Consent Summary</h1>
            <p className="text-muted-foreground">
              Track and manage parent consent status for all candidates
            </p>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{consentStats.total}</div>
                  <p className="text-xs text-muted-foreground">Total Parents</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{consentStats.consented}</div>
                  <p className="text-xs text-muted-foreground">Consented</p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{consentStats.notConsented}</div>
                  <p className="text-xs text-muted-foreground">Not Consented</p>
                </div>
                <X className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{consentStats.pending}</div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates or parents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={consentFilter} onValueChange={setConsentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Consent Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="yes">Consented</SelectItem>
                  <SelectItem value="no">Not Consented</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="Batch 2025-01">Batch 2025-01</SelectItem>
                  <SelectItem value="Batch 2025-02">Batch 2025-02</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Parent Consent Table */}
        <Card>
          <CardHeader>
            <CardTitle>Parent Consent Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Consent Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsents.map((consent) => (
                    <TableRow key={consent.id}>
                      <TableCell className="font-medium">{consent.candidateName}</TableCell>
                      <TableCell>{consent.parentName}</TableCell>
                      <TableCell>{consent.contactNumber}</TableCell>
                      <TableCell>{consent.batch}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getConsentIcon(consent.consent)}
                          {getConsentBadge(consent.consent)}
                        </div>
                      </TableCell>
                      <TableCell>{consent.date || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">{consent.remarks}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          {consent.consent === "pending" && (
                            <Button size="sm">
                              Schedule Call
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}