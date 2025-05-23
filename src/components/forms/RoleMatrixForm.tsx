
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface RoleMatrixFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define modules and permissions for the matrix
const modules = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'users', name: 'User & Role Management' },
  { id: 'master_data', name: 'Master Data Management' },
  { id: 'documents', name: 'Document Generator' },
  { id: 'batches', name: 'Batch Management' },
  { id: 'candidates', name: 'Candidate Directory' },
  { id: 'reports', name: 'Reports & Analytics' },
  { id: 'videos', name: 'Video Log Manager' },
  { id: 'ai_dropout', name: 'AI Dropout Engine' },
  { id: 'quality', name: 'Quality Tracker' },
  { id: 'sos', name: 'SOS & Escalation Tracker' },
  { id: 'export', name: 'Data Export Hub' },
  { id: 'settings', name: 'System Settings' },
];

const permissions = [
  { id: 'view', name: 'View' },
  { id: 'create', name: 'Create' },
  { id: 'edit', name: 'Edit' },
  { id: 'delete', name: 'Delete' },
];

export function RoleMatrixForm({ open, onOpenChange }: RoleMatrixFormProps) {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>('center_manager');
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<string, boolean>>>({});

  // Initialize permission matrix
  useEffect(() => {
    const initialMatrix: Record<string, Record<string, boolean>> = {};
    modules.forEach(module => {
      initialMatrix[module.id] = {};
      permissions.forEach(permission => {
        initialMatrix[module.id][permission.id] = false;
      });
    });
    setPermissionMatrix(initialMatrix);
  }, []);

  // Handle checkbox changes for role matrix
  const handlePermissionChange = (moduleId: string, permissionId: string, checked: boolean) => {
    setPermissionMatrix(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permissionId]: checked,
      }
    }));
  };

  // Handle select all for a module
  const handleSelectAllForModule = (moduleId: string, checked: boolean) => {
    setPermissionMatrix(prev => {
      const updatedModule = { ...prev[moduleId] };
      permissions.forEach(permission => {
        updatedModule[permission.id] = checked;
      });
      return {
        ...prev,
        [moduleId]: updatedModule
      };
    });
  };

  // Save role matrix changes
  const handleRoleMatrixSave = () => {
    toast({
      title: "Role Permissions Updated",
      description: `Permissions for ${selectedRole} have been updated`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Role Permission Matrix</DialogTitle>
          <DialogDescription>
            Configure access permissions for each role in the system
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <Label htmlFor="role-select">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role-select" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="state_head">State Head</SelectItem>
                <SelectItem value="center_manager">Center Manager</SelectItem>
                <SelectItem value="mobilizer">Mobilizer</SelectItem>
                <SelectItem value="ppc_team">PPC Team</SelectItem>
                <SelectItem value="trainer">Trainer</SelectItem>
                <SelectItem value="outreach_admin">Outreach Admin</SelectItem>
                <SelectItem value="accounts_team">Accounts Team</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 sticky top-0 bg-gray-100 z-10">Module</th>
                  {permissions.map(permission => (
                    <th key={permission.id} className="text-center p-2 sticky top-0 bg-gray-100 z-10">
                      {permission.name}
                    </th>
                  ))}
                  <th className="text-center p-2 sticky top-0 bg-gray-100 z-10">All</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(module => (
                  <tr key={module.id} className="border-b">
                    <td className="p-2">{module.name}</td>
                    {permissions.map(permission => (
                      <td key={permission.id} className="text-center p-2">
                        <Checkbox
                          id={`${module.id}-${permission.id}`}
                          checked={permissionMatrix[module.id]?.[permission.id] || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(module.id, permission.id, checked === true)
                          }
                        />
                      </td>
                    ))}
                    <td className="text-center p-2">
                      <Checkbox
                        id={`${module.id}-all`}
                        onCheckedChange={(checked) => 
                          handleSelectAllForModule(module.id, checked === true)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleRoleMatrixSave}>
            Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
