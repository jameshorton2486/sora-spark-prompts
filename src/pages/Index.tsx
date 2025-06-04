
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Sparkles, Wand2, Camera, Film, Palette, Users, Landscape } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const promptStyles = [
    { value: "cinematic", label: "Cinematic", description: "Movie-like quality with dramatic lighting" },
    { value: "documentary", label: "Documentary", description: "Realistic, natural style" },
    { value: "anime", label: "Anime", description: "Japanese animation style" },
    { value: "vintage", label: "Vintage", description: "Retro, nostalgic aesthetic" },
    { value: "futuristic", label: "Futuristic", description: "Sci-fi, high-tech visuals" },
  ];

  const categories = [
    { value: "nature", label: "Nature", icon: Landscape },
    { value: "people", label: "People", icon: Users },
    { value: "abstract", label: "Abstract", icon: Palette },
    { value: "action", label: "Action", icon: Film },
  ];

  const samplePrompts = [
    "A serene forest with golden sunlight filtering through the trees, gentle wind moving the leaves",
    "A person walking through a bustling Tokyo street at night, neon lights reflecting on wet pavement",
    "Ocean waves crashing against dramatic cliffs during a stunning sunset",
    "A dancer performing in slow motion, colorful fabric flowing gracefully around them",
    "Time-lapse of clouds forming and dispersing over a mountain landscape",
  ];

  const enhancementTips = [
    "Add camera movements (zoom, pan, tilt)",
    "Specify lighting conditions (golden hour, soft lighting)",
    "Include emotional descriptors (peaceful, energetic, mysterious)",
    "Mention specific details (textures, colors, atmosphere)",
    "Add temporal elements (slow motion, time-lapse)",
  ];

  const copyToClipboard = () => {
    if (!prompt.trim()) {
      toast.error("Please write a prompt first!");
      return;
    }
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const enhancePrompt = () => {
    if (!prompt.trim()) {
      toast.error("Please write a prompt first!");
      return;
    }
    
    let enhanced = prompt;
    
    if (selectedStyle) {
      const style = promptStyles.find(s => s.value === selectedStyle);
      enhanced += `, ${style?.description.toLowerCase()}`;
    }
    
    enhanced += ", high quality, detailed, smooth motion";
    setPrompt(enhanced);
    toast.success("Prompt enhanced!");
  };

  const loadSample = (sample: string) => {
    setPrompt(sample);
    toast.success("Sample prompt loaded!");
  };

  const clearPrompt = () => {
    setPrompt("");
    setSelectedStyle("");
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Sora Prompt Generator
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Create stunning video prompts for OpenAI's Sora with our intelligent generator
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="generator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="generator" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                Generator
              </TabsTrigger>
              <TabsTrigger value="samples" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                Samples
              </TabsTrigger>
              <TabsTrigger value="tips" className="text-white data-[state=active]:bg-white data-[state=active]:text-purple-600">
                Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Prompt Generator
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Craft your perfect Sora video prompt with style and category options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Style and Category Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Style</label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Choose a style" />
                        </SelectTrigger>
                        <SelectContent>
                          {promptStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              <div>
                                <div className="font-medium">{style.label}</div>
                                <div className="text-sm text-gray-500">{style.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <category.icon className="h-4 w-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Prompt Input */}
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Your Prompt</label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the video you want to create... Be specific about movements, lighting, camera angles, and mood."
                      className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-white/70">
                        {prompt.length} characters
                      </span>
                      <Badge 
                        variant={prompt.length > 500 ? "destructive" : "secondary"}
                        className="bg-white/10 text-white"
                      >
                        {prompt.length > 500 ? "Too long" : "Good length"}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={enhancePrompt} className="bg-white text-purple-600 hover:bg-white/90">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enhance Prompt
                    </Button>
                    <Button onClick={copyToClipboard} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Prompt
                    </Button>
                    <Button onClick={clearPrompt} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="samples" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Sample Prompts</CardTitle>
                  <CardDescription className="text-white/70">
                    Get inspired by these example prompts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {samplePrompts.map((sample, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => loadSample(sample)}
                      >
                        <p className="text-white">{sample}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Enhancement Tips</CardTitle>
                  <CardDescription className="text-white/70">
                    Make your prompts more effective with these suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {enhancementTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-white font-medium">{index + 1}</span>
                        </div>
                        <p className="text-white">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
