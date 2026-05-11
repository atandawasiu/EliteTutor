import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Phone, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [targetExam, setTargetExam] = useState("jamb");
  const [targetCourse, setTargetCourse] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    if (error) {
      setLoading(false);
      toast.error(error.message.includes("already") ? "Account already exists. Please log in." : error.message);
      return;
    }
    // Save extra profile fields after signup (best-effort; auth listener will create the row via trigger)
    try {
      await new Promise(r => setTimeout(r, 400));
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          whatsapp: whatsapp || null,
          country,
          target_course: targetCourse || null,
        }).eq("id", user.id);
      }
    } catch { /* non-blocking */ }
    setLoading(false);
    toast.success("Account created! Welcome to MyPrep.");
    navigate({ to: "/welcome" });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Create your MyPrep account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Start practicing for free — no credit card required</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" required placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="whatsapp" type="tel" placeholder="+234..." value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="pl-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Nigeria","Ghana","Kenya","South Africa","Cameroon","Uganda","Tanzania","Ethiopia","Rwanda","Other"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="exam">Target Exam</Label>
              <Select value={targetExam} onValueChange={setTargetExam}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="jamb">JAMB UTME</SelectItem>
                  <SelectItem value="waec">WAEC SSCE</SelectItem>
                  <SelectItem value="neco">NECO</SelectItem>
                  <SelectItem value="gce">WAEC GCE</SelectItem>
                  <SelectItem value="ielts">IELTS</SelectItem>
                  <SelectItem value="sat">SAT</SelectItem>
                  <SelectItem value="gre">GRE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="course">Course of Interest</Label>
              <div className="relative mt-1.5">
                <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="course" placeholder="e.g. Computer Science" value={targetCourse} onChange={e => setTargetCourse(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} required minLength={8} placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="confirm" type={showPassword ? "text" : "password"} required minLength={8} placeholder="Re-type password" value={confirm} onChange={e => setConfirm(e.target.value)} className="pl-10" />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full gap-2 bg-gradient-hero text-white shadow-hero hover:opacity-90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
