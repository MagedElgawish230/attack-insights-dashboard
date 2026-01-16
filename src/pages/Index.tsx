import { Shield, Activity, AlertTriangle, CheckCircle, TrendingUp, Globe, FileText } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AttackChart } from "@/components/AttackChart";
import { AttackTypeChart } from "@/components/AttackTypeChart";
import { useState } from "react";
import { RealtimeAttackFeed } from "@/components/RealtimeAttackFeed";
import { Scene3D } from "@/components/Scene3D";
import { RetrainButton } from "@/components/RetrainButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/sentriai-logo.png";
import { ModeToggle } from "@/components/mode-toggle";
import { ExecutiveReportModal } from "@/components/ExecutiveReportModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardData } from "@/hooks/use-dashboard-data";

const Index = () => {
  const { websites, isLoading, toggleFalsePositive } = useDashboardData();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>("");
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Update selected website when data is loaded
  if (!selectedWebsiteId && websites.length > 0) {
    setSelectedWebsiteId(websites[0].id);
  }

  const selectedWebsite = websites.find(w => w.id === selectedWebsiteId) || websites[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Defensive check used if data fetch fails entirely and mock data is also missing
  if (websites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground gap-4">
        <h2 className="text-xl font-bold">No Data Available</h2>
        <p className="text-muted-foreground">Please configure Supabase or check your data source.</p>
      </div>
    );
  }

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
            <div className="flex items-center gap-4">
              <div className="w-[200px]">
                <Select value={selectedWebsiteId} onValueChange={setSelectedWebsiteId}>
                  <SelectTrigger className="bg-background/50 backdrop-blur-sm border-primary/20">
                    <SelectValue placeholder="Select Website" />
                  </SelectTrigger>
                  <SelectContent>
                    {websites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReportModalOpen(true)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Export Report</span>
              </Button>
              <div className="px-3 py-1.5 rounded-full bg-success/20 border border-success/30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">System Active</span>
              </div>
              <ModeToggle />
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
              <Scene3D attacks={selectedWebsite.recentAttacks} />
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Threats Detected"
            value={selectedWebsite.stats.totalThreats}
            icon={AlertTriangle}
            trend={{ value: Math.abs(selectedWebsite.stats.trend), isPositive: selectedWebsite.stats.trend > 0 }}
            variant="critical"
          />
          <StatCard
            title="Threats Blocked"
            value={selectedWebsite.stats.threatsBlocked}
            icon={CheckCircle}
            trend={{ value: Math.abs(selectedWebsite.stats.blockedTrend), isPositive: selectedWebsite.stats.blockedTrend > 0 }}
            variant="success"
          />
          <StatCard
            title="Active Protection"
            value={selectedWebsite.stats.activeProtection}
            icon={Shield}
            variant="default"
          />
          <StatCard
            title="False Positives"
            value={selectedWebsite.stats.falsePositives}
            icon={Activity}
            variant="warning"
          />
        </div>

        {/* Retrain AI Model Button */}
        {parseInt(selectedWebsite.stats.falsePositives) > 0 && (
          <div className="mb-8 flex justify-center">
            <RetrainButton />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AttackChart data={selectedWebsite.attackTrend} />
          <AttackTypeChart data={selectedWebsite.attackTypes} />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Avg Response Time"
            value={selectedWebsite.stats.avgResponseTime}
            icon={TrendingUp}
            variant="default"
          />
          <StatCard
            title="Protected Endpoints"
            value={selectedWebsite.stats.protectedEndpoints}
            icon={Globe}
            variant="default"
          />
          <StatCard
            title="ML Model Accuracy"
            value={selectedWebsite.stats.modelAccuracy}
            icon={Activity}
            variant="success"
          />
        </div>

        {/* Real-time Feed */}
        {/* Real-time Feed */}
        <RealtimeAttackFeed
          attacks={selectedWebsite.recentAttacks}
          onToggleFalsePositive={toggleFalsePositive}
        />
      </main>

      {/* Executive Report Modal */}
      <ExecutiveReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        stats={selectedWebsite.stats}
        attackTypes={selectedWebsite.attackTypes}
      />
    </div>
  );
};

export default Index;
