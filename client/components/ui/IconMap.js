import { 
  Layout, 
  Server, 
  Database, 
  Smartphone, 
  Code, 
  Cpu, 
  Globe, 
  Terminal, 
  Wrench, 
  Cloud 
} from 'lucide-react';

export const IconMap = {
  Layout,
  Server,
  Database,
  Smartphone,
  Code,
  Cpu,
  Globe,
  Terminal,
  Wrench,
  Cloud
};

export const getIconComponent = (iconName) => {
  return IconMap[iconName] || Code;
};
