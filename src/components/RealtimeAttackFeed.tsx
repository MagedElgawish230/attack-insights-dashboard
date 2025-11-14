import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Shield, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const attacks = [
  {
    id: 1,
    type: "SQL Injection",
    severity: "critical",
    ip: "192.168.1.45",
    time: "2 mins ago",
    status: "blocked",
  },
  {
    id: 2,
    type: "XSS Attack",
    severity: "high",
    ip: "10.0.0.123",
    time: "5 mins ago",
    status: "blocked",
  },
  {
    id: 3,
    type: "DDoS Attempt",
    severity: "critical",
    ip: "172.16.0.89",
    time: "8 mins ago",
    status: "blocked",
  },
  {
    id: 4,
    type: "Path Traversal",
    severity: "medium",
    ip: "192.168.2.10",
    time: "12 mins ago",
    status: "blocked",
  },
  {
    id: 5,
    type: "Brute Force",
    severity: "high",
    ip: "203.0.113.45",
    time: "15 mins ago",
    status: "blocked",
  },
  {
    id: 6,
    type: "Suspicious Pattern",
    severity: "low",
    ip: "198.51.100.23",
    time: "18 mins ago",
    status: "monitored",
  },
];

const severityConfig = {
  critical: { icon: AlertTriangle, color: "text-destructive", bgColor: "bg-destructive/10" },
  high: { icon: AlertCircle, color: "text-warning", bgColor: "bg-warning/10" },
  medium: { icon: Info, color: "text-primary", bgColor: "bg-primary/10" },
  low: { icon: Shield, color: "text-muted-foreground", bgColor: "bg-muted/10" },
};

export const RealtimeAttackFeed = () => {
  return (
    <Card className="border-2 border-primary/30 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Real-time Attack Feed
        </CardTitle>
        <CardDescription className="text-muted-foreground">Live security event monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {attacks.map((attack) => {
              const config = severityConfig[attack.severity as keyof typeof severityConfig];
              const Icon = config.icon;
              
              return (
                <div
                  key={attack.id}
                  className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-lg", config.bgColor)}>
                        <Icon className={cn("w-4 h-4", config.color)} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{attack.type}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>IP: {attack.ip}</span>
                          <span>•</span>
                          <span>{attack.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={attack.severity === "critical" || attack.severity === "high" ? "destructive" : "secondary"}
                        className="capitalize"
                      >
                        {attack.severity}
                      </Badge>
                      <Badge variant="outline" className="text-success border-success/50">
                        {attack.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
