"use client";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DailyTrendChartProps {
    data: { date: string; amount: number }[];
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
    return (
        <div className="h-60 w-full mt-4 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#D4FF00" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: 'var(--font-outfit)' }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />
                    <Tooltip
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                        contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#D4FF00', fontSize: '14px', fontWeight: 'bold', fontFamily: 'var(--font-outfit)' }}
                        labelStyle={{ display: 'none' }}
                        formatter={(value: any) => [formatCurrency(value), '']}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#D4FF00"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
