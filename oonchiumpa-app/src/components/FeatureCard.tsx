import React from 'react';
import { Card, CardBody } from './Card';

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay = 0
}) => {
  return (
    <div 
      className="animate-on-scroll"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="h-full group">
        <CardBody className="text-center p-8">
          {icon && (
            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-ochre-100 text-ochre-600 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-semibold text-earth-900 mb-3">
            {title}
          </h3>
          <p className="text-earth-600 leading-relaxed">
            {description}
          </p>
        </CardBody>
      </Card>
    </div>
  );
};