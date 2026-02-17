"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Expense } from "@/types";
import { Loader2, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // User Name State
  const [userName, setUserName] = useState("User");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [budget, setBudget] = useState(20000);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Check Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUserId(session.user.id);

      // Determine Initial Name (Priority: LocalStorage -> DB -> Email)
      const localName = localStorage.getItem("paisapulse_name");
      const emailName = session.user.email?.split("@")[0] || "User";

      if (localName) {
        setUserName(localName);
      } else {
        setUserName(emailName);
      }

      // 2. Fetch Expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (expensesError) {
        console.error("Error fetching expenses:", expensesError);
      } else {
        setExpenses(expensesData || []);
      }

      // 3. Fetch Budget Settings (& Name if available)
      const { data: settingsData } = await supabase
        .from("user_settings")
        .select("monthly_limit, display_name")
        .eq("user_id", session.user.id)
        .single();

      if (settingsData) {
        setBudget(settingsData.monthly_limit);

        // If DB has a name, it overwrites local storage (single source of truth for sync)
        if (settingsData.display_name) {
          setUserName(settingsData.display_name);
          localStorage.setItem("paisapulse_name", settingsData.display_name);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleSaveName = async () => {
    if (!tempName.trim()) return setIsEditingName(false);

    setSavingName(true);
    const newName = tempName.trim();

    // 1. Instant Local Update (The "Happy Path")
    setUserName(newName);
    localStorage.setItem("paisapulse_name", newName);
    setIsEditingName(false);

    // 2. Try DB Update (Silent Fail is OK here if they didn't run SQL)
    if (userId) {
      try {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: userId,
            display_name: newName,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      } catch (err) {
        console.warn("DB Update failed (likely missing column), but LocalStorage saved it.");
      }
    }

    setSavingName(false);
  };

  const startEditing = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const spent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const handleTransactionDeleted = (deletedId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== deletedId));
  };

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
          <div className="flex items-center gap-3">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="h-10 text-2xl font-bold bg-black/20 border-primary/50 w-[200px]"
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="h-10 w-10 text-primary bg-primary/10" onClick={handleSaveName} disabled={savingName}>
                  <Check size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="h-10 w-10 text-danger bg-danger/10" onClick={() => setIsEditingName(false)}>
                  <X size={20} />
                </Button>
              </div>
            ) : (
              <h1 className="text-3xl font-heading font-bold text-white tracking-tight capitalize flex items-center gap-3 group">
                <span>Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{userName}</span></span>
                <button onClick={startEditing} className="opacity-0 group-hover:opacity-100 transition-opacity text-textMuted hover:text-white p-1">
                  <Edit2 size={18} />
                </button>
              </h1>
            )}
          </div>
          <p className="text-xs text-textMuted/80 font-medium tracking-wide uppercase mt-1">Financial Overview</p>
        </div>
      </header>

      <BudgetOverview budget={budget} spent={spent} />

      <RecentTransactions
        expenses={expenses.slice(0, 5)}
        onTransactionDeleted={handleTransactionDeleted}
      />
    </div>
  );
}
