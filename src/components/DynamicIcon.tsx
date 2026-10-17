import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, size = 20, className = '', color }) => {
  // @ts-ignore
  const IconComponent = Icons[name] || Icons.Layers;
  return <IconComponent size={size} className={className} color={color} />;
};
