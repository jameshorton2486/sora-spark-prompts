import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Copy, Sparkles, Camera, Users, Palette, Mountain, Shuffle, HelpCircle, Info, ChevronDown, ChevronRight, Film, Eye, Zap, Layers, Paintbrush, Square } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { AiEnhancer } from "@/components/AiEnhancer";

type SubjectType = "person" | "object" | "landscape" | "abstract" | "animal" | "scene" | "";
type StyleType = "realistic" | "cinematic" | "surreal" | "vintage" | "fantasy" | "minimalist" | "";

const Index = () => {
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [detectedSubjectType, setDetectedSubjectType] = useState<SubjectType>("");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("");
  const [makeItSpectacular, setMakeItSpectacular] = useState(false);
  const [spectacularIntensity, setSpectacularIntensity] = useState([1]); // 0=Subtle, 1=Cinematic, 2=Wild
  const [showAdvancedTips, setShowAdvancedTips] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [apiKey, setApiKey] = useState("");
  
  // Subject Identity
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [facialFeatures, setFacialFeatures] = useState("");

  // Lighting
  const [lightingType, setLightingType] = useState("");

  // Makeup & Accessories
  const [selectedMakeup, setSelectedMakeup] = useState<string[]>([]);

  // Wardrobe
  const [wardrobeStyle, setWardrobeStyle] = useState("");
  const [material, setMaterial] = useState("");

  // Camera & Lens
  const [cameraStyle, setCameraStyle] = useState("");

  // Pose & Expression
  const [poseExpression, setPoseExpression] = useState("");

  // Setting & Environment
  const [setting, setSetting] = useState("");

  // Composition & Quality
  const [composition, setComposition] = useState("");

  // Mood & Tone
  const [moodTone, setMoodTone] = useState("");

  // Color Palette
  const [colorPalette, setColorPalette] = useState("");

  // Style definitions
  const styles = [
    { 
      id: "realistic", 
      name: "Realistic", 
      icon: Camera, 
      description: "Photorealistic, natural lighting"
    },
    { 
      id: "cinematic", 
      name: "Cinematic", 
      icon: Film, 
      description: "Movie-style, dramatic lighting"
    },
    { 
      id: "surreal", 
      name: "Surreal / Dreamlike", 
      icon: Eye, 
      description: "Imaginative, otherworldly"
    },
    { 
      id: "vintage", 
      name: "Vintage / Film", 
      icon: Zap, 
      description: "Retro, aged, film grain"
    },
    { 
      id: "fantasy", 
      name: "Fantasy / Mythic", 
      icon: Layers, 
      description: "Magical, epic, legendary"
    },
    { 
      id: "minimalist", 
      name: "Minimalist", 
      icon: Square, 
      description: "Clean, simple, focused"
    }
  ];

  // New data for enhanced features
  const samplePrompts = [
    { type: "person", prompt: "Young Asian woman in her 20s with freckles, wearing vintage silk blouse, soft natural light, looking into camera, urban street setting, shallow depth of field, ethereal mood, warm neutrals" },
    { type: "object", prompt: "Antique silver pocket watch on weathered leather, macro shot, golden hour lighting, shallow focus, dark background, dramatic mood, high contrast" },
    { type: "landscape", prompt: "Misty mountain valley at dawn, cinematic wide shot, soft directional light, ethereal atmosphere, cool blues and greys, 16:9 aspect ratio" },
    { type: "scene", prompt: "Medieval marketplace bustling with activity, film camera style, warm candlelight, dynamic motion, full body shots, gritty realism, earth tones" }
  ];

  const visualEnhancersSubtle = [
    "with soft golden hour lighting",
    "in gentle morning mist",
    "with delicate shadows",
    "bathed in warm natural light",
    "with subtle depth of field"
  ];

  const visualEnhancersCinematic = [
    "backlit by a massive glowing moon",
    "captured in a single beam of sunlight piercing fog",
    "in high-contrast spotlight in a smoky, noir setting",
    "silhouetted against dramatic storm clouds",
    "emerging from shadows with cinematic rim lighting"
  ];

  const visualEnhancersWild = [
    "surrounded by glowing butterflies made of glass",
    "floating in a galaxy with stars reflecting off water",
    "with wings made of stained glass, shimmering in moonlight",
    "suspended in time within liquid amber",
    "as lightning illuminates the scene in electric blue"
  ];

  const exampleIdeas = {
    person: [
      "a girl with blue hair under starlight",
      "an elderly man reading in a library",
      "a dancer in flowing fabric",
      "a chef in a busy kitchen"
    ],
    object: [
      "a silver teapot on a linen table",
      "an antique pocket watch",
      "a vintage camera on weathered wood",
      "a crystal vase with morning light"
    ],
    landscape: [
      "a Japanese alleyway at night",
      "misty mountains at dawn",
      "desert dunes under full moon",
      "forest path with autumn leaves"
    ],
    scene: [
      "a busy marketplace in medieval times",
      "friends laughing around a campfire",
      "a wedding ceremony in a garden",
      "children playing in the rain"
    ],
    animal: [
      "a majestic lion in golden grass",
      "a colorful bird in tropical foliage",
      "a cat sleeping in sunlight",
      "horses running through mist"
    ],
    abstract: [
      "geometric shapes floating in space",
      "liquid colors merging together",
      "light patterns dancing on water",
      "shadows creating impossible forms"
    ]
  };

  const detectSubjectType = (input: string): SubjectType => {
    const personKeywords = ["woman", "man", "person", "girl", "boy", "warrior", "dancer", "artist", "chef"];
    const objectKeywords = ["watch", "book", "chair", "camera", "sword", "jewelry", "bottle", "instrument"];
    const landscapeKeywords = ["mountain", "forest", "ocean", "desert", "valley", "river", "canyon", "beach"];
    const animalKeywords = ["cat", "dog", "bird", "lion", "tiger", "horse", "elephant", "butterfly"];
    const sceneKeywords = ["marketplace", "concert", "wedding", "festival", "battle", "celebration", "meeting"];
    
    const lowerInput = input.toLowerCase();
    
    if (personKeywords.some(keyword => lowerInput.includes(keyword))) return "person";
    if (objectKeywords.some(keyword => lowerInput.includes(keyword))) return "object";
    if (landscapeKeywords.some(keyword => lowerInput.includes(keyword))) return "landscape";
    if (animalKeywords.some(keyword => lowerInput.includes(keyword))) return "animal";
    if (sceneKeywords.some(keyword => lowerInput.includes(keyword))) return "scene";
    
    return "abstract";
  };

  const getRelevantSections = (subjectType: SubjectType) => {
    switch (subjectType) {
      case "person":
        return ["identity", "lighting", "makeup", "wardrobe", "camera", "pose", "setting", "composition", "mood", "color"];
      case "object":
        return ["lighting", "camera", "setting", "composition", "mood", "color"];
      case "landscape":
        return ["lighting", "camera", "setting", "composition", "mood", "color"];
      case "animal":
        return ["lighting", "camera", "pose", "setting", "composition", "mood", "color"];
      case "scene":
        return ["lighting", "camera", "setting", "composition", "mood", "color"];
      default:
        return ["lighting", "camera", "setting", "composition", "mood", "color"];
    }
  };

  const randomizeSelections = () => {
    const relevantSections = getRelevantSections(detectedSubjectType);
    
    if (relevantSections.includes("identity")) {
      setAgeRange(ageRanges[Math.floor(Math.random() * ageRanges.length)]);
      setGender(genders[Math.floor(Math.random() * genders.length)]);
      setEthnicity(ethnicities[Math.floor(Math.random() * ethnicities.length)]);
      setFacialFeatures(facialFeaturesOptions[Math.floor(Math.random() * facialFeaturesOptions.length)]);
    }
    
    if (relevantSections.includes("lighting")) {
      setLightingType(lightingOptions[Math.floor(Math.random() * lightingOptions.length)]);
    }
    
    if (relevantSections.includes("camera")) {
      setCameraStyle(cameraStyles[Math.floor(Math.random() * cameraStyles.length)]);
    }
    
    if (relevantSections.includes("setting")) {
      setSetting(settings[Math.floor(Math.random() * settings.length)]);
    }
    
    if (relevantSections.includes("composition")) {
      setComposition(compositions[Math.floor(Math.random() * compositions.length)]);
    }
    
    if (relevantSections.includes("mood")) {
      setMoodTone(moodTones[Math.floor(Math.random() * moodTones.length)]);
    }
    
    if (relevantSections.includes("color")) {
      setColorPalette(colorPalettes[Math.floor(Math.random() * colorPalettes.length)]);
    }
    
    toast.success("Random selections applied!");
  };

  const handleMakeupChange = (makeup: string, checked: boolean) => {
    if (checked) {
      setSelectedMakeup([...selectedMakeup, makeup]);
    } else {
      setSelectedMakeup(selectedMakeup.filter(item => item !== makeup));
    }
  };

  const getStyleModifier = (style: StyleType): string => {
    switch (style) {
      case "realistic":
        return "photorealistic, natural lighting, high detail";
      case "cinematic":
        return "cinematic composition, dramatic lighting, film-style";
      case "surreal":
        return "surreal, dreamlike, imaginative, otherworldly";
      case "vintage":
        return "vintage style, film grain, retro aesthetic, aged look";
      case "fantasy":
        return "fantasy style, magical, epic, mythical elements";
      case "minimalist":
        return "minimalist composition, clean lines, simple, focused";
      default:
        return "";
    }
  };

  const getSpectacularEnhancer = (): string => {
    const intensity = spectacularIntensity[0];
    let enhancers: string[];
    
    switch (intensity) {
      case 0: // Subtle
        enhancers = visualEnhancersSubtle;
        break;
      case 2: // Wild
        enhancers = visualEnhancersWild;
        break;
      default: // Cinematic
        enhancers = visualEnhancersCinematic;
        break;
    }
    
    return enhancers[Math.floor(Math.random() * enhancers.length)];
  };

  const generatePrompt = () => {
    const components = [];
    
    if (subjectInput) {
      components.push(subjectInput.toLowerCase());
    }
    
    if (ageRange || gender || ethnicity) {
      let subject = "";
      if (ageRange) subject += ageRange.toLowerCase();
      if (gender) subject += (subject ? " " : "") + gender.toLowerCase();
      if (ethnicity) subject += (subject ? " " : "") + ethnicity.toLowerCase();
      if (subject) components.push(subject + " person");
    }

    if (facialFeatures) components.push(`with ${facialFeatures.toLowerCase()}`);
    if (selectedMakeup.length > 0) components.push(`featuring ${selectedMakeup.join(", ").toLowerCase()}`);
    if (wardrobeStyle) {
      let wardrobe = wardrobeStyle.toLowerCase();
      if (material) wardrobe += ` ${material.toLowerCase()}`;
      components.push(`wearing ${wardrobe}`);
    }
    if (poseExpression) components.push(poseExpression.toLowerCase());
    if (setting) components.push(`in ${setting.toLowerCase()}`);
    if (lightingType) components.push(`with ${lightingType.toLowerCase()}`);
    if (cameraStyle) components.push(`shot with ${cameraStyle.toLowerCase()}`);
    if (composition) components.push(composition.toLowerCase());
    if (moodTone) components.push(`${moodTone.toLowerCase()} mood`);
    if (colorPalette) components.push(`${colorPalette.toLowerCase()} color palette`);

    // Add style modifier
    if (selectedStyle) {
      const styleModifier = getStyleModifier(selectedStyle);
      if (styleModifier) components.push(styleModifier);
    }

    if (makeItSpectacular) {
      const enhancer = getSpectacularEnhancer();
      components.push(enhancer);
    }

    const finalPrompt = components.join(", ") + ", ultra-high quality";
    setGeneratedPrompt(finalPrompt);
  };

  const copyPrompt = () => {
    if (!generatedPrompt.trim()) {
      toast.error("Please generate a prompt first!");
      return;
    }
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Prompt copied to clipboard!");
  };

  const clearAll = () => {
    setSubjectInput("");
    setDetectedSubjectType("");
    setSelectedStyle("");
    setAgeRange("");
    setGender("");
    setEthnicity("");
    setFacialFeatures("");
    setLightingType("");
    setSelectedMakeup([]);
    setWardrobeStyle("");
    setMaterial("");
    setCameraStyle("");
    setPoseExpression("");
    setSetting("");
    setComposition("");
    setMoodTone("");
    setColorPalette("");
    setGeneratedPrompt("");
    setMakeItSpectacular(false);
    setSpectacularIntensity([1]);
    setShowAdvancedOptions(false);
  };

  useEffect(() => {
    if (subjectInput) {
      const detected = detectSubjectType(subjectInput);
      setDetectedSubjectType(detected);
    } else {
      setDetectedSubjectType("");
    }
  }, [subjectInput]);

  useEffect(() => {
    generatePrompt();
  }, [subjectInput, selectedStyle, ageRange, gender, ethnicity, facialFeatures, lightingType, selectedMakeup, wardrobeStyle, material, cameraStyle, poseExpression, setting, composition, moodTone, colorPalette, makeItSpectacular, spectacularIntensity]);

  const relevantSections = getRelevantSections(detectedSubjectType);

  const getIntensityLabel = (value: number) => {
    switch (value) {
      case 0: return "💡 Subtle";
      case 1: return "🎥 Cinematic";
      case 2: return "💭 Wild/Surreal";
      default: return "🎥 Cinematic";
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-amber-600/10 backdrop-blur-sm rounded-full">
                <Camera className="h-8 w-8 text-amber-700" />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-800">
                Sora Prompt Builder
              </h1>
            </div>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light">
              Create hyper-realistic prompts for stunning AI-generated imagery
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Guided Steps */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Step 1: Describe Your Idea */}
                <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-stone-800 flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      Describe Your Idea
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      What do you want to generate? (person, object, place, moment)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Input
                        placeholder="e.g., a silver teapot on a linen table, a girl with blue hair under starlight..."
                        value={subjectInput}
                        onChange={(e) => setSubjectInput(e.target.value)}
                        className="bg-white border-stone-300 text-lg py-6"
                      />
                      
                      {detectedSubjectType && (
                        <div className="mt-4">
                          <Badge className="mb-3 bg-amber-100 text-amber-800">
                            Detected: {detectedSubjectType}
                          </Badge>
                          
                          {exampleIdeas[detectedSubjectType] && (
                            <div>
                              <p className="text-sm text-stone-600 mb-2">💡 Try these {detectedSubjectType} ideas:</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {exampleIdeas[detectedSubjectType].map((example, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setSubjectInput(example)}
                                    className="text-left p-2 text-sm bg-stone-50 hover:bg-stone-100 rounded border text-stone-700 transition-colors"
                                  >
                                    "{example}"
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2: Choose a Style */}
                {subjectInput && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        Choose a Style
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Select a visual style for your prompt
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {styles.map((style) => {
                          const IconComponent = style.icon;
                          return (
                            <button
                              key={style.id}
                              onClick={() => setSelectedStyle(style.id as StyleType)}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                selectedStyle === style.id
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <IconComponent className="h-5 w-5 text-amber-600" />
                                <span className="font-medium text-stone-800">{style.name}</span>
                              </div>
                              <p className="text-xs text-stone-600">{style.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Enhance the Scene */}
                {subjectInput && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        Enhance the Scene (Optional)
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Add spectacular visual elements to make your prompt stand out
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="spectacular"
                            checked={makeItSpectacular}
                            onCheckedChange={setMakeItSpectacular}
                          />
                          <label htmlFor="spectacular" className="text-sm font-medium text-stone-700">
                            ✨ Make It Spectacular
                          </label>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-stone-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Adds cinematic, imaginative elements to make your prompt more visually stunning</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="advanced-tips"
                            checked={showAdvancedTips}
                            onCheckedChange={setShowAdvancedTips}
                          />
                          <label htmlFor="advanced-tips" className="text-sm font-medium text-stone-700">
                            Advanced Tips
                          </label>
                        </div>
                      </div>

                      {makeItSpectacular && (
                        <div className="space-y-4 p-4 bg-amber-50/50 rounded-lg border border-amber-200">
                          <div>
                            <label className="text-sm font-medium text-stone-700 mb-3 block">
                              Enhancement Intensity: {getIntensityLabel(spectacularIntensity[0])}
                            </label>
                            <Slider
                              value={spectacularIntensity}
                              onValueChange={setSpectacularIntensity}
                              max={2}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-stone-500 mt-2">
                              <span>💡 Subtle</span>
                              <span>🎥 Cinematic</span>
                              <span>💭 Wild/Surreal</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Advanced Options */}
                {detectedSubjectType && subjectInput && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2 cursor-pointer" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
                        <div className="w-8 h-8 bg-stone-400 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                        Fine-tune Details (Optional)
                        {showAdvancedOptions ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Advanced options for {detectedSubjectType} prompts
                      </CardDescription>
                    </CardHeader>
                    {showAdvancedOptions && (
                      <CardContent className="space-y-6">
                        
                        {/* Subject Identity - Only show for person/animal */}
                        {relevantSections.includes("identity") && (
                          <div className="space-y-4">
                            <h4 className="font-medium text-stone-800 flex items-center gap-2">
                              <Users className="h-4 w-4 text-amber-600" />
                              Subject Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-stone-700 mb-2 block">Age Range</label>
                                <Select value={ageRange} onValueChange={setAgeRange}>
                                  <SelectTrigger className="bg-white border-stone-300">
                                    <SelectValue placeholder="Select age range" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {ageRanges.map((age) => (
                                      <SelectItem key={age} value={age}>{age}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-stone-700 mb-2 block">Gender</label>
                                <Select value={gender} onValueChange={setGender}>
                                  <SelectTrigger className="bg-white border-stone-300">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {genders.map((g) => (
                                      <SelectItem key={g} value={g}>{g}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-stone-700 mb-2 block">Ethnicity</label>
                                <Select value={ethnicity} onValueChange={setEthnicity}>
                                  <SelectTrigger className="bg-white border-stone-300">
                                    <SelectValue placeholder="Select ethnicity" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {ethnicities.map((e) => (
                                      <SelectItem key={e} value={e}>{e}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-stone-700 mb-2 block">Facial Features</label>
                                <Select value={facialFeatures} onValueChange={setFacialFeatures}>
                                  <SelectTrigger className="bg-white border-stone-300">
                                    <SelectValue placeholder="Select features" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {facialFeaturesOptions.map((f) => (
                                      <SelectItem key={f} value={f}>{f}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {relevantSections.includes("lighting") && (
                            <div>
                              <label className="text-sm font-medium text-stone-700 mb-2 block">Lighting</label>
                              <Select value={lightingType} onValueChange={setLightingType}>
                                <SelectTrigger className="bg-white border-stone-300">
                                  <SelectValue placeholder="Select lighting" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {lightingOptions.map((light) => (
                                    <SelectItem key={light} value={light}>{light}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {relevantSections.includes("setting") && (
                            <div>
                              <label className="text-sm font-medium text-stone-700 mb-2 block">Setting</label>
                              <Select value={setting} onValueChange={setSetting}>
                                <SelectTrigger className="bg-white border-stone-300">
                                  <SelectValue placeholder="Select setting" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {settings.map((set) => (
                                    <SelectItem key={set} value={set}>{set}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {relevantSections.includes("mood") && (
                            <div>
                              <label className="text-sm font-medium text-stone-700 mb-2 block">Mood</label>
                              <Select value={moodTone} onValueChange={setMoodTone}>
                                <SelectTrigger className="bg-white border-stone-300">
                                  <SelectValue placeholder="Select mood" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {moodTones.map((mood) => (
                                    <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-center">
                          <Button 
                            onClick={randomizeSelections} 
                            variant="outline" 
                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            <Shuffle className="h-4 w-4 mr-2" />
                            Randomize Options
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )}
              </div>

              {/* Right Column - Generated Prompt & Features */}
              <div className="lg:col-span-1 space-y-6">
                {/* Generated Prompt */}
                <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-stone-800 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-600" />
                      Your Prompt
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      Updates automatically as you make changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={generatedPrompt}
                      readOnly
                      placeholder="Start by describing your idea in Step 1..."
                      className="min-h-40 bg-stone-50 border-stone-300 text-stone-700 resize-none"
                    />
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {generatedPrompt.length} characters
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={copyPrompt} 
                        className="bg-amber-600 text-white hover:bg-amber-700 w-full"
                        disabled={!generatedPrompt.trim()}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Prompt
                      </Button>
                      <Button 
                        onClick={clearAll} 
                        variant="outline" 
                        className="border-stone-300 text-stone-700 hover:bg-stone-50 w-full"
                      >
                        Start Over
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Enhancement */}
                {generatedPrompt && (
                  <AiEnhancer 
                    currentPrompt={generatedPrompt}
                    apiKey={apiKey}
                    onEnhancedPrompt={setGeneratedPrompt}
                  />
                )}

                {/* Sample Prompts Panel */}
                <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-stone-800 flex items-center gap-2">
                      <Mountain className="h-5 w-5 text-amber-600" />
                      Example Prompts
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      Get inspired by these professionally crafted prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-80 overflow-y-auto">
                    {samplePrompts.map((sample, index) => (
                      <div key={index} className="p-3 bg-stone-50 rounded border cursor-pointer hover:bg-stone-100 transition-colors"
                           onClick={() => setSubjectInput(sample.prompt.split(',')[0])}>
                        <Badge className="mb-2 bg-stone-200 text-stone-700 text-xs">
                          {sample.type}
                        </Badge>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {sample.prompt}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
