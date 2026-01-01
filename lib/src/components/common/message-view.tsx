interface MessageViewProps {
    className?: string;
    children: React.ReactNode;
}

export default function MessageView({ className = "", children }: MessageViewProps) {
    return (
        <div className={`w-full bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-12 flex flex-col items-center justify-center ${className}`}>
            {children}
        </div>
    );
}
