import { Coins, DollarSign, Goal, Home, LayoutDashboard, ListCollapse, LogOut, Settings, User, Users } from "lucide-react";

const adminMenu = [
    { name: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
    { name: "Usuarios", link: "/users", icon: Users },
    { name: "Settings", link: "#", icon: Settings },
];

const userMenu = [
    { name: "Home", link: "/dashboard", icon: Home },
    { name: "Despesas", link: "/dashboard/expensive/register", icon: Coins  },
    { name: "Receitas", link: "/dashboard/expensive/register", icon: DollarSign },
    { name: "Metas", link: "/dashboard/expensive/register", icon:  Goal },
    { name: "Investimentos", link: "/dashboard/expensive/register", icon: DollarSign },
    { name: "Gerir. Categorias", link: "/dashboard/expensive/register", icon: ListCollapse },
    { name: "Perfil", link: "/dashboard/expensive/register", icon: User },


    { name: "Sair", link: "/logout", icon: LogOut },
];

export { adminMenu, userMenu };

