interface SidebarOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SidebarOverlay({ isOpen, onClose }: SidebarOverlayProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
        />
    );
}
