import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { useTagsByType } from "@/hooks/useTagsByType";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import {
  User,
  School,
  GraduationCap,
  Star,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play,
  Trophy,
  Rocket,
  Phone,
  MapPin,
  X
} from "lucide-react";

interface FormData {
  alias_name: string;
  mobile: string;
  address: string;
  school_name: string;
  tag_id: string;
}

export default function InitialSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    alias_name: "",
    mobile: "",
    address: "",
    school_name: "",
    tag_id: ""
  });
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { user, session } = useAuth();
  const { loadUserData } = useAuthStore();

  // Fetch tags that belong to "Class" tag type
  const { data: tags, isLoading: isLoadingTags, error: tagsError } = useTagsByType("Class");

  const steps = [
    {
      question: "🎮 Welcome, Champion! What should we call you?",
      subtitle: "Let's start your learning adventure!",
      placeholder: "Enter your awesome name",
      field: "alias_name" as keyof FormData,
      type: "input",
      icon: <User className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-600/20 to-cyan-600/20"
    },
    {
      question: "What's your mobile number?",
      subtitle: "We'll use this to keep you updated!",
      placeholder: "Enter your mobile number",
      field: "mobile" as keyof FormData,
      type: "input",
      icon: <Phone className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-600/20 to-red-600/20"
    },
    {
      question: "🏠 Where do you live?",
      subtitle: "Tell us your address for better service!",
      placeholder: "Enter your address",
      field: "address" as keyof FormData,
      type: "input",
      icon: <MapPin className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500",
      bgColor: "from-teal-600/20 to-cyan-600/20"
    },
    {
      question: "🏫 Which amazing school do you attend?",
      subtitle: "Tell us about your learning home!",
      placeholder: "Enter your school name",
      field: "school_name" as keyof FormData,
      type: "input",
      icon: <School className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-600/20 to-emerald-600/20"
    },
    {
      question: "🎓 What grade are you conquering?",
      subtitle: "Choose your learning level!",
      placeholder: "Select your grade",
      field: "tag_id" as keyof FormData,
      type: "select",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-600/20 to-pink-600/20"
    }
  ];

  // Validate mobile number: must start with 9 and be exactly 10 digits
  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^9\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleInputChange = (value: string) => {
    // For mobile field, only allow digits
    if (steps[currentStep].field === "mobile") {
      const digitsOnly = value.replace(/\D/g, "");
      // Limit to 10 digits
      const limitedValue = digitsOnly.slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [steps[currentStep].field]: limitedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [steps[currentStep].field]: value
      }));
    }
  };

  const handleTagSelection = (tagId: string) => {
    setSelectedTag(tagId);
    setFormData(prev => ({
      ...prev,
      tag_id: tagId
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Play sound effects
  useEffect(() => {
    if (currentStep === 0) {
      try {
        const audio = new Audio('/sounds/new-level.mp3');
        audio.volume = 0.7;
        audio.play().catch(error => {
          console.log('Audio play failed:', error);
        });
        audioRef.current = audio;
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          school_name: formData.school_name,
          tag_id: formData.tag_id || null,
          alias_name: formData.alias_name,
          mobile: formData.mobile,
          address: formData.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select(`
          id,
          full_name,
          avatar_url,
          user_type_id,
          school_name,
          tag_id,
          alias_name,
          mobile,
          address,
          is_erased,
          is_active,
          created_by,
          updated_by,
          created_at,
          updated_at,
          user_types (
            id,
            name
          ),
          tags (
            id,
            title,
            slug
          )
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setIsSubmitted(true);

        // Refresh the auth store with updated user data
        try {

          // Transform the data to match the expected structure
          const transformedData = {
            ...data,
            user_type: data.user_types ? {
              id: (data.user_types as any).id,
              name: (data.user_types as any).name
            } : undefined,
            tag: data.tags ? {
              id: (data.tags as any).id,
              title: (data.tags as any).title,
              slug: (data.tags as any).slug
            } : undefined,
            permissions: [] // Add empty permissions array
          };

          await loadUserData(session.user, transformedData);
        } catch (error) {
          console.error('Error updating auth store:', error);
        }

        // Play success sound
        try {
          const audio = new Audio('/sounds/correct.mp3');
          audio.volume = 0.8;
          audio.play().catch(error => {
            console.log('Success audio play failed:', error);
          });
        } catch (error) {
          console.error('Error playing success sound:', error);
        }

        // Navigate after a short delay to show success animation
        setTimeout(() => {
          navigate("/admin/courses");
        }, 2000);
      }
    } catch (error) {
      console.error('Setup error:', error);
      alert("Error: " + error?.message);
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setShowSuccess(false);
    setCurrentStep(0);
  };

  const isLastStep = currentStep === steps.length - 1;
  const canProceed = currentStep === 4
    ? selectedTag !== "" && !isLoadingTags && !tagsError
    : currentStep === 1 // Mobile number step
      ? validateMobile(formData.mobile)
      : formData[steps[currentStep].field].trim() !== "";

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Success Animation Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-bounce opacity-30"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-green-400 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400 rounded-full animate-bounce opacity-30"></div>
          <div className="absolute bottom-10 right-10 w-18 h-18 bg-pink-400 rounded-full animate-pulse opacity-30"></div>
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-4">
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-700">
            {/* Success Animation */}
            <div className="mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              {/* <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                Setup Complete!
              </h1> */}
              <p className="text-base text-gray-300 mb-6">
                Welcome to your learning adventure, <span className="text-yellow-300 font-bold">{formData.alias_name}</span>!
              </p>
            </div>

            {/* Success Details */}
            <div className="space-y-2 mb-8">
              <div className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600">
                <div className="flex items-center gap-3 text-green-300">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Name:</span>
                  <span className="text-white">{formData.alias_name}</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600">
                <div className="flex items-center gap-3 text-green-300">
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold">Mobile:</span>
                  <span className="text-white">{formData.mobile}</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600">
                <div className="flex items-center gap-3 text-green-300">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">Address:</span>
                  <span className="text-white">{formData.address}</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600">
                <div className="flex items-center gap-3 text-green-300">
                  <School className="w-5 h-5" />
                  <span className="font-semibold">School:</span>
                  <span className="text-white">{formData.school_name}</span>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-2xl p-4 border border-gray-600">
                <div className="flex items-center gap-3 text-green-300">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-semibold">Grade:</span>
                  <span className="text-white">
                    {tags?.find((tag: any) => tag.id === formData.tag_id)?.title || 'Selected'}
                  </span>
                </div>
              </div>
            </div>

            {!isSubmitted ? (
              <div className="space-y-6">
                {/* <div className="flex items-center justify-center gap-2 text-yellow-300">
                  <Rocket className="w-6 h-6 animate-bounce" />
                  <span className="text-lg font-semibold">Ready to start your learning journey?</span>
                  <Rocket className="w-6 h-6 animate-bounce" />
                </div> */}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="px-8 py-3 text-lg font-semibold rounded-2xl border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Edit Information
                  </Button>

                  <Button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        <span>Submit & Continue</span>
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-300">
                <CheckCircle className="w-6 h-6 animate-bounce" />
                <span className="text-lg font-semibold">Setup Complete! Redirecting...</span>
                <CheckCircle className="w-6 h-6 animate-bounce" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-bounce opacity-20"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-pink-400 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400 rounded-full animate-bounce opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-18 h-18 bg-blue-400 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400 rounded-full animate-ping opacity-15"></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-cyan-400 rounded-full animate-bounce opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-4">
        {/* Welcome Header */}


        {/* Main Game Card */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-700/50 relative overflow-hidden">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="text-center mb-8">
              {/* <div className="flex items-center justify-center mb-6">
            <img src="/images/borthersister.png" alt="logo" className="w-64 h-64 object-contain" />
          </div> */}
              {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                🎮 Welcome to RoboTech Learning! 🎮
              </h1> */}
              <p className="text-xl text-gray-300">
                Let's set up your learning adventure!
              </p>
            </div>
            <div className="flex justify-center space-x-0 mb-4">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${index <= currentStep
                      ? `bg-gradient-to-r ${steps[index].color} shadow-lg scale-110`
                      : "bg-gray-600"
                      }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 rounded-full transition-all duration-500 ${index < currentStep ? `bg-gradient-to-r ${steps[index].color}` : "bg-gray-600"
                      }`}></div>
                  )}
                </div>
              ))}
            </div>
            {/* <div className="text-center">
              <p className="text-gray-400 text-sm">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div> */}
          </div>

          {/* Current Step Content */}
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
            <div className="text-center mb-8">
              <div className={`w-14 h-14 bg-gradient-to-r ${steps[currentStep].color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse`}>
                {steps[currentStep].icon}
              </div>
              <h2 className="text-xl font-bold text-white mb-3">
                {steps[currentStep].question}
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                {steps[currentStep].subtitle}
              </p>
            </div>

            {/* Input Section */}
            <div className="mb-8">
              {isLoadingTags ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading grades...</p>
                </div>
              ) : tagsError ? (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">Error loading grades. Please try again.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500 text-white"
                  >
                    Retry
                  </button>
                </div>
              ) : steps[currentStep].type === "input" ? (
                <div className="space-y-3">
                  <Label htmlFor="input" className="text-gray-300 text-base font-semibold">
                    {steps[currentStep].placeholder}
                    {steps[currentStep].field === "mobile" && (
                      <span className="text-sm text-gray-400 font-normal ml-2">
                        {/* (Must start with 9 and be 10 digits) */}
                      </span>
                    )}
                  </Label>
                  <Input
                    id="input"
                    type="text"
                    value={formData[steps[currentStep].field]}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={steps[currentStep].placeholder}
                    className={`w-full p-6 text-lg bg-gray-700/50 border-2 rounded-2xl text-white placeholder-gray-400 focus:ring-2 transition-all duration-300 ${steps[currentStep].field === "mobile" && formData.mobile.length > 0 && !validateMobile(formData.mobile)
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-600 focus:border-purple-500 focus:ring-purple-500/20"
                      }`}
                    autoFocus
                  />
                  {steps[currentStep].field === "mobile" && formData.mobile.length > 0 && !validateMobile(formData.mobile) && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Mobile number must start with 9 and be exactly 10 digits
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <Label className="text-gray-300 text-lg font-semibold block text-center">
                    {steps[currentStep].placeholder}
                  </Label>

                  {/* Cool Radio Button Style Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {tags?.map((tag: any, index: number) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagSelection(tag.id)}
                        className={`group relative p-2 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${selectedTag === tag.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 shadow-lg shadow-purple-500/25 scale-105'
                          : 'bg-gray-700/50 border-gray-600 hover:border-purple-400 hover:bg-gray-600/50'
                          }`}
                      >
                        {/* Selection Indicator */}
                        <div className={`absolute top-2 right-3 w-5 h-5 rounded-full border-2 transition-all duration-300 ${selectedTag === tag.id
                          ? 'bg-white border-white'
                          : 'border-gray-400'
                          }`}>
                          {selectedTag === tag.id && (
                            <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Grade Icon */}
                        {/* <div className="flex justify-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${selectedTag === tag.id
                            ? 'bg-white/20'
                            : 'bg-gray-600/50'
                            }`}>
                            <GraduationCap className={`w-6 h-6 transition-colors duration-300 ${selectedTag === tag.id ? 'text-white' : 'text-gray-300'
                              }`} />
                          </div>
                        </div> */}

                        {/* Grade Title */}
                        <div className="text-center">
                          <h3 className={`text-sm font-bold transition-colors duration-300 ${selectedTag === tag.id ? 'text-white' : 'text-gray-300'
                            }`}>
                            {tag.title}
                          </h3>
                          {/* <p className={`text-sm mt-1 transition-colors duration-300 ${selectedTag === tag.id ? 'text-white/80' : 'text-gray-400'
                            }`}>
                            Grade {index + 1}
                          </p> */}
                        </div>

                        {/* Hover Effect */}
                        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${selectedTag === tag.id
                          ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10'
                          : 'bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5'
                          }`}></div>
                      </button>
                    ))}
                  </div>

                  {/* Selection Feedback */}
                  {/* {selectedTag && (
                    <div className="text-center mt-4">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full px-4 py-2">
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-300 font-semibold">
                          Selected: {tags?.find((tag: any) => tag.id === selectedTag)?.title}
                        </span>
                      </div>
                    </div>
                  )} */}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="text-center">
              <Button
                onClick={isLastStep ? handleSubmit : handleNext}
                disabled={!canProceed}
                className={`px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-300 transform ${canProceed
                  ? `bg-gradient-to-r ${steps[currentStep].color} hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 text-white`
                  : "bg-gray-600 cursor-not-allowed text-gray-400"
                  }`}
              >
                {isLastStep ? (
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6" />
                    <span>Complete Setup!</span>
                    <Sparkles className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span>Continue</span>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}