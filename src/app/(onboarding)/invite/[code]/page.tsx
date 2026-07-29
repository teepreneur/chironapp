"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Loader2, UserCheck, CreditCard } from "lucide-react"

export default function ClientInvitePage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params)
  const code = resolvedParams.code
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invite, setInvite] = useState<any>(null)
  const [teacher, setTeacher] = useState<any>(null)
  const [success, setSuccess] = useState(false)

  // Acceptance Form State
  const [clientType, setClientType] = useState<"self_learner" | "parent_guardian">("parent_guardian")
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [learnerName, setLearnerName] = useState("")
  const [teachingLevel, setTeachingLevel] = useState("primary")

  useEffect(() => {
    async function fetchInvite() {
      setLoading(true)
      try {
        const { data: inviteData, error: inviteErr } = await supabase
          .from("client_invites")
          .select("*, profiles(*)")
          .eq("invite_code", code)
          .single()

        if (inviteErr || !inviteData) {
          setError("Invalid or expired invite link.")
          return
        }

        if (inviteData.status !== "pending") {
          setError("This invite code has already been accepted or expired.")
          return
        }

        setInvite(inviteData)
        setTeacher(inviteData.profiles)
        setContactName(inviteData.client_name || "")
        setContactPhone(inviteData.client_phone || "")
        setLearnerName(inviteData.client_name || "")
        if (inviteData.teaching_level) setTeachingLevel(inviteData.teaching_level)
      } catch (err: any) {
        setError(err.message || "Failed to load invite details.")
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      fetchInvite()
    }
  }, [code])

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // 1. Create client record
      const { data: clientRecord, error: clientErr } = await supabase
        .from("clients")
        .insert({
          teacher_id: invite.teacher_id,
          client_type: clientType,
          contact_name: contactName,
          contact_phone: contactPhone,
          learner_name: learnerName,
          teaching_level: teachingLevel,
          invite_code: code,
          status: "active",
        })
        .select()
        .single()

      if (clientErr) throw clientErr

      // 2. Mark invite as accepted
      await supabase
        .from("client_invites")
        .update({ status: "accepted" })
        .eq("id", invite.id)

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to accept invite.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading invite details...</p>
        </div>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-destructive/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 p-3 bg-destructive/10 text-destructive rounded-full w-fit">
              <AlertCircle className="h-6 w-6" />
            </div>
            <CardTitle>Invite Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => router.push("/login")}>Go to Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-emerald-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 p-3 bg-emerald-500/10 text-emerald-600 rounded-full w-fit">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Registration Complete!</CardTitle>
            <CardDescription>
              You have successfully joined as a client of {teacher?.full_name || "your teacher"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Your teacher will schedule your upcoming sessions. You will receive notifications and mobile money payment links for approved classes.
            </p>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Proceed to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Logo size={40} variant="full" className="mx-auto mb-4" />
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Teacher Client Invite
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {teacher?.full_name || "Your Teacher"} has invited you to complete your client profile.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <CardTitle className="text-lg">{invite?.proposed_subject}</CardTitle>
                <CardDescription>Teacher: {teacher?.full_name}</CardDescription>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                GHS {invite?.proposed_rate} / session
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAccept} className="space-y-4">
              <div>
                <Label className="text-sm font-medium">I am registering as:</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setClientType("parent_guardian")}
                    className={`p-3 text-sm rounded-lg border text-center font-medium transition-colors ${
                      clientType === "parent_guardian"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Parent / Guardian
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientType("self_learner")}
                    className={`p-3 text-sm rounded-lg border text-center font-medium transition-colors ${
                      clientType === "self_learner"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    Self Learner
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  placeholder="Full name"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Mobile Money Number (Ghana MoMo)</Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                  placeholder="024XXXXXXX"
                />
              </div>

              {clientType === "parent_guardian" && (
                <div>
                  <Label htmlFor="learnerName">Student / Child Name</Label>
                  <Input
                    id="learnerName"
                    value={learnerName}
                    onChange={(e) => setLearnerName(e.target.value)}
                    required
                    placeholder="Learner's name"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="teachingLevel">Teaching Level</Label>
                <select
                  id="teachingLevel"
                  value={teachingLevel}
                  onChange={(e) => setTeachingLevel(e.target.value)}
                  className="w-full mt-1.5 p-2 rounded-md border border-input bg-background text-sm text-foreground focus:ring-1 focus:ring-primary"
                >
                  <option value="preschool">Preschool & Early Years</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary (JHS / SHS / IGCSE)</option>
                  <option value="university">University / Tertiary</option>
                  <option value="adult_professional">Adult / Professional</option>
                </select>
              </div>

              {error && (
                <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full mt-4" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Accept Invite & Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
