import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "SQL Injection", value: 35, color: "hsl(0 84% 60%)" },
  { name: "XSS", value: 28, color: "hsl(38 92% 50%)" },
  { name: "DDoS", value: 20, color: "hsl(195 100% 50%)" },
  { name: "Path Traversal", value: 10, color: "hsl(142 71% 45%)" },
  { name: "Other", value: 7, color: "hsl(215 20% 65%)" },
];

export const AttackTypeChart = () => {
  return (
    <Card className="border-2 border-primary/30 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Attack Types Distribution</CardTitle>
        <CardDescription className="text-muted-foreground">Classification of detected threats</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
