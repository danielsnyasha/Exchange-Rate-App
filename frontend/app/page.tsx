import { DirectLookup } from "@/components/direct-lookup";
import { NaturalLanguageLookup } from "@/components/natural-language-lookup";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { StatsCards } from "@/components/stats-cards";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-72 transition-all duration-300">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Exchange Rates
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Real-time South African Rand (ZAR) conversion
              </p>
            </div>

            {/* Stats Cards - Real Live Data */}
            <StatsCards />

            {/* Main Exchange Tools */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <DirectLookup />
              <NaturalLanguageLookup />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
