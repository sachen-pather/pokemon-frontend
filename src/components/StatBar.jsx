import { getStatName } from "../utils/helpers";

export default function StatBar({ statName, value, maxValue = 255 }) {
  const percentage = (value / maxValue) * 100;

  // Color based on value
  let barColor = "bg-red-500";
  if (value >= 100) barColor = "bg-green-500";
  else if (value >= 60) barColor = "bg-yellow-500";
  else if (value >= 30) barColor = "bg-orange-500";

  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-white">{getStatName(statName)}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${barColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
