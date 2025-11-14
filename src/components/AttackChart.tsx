import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", attacks: 12, blocked: 11 },
  { time: "04:00", attacks: 8, blocked: 8 },
  { time: "08:00", attacks: 24, blocked: 22 },
  { time: "12:00", attacks: 45, blocked: 42 },
  { time: "16:00", attacks: 38, blocked: 35 },
  { time: "20:00", attacks: 52, blocked: 48 },
  { time: "23:59", attacks: 31, blocked: 29 },
];

export const AttackChart = () => {
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
                <stop offset="5%" stopColor="hsl(195 100% 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(195 100% 50%)" stopOpacity={0} />
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
              stroke="hsl(195 100% 50%)"
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
