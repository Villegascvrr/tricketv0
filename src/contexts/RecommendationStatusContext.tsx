import { createContext, useContext, useState, ReactNode } from 'react';

export type RecommendationStatus = 'pending' | 'in_progress' | 'completed';

interface RecommendationStatusMap {
  [recommendationId: string]: RecommendationStatus;
}

interface RecommendationStatusContextType {
  statuses: RecommendationStatusMap;
  updateStatus: (id: string, status: RecommendationStatus) => void;
  getStatus: (id: string) => RecommendationStatus;
}

const RecommendationStatusContext = createContext<RecommendationStatusContextType | undefined>(undefined);

export const RecommendationStatusProvider = ({ children }: { children: ReactNode }) => {
  const [statuses, setStatuses] = useState<RecommendationStatusMap>({});

  const updateStatus = (id: string, status: RecommendationStatus) => {
    setStatuses(prev => ({ ...prev, [id]: status }));
  };

  const getStatus = (id: string): RecommendationStatus => {
    return statuses[id] || 'pending';
  };

  return (
    <RecommendationStatusContext.Provider value={{ statuses, updateStatus, getStatus }}>
      {children}
    </RecommendationStatusContext.Provider>
  );
};

export const useRecommendationStatus = () => {
  const context = useContext(RecommendationStatusContext);
  if (!context) {
    throw new Error('useRecommendationStatus must be used within RecommendationStatusProvider');
  }
  return context;
};
