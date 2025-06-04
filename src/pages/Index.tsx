import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Copy, Sparkles, Camera, Users, Palette, Mountain, Shuffle, HelpCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SubjectType = "person" | "object" | "landscape" | "abstract" | "animal" | "scene" | "";

const Index = () => {
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [detectedSubjectType, setDetectedSubjectType] = useState<SubjectType>("");
  const [makeItSpectacular, setMakeItSpectacular] = useState(false);
  const [showAdvancedTips, setShowAdvancedTips] = useState(false);
  
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

  const ageRanges = [
    "Child (5-12)", "Teenager (13-19)", "Young Adult (20-30)", 
    "Adult (30-50)", "Middle-aged (50-65)", "Senior (65+)"
  ];

  const genders = ["Male", "Female", "Non-binary", "Androgynous"];

  const ethnicities = [
    "Asian", "Black/African", "Caucasian/White", "Hispanic/Latino", 
    "Middle Eastern", "Native American", "Pacific Islander", "Mixed Heritage"
  ];

  const facialFeaturesOptions = [
    "Sharp jawline", "Soft features", "High cheekbones", "Full lips", 
    "Defined eyebrows", "Freckles", "Dimples", "Scar details"
  ];

  const lightingOptions = [
    "Soft natural light", "Harsh flash", "Directional studio light", 
    "Golden hour", "Candlelight", "Overexposed", "Rim lighting", "Low key lighting"
  ];

  const makeupOptions = [
    "Minimal makeup", "Glam makeup", "Gold/painterly", "Freckles", 
    "Piercings", "Statement jewelry", "Vintage accessories", "Modern minimalist"
  ];

  const wardrobeStyles = [
    "Vintage", "Casual streetwear", "High fashion", "Business formal", 
    "Bohemian", "Minimalist", "Avant-garde", "Traditional cultural"
  ];

  const materials = [
    "Linen", "Velvet", "Leather", "Silk", "Denim", "Cashmere", "Cotton", "Satin"
  ];

  const cameraStyles = [
    "Macro shot", "Film camera", "90s digital", "DSLR 4K", 
    "Cinematic", "Grainy texture", "Vintage Polaroid", "Professional studio"
  ];

  const poseExpressions = [
    "Looking into camera", "Candid moment", "Dynamic motion", "Profile view", 
    "Three-quarter turn", "Laughing naturally", "Contemplative gaze", "Action pose"
  ];

  const settings = [
    "Urban street", "Professional studio", "Antique room", "Balcony at night", 
    "Natural landscape", "Coffee shop", "Art gallery", "Rooftop terrace"
  ];

  const compositions = [
    "Ultra close-up", "3/4 body shot", "Full body", "16:9 aspect ratio", 
    "Bokeh background", "Shallow depth of field", "Symmetrical framing", "Rule of thirds"
  ];

  const moodTones = [
    "Ethereal", "Dramatic", "Editorial", "Peaceful", "Gritty realism", 
    "Romantic", "Powerful", "Mysterious"
  ];

  const colorPalettes = [
    "Warm neutrals", "High contrast", "Low saturation", "Muted tones", 
    "Vibrant colors", "Monochromatic", "Earth tones", "Cool blues and greys"
  ];

  // New data for enhanced features
  const samplePrompts = [
    { type: "person", prompt: "Young Asian woman in her 20s with freckles, wearing vintage silk blouse, soft natural light, looking into camera, urban street setting, shallow depth of field, ethereal mood, warm neutrals" },
    { type: "object", prompt: "Antique silver pocket watch on weathered leather, macro shot, golden hour lighting, shallow focus, dark background, dramatic mood, high contrast" },
    { type: "landscape", prompt: "Misty mountain valley at dawn, cinematic wide shot, soft directional light, ethereal atmosphere, cool blues and greys, 16:9 aspect ratio" },
    { type: "scene", prompt: "Medieval marketplace bustling with activity, film camera style, warm candlelight, dynamic motion, full body shots, gritty realism, earth tones" }
  ];

  const visualEnhancers = [
    "surrounded by glowing butterflies made of glass",
    "floating through a sea of violet fog with reflections of stars",
    "lit by the glow of an unseen fire behind the horizon",
    "with crystalline droplets of light cascading around",
    "emerging from shadows that dance like living smoke",
    "bathed in ethereal moonbeams filtering through ancient trees",
    "reflected in pools of liquid mercury",
    "adorned with fragments of rainbow light",
    "suspended in time within a sphere of shimmering energy",
    "crowned with delicate frost patterns that sparkle like diamonds"
  ];

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

    if (makeItSpectacular) {
      const randomEnhancer = visualEnhancers[Math.floor(Math.random() * visualEnhancers.length)];
      components.push(randomEnhancer);
    }

    const finalPrompt = components.join(", ") + ", ultra-high quality, photorealistic";
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
  }, [subjectInput, ageRange, gender, ethnicity, facialFeatures, lightingType, selectedMakeup, wardrobeStyle, material, cameraStyle, poseExpression, setting, composition, moodTone, colorPalette, makeItSpectacular]);

  const relevantSections = getRelevantSections(detectedSubjectType);

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
              {/* Left Column - Categories */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Subject Input & Detection */}
                <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-stone-800 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-600" />
                      Subject & Enhancement
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      Start with your main subject - the system will detect the type and show relevant options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-stone-700 mb-2 block">What's your main subject?</label>
                      <Input
                        placeholder="e.g., a silver pocket watch, a medieval warrior, a woman walking at night..."
                        value={subjectInput}
                        onChange={(e) => setSubjectInput(e.target.value)}
                        className="bg-white border-stone-300"
                      />
                      {detectedSubjectType && (
                        <Badge className="mt-2 bg-amber-100 text-amber-800">
                          Detected: {detectedSubjectType}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="spectacular"
                          checked={makeItSpectacular}
                          onCheckedChange={setMakeItSpectacular}
                        />
                        <label htmlFor="spectacular" className="text-sm font-medium text-stone-700">
                          🌟 Make It Spectacular
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
                  </CardContent>
                </Card>

                {/* Subject Identity - Only show for person/animal */}
                {relevantSections.includes("identity") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        <Users className="h-5 w-5 text-amber-600" />
                        Subject Identity
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Define the physical characteristics of your subject</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Black woman in her 30s with freckles and glowing skin"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Be specific about age and features for more consistent results
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </CardContent>
                  </Card>
                )}

                {/* Makeup & Accessories - Only for person */}
                {relevantSections.includes("makeup") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        Makeup & Accessories
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add details like makeup style and accessories</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Abstract gold metallic makeup and pearl earrings"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Use statement jewelry to add character and story
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {makeupOptions.map((makeup) => (
                          <div key={makeup} className="flex items-center space-x-2">
                            <Checkbox
                              id={makeup}
                              checked={selectedMakeup.includes(makeup)}
                              onCheckedChange={(checked) => handleMakeupChange(makeup, checked as boolean)}
                            />
                            <label htmlFor={makeup} className="text-sm text-stone-700">{makeup}</label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Wardrobe & Style - Only for person */}
                {relevantSections.includes("wardrobe") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        Wardrobe & Style
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose clothing style and material</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Wearing a black velvet jacket and antique brooch"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Velvet and silk add richness and texture
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-stone-700 mb-2 block">Style</label>
                        <Select value={wardrobeStyle} onValueChange={setWardrobeStyle}>
                          <SelectTrigger className="bg-white border-stone-300">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {wardrobeStyles.map((style) => (
                              <SelectItem key={style} value={style}>{style}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-stone-700 mb-2 block">Material</label>
                        <Select value={material} onValueChange={setMaterial}>
                          <SelectTrigger className="bg-white border-stone-300">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {materials.map((mat) => (
                              <SelectItem key={mat} value={mat}>{mat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Lighting & Atmosphere */}
                {relevantSections.includes("lighting") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        Lighting & Atmosphere
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Lighting dramatically affects mood and realism</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Soft directional studio light with highlights on cheekbones"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Try rim lighting for dramatic portraits or golden hour for warmth
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <label className="text-sm font-medium text-stone-700 mb-2 block">Lighting Type</label>
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
                    </CardContent>
                  </Card>
                )}

                {/* Camera & Lens */}
                {relevantSections.includes("camera") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        Camera & Lens
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose camera style and lens effects</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Taken with a compact digital camera from the early 1990s"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Grainy texture adds vintage feel
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select value={cameraStyle} onValueChange={setCameraStyle}>
                        <SelectTrigger className="bg-white border-stone-300">
                          <SelectValue placeholder="Select camera style" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {cameraStyles.map((camera) => (
                            <SelectItem key={camera} value={camera}>{camera}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}

                {/* Pose & Expression */}
                {relevantSections.includes("pose") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        Pose & Expression
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Define the subject's pose and facial expression</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Short wavy hair covers one eye, soft smile, leaning on bench"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Dynamic motion adds energy to the scene
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select value={poseExpression} onValueChange={setPoseExpression}>
                        <SelectTrigger className="bg-white border-stone-300">
                          <SelectValue placeholder="Select pose" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {poseExpressions.map((pose) => (
                            <SelectItem key={pose} value={pose}>{pose}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}

                {/* Setting & Environment */}
                {relevantSections.includes("setting") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        Setting
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose the environment or background</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Dark background of a balcony at night in a city"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Urban street adds grit and realism
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                )}

                {/* Composition & Quality */}
                {relevantSections.includes("composition") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        Composition
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Frame your shot with composition techniques</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Half-body portrait, shallow focus on the eyes, 16:9 format"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Use rule of thirds for balanced composition
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select value={composition} onValueChange={setComposition}>
                        <SelectTrigger className="bg-white border-stone-300">
                          <SelectValue placeholder="Select composition" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {compositions.map((comp) => (
                            <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}

                {/* Mood & Tone */}
                {relevantSections.includes("mood") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        Mood & Tone
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Set the emotional tone of your image</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Dramatic, minimalistic, high-fashion editorial tone"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Ethereal mood works well with soft lighting
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                )}

                {/* Color Palette */}
                {relevantSections.includes("color") && (
                  <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-stone-800 flex items-center gap-2">
                        Color Palette
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-stone-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose the color scheme for your image</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-stone-600">
                        Example: "Soft charcoal and muted sage with antique gold accents"
                        {showAdvancedTips && (
                          <div className="mt-2 p-2 bg-amber-50 rounded text-xs">
                            💡 Pro tip: Muted tones create a calm, sophisticated look
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select value={colorPalette} onValueChange={setColorPalette}>
                        <SelectTrigger className="bg-white border-stone-300">
                          <SelectValue placeholder="Select palette" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {colorPalettes.map((palette) => (
                            <SelectItem key={palette} value={palette}>{palette}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
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
                      Generated Prompt
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      Your AI prompt updates automatically as you make selections
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={generatedPrompt}
                      readOnly
                      placeholder="Your generated prompt will appear here..."
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
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Prompt
                      </Button>
                      <Button 
                        onClick={randomizeSelections} 
                        variant="outline" 
                        className="border-amber-300 text-amber-700 hover:bg-amber-50 w-full"
                      >
                        <Shuffle className="h-4 w-4 mr-2" />
                        Randomize
                      </Button>
                      <Button 
                        onClick={clearAll} 
                        variant="outline" 
                        className="border-stone-300 text-stone-700 hover:bg-stone-50 w-full"
                      >
                        Clear All
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Prompts Panel */}
                <Card className="bg-white/70 backdrop-blur-sm border-stone-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-stone-800 flex items-center gap-2">
                      <Mountain className="h-5 w-5 text-amber-600" />
                      Sample Prompts
                    </CardTitle>
                    <CardDescription className="text-stone-600">
                      Get inspired by these professionally crafted prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-80 overflow-y-auto">
                    {samplePrompts.map((sample, index) => (
                      <div key={index} className="p-3 bg-stone-50 rounded border">
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
