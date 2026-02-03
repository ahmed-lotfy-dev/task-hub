import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authClient, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Chrome, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignupValues = z.infer<typeof signupSchema>

type SignupSearch = {
  redirect?: string
}

export const Route = createFileRoute('/signup')({
  validateSearch: (search: Record<string, unknown>): SignupSearch => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
  component: SignupPage,
})

function SignupPage() {
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
      navigate({ to: redirect || '/home' })
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true)
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: redirect || `${window.location.origin}/home`,
      })
    } catch (err) {
      toast.error('Failed to sign in with Google')
      setIsSocialLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <Card className="w-full max-w-md shadow-xl border-zinc-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
          <p className="text-muted-foreground font-medium">Enter your details to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Name</label>
              <input
                {...register('name')}
                placeholder="Ahmed Lotfy"
                className={`w-full px-4 py-3 rounded-xl border bg-zinc-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-zinc-200 focus:border-primary'
                  }`}
              />
              {errors.name && <p className="text-xs font-bold text-red-500 mt-1">{errors.name.message}</p>}
            </div>
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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
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

          <Button
            variant="outline"
            className="w-full py-6 font-bold flex items-center gap-3 border-zinc-200 hover:bg-zinc-50"
            onClick={handleGoogleSignIn}
            disabled={isSocialLoading}
          >
            {isSocialLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Chrome className="w-5 h-5 text-red-500" />}
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-zinc-50 pt-6">
          <p className="text-sm font-medium text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
