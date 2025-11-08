import React from "react";

interface CountryFlagProps {
  countryCode: string;
  countryName: string;
  flag: string;
}

/**
 * Country Flag Component
 * Single Responsibility: Display country flag with name
 * Interface Segregation: Only country-related props
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  countryName,
  flag,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg" title={countryName}>
        {flag}
      </span>
      <span className="text-sm text-gray-300">{countryCode}</span>
    </div>
  );
};
