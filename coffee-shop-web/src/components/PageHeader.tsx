import React from 'react';

interface PageHeaderProps {
  title: string;
  bgColor?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, bgColor = 'bg-white' }) => {
  return (
    <div className={`w-full mb-6 py-4 ${bgColor} flex items-center justify-center border-b border-neutral-300`}>
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
    </div>
  );
};

export default PageHeader;