import { Link } from '@inertiajs/react';
import { 
    LayoutGrid, Truck, Fuel, Briefcase, Users, 
    ShoppingCart, ReceiptIndianRupee, Settings,
    HelpCircle, LogOut, ChevronRight, Sparkles,
    BarChart3, TrendingUp, DollarSign, Droplets,
    Landmark
} from 'lucide-react';
import { route } from '@/lib/route';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import AppLogo from '@/components/app-logo';
import type { NavItem } from '@/types';
import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarContent,
    SidebarFooter,
    SidebarSeparator
} from '@/components/ui/sidebar';
import { useState } from 'react';

export function AppSidebar() {
    const [isHovered, setIsHovered] = useState<string | null>(null);

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutGrid,
            description: 'Overview & Analytics'
        },
        {
            title: 'Party Management',
            href: route('admin.parties.index'),
            icon: Briefcase,
            description: 'Suppliers & Vendors',
            badge: '12'
        },
        {
            title: 'Customer Management',
            href: route('admin.customers.index'),
            icon: Users,
            description: 'Customer Registry',
            badge: '48'
        },
        {
            title: 'Vehicle Management',
            href: route('admin.vehicles.index'),
            icon: Truck,
            description: 'Fleet Management',
            badge: '24'
        },
        {
            title: 'Product Management',
            href: route('admin.products.index'),
            icon: Fuel,
            description: 'Fuel & Oils',
            badge: '8'
        },
        {
            title: 'Purchase Entry',
            href: route('admin.purchases.index'),
            icon: ShoppingCart,
            description: 'Procurement',
            badge: '3'
        },
        {
            title: 'Sales / Billing',
            href: route('admin.sales.index'),
            icon: ReceiptIndianRupee,
            description: 'Transactions',
            badge: '156'
        },
        {
            title:'Payments',
            href: route('admin.payments.index'),
            icon: ReceiptIndianRupee,
            description: 'Payments & Receipts',
            badge: '27' 
        }
    ];

    const quickStats = [
        { label: 'Today\'s Sales', value: '₹45.2k', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Revenue', value: '₹1.2M', icon: DollarSign, color: 'text-amber-500' },
        { label: 'Profit', value: '₹2.4L', icon: BarChart3, color: 'text-blue-500' },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-gray-200 dark:border-gray-800">
            {/* Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 pointer-events-none" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
            
            {/* Animated Dots Pattern */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
                 style={{
                     backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--amber-500) / 0.15) 1px, transparent 0)`,
                     backgroundSize: '24px 24px'
                 }} 
            />

            <SidebarHeader className="relative border-b border-gray-200 dark:border-gray-800 pb-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            asChild
                            className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-transparent dark:hover:from-amber-900/20 dark:hover:to-transparent transition-all duration-300"
                        >
                            <Link href={route('dashboard')} prefetch className="group relative overflow-hidden">
                                {/* Hover Effect */}
                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                
                                <AppLogo />
                                
                                {/* Premium Badge */}
                                <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full text-[10px] font-bold text-white shadow-lg shadow-amber-500/25">
                                    <Sparkles className="w-3 h-3" />
                                    <span>ADMIN</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Quick Stats - Visible when sidebar expanded */}
                {/* <div className="mt-4 px-3 space-y-2 group-data-[collapsible=icon]:hidden">
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">
                        Quick Overview
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                        {quickStats.map((stat, index) => (
                            <div 
                                key={index}
                                className="p-2 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 transition-all duration-200"
                            >
                                <stat.icon className={`w-3.5 h-3.5 ${stat.color} mb-1`} />
                                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div> */}
            </SidebarHeader>

            <SidebarSeparator className="bg-gray-200 dark:bg-gray-800" />

            <SidebarContent className="relative py-4">
                {/* Section Label */}
                <div className="px-3 mb-2 group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-amber-500 to-amber-400 rounded-full" />
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            Main Navigation
                        </span>
                    </div>
                </div>

                <NavMain 
                    items={mainNavItems.map(item => ({
                        ...item,
                        onMouseEnter: () => setIsHovered(item.title),
                        onMouseLeave: () => setIsHovered(null),
                        className: `group relative overflow-hidden transition-all duration-200 ${
                            isHovered === item.title 
                                ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/30 border-l-2 border-amber-500' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`
                    }))} 
                />
            </SidebarContent>

            <SidebarFooter className="relative border-t border-gray-200 dark:border-gray-800 pt-4">
                {/* Bottom Gradient */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

                {/* Admin Dashboard Label */}
                <div className="px-3 mb-3 group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-gradient-to-br from-amber-500 to-amber-400 rounded-md shadow-lg shadow-amber-500/25">
                                <Droplets className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                                Admin Dashboard
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                            <span>v2.0</span>
                            <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-3 mb-2 group-data-[collapsible=icon]:hidden">
                    <div className="grid grid-cols-2 gap-1.5">
                        <Link 
                            href={route('admin.banks.index')} 
                            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                        >
                            <Landmark className="w-3.5 h-3.5" />
                            <span>Bank</span>
                        </Link>
                        <Link 
                            href="#" 
                            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                        >
                            <Settings className="w-3.5 h-3.5" />
                            <span>Settings</span>
                        </Link>
                    </div>
                </div>

                <NavUser />

                {/* Logout Button - Optional, can be enabled if needed */}
                {/* <div className="mt-2 px-3 group-data-[collapsible=icon]:hidden">
                    <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all duration-200">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                    </button>
                </div> */}
            </SidebarFooter>
        </Sidebar>
    );
}