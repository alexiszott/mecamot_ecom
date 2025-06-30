import React from "react";

const StatsCard = ({ title, data, icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{data}</p>
        </div>
        <div
          className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
