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
    payload: "' OR '1'='1' --",
  },
  {
    id: 2,
    type: "XSS Attack",
    severity: "critical",
    ip: "10.0.0.123",
    time: "3 mins ago",
    status: "blocked",
    payload: "<script>alert('XSS')</script>",
  },
  {
    id: 3,
    type: "Command Injection",
    severity: "critical",
    ip: "172.16.0.89",
    time: "5 mins ago",
    status: "blocked",
    payload: "; cat /etc/passwd",
  },
  {
    id: 4,
    type: "SQL Injection",
    severity: "high",
    ip: "192.168.2.10",
    time: "8 mins ago",
    status: "blocked",
    payload: "UNION SELECT * FROM users",
  },
  {
    id: 5,
    type: "XSS Attack",
    severity: "high",
    ip: "203.0.113.45",
    time: "12 mins ago",
    status: "blocked",
    payload: "<img src=x onerror=alert(1)>",
  },
  {
    id: 6,
    type: "Command Injection",
    severity: "critical",
    ip: "198.51.100.23",
    time: "15 mins ago",
    status: "blocked",
    payload: "| rm -rf /",
  },
  {
    id: 7,
    type: "SQL Injection",
    severity: "medium",
    ip: "172.20.5.67",
    time: "18 mins ago",
    status: "blocked",
    payload: "admin' --",
  },
  {
    id: 8,
    type: "XSS Attack",
    severity: "high",
    ip: "10.10.10.99",
    time: "22 mins ago",
    status: "blocked",
    payload: "javascript:void(0)",
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
    <Card className="border-2 border-primary/30 bg-card card-3d">
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
                        <code className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded block mt-1 font-mono">
                          {(attack as any).payload}
                        </code>
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
