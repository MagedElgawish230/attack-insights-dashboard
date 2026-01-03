import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const RetrainButton = () => {
    const [isRetraining, setIsRetraining] = useState(false);
    const { toast } = useToast();

    const handleRetrain = async () => {
        setIsRetraining(true);

        // Simulate sending data to Python backend (2 second delay)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsRetraining(false);
        toast({
            title: "Success",
            description: "New patterns sent to AI Engine. Model retraining initiated.",
            variant: "default",
        });
    };

    return (
        <Button
            onClick={handleRetrain}
            disabled={isRetraining}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold px-6 py-3 rounded-lg shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-primary/50 hover:scale-105"
        >
            {isRetraining ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Retraining...
                </>
            ) : (
                <>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Retrain AI Model
                </>
            )}
        </Button>
    );
};
