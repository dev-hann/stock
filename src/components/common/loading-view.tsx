import Spinner from "./spinner";
import MessageView from "./message-view";

interface LoadingViewProps {
    message: string;
    className?: string;
}

export default function LoadingView({ message, className }: LoadingViewProps) {
    return (
        <MessageView className={className}>
            <Spinner size="lg" />
            <p className="text-slate-600 mt-4">{message}</p>
        </MessageView>
    );
}
