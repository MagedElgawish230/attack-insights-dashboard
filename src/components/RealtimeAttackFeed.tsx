import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const severityConfig = {
  critical: { icon: AlertTriangle, color: "text-destructive", bgColor: "bg-destructive/10" },
  high: { icon: AlertCircle, color: "text-warning", bgColor: "bg-warning/10" },
  medium: { icon: Info, color: "text-primary", bgColor: "bg-primary/10" },
  low: { icon: Shield, color: "text-muted-foreground", bgColor: "bg-muted/10" },
};

interface AttackEvent {
  id: number;
  type: string;
  severity: string;
  ip: string;
  time: string;
  status: string;
  payload: string;
}

export const RealtimeAttackFeed = ({ attacks }: { attacks: AttackEvent[] }) => {
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
        <div className="h-[500px] w-full overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
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
                          {attack.payload}
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
        </div>
      </CardContent>
    </Card>
  );
};
