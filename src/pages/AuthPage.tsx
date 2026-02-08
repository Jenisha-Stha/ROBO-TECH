import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { googleAuthService } from '@/services/googleAuthService';
import { useCreateUser, useUserTypes } from '@/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const AuthPage = () => {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { session, user } = useAuth();
    const { toast } = useToast();

    // Registration specific data (from lms-main-game logic)
    const [formData, setFormData] = useState({
        full_name: "",
        school_name: "",
        avatar_url: "",
        tag_id: "",
        alias_name: ""
    });

    const createUserMutation = useCreateUser();
    const { data: userTypes = [] } = useUserTypes();
    const studentRole = userTypes.find(role => role.name === 'Student');

    // Redirect if already authenticated
    useEffect(() => {
        if (session && user) {
            navigate('/admin');
        }
    }, [session, user, navigate]);

    const validate = () => {
        const emailToValidate = mode === 'signin' ? email : email; // Both use email state
        const passwordToValidate = mode === 'signin' ? password : password;

        if (!emailToValidate.trim() || !passwordToValidate.trim()) {
            return "Email and password are required.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailToValidate)) {
            return "Please enter a valid email address.";
        }

        if (passwordToValidate.length < 6) {
            return "Password must be at least 6 characters.";
        }

        if (mode === 'signup' && !formData.full_name.trim()) {
            return "Full name is required for registration.";
        }

        return null;
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const validationError = validate();
            if (validationError) {
                setError(validationError);
                return;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                navigate('/admin');
            }
        } catch (error: unknown) {
            const err = error as Error;
            setError(err.message || 'An error occurred during sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const validationError = validate();
            if (validationError) {
                setError(validationError);
                return;
            }

            if (!acceptTerms) {
                setError('Please accept the Terms and Conditions.');
                return;
            }

            // In lms-main-game, signup is handled by creating the user via an admin mutation 
            // to ensure the profile is created correctly with all fields.
            const userData = {
                email: email.trim().toLowerCase(),
                password: password,
                full_name: formData.full_name.trim(),
                avatar_url: formData.avatar_url.trim() || undefined,
                user_type_id: studentRole?.id,
                school_name: formData.school_name.trim() || undefined,
                tag_id: formData.tag_id || undefined,
                alias_name: formData.alias_name.trim() || undefined
            };

            await createUserMutation.mutateAsync(userData);
            
            // After successful admin creation, we notify the user
            setMessage('Account created successfully! You can now sign in.');
            setMode('signin');
            
        } catch (error: unknown) {
            const err = error as Error;
            if (err.message.includes('User already registered')) {
                setError('An account with this email already exists. Please sign in instead.');
            } else {
                setError(err.message || 'An error occurred during sign up');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        setError('');
        setMessage('');

        try {
            const { data, error } = await googleAuthService.signInWithGoogle({
                redirectTo: `${window.location.origin}/auth/callback`
            });

            if (error) throw error;

            setMessage('Redirecting to Google...');
        } catch (error: unknown) {
            const err = error as Error;
            setError(err.message || 'Failed to initiate Google sign in');
            setIsGoogleLoading(false);
        }
    };

    const switchMode = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setError('');
        setMessage('');
    };

    const getPasswordStrength = (pass: string) => {
        if (pass.length === 0) return { strength: 0, label: "", color: "" };
        if (pass.length < 6) return { strength: 1, label: "Weak", color: "text-red-500" };
        if (pass.length < 8) return { strength: 2, label: "Fair", color: "text-yellow-500" };
        if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
            return { strength: 4, label: "Strong", color: "text-green-500" };
        }
        return { strength: 3, label: "Good", color: "text-blue-500" };
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* ═══════ LEFT PANEL ═══════ */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col"
                style={{ background: 'linear-gradient(180deg, #0c3d7a 0%, #1565C0 50%, #1E88E5 100%)' }}
            >
                {/* Logo */}
                <div className="p-8">
                    <img src="/images/auth-logo.png" alt="Robo-Tech" className="h-14" />
                </div>

                {/* Main illustration */}
                <div className="flex-1 flex flex-col justify-center px-10">
                    <div className="flex justify-center mb-8">
                        <img
                            src="/images/auth-kids.png"
                            alt="Kids learning with robots"
                            className="w-full max-w-md h-auto object-contain"
                        />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3">
                        Empower Young Minds with RoboTech Learning Center
                    </h2>
                    <p className="text-blue-100/80 text-sm leading-relaxed">
                        RoboTech Learning Center is a future focused learning platform that helps students
                        build strong foundations in coding, robotics, AI, and technology skills. Through
                        interactive lessons, hands-on projects, and expert-guided training, learners
                        develop problem-solving, creativity, and logical thinking—skills essential for the
                        digital world.
                    </p>
                </div>

                {/* Bottom: robot on pencil + clouds */}
                <div className="relative h-44">
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
                        <img src="/images/auth-robot-pencil.png" alt="Robot on pencil" className="h-28 w-auto object-contain" />
                    </div>
                    <img
                        src="/images/auth-clouds.png"
                        alt=""
                        className="absolute bottom-0 left-0 w-full h-auto"
                    />
                    <div className="absolute bottom-3 left-[12%] flex gap-2.5 z-10">
                        <div className="w-4 h-4 rounded-full bg-yellow-400" />
                        <div className="w-4 h-4 rounded-full bg-orange-500" />
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                    </div>
                </div>
            </div>

            {/* ═══════ RIGHT PANEL ═══════ */}
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
                <div className="flex items-center justify-between px-8 pt-8">
                    <Link to="/" className="inline-flex items-center gap-1.5 text-[#1565C0] font-medium hover:underline">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>

                    {mode === 'signin' ? (
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Don't have an account?</p>
                            <button onClick={switchMode} className="text-[#1565C0] font-semibold text-sm hover:underline">
                                Register to start your journey with us!
                            </button>
                        </div>
                    ) : (
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Already have an account?</p>
                            <button onClick={switchMode} className="text-[#1565C0] font-semibold text-sm hover:underline">
                                Sign in to continue
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex items-center justify-center px-8 py-12">
                    <div className="w-full max-w-md">
                        {/* ─── SIGN IN ─── */}
                        {mode === 'signin' && (
                            <>
                                <h1 className="text-3xl font-bold text-[#1565C0] mb-2">Sign in to your account</h1>
                                <p className="text-gray-500 mb-8">Enter your credentials to access your account</p>

                                <form onSubmit={handleSignIn} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-email" className="text-sm font-bold text-gray-900">Email Address</Label>
                                        <Input
                                            id="signin-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-12 rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#1565C0] focus:ring-[#1565C0]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="signin-password" className="text-sm font-bold text-gray-900">Password</Label>
                                            <button type="button" className="text-sm text-[#1565C0] font-medium hover:underline">
                                                Forgot your password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="signin-password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="h-12 rounded-lg border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#1565C0] focus:ring-[#1565C0] pr-12"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="remember"
                                            checked={rememberMe}
                                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                            className="border-gray-300 data-[state=checked]:bg-[#1565C0] data-[state=checked]:border-[#1565C0]"
                                        />
                                        <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                                            Remember me
                                        </label>
                                    </div>

                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}
                                    {message && (
                                        <Alert>
                                            <AlertDescription>{message}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-lg text-base font-semibold bg-[#1565C0] hover:bg-[#0d47a1]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </form>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <Separator className="w-full bg-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-4 text-gray-400">Or continue with</span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 rounded-lg border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50"
                                    onClick={handleGoogleSignIn}
                                    disabled={isGoogleLoading}
                                >
                                    {isGoogleLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Connecting to Google...
                                        </>
                                    ) : (
                                        <>
                                            <GoogleIcon />
                                            Google
                                        </>
                                    )}
                                </Button>
                            </>
                        )}

                        {/* ─── SIGN UP ─── */}
                        {mode === 'signup' && (
                            <>
                                <h1 className="text-3xl font-bold text-[#1565C0] mb-2">Create Your Account</h1>
                                <p className="text-gray-500 mb-8">Join the RoboTech community today!</p>

                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="signup-name" className="text-sm font-bold text-gray-900">Full Name *</Label>
                                        <Input
                                            id="signup-name"
                                            placeholder="Your full name"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                                            required
                                            className="h-11 rounded-lg border-gray-300"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="signup-email" className="text-sm font-bold text-gray-900">Email Address *</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-11 rounded-lg border-gray-300"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="signup-password" className="text-sm font-bold text-gray-900">Password *</Label>
                                        <div className="relative">
                                            <Input
                                                id="signup-password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                className="h-11 rounded-lg border-gray-300 pr-12"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {password && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                                            getPasswordStrength(password).strength === 1 ? "bg-red-500 w-1/4" :
                                                            getPasswordStrength(password).strength === 2 ? "bg-yellow-500 w-1/2" :
                                                            getPasswordStrength(password).strength === 3 ? "bg-blue-500 w-3/4" :
                                                            getPasswordStrength(password).strength === 4 ? "bg-green-500 w-full" : "w-0"
                                                        }`}
                                                    />
                                                </div>
                                                <span className={`text-[10px] font-bold ${getPasswordStrength(password).color}`}>
                                                    {getPasswordStrength(password).label}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-2 py-1">
                                        <Checkbox
                                            id="terms"
                                            checked={acceptTerms}
                                            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                                            className="mt-0.5 border-gray-300 data-[state=checked]:bg-[#1565C0] data-[state=checked]:border-[#1565C0]"
                                        />
                                        <label htmlFor="terms" className="text-xs text-gray-600 leading-normal cursor-pointer">
                                            I accept the{' '}
                                            <span className="text-[#1565C0] font-medium hover:underline">Terms and Conditions</span>
                                            {' '}&{' '}
                                            <span className="text-[#1565C0] font-medium hover:underline">Privacy Policy</span>
                                        </label>
                                    </div>

                                    {error && (
                                        <Alert variant="destructive" className="py-2 px-3">
                                            <AlertDescription className="text-xs">{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-11 rounded-lg text-base font-semibold bg-[#1565C0] hover:bg-[#0d47a1]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
                                    </Button>
                                </form>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <Separator className="w-full bg-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-4 text-gray-400">Or continue with</span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-11 rounded-lg border-gray-300"
                                    onClick={handleGoogleSignIn}
                                    disabled={isGoogleLoading}
                                >
                                    <GoogleIcon />
                                    Google
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;