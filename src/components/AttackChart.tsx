import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


interface AttackData {
  time: string;
  attacks: number;
  blocked: number;
}

export const AttackChart = ({ data }: { data: AttackData[] }) => {
  return (
    <Card className="border-2 border-primary/30 bg-card card-3d">
      <CardHeader>
        <CardTitle className="text-foreground">Attack Timeline</CardTitle>
        <CardDescription className="text-muted-foreground">24-hour attack pattern analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="attackGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(45 100% 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(45 100% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                color: "hsl(var(--foreground))",
              }}
            />
            <Area
              type="monotone"
              dataKey="attacks"
              stroke="hsl(0 84% 60%)"
              fillOpacity={1}
              fill="url(#attackGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="blocked"
              stroke="hsl(45 100% 60%)"
              fillOpacity={1}
              fill="url(#blockedGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
