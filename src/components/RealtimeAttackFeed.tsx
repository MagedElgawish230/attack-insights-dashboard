import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, AlertCircle, Info, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  location?: string;
  is_false_positive?: boolean;
}

interface RealtimeAttackFeedProps {
  attacks: AttackEvent[];
  onToggleFalsePositive?: (id: number, currentVal: boolean) => void;
}

export const RealtimeAttackFeed = ({ attacks, onToggleFalsePositive }: RealtimeAttackFeedProps) => {
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
              const config = severityConfig[attack.severity as keyof typeof severityConfig] || severityConfig.medium;
              const Icon = config.icon;
              const isFP = attack.is_false_positive;

              return (
                <div
                  key={attack.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-300",
                    isFP
                      ? "border-warning/50 bg-warning/5"
                      : "border-border bg-background/50 hover:bg-background/80"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-lg", isFP ? "bg-warning/10" : config.bgColor)}>
                        {isFP ? (
                          <Flag className="w-4 h-4 text-warning" />
                        ) : (
                          <Icon className={cn("w-4 h-4", config.color)} />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("font-semibold", isFP ? "text-warning" : "text-foreground")}>
                            {attack.type}
                            <span className="ml-1.5 text-xs font-mono text-muted-foreground opacity-70">
                              #{attack.id}
                            </span>
                            {isFP && " (False Positive)"}
                          </p>
                          {attack.location && (
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 py-0 border-primary/30 text-primary/80">
                              {attack.location}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>IP: {attack.ip}</span>
                          <span>•</span>
                          <span>{attack.time}</span>
                        </div>
                        <code className={cn(
                          "text-xs px-2 py-1 rounded block mt-1 font-mono break-all whitespace-pre-wrap",
                          isFP ? "text-warning/80 bg-warning/10" : "text-destructive bg-destructive/10"
                        )}>
                          {attack.payload}
                        </code>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {isFP ? (
                        <Badge variant="outline" className="text-warning border-warning">
                          False Positive
                        </Badge>
                      ) : (
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
                      )}

                      {onToggleFalsePositive && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-6 w-6 p-0 mt-2",
                                  isFP ? "text-warning hover:text-warning/80 hover:bg-warning/10" : "hover:text-warning hover:bg-warning/10"
                                )}
                                onClick={() => onToggleFalsePositive(attack.id, !!isFP)}
                              >
                                {isFP ? <Flag className="w-3 h-3 fill-warning" /> : <Flag className="w-3 h-3" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isFP ? "Undo False Positive" : "Mark as False Positive"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
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
