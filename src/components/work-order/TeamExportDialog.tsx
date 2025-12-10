import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { MobilisationTeamMember } from "./WorkOrderAssignmentTab";

interface TeamExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: MobilisationTeamMember[];
  workOrderId: string;
}

const TeamExportDialog = ({
  open,
  onOpenChange,
  members,
  workOrderId,
}: TeamExportDialogProps) => {
  const [format, setFormat] = useState<"excel" | "pdf">("excel");
  const [includeOptions, setIncludeOptions] = useState({
    orgStructure: true,
    salaryBreakdown: true,
    contactDetails: true,
    statusHistory: false,
  });

  const calculateSalaryBreakdown = () => {
    const activeMembers = members.filter((m) => m.status === "active");
    const breakdown: Record<string, { count: number; total: number }> = {};

    activeMembers.forEach((member) => {
      if (!breakdown[member.roleDisplayName]) {
        breakdown[member.roleDisplayName] = { count: 0, total: 0 };
      }
      breakdown[member.roleDisplayName].count++;
      breakdown[member.roleDisplayName].total += member.salary;
    });

    return breakdown;
  };

  const generateCSVContent = () => {
    const breakdown = calculateSalaryBreakdown();
    let csv = "";

    // Header
    csv += `Work Order Team Export - ${workOrderId}\n`;
    csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    // Team List
    csv += "TEAM ROSTER\n";
    csv += "Employee ID,Name,Role,";
    if (includeOptions.contactDetails) csv += "Email,Phone,";
    if (includeOptions.salaryBreakdown) csv += "Monthly Salary,";
    csv += "Status,Reporting To,Start Date\n";

    members
      .filter((m) => m.status !== "removed")
      .forEach((member) => {
        csv += `${member.employeeId},${member.name},${member.roleDisplayName},`;
        if (includeOptions.contactDetails)
          csv += `${member.email},${member.phone},`;
        if (includeOptions.salaryBreakdown) csv += `${member.salary},`;
        csv += `${member.status},${member.reportingTo || "N/A"},${member.assignmentStartDate}\n`;
      });

    // Salary Breakdown
    if (includeOptions.salaryBreakdown) {
      csv += "\n\nSALARY BREAKDOWN BY ROLE\n";
      csv += "Role,Count,Total Monthly Cost\n";
      let grandTotal = 0;
      Object.entries(breakdown).forEach(([role, data]) => {
        csv += `${role},${data.count},${data.total}\n`;
        grandTotal += data.total;
      });
      csv += `GRAND TOTAL,${members.filter((m) => m.status === "active").length},${grandTotal}\n`;
    }

    // Org Structure
    if (includeOptions.orgStructure) {
      csv += "\n\nORGANIZATIONAL STRUCTURE\n";
      csv += "Level,Role,Employee,Reports To\n";

      const roleHierarchy = [
        "state_head",
        "project_head",
        "operation_manager",
        "centre_manager",
        "mobilisation_manager",
        "mobiliser",
      ];

      roleHierarchy.forEach((role, level) => {
        members
          .filter((m) => m.role === role && m.status !== "removed")
          .forEach((member) => {
            const reportsTo = members.find(
              (m) => m.employeeId === member.reportingTo
            );
            csv += `${level + 1},${member.roleDisplayName},${member.name} (${member.employeeId}),${reportsTo ? reportsTo.name : "N/A"}\n`;
          });
      });
    }

    return csv;
  };

  const handleExport = () => {
    if (format === "excel") {
      const csvContent = generateCSVContent();
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `team_export_${workOrderId}_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Team list exported as CSV file.",
      });
    } else {
      // PDF generation - create a printable HTML
      const breakdown = calculateSalaryBreakdown();
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast({
          title: "Export Failed",
          description: "Please allow popups to export PDF.",
          variant: "destructive",
        });
        return;
      }

      const activeMembers = members.filter((m) => m.status !== "removed");
      const totalSalary = activeMembers
        .filter((m) => m.status === "active")
        .reduce((sum, m) => sum + m.salary, 0);

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Team Export - ${workOrderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #444; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            tr:nth-child(even) { background-color: #fafafa; }
            .summary-box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
            .summary-item { text-align: center; }
            .summary-value { font-size: 24px; font-weight: bold; color: #1a1a1a; }
            .summary-label { font-size: 12px; color: #666; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>Work Order Team Report</h1>
          <p><strong>Work Order:</strong> ${workOrderId} | <strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          
          <div class="summary-box">
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-value">${activeMembers.length}</div>
                <div class="summary-label">Total Members</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${activeMembers.filter((m) => m.status === "active").length}</div>
                <div class="summary-label">Active</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${activeMembers.filter((m) => m.status === "pending_approval").length}</div>
                <div class="summary-label">Pending Approval</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">₹${totalSalary.toLocaleString()}</div>
                <div class="summary-label">Monthly Salary</div>
              </div>
            </div>
          </div>

          <h2>Team Roster</h2>
          <table>
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Role</th>
                ${includeOptions.contactDetails ? "<th>Email</th><th>Phone</th>" : ""}
                ${includeOptions.salaryBreakdown ? "<th>Salary (₹)</th>" : ""}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${activeMembers
                .map(
                  (m) => `
                <tr>
                  <td>${m.employeeId}</td>
                  <td>${m.name}</td>
                  <td>${m.roleDisplayName}</td>
                  ${includeOptions.contactDetails ? `<td>${m.email}</td><td>${m.phone}</td>` : ""}
                  ${includeOptions.salaryBreakdown ? `<td>${m.salary.toLocaleString()}</td>` : ""}
                  <td>${m.status === "active" ? "✓ Active" : "⏳ Pending"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          ${
            includeOptions.salaryBreakdown
              ? `
            <h2>Salary Breakdown by Role</h2>
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Count</th>
                  <th>Monthly Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(breakdown)
                  .map(
                    ([role, data]) => `
                  <tr>
                    <td>${role}</td>
                    <td>${data.count}</td>
                    <td>${data.total.toLocaleString()}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr style="font-weight: bold; background: #e9ecef;">
                  <td>TOTAL</td>
                  <td>${activeMembers.filter((m) => m.status === "active").length}</td>
                  <td>₹${totalSalary.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          `
              : ""
          }

          ${
            includeOptions.orgStructure
              ? `
            <h2>Organizational Structure</h2>
            <table>
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Role</th>
                  <th>Employee</th>
                  <th>Reports To</th>
                </tr>
              </thead>
              <tbody>
                ${["state_head", "project_head", "operation_manager", "centre_manager", "mobilisation_manager", "mobiliser"]
                  .map((role, level) =>
                    activeMembers
                      .filter((m) => m.role === role)
                      .map((m) => {
                        const reportsTo = members.find(
                          (r) => r.employeeId === m.reportingTo
                        );
                        return `
                        <tr>
                          <td>${level + 1}</td>
                          <td>${m.roleDisplayName}</td>
                          <td>${m.name} (${m.employeeId})</td>
                          <td>${reportsTo ? reportsTo.name : "—"}</td>
                        </tr>
                      `;
                      })
                      .join("")
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : ""
          }

          <div class="footer">
            <p>This report was generated from the Work Order Management System.</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();

      toast({
        title: "Export Successful",
        description: "PDF export opened in new window.",
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Team Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(v) => setFormat(v as "excel" | "pdf")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label
                  htmlFor="excel"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  Excel (CSV)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label
                  htmlFor="pdf"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-red-600" />
                  PDF
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <Label>Include in Export</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="orgStructure"
                  checked={includeOptions.orgStructure}
                  onCheckedChange={(checked) =>
                    setIncludeOptions((prev) => ({
                      ...prev,
                      orgStructure: !!checked,
                    }))
                  }
                />
                <Label htmlFor="orgStructure" className="cursor-pointer">
                  Organizational Structure
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="salaryBreakdown"
                  checked={includeOptions.salaryBreakdown}
                  onCheckedChange={(checked) =>
                    setIncludeOptions((prev) => ({
                      ...prev,
                      salaryBreakdown: !!checked,
                    }))
                  }
                />
                <Label htmlFor="salaryBreakdown" className="cursor-pointer">
                  Salary Breakdown by Role
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contactDetails"
                  checked={includeOptions.contactDetails}
                  onCheckedChange={(checked) =>
                    setIncludeOptions((prev) => ({
                      ...prev,
                      contactDetails: !!checked,
                    }))
                  }
                />
                <Label htmlFor="contactDetails" className="cursor-pointer">
                  Contact Details (Email, Phone)
                </Label>
              </div>
            </div>
          </div>

          {/* Preview Summary */}
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="font-medium mb-2">Export Preview</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                • {members.filter((m) => m.status !== "removed").length} team
                members
              </li>
              <li>
                • Total salary: ₹
                {members
                  .filter((m) => m.status === "active")
                  .reduce((sum, m) => sum + m.salary, 0)
                  .toLocaleString()}
                /month
              </li>
              <li>• Format: {format === "excel" ? "CSV Spreadsheet" : "PDF Document"}</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamExportDialog;
