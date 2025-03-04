import { Coins, DollarSign, Goal, Home, LayoutDashboard, ListCollapse, LogOut, Receipt, Settings, User, Users } from "lucide-react";

const adminMenu = [
    { name: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
    { name: "Usuarios", link: "/users", icon: Users },
    { name: "Settings", link: "#", icon: Settings },
];

const userMenu = [
    { name: "Home", link: "/dashboard", icon: Home },
    { name: "Transações", link: "/dashboard/transations", icon: Receipt },

    { name: "Despesas", link: "/dashboard/transations?type=despesa", icon: Coins },
    { name: "Receitas", link: "/dashboard/transations?type=receita", icon: DollarSign },
    { name: "Metas Financeiras", link: "/dashboard/budgets/", icon: Goal },
    // { name: "Investimentos", link: "/dashboard/expensive/register", icon: DollarSign },
    { name: "Gerir. Categorias", link: "/dashboard/categories", icon: ListCollapse },
    { name: "Perfil", link: "/dashboard/expensive/register", icon: User },



];

export { adminMenu, userMenu };

