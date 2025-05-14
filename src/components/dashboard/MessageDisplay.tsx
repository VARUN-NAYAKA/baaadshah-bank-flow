
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface MessageDisplayProps {
  error: string | null;
  success: string | null;
}

const MessageDisplay = ({ error, success }: MessageDisplayProps) => {
  if (!error && !success) return null;
  
  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default MessageDisplay;
