import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  color?: "green" | "blue" | "purple";
}

const colorClasses = {
  green: "from-green-400 to-green-500",
  blue: "from-blue-400 to-blue-500",
  purple: "from-purple-400 to-purple-500",
};

export function FeatureCard({
  icon,
  title,
  description,
  features,
  color = "green",
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-2xl bg-linear-to-r ${colorClasses[color]} flex items-center justify-center text-white text-2xl mb-6`}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

      {/* Features List */}
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <div
              className={`w-2 h-2 rounded-full bg-linear-to-r ${colorClasses[color]} mr-3`}
            />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
