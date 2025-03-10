import {
    Coins,
    DollarSign,
    Goal,
    Home,
    LayoutDashboard,
    ListCollapse,
    LogOut,
    Logs,
    Receipt,
    Settings,
    User,
    Users,
    BarChart4
} from "lucide-react";
const pathAmin = "/admin/dashboard/";
const adminMenu = [
    { name: "Dashboard", link: pathAmin, icon: LayoutDashboard },
    { name: "Usuários", link: `${pathAmin}users`, icon: Users },
    { name: "Transações", link: `${pathAmin}transactions`, icon: Receipt },
    { name: "Categorias", link: `${pathAmin}categories `, icon: ListCollapse },
    {
        name: "Orçamentos", link: `${pathAmin}budgets`, icon: Coins
    },
    { name: "Metas Financeiras", link: `${pathAmin}goals`, icon: Goal },
    { name: "Relatórios", link: `${pathAmin}reports`, icon: BarChart4 },
    {
        name: "Auditoria", link: `${pathAmin}logs`, icon: Logs
    },
    { name: "Configurações", link: `${pathAmin}settings`, icon: Settings },
];

const userMenu = [
    { name: "Home", link: "/dashboard", icon: Home },
    { name: "Transações", link: "/dashboard/transactions", icon: Receipt },
    { name: "Despesas", link: "/dashboard/transactions?type=despesa", icon: Coins },
    { name: "Receitas", link: "/dashboard/transactions?type=receita", icon: DollarSign },
    { name: "Metas Financeiras", link: "/dashboard/goals", icon: Goal },
    { name: "Gerir Categorias", link: "/dashboard/categories", icon: ListCollapse },
    { name: "Perfil", link: "/dashboard/profile", icon: User },
];

export { adminMenu, userMenu };
