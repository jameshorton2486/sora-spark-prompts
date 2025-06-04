
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Key, Save } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("openai_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
      onApiKeySet(storedKey);
    }
  }, [onApiKeySet]);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    if (!apiKey.startsWith("sk-")) {
      toast.error("OpenAI API keys should start with 'sk-'");
      return;
    }

    localStorage.setItem("openai_api_key", apiKey);
    setIsStored(true);
    onApiKeySet(apiKey);
    toast.success("API key saved securely");
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey("");
    setIsStored(false);
    onApiKeySet("");
    toast.success("API key cleared");
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-stone-800 flex items-center gap-2">
          <Key className="h-5 w-5 text-amber-600" />
          OpenAI API Key
        </CardTitle>
        <CardDescription className="text-stone-600">
          Enter your OpenAI API key to enable AI-powered prompt enhancement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showApiKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10 bg-white border-stone-300"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4 text-stone-400" />
              ) : (
                <Eye className="h-4 w-4 text-stone-400" />
              )}
            </Button>
          </div>
          <Button 
            onClick={handleSaveApiKey}
            disabled={!apiKey.trim()}
            className="bg-amber-600 text-white hover:bg-amber-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        
        {isStored && (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
            <span className="text-sm text-green-700">✓ API key saved securely</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearApiKey}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Clear
            </Button>
          </div>
        )}
        
        <p className="text-xs text-stone-500">
          Your API key is stored locally in your browser and never sent to our servers.
        </p>
      </CardContent>
    </Card>
  );
};
