import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ReportCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const ReportCard = ({ title, description, children }: ReportCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};