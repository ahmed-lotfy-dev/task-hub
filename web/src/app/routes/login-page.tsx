import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { authClient, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Github, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = (location.state as { redirect?: string })?.redirect
  const { data: session, isPending: isSessionPending } = useSession()
  const [activeProvider, setActiveProvider] = useState<'google' | 'github' | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (session && !isSessionPending) {
      navigate(redirect || '/home')
    }
  }, [session, isSessionPending, navigate, redirect])

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setActiveProvider(provider)
    try {
      // Ensure the callback URL is absolute to avoid redirecting to the API domain
      const baseUrl = window.location.origin
      const redirectPath = redirect || '/home'
      const callbackURL = redirectPath.startsWith('http') ? redirectPath : `${baseUrl}${redirectPath}`

      console.log(`[Login] Redirecting to ${provider} with callbackURL: ${callbackURL}`)

      await authClient.signIn.social({
        provider,
        callbackURL: callbackURL,
      })
    } catch (err) {
      toast.error(`Failed to sign in with ${provider}`)
      setActiveProvider(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <Card className="w-full max-w-md shadow-xl border-zinc-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">Sign in</CardTitle>
          <p className="text-muted-foreground font-medium">Welcome back! Please choose a provider</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="py-6 font-bold flex items-center justify-center gap-3 border-zinc-200 hover:bg-zinc-50 transition-all active:scale-95 text-lg"
              onClick={() => handleSocialSignIn('google')}
              disabled={!!activeProvider}
            >
              {activeProvider === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.36-1.24 1.04-3.16 1.84-5.72 1.84-4.8 0-8.8-3.56-8.8-8.4s4-8.4 8.8-8.4c2.8 0 5 1.04 6.64 2.6l2.32-2.32C19.12 1.6 16.08 0 12.48 0 5.6 0 0 5.6 0 12.4s5.6 12.4 12.48 12.4c3.84 0 6.64-1.24 8.84-3.48 2.32-2.32 3.04-5.56 3.04-8.16 0-.6-.04-1.2-.16-1.84h-11.72z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="py-6 font-bold flex items-center justify-center gap-3 border-zinc-200 hover:bg-zinc-50 transition-all active:scale-95 text-lg"
              onClick={() => handleSocialSignIn('github')}
              disabled={!!activeProvider}
            >
              {activeProvider === 'github' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
              Continue with GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-zinc-50 pt-6">
          <p className="text-sm font-medium text-zinc-500">
            By signing in, you agree to our Terms of Service.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
