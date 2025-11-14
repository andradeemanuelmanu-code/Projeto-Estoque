import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description?: string;
  Icon: LucideIcon;
  children: React.ReactNode;
  linkTo?: string;
  onClick?: () => void;
}

export const DashboardCard = ({ title, description, Icon, children, linkTo, onClick }: DashboardCardProps) => {
  const content = (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {children}
      </CardContent>
    </Card>
  );

  if (linkTo) {
    return <Link to={linkTo} className="hover:opacity-90 transition-opacity">{content}</Link>;
  }

  if (onClick) {
    return (
      <div onClick={onClick} className="cursor-pointer hover:opacity-90 transition-opacity">
        {content}
      </div>
    );
  }

  return content;
};