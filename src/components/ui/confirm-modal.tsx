import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isDestructive = false,
    isLoading = false,
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="rounded-3xl border-none shadow-2xl max-w-md bg-white">
                <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-gray-500 leading-relaxed">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 gap-3 sm:gap-0">
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="rounded-xl font-bold h-12 hover:bg-gray-50 border-gray-200"
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className={`rounded-xl font-bold h-12 transition-all ${isDestructive
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-100'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-100'
                            }`}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
