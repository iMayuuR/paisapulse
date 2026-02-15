"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Expense } from "@/types";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  // Hardcoded budget for now (could be moved to settings)
  const budget = 25000;

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      setUserName(session.user.email?.split("@")[0] || "User");

      // 2. Fetch Expenses
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
      } else {
        setExpenses(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const spent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-6">
      <header className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight capitalize">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{userName}</span>
          </h1>
          <p className="text-xs text-textMuted/80 font-medium tracking-wide uppercase mt-1">Financial Overview</p>
        </div>
      </header>

      <BudgetOverview budget={budget} spent={spent} />

      <RecentTransactions expenses={expenses.slice(0, 5)} />
    </div>
  );
}
