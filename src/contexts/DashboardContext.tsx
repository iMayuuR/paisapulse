"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DashboardContextType {
    selectedMonth: number;
    selectedYear: number;
    setDashboardDate: (month: number, year: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load from local storage
        const savedMonth = localStorage.getItem("paisapulse_dashboard_month");
        const savedYear = localStorage.getItem("paisapulse_dashboard_year");

        if (savedMonth && savedYear) {
            setSelectedMonth(parseInt(savedMonth, 10));
            setSelectedYear(parseInt(savedYear, 10));
        }
        setIsLoaded(true);
    }, []);

    const setDashboardDate = (month: number, year: number) => {
        setSelectedMonth(month);
        setSelectedYear(year);
        localStorage.setItem("paisapulse_dashboard_month", month.toString());
        localStorage.setItem("paisapulse_dashboard_year", year.toString());
    };

    return (
        <DashboardContext.Provider value={{ selectedMonth, selectedYear, setDashboardDate }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}
