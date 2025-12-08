import MessageView from "./message-view";

interface ErrorViewProps {
    title: string;
    message: string;
    className?: string;
}

export default function ErrorView({ title, message, className }: ErrorViewProps) {
    return (
        <MessageView className={className}>
            <div className="bg-red-50 p-4 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-slate-900 font-medium mb-2">{title}</p>
            <p className="text-slate-500 text-sm mb-4">{message}</p>
        </MessageView>
    );
}
