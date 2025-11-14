import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  Icon: LucideIcon;
  linkTo?: string;
}

export const KpiCard = ({ title, value, change, changeType, Icon, linkTo }: KpiCardProps) => {
  const isPositive = changeType === "positive";
  
  const content = (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};