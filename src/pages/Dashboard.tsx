import React from 'react';
import { ArrowUpRight, Users, Activity, CreditCard, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
  const stats = [
    { title: "Total Revenue", value: "$45,231.89", icon: DollarSign, trend: "+20.1%", isPositive: true },
    { title: "Subscriptions", value: "+2350", icon: Users, trend: "+180.1%", isPositive: true },
    { title: "Sales", value: "+12,234", icon: CreditCard, trend: "+19%", isPositive: true },
    { title: "Active Now", value: "+573", icon: Activity, trend: "-2%", isPositive: false },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Welcome back, here's what's happening with Safara today.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
            New Campaign
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className={cn(
                  "flex items-center font-medium mr-1",
                  stat.isPositive ? "text-emerald-500" : "text-destructive"
                )}>
                  {stat.trend}
                  <ArrowUpRight className={cn("h-3 w-3 ml-0.5", !stat.isPositive && "rotate-90")} />
                </span>
                from last month
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 mb-6">
            <h3 className="font-semibold leading-none tracking-tight">Revenue Overview</h3>
            <p className="text-sm text-muted-foreground">Monthly performance metrics.</p>
          </div>
          <div className="h-[300px] w-full bg-secondary/30 rounded-xl border border-border/50 flex items-center justify-center">
            <p className="text-muted-foreground font-medium flex flex-col items-center gap-2">
              <Activity className="h-8 w-8 text-muted-foreground/50" />
              Chart Placeholder
            </p>
          </div>
        </div>
        <div className="col-span-4 lg:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col space-y-1.5 mb-6">
            <h3 className="font-semibold leading-none tracking-tight">Recent Sales</h3>
            <p className="text-sm text-muted-foreground">You made 265 sales this month.</p>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                  {String.fromCharCode(64 + i)}
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">User {i}</p>
                  <p className="text-sm text-muted-foreground">user{i}@example.com</p>
                </div>
                <div className="ml-auto font-medium text-sm">+$299.00</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
