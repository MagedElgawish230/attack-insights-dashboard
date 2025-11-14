import { Shield, Activity, AlertTriangle, CheckCircle, TrendingUp, Globe } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AttackChart } from "@/components/AttackChart";
import { AttackTypeChart } from "@/components/AttackTypeChart";
import { RealtimeAttackFeed } from "@/components/RealtimeAttackFeed";
import { Scene3D } from "@/components/Scene3D";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/sentriai-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-primary/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="SentriAI Logo" 
                className="w-12 h-12 rounded-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-6" 
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">SentriAI</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Predictive Web Security System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-success/20 border border-success/30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 perspective-container">
        {/* 3D Visualization Hero */}
        <div className="mb-8">
          <Card className="border-2 border-primary/30 bg-card/50 backdrop-blur-sm card-3d overflow-hidden">
            <CardHeader>
              <CardTitle className="text-foreground">Threat Intelligence Visualization</CardTitle>
              <CardDescription className="text-muted-foreground">Interactive 3D security monitoring sphere</CardDescription>
            </CardHeader>
            <CardContent>
              <Scene3D />
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Threats Detected"
            value="1,247"
            icon={AlertTriangle}
            trend={{ value: 12, isPositive: false }}
            variant="critical"
          />
          <StatCard
            title="Threats Blocked"
            value="1,189"
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
            variant="success"
          />
          <StatCard
            title="Active Protection"
            value="99.2%"
            icon={Shield}
            variant="default"
          />
          <StatCard
            title="False Positives"
            value="58"
            icon={Activity}
            trend={{ value: 5, isPositive: true }}
            variant="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AttackChart />
          <AttackTypeChart />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Avg Response Time"
            value="0.8ms"
            icon={TrendingUp}
            variant="default"
          />
          <StatCard
            title="Protected Endpoints"
            value="247"
            icon={Globe}
            variant="default"
          />
          <StatCard
            title="ML Model Accuracy"
            value="98.7%"
            icon={Activity}
            variant="success"
          />
        </div>

        {/* Real-time Feed */}
        <RealtimeAttackFeed />
      </main>
    </div>
  );
};

export default Index;
