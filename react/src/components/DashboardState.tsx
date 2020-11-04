import React from 'react';

export type DashboardState = {
    startDate: string;
    endDate: string;
    gaIds: string;
};

export const DashboardStateContext = React.createContext<DashboardState | null>(null);

export function useDashboardState() {
    return React.useContext(DashboardStateContext);
}