import { Card } from "antd";

interface StatisticCardProps {
  title: string;
  value: string;
}

const StatisticCard = ({ title, value }: StatisticCardProps) => {
  return (
    <Card className="shadow-sm h-full rounded-lg border border-border bg-card">
      <div className="flex flex-col">
        <span className="text-card-foreground text-sm">{title}</span>
        <span className="text-2xl font-bold mt-2">{value}</span>
      </div>
    </Card>
  );
};

export default StatisticCard;
