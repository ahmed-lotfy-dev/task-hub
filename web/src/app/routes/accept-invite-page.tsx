import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import { useSession } from '@/lib/auth-client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, AlertCircle, Users, Layout } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

interface InvitationDetails {
  valid: boolean
  details?: {
    invitation: {
      id: string
      email: string
      role: string
      expiresAt: string
      workspaceId: string | null
      boardId: string | null
    }
    workspaceName: string | null
    boardName: string | null
    inviterName: string | null
    inviterEmail: string | null
  }
  error?: string
}

export function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { data: session, isPending: isSessionPending } = useSession()
  const [accepted, setAccepted] = useState(false)

  // Verify the invitation
  const { data: verification, isLoading: isVerifying, error: verifyError } = useQuery<InvitationDetails>({
    queryKey: ['invitation-verify', token],
    queryFn: async () => {
      return apiFetch(`/api/invitations/verify/${token}`)
    },
    enabled: !!token,
  })

  // Accept mutation
  const acceptMutation = useMutation({
    mutationFn: async () => {
      return apiFetch('/api/invitations/accept', {
        method: 'POST',
        body: JSON.stringify({ token }),
      })
    },
    onSuccess: (data: any) => {
      if (data.error) {
        toast.error(data.error)
      } else {
        setAccepted(true)
        toast.success('Invitation accepted successfully!')
        // Redirect after a short delay
        setTimeout(() => {
          if (verification?.details?.invitation.workspaceId) {
            navigate('/home')
          } else if (verification?.details?.invitation.boardId) {
            navigate(`/board/${verification.details.invitation.boardId}`)
          } else {
            navigate('/home')
          }
        }, 2000)
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to accept invitation')
    },
  })

  // Loading state
  if (isVerifying || isSessionPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Verifying invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Invalid or expired invitation
  if (!verification?.valid || verifyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Invitation</h2>
            <p className="text-muted-foreground">
              {verification?.error || 'This invitation link is invalid, expired, or has already been used.'}
            </p>
            <Button 
              className="mt-6" 
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state after acceptance
  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-green-600 mb-2">Invitation Accepted!</h2>
            <p className="text-muted-foreground">
              You have successfully joined {verification.details?.workspaceName || verification.details?.boardName}.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Redirecting you to the workspace...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const details = verification.details!
  const contextName = details.workspaceName || details.boardName || 'Unknown'
  const contextType = details.invitation.workspaceId ? 'workspace' : 'board'
  const isMatchingEmail = session?.user?.email === details.invitation.email

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            {contextType === 'workspace' ? (
              <Users className="w-8 h-8 text-primary" />
            ) : (
              <Layout className="w-8 h-8 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">You're Invited!</CardTitle>
          <CardDescription>
            {details.inviterName || details.inviterEmail} has invited you to join a {contextType}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{contextType === 'workspace' ? 'Workspace' : 'Board'}</span>
              <span className="font-semibold">{contextName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Invited by</span>
              <span className="font-semibold">{details.inviterName || details.inviterEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Your role</span>
              <span className="font-semibold capitalize">{details.invitation.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Invited email</span>
              <span className="font-semibold">{details.invitation.email}</span>
            </div>
          </div>

          {!session?.user ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Please sign in first</strong> to accept this invitation. 
                You'll be redirected back here after signing in.
              </p>
            </div>
          ) : !isMatchingEmail ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Email mismatch:</strong> This invitation was sent to <strong>{details.invitation.email}</strong>, 
                but you're currently logged in as <strong>{session.user.email}</strong>. 
                Please sign in with the correct email or ask the inviter to send a new invitation to your current email.
              </p>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {!session?.user ? (
            <Button 
              className="w-full" 
              onClick={() => navigate('/login', { state: { redirect: `/accept-invite/${token}` } })}
            >
              Sign In to Accept
            </Button>
          ) : !isMatchingEmail ? (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/login', { state: { redirect: `/accept-invite/${token}` } })}
            >
              Sign In with Different Account
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => acceptMutation.mutate()}
              disabled={acceptMutation.isPending}
            >
              {acceptMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                'Accept Invitation'
              )}
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            Decline & Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
