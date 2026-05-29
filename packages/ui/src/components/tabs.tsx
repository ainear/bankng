"use client";

import { clsx } from "clsx";
import { createContext, useContext, useState, type ReactNode } from "react";

type TabsContextValue = {
  active: string;
  setActive: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within a Tabs provider");
  return ctx;
}

type TabsProps = {
  defaultValue: string;
  children: ReactNode;
  className?: string;
};

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabListProps = {
  children: ReactNode;
  className?: string;
};

export function TabList({ children, className }: TabListProps) {
  return (
    <div
      className={clsx(
        "flex flex-wrap gap-1 border-b border-[var(--bankng-border)]",
        className,
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

type TabTriggerProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export function TabTrigger({ value, children, className }: TabTriggerProps) {
  const { active, setActive } = useTabsContext();
  const isActive = active === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActive(value)}
      className={clsx(
        "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
        isActive
          ? "border-[var(--bankng-primary)] text-[var(--bankng-primary)]"
          : "border-transparent text-[var(--bankng-text-secondary)] hover:text-[var(--bankng-text-primary)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

type TabContentProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export function TabContent({ value, children, className }: TabContentProps) {
  const { active } = useTabsContext();
  if (active !== value) return null;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}