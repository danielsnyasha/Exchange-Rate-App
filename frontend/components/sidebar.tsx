'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs'
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Settings,
  Menu,
  X,
  ChevronLeft,
  LogIn
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Exchange Rates', href: '/', icon: ArrowLeftRight },
  { name: 'Market Trends', href: '/dashboard', icon: TrendingUp },
  { name: 'Settings', href: '#', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg"
      >
        {mobileOpen ? (
          <X className="h-6 w-6 text-slate-700 dark:text-slate-300" />
        ) : (
          <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
          collapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Z</span>
                </div>
                {!collapsed && (
                  <div>
                    <h2 className="text-white font-semibold text-lg">ZAR Hub</h2>
                    <p className="text-emerald-400 text-xs">Currency Exchange</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:block p-1.5 rounded-md hover:bg-white/10 transition-colors"
              >
                <ChevronLeft
                  className={cn(
                    "h-5 w-5 text-slate-400 transition-transform",
                    collapsed && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white border border-emerald-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-emerald-500/20">
            <SignedIn>
              {!collapsed ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10"
                      }
                    }}
                    afterSignOutUrl="/"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.fullName || user?.primaryEmailAddress?.emailAddress}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10"
                      }
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              )}
            </SignedIn>

            <SignedOut>
              {!collapsed ? (
                <SignInButton mode="modal">
                  <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign In</span>
                  </button>
                </SignInButton>
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full flex justify-center p-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                    <LogIn className="h-4 w-4" />
                  </button>
                </SignInButton>
              )}
            </SignedOut>
          </div>
        </div>
      </aside>
    </>
  )
}
