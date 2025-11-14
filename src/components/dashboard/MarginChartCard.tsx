import { TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardCard } from "./DashboardCard";

const data = [
  { average: 41 }, { average: 35 }, { average: 51 }, { average: 49 },
  { average: 62 }, { average: 69 }, { average: 91 }, { average: 148 },
];

interface MarginChartCardProps {
  linkTo?: string;
  pdfMode?: boolean;
  value: string;
  change: string;
}

export const MarginChartCard = ({ linkTo, pdfMode = false, value, change }: MarginChartCardProps) => {
  return (
    <DashboardCard title="Margem de Lucro Média" Icon={TrendingUp} linkTo={linkTo}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{change}</p>
        </div>
        <div className="h-[60px] w-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Tooltip
                contentStyle={{ background: "transparent", border: "none" }}
                labelStyle={{ display: "none" }}
                position={{ x: 10, y: 60 }}
              />
              <Line isAnimationActive={!pdfMode} type="monotone" dataKey="average" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  );
};