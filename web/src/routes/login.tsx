import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authClient, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Github, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

type LoginSearch = {
  redirect?: string
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const { data: session, isPending: isSessionPending } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (session && !isSessionPending) {
      navigate({ to: redirect || '/home' })
    }
  }, [session, isSessionPending, navigate, redirect])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true)
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      })

      if (error) {
        toast.error(error.message || 'Invalid credentials')
        return
      }

      toast.success('Signed in successfully!')
      navigate({ to: redirect || '/home' })
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setIsSocialLoading(true)
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: redirect || `${window.location.origin}/home`,
      })
    } catch (err) {
      toast.error(`Failed to sign in with ${provider}`)
      setIsSocialLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <Card className="w-full max-w-md shadow-xl border-zinc-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">Sign in</CardTitle>
          <p className="text-muted-foreground font-medium">Welcome back! Please enter your details</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border bg-zinc-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-red-500 focus:ring-red-500/10' : 'border-zinc-200 focus:border-primary'
                  }`}
              />
              {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border bg-zinc-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.password ? 'border-red-500 focus:ring-red-500/10' : 'border-zinc-200 focus:border-primary'
                  }`}
              />
              {errors.password && <p className="text-xs font-bold text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full py-6 text-lg font-bold shadow-lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-zinc-400 font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="py-6 font-bold flex items-center justify-center gap-3 border-zinc-200 hover:bg-zinc-50 transition-all active:scale-95"
              onClick={() => handleSocialSignIn('google')}
              disabled={isSocialLoading}
            >
              {isSocialLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.36-1.24 1.04-3.16 1.84-5.72 1.84-4.8 0-8.8-3.56-8.8-8.4s4-8.4 8.8-8.4c2.8 0 5 1.04 6.64 2.6l2.32-2.32C19.12 1.6 16.08 0 12.48 0 5.6 0 0 5.6 0 12.4s5.6 12.4 12.48 12.4c3.84 0 6.64-1.24 8.84-3.48 2.32-2.32 3.04-5.56 3.04-8.16 0-.6-.04-1.2-.16-1.84h-11.72z"
                  />
                </svg>
              )}
              Google
            </Button>
            <Button
              variant="outline"
              className="py-6 font-bold flex items-center justify-center gap-3 border-zinc-200 hover:bg-zinc-50 transition-all active:scale-95"
              onClick={() => handleSocialSignIn('github')}
              disabled={isSocialLoading}
            >
              {isSocialLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-zinc-50 pt-6">
          <p className="text-sm font-medium text-zinc-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
