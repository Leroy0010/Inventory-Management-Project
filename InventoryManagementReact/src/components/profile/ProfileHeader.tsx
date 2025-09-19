interface ProfileHeaderProps {
    title: string;
    description: string;
}

export function ProfileHeader({ title, description }: ProfileHeaderProps) {
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
