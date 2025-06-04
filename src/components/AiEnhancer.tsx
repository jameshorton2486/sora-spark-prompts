
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AiEnhancerProps {
  currentPrompt: string;
  apiKey: string;
  onEnhancedPrompt: (enhancedPrompt: string) => void;
}

export const AiEnhancer = ({ currentPrompt, apiKey, onEnhancedPrompt }: AiEnhancerProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  const enhancePrompt = async () => {
    if (!currentPrompt.trim()) {
      toast.error("Please generate a prompt first!");
      return;
    }

    if (!apiKey) {
      toast.error("Please add your OpenAI API key first!");
      return;
    }

    setIsEnhancing(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert at creating visually stunning, detailed prompts for AI image generation (like Sora). Take the user's prompt and enhance it with more vivid details, better composition suggestions, lighting improvements, and cinematic elements while keeping the core concept intact. Make it more specific and visually compelling. Return only the enhanced prompt, nothing else."
            },
            {
              role: "user",
              content: `Enhance this prompt for better visual appeal: "${currentPrompt}"`
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to enhance prompt");
      }

      const data = await response.json();
      const enhanced = data.choices[0]?.message?.content?.trim() || "";
      
      if (enhanced) {
        setEnhancedPrompt(enhanced);
        onEnhancedPrompt(enhanced);
        toast.success("Prompt enhanced successfully!");
      } else {
        throw new Error("No enhanced prompt received");
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to enhance prompt");
    } finally {
      setIsEnhancing(false);
    }
  };

  const useEnhancedPrompt = () => {
    if (enhancedPrompt) {
      onEnhancedPrompt(enhancedPrompt);
      toast.success("Enhanced prompt applied!");
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-stone-800 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          AI Enhancement
        </CardTitle>
        <CardDescription className="text-stone-600">
          Use OpenAI to make your prompt even more visually compelling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={enhancePrompt}
          disabled={isEnhancing || !currentPrompt.trim() || !apiKey}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Enhance with AI
            </>
          )}
        </Button>

        {enhancedPrompt && (
          <div className="space-y-3">
            <h4 className="font-medium text-stone-800">AI-Enhanced Version:</h4>
            <Textarea
              value={enhancedPrompt}
              readOnly
              className="min-h-32 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 text-stone-700 resize-none"
            />
            <Button 
              onClick={useEnhancedPrompt}
              variant="outline"
              className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Use Enhanced Prompt
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
