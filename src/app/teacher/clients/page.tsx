"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getURL } from "@/lib/utils/url"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, UserPlus, Copy, Check, MessageSquare, Loader2, Sparkles } from "lucide-react"

export default function TeacherClientsPage() {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Invite Form
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [proposedSubject, setProposedSubject] = useState("")
  const [proposedRate, setProposedRate] = useState("")
  const [teachingLevel, setTeachingLevel] = useState("primary")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: clientsData }, { data: invitesData }] = await Promise.all([
        supabase.from("clients").select("*").eq("teacher_id", user.id).order("created_at", { ascending: false }),
        supabase.from("client_invites").select("*").eq("teacher_id", user.id).order("created_at", { ascending: false }),
      ])

      setClients(clientsData || [])
      setInvites(invitesData || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const inviteCode = Math.random().toString(36).substring(2, 10)

      const { data, error } = await supabase
        .from("client_invites")
        .insert({
          teacher_id: user.id,
          invite_code: inviteCode,
          client_name: clientName,
          client_phone: clientPhone,
          proposed_subject: proposedSubject,
          proposed_rate: parseFloat(proposedRate) || 0,
          teaching_level: teachingLevel,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      setInvites([data, ...invites])
      setModalOpen(false)
      // Reset form
      setClientName("")
      setClientPhone("")
      setProposedSubject("")
      setProposedRate("")
    } catch (err: any) {
      alert(err.message || "Failed to create invite")
    } finally {
      setSubmitting(false)
    }
  }

  const copyInviteLink = (code: string) => {
    const link = `${window.location.origin}/invite/${code}`
    navigator.clipboard.writeText(link)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Client Directory</h1>
          <p className="text-muted-foreground mt-1">
            Manage your registered clients and invite existing student pairs.
          </p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite New Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Closed-Beta Client Invite</DialogTitle>
              <DialogDescription>
                Create a custom invite link for your existing client or student pair.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateInvite} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="cName">Client / Parent Name</Label>
                <Input
                  id="cName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Kwesi Mensah"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cPhone">Client Phone Number (WhatsApp)</Label>
                <Input
                  id="cPhone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="024XXXXXXX"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pSubject">Subject / Course</Label>
                  <Input
                    id="pSubject"
                    value={proposedSubject}
                    onChange={(e) => setProposedSubject(e.target.value)}
                    placeholder="e.g. Core Mathematics"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pRate">Rate per Session (GHS)</Label>
                  <Input
                    id="pRate"
                    type="number"
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value)}
                    placeholder="150"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tLevel">Teaching Level</Label>
                <select
                  id="tLevel"
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

              <Button type="submit" className="w-full mt-4" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Generate Invite Link
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invites Section */}
      {invites.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Active Pending Invites ({invites.filter((i) => i.status === "pending").length})
            </CardTitle>
            <CardDescription>
              Share these invite links with your clients to complete their registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-card rounded-lg border border-border gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{inv.client_name}</span>
                      <Badge variant={inv.status === "accepted" ? "default" : "secondary"}>
                        {inv.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {inv.proposed_subject} • GHS {inv.proposed_rate}/session • {inv.client_phone}
                    </p>
                  </div>

                  {inv.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyInviteLink(inv.invite_code)}
                        className="gap-1.5 text-xs"
                      >
                        {copiedCode === inv.invite_code ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copiedCode === inv.invite_code ? "Copied!" : "Copy Link"}
                      </Button>
                      <a
                        href={`https://wa.me/${inv.client_phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi ${inv.client_name}! Please use this link to complete your tutoring registration on Chiron: ${window.location.origin}/invite/${inv.invite_code}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button size="sm" variant="default" className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Send WhatsApp
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Clients List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Clients ({clients.length})
          </CardTitle>
          <CardDescription>
            Active learners and parent clients currently assigned to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex justify-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium text-foreground">No active clients found</p>
              <p className="text-sm mt-1">Use the "Invite New Client" button above to onboard your student pairs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map((client) => (
                <div key={client.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">{client.learner_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Contact: {client.contact_name} ({client.contact_phone})
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">
                      {client.client_type.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                    <span className="capitalize bg-secondary px-2 py-0.5 rounded font-medium text-foreground">
                      Level: {client.teaching_level.replace("_", " ")}
                    </span>
                    <span>Status: {client.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
