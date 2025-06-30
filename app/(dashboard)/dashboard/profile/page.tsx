'use client'

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';

const profileSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
}).refine((data) => {
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
        return false;
    }
    return true;
}, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema)
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/profile', { method: 'GET' });
                const data = await response.json();
                if (data.profile) {
                    setValue('name', data.profile.name || '');
                    setValue('email', data.profile.email || '');
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário', error);
            }
        };
        fetchUserData();
    }, [setValue]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const response = await fetch('/api/profile/edit', {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage('Perfil atualizado com sucesso!');
            } else {
                console.error('Erro ao atualizar perfil:', result);
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    };

    return (
        <div className="space-y-6 justify-center items-center p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Perfil</h1>

                <div>
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-24 h-24 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Mensagem de sucesso */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {successMessage}
                </div>
            )}

            <div className="bg-white rounded-lg p-6 w-full items-center">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome</label>
                            <input
                                autoComplete="off"
                                type="text"
                                {...register('name')}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                autoComplete="off"
                                type="email"
                                {...register('email')}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                            <input
                                autoComplete="off"
                                type="password"
                                {...register('currentPassword')}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                            <input
                                autoComplete="off"
                                type="password"
                                {...register('newPassword')}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                        <input
                            autoComplete="off"
                            type="password"
                            {...register('confirmNewPassword')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.confirmNewPassword && <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm transition duration-200"
                    >
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
