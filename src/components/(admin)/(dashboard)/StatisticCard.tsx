import { Card } from "antd";

interface StatisticCardProps {
  title: string;
  value: string;
}

const StatisticCard = ({ title, value }: StatisticCardProps) => {
  return (
    <Card className="shadow-sm h-full border-border border rounded-lg">
      <div className="flex flex-col">
        <span className="text-card-foreground text-sm">{title}</span>
        <span className="text-3xl font-bold mt-2">{value}</span>
      </div>
    </Card>
  );
};

export default StatisticCard;
