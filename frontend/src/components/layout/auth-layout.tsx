import { Leaf } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="w-full h-full bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 mt-4">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">
                <Leaf />
              </span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
