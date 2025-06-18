
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const userRoles = [
    {
      title: "Super Admin",
      description: "Complete system administration and oversight",
      path: "/admin/dashboard",
      color: "bg-gradient-to-br from-purple-600 to-purple-800",
    },
    {
      title: "State Head",
      description: "State-level management and monitoring",
      path: "/state-head/dashboard",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
    },
    {
      title: "Mobilizer",
      description: "Field operations and candidate enrollment",
      path: "/mobilizer/new",
      color: "bg-gradient-to-br from-green-600 to-green-800",
    },
    {
      title: "Candidate",
      description: "Training progress and placement tracking",
      path: "/candidate",
      color: "bg-gradient-to-br from-orange-600 to-orange-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            LNJ Skills Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive skill development and placement tracking platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {userRoles.map((role) => (
            <Card key={role.title} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${role.color} flex items-center justify-center mb-4`}>
                  <span className="text-white text-xl font-bold">
                    {role.title.charAt(0)}
                  </span>
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(role.path)}
                  className="w-full"
                  variant="outline"
                >
                  Access Dashboard
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center rounded-lg bg-indigo-50 px-4 py-2 text-sm text-indigo-800 border border-indigo-200">
            <span className="mr-2">🚀</span>
            Ready to get started? Choose your role above to access the platform.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
