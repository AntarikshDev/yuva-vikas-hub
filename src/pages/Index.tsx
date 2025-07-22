
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userRoles = [
    {
      value: "super-admin",
      label: "Super Admin",
      path: "/admin/dashboard",
    },
    {
      value: "state-head",
      label: "State Head",
      path: "/state-head/dashboard",
    },
    {
      value: "mobilizer",
      label: "Mobilizer",
      path: "/mobilizer/new",
    },
    {
      value: "candidate",
      label: "Candidate",
      path: "/candidate",
    },
    {
      value: "trainer",
      label: "Trainer",
      path: "/trainer",
    },
    {
      value: "counsellor",
      label: "Counsellor",
      path: "/counsellor/dashboard",
    },
    {
      value: "center-manager",
      label: "Center Manager",
      path: "/center-manager/dashboard",
    },
    {
      value: "mis-admin",
      label: "MIS Admin",
      path: "/mis-admin/dashboard",
    },
    {
      value: "company-hr",
      label: "Company HR",
      path: "/company-hr/dashboard",
    },
    {
      value: "ppc-admin",
      label: "PPC Admin",
      path: "/ppc-admin/dashboard",
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && username && password) {
      const role = userRoles.find(r => r.value === selectedRole);
      if (role) {
        navigate(role.path);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              LNJ Skills Hub
            </h1>
            <p className="text-gray-600">
              Login to access your dashboard
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Select Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!selectedRole || !username || !password}
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-800 border border-indigo-200">
              <span className="mr-2">🔐</span>
              Select your role and login to access the platform
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
