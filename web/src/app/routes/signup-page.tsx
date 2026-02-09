import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authClient, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Github, Loader2, Mail, Lock, User, CheckCircle2, Zap, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignupValues = z.infer<typeof signupSchema>

export function SignupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = (location.state as { redirect?: string })?.redirect
  const { data: session, isPending: isSessionPending } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (session && !isSessionPending) {
      navigate(redirect || '/home')
    }
  }, [session, isSessionPending, navigate, redirect])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (values: SignupValues) => {
    setIsLoading(true)
    try {
      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        role: 'user',
      })

      if (error) {
        toast.error(error.message || 'Failed to create account')
        return
      }

      toast.success('Account created successfully!')
      navigate(redirect || '/home')
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setIsSocialLoading(provider)
    try {
      const callbackURL = redirect || `${window.location.origin}/home`
      await authClient.signIn.social({
        provider,
        callbackURL,
      })
    } catch (err: any) {
      toast.error(err?.message || `Failed to sign in with ${provider}`)
      setIsSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F8FAFC]">
      {/* Left Column - Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">T</div>
            <span className="text-2xl font-extrabold tracking-tight font-sans">Task<span className="text-cyan-400">Hub</span></span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <QuoteIcon className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Alex Chen</h4>
                <p className="text-slate-400 text-sm">VP of Engineering at ScaleUp</p>
              </div>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed font-medium">
              "We moved our entire engineering workflow to TaskHub. The speed and fluidity of the interface is something we haven't found anywhere else."
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300"> Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-300"> Lightning Fast</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500 font-medium">
          © 2026 Task Hub Inc.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Create an account</h1>
            <p className="text-slate-500">
              Start managing your tasks with clarity and focus
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-cyan-500"
                  {...register('name')}
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p className="text-xs font-semibold text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-cyan-500"
                  {...register('email')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-xs font-semibold text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Twice the strength"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-cyan-500"
                  {...register('password')}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-xs font-semibold text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-lg shadow-slate-900/10" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#F8FAFC] px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-11 border-slate-200 hover:bg-white hover:text-slate-900 hover:border-slate-300 transition-all"
              onClick={() => handleSocialSignIn('google')}
              disabled={!!isSocialLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.36-1.24 1.04-3.16 1.84-5.72 1.84-4.8 0-8.8-3.56-8.8-8.4s4-8.4 8.8-8.4c2.8 0 5 1.04 6.64 2.6l2.32-2.32C19.12 1.6 16.08 0 12.48 0 5.6 0 0 5.6 0 12.4s5.6 12.4 12.48 12.4c3.84 0 6.64-1.24 8.84-3.48 2.32-2.32 3.04-5.56 3.04-8.16 0-.6-.04-1.2-.16-1.84h-11.72z"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="h-11 border-slate-200 hover:bg-white hover:text-slate-900 hover:border-slate-300 transition-all text-slate-700"
              onClick={() => handleSocialSignIn('github')}
              disabled={!!isSocialLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-cyan-600 hover:text-cyan-700 hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
    </svg>
  )
}
