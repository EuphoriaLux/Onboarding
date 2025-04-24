export interface Service {
  id: string;
  name: string;
  description: string;
  examples?: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: Service[];
}
