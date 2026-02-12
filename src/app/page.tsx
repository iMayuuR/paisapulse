import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Expense } from "@/types";

// Dummy Data
const DUMMY_EXPENSES: Expense[] = [
  {
    id: "1",
    user_id: "u1",
    amount: 1250,
    category: { id: "c1", name: "Groceries", icon: "shopping-bag", is_default: true },
    category_id: "c1",
    payment_method: "UPI",
    date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    note: "Big Basket"
  },
  {
    id: "2",
    user_id: "u1",
    amount: 380,
    category: { id: "c2", name: "Food", icon: "coffee", is_default: true },
    category_id: "c2",
    payment_method: "Cash",
    date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    note: "Starbucks"
  },
  {
    id: "3",
    user_id: "u1",
    amount: 4500,
    category: { id: "c3", name: "Transport", icon: "car", is_default: true },
    category_id: "c3",
    payment_method: "Credit Card",
    date: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date().toISOString(),
    note: "Fuel Check"
  }
];

export default function Home() {
  const budget = 25000;
  const spent = 6130;

  return (
    <div className="space-y-8 pt-6">
      <header className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Mayur</span>
          </h1>
          <p className="text-xs text-textMuted/80 font-medium tracking-wide uppercase mt-1">Financial Overview</p>
        </div>
      </header>

      <BudgetOverview budget={budget} spent={spent} />

      <RecentTransactions expenses={DUMMY_EXPENSES} />
    </div>
  );
}
