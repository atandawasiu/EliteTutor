import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles, Upload, Check, X, FileSpreadsheet, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Parsed = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
};

const CHUNK_SIZE = 500;
const MAX_AI_PARSE = 200;

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === "," && !inQuote) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]).map((h) =>
    h.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
  );
  const rows = lines.slice(1).map((l) => parseCsvLine(l));
  return { headers, rows };
}

function csvRowsToParsed(headers: string[], rows: string[][]): Parsed[] {
  return rows
    .filter((r) => r.some((c) => c.trim()))
    .map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = row[i] ?? ""; });

      const question = obj["question"] ?? obj["q"] ?? obj["question_text"] ?? "";
      const optA = obj["option_a"] ?? obj["a"] ?? obj["opt_a"] ?? obj["choice_a"] ?? "";
      const optB = obj["option_b"] ?? obj["b"] ?? obj["opt_b"] ?? obj["choice_b"] ?? "";
      const optC = obj["option_c"] ?? obj["c"] ?? obj["opt_c"] ?? obj["choice_c"] ?? "";
      const optD = obj["option_d"] ?? obj["d"] ?? obj["opt_d"] ?? obj["choice_d"] ?? "";
      const optE = obj["option_e"] ?? obj["e"] ?? obj["opt_e"] ?? obj["choice_e"] ?? "";
      const raw_answer = obj["correct_answer"] ?? obj["answer"] ?? obj["ans"] ?? obj["correct"] ?? "";
      const explanation = obj["explanation"] ?? obj["solution"] ?? obj["rationale"] ?? "";
      const topic = obj["topic"] ?? obj["subject_topic"] ?? obj["chapter"] ?? "";
      const difficulty = (obj["difficulty"] ?? obj["level"] ?? "medium") as Parsed["difficulty"];

      const options = [optA, optB, optC, optD, ...(optE ? [optE] : [])].filter(Boolean);

      let correct_answer = raw_answer.trim();
      if (/^[a-e]$/i.test(correct_answer)) {
        const idx = correct_answer.toUpperCase().charCodeAt(0) - 65;
        correct_answer = options[idx] ?? correct_answer;
      }

      if (!question || options.length < 2) return null;

      return {
        question: question.trim(),
        options,
        correct_answer: correct_answer || options[0],
        explanation: explanation || undefined,
        topic: topic || undefined,
        difficulty: ["easy", "medium", "hard"].includes(difficulty ?? "") ? difficulty : "medium",
      } satisfies Parsed;
    })
    .filter(Boolean) as Parsed[];
}

export function BulkQuestionImporter() {
  const [subjects, setSubjects] = useState<{ id: string; name: string; exams: { name: string } | null }[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [text, setText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsed, setParsed] = useState<Parsed[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRows, setCsvRows] = useState<Parsed[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase
      .from("subjects")
      .select("id, name, exams(name)")
      .order("name")
      .then(({ data }) => setSubjects((data ?? []) as never));
  }, []);

  const callParser = async (body: Record<string, unknown>) => {
    setParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke("parse-questions", { body });
      if (error) throw error;
      const qs = (data?.questions ?? []) as Parsed[];
      if (qs.length === 0) toast.warning("No questions detected — try cleaner text or a different file");
      else { setParsed(qs); toast.success(`Parsed ${qs.length} question${qs.length === 1 ? "" : "s"} via AI`); }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Parse failed");
    } finally {
      setParsing(false);
    }
  };

  const onPasteText = () => {
    if (!text.trim()) { toast.error("Paste some text first"); return; }
    callParser({ text });
  };

  const onPdf = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) { toast.error("PDF too large (max 8MB)"); return; }
    const buf = await file.arrayBuffer();
    let bin = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
    callParser({ pdfBase64: btoa(bin), pdfMime: file.type || "application/pdf" });
  };

  const onCsvSelect = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) { toast.error("CSV too large (max 100MB)"); return; }
    setCsvFile(file);
    const fileText = await file.text();
    const { headers, rows } = parseCsv(fileText);
    if (headers.length === 0) { toast.error("Empty CSV file"); return; }
    const result = csvRowsToParsed(headers, rows);
    if (result.length === 0) {
      toast.error("No valid questions found. Ensure columns: question, option_a, option_b, option_c, option_d, correct_answer");
      return;
    }
    setCsvRows(result);
    toast.success(`Loaded ${result.length.toLocaleString()} questions from CSV. Ready to upload.`);
  };

  const uploadCsv = async () => {
    if (!subjectId) { toast.error("Pick a subject first"); return; }
    if (csvRows.length === 0) { toast.error("No CSV rows loaded"); return; }
    setUploading(true);
    setUploadedCount(0);
    setUploadTotal(csvRows.length);
    setUploadProgress(0);

    let uploaded = 0;
    let failed = 0;

    for (let i = 0; i < csvRows.length; i += CHUNK_SIZE) {
      const chunk = csvRows.slice(i, i + CHUNK_SIZE);
      const rows = chunk.map((p) => ({
        subject_id: subjectId,
        question: p.question,
        options: p.options,
        correct_answer: p.correct_answer,
        explanation: p.explanation ?? null,
        topic: p.topic ?? null,
        difficulty: p.difficulty ?? "medium",
      }));

      const { error } = await supabase.from("questions").insert(rows);
      if (error) {
        failed += chunk.length;
        console.error("Batch error:", error.message);
      } else {
        uploaded += chunk.length;
      }

      setUploadedCount(uploaded);
      setUploadProgress(Math.round(((i + chunk.length) / csvRows.length) * 100));

      await new Promise((r) => setTimeout(r, 20));
    }

    setUploading(false);
    if (failed > 0) {
      toast.warning(`Uploaded ${uploaded.toLocaleString()} questions. ${failed.toLocaleString()} failed.`);
    } else {
      toast.success(`Successfully uploaded ${uploaded.toLocaleString()} questions! 🎉`);
      setCsvRows([]);
      setCsvFile(null);
      if (csvInputRef.current) csvInputRef.current.value = "";
    }
    setUploadProgress(0);
    setUploadedCount(0);
    setUploadTotal(0);
  };

  const removeOne = (i: number) => setParsed(parsed.filter((_, idx) => idx !== i));

  const saveAiParsed = async () => {
    if (!subjectId) { toast.error("Pick a subject"); return; }
    if (parsed.length === 0) { toast.error("Nothing to save"); return; }
    setSaving(true);
    const rows = parsed.map((p) => ({
      subject_id: subjectId,
      question: p.question,
      options: p.options,
      correct_answer: p.correct_answer,
      explanation: p.explanation ?? null,
      topic: p.topic ?? null,
      difficulty: (p.difficulty ?? "medium") as "easy" | "medium" | "hard",
    }));
    const { error } = await supabase.from("questions").insert(rows);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Saved ${rows.length} question${rows.length === 1 ? "" : "s"}`);
      setParsed([]);
      setText("");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── CSV Bulk Upload (1M+ questions) ── */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold mb-1 flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" /> CSV Bulk Upload
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            1M+ Questions
          </span>
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Upload a CSV with columns:{" "}
          {["question", "option_a", "option_b", "option_c", "option_d", "correct_answer"].map((col) => (
            <code key={col} className="rounded bg-secondary px-1 py-0.5 mr-1">{col}</code>
          ))}
          . Optional: <code className="rounded bg-secondary px-1 py-0.5">explanation</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5">topic</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5">difficulty</code>. Max 100MB per file.
        </p>

        <div className="space-y-3">
          <div>
            <Label>Target Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select subject for all questions" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.exams?.name} — {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-5 cursor-pointer hover:bg-secondary/50 transition">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <div className="text-center">
              <p className="text-sm font-medium">{csvFile ? csvFile.name : "Choose CSV file"}</p>
              {csvFile && (
                <p className="text-xs text-muted-foreground">{csvRows.length.toLocaleString()} questions ready</p>
              )}
              {!csvFile && (
                <p className="text-xs text-muted-foreground">Click to browse — handles 1 million+ rows</p>
              )}
            </div>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onCsvSelect(e.target.files[0])}
            />
          </label>

          {csvRows.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {showPreview ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showPreview ? "Hide" : "Preview"} first 5 rows
              </button>
              {showPreview && (
                <div className="rounded-lg bg-secondary p-3 text-xs space-y-2 max-h-48 overflow-y-auto">
                  {csvRows.slice(0, 5).map((q, i) => (
                    <div key={i} className="border-b border-border pb-2 last:border-0">
                      <p className="font-medium">
                        {i + 1}. {q.question.slice(0, 120)}{q.question.length > 120 ? "…" : ""}
                      </p>
                      <p className="text-success font-medium mt-0.5">✓ {q.correct_answer}</p>
                    </div>
                  ))}
                </div>
              )}

              {uploading ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Uploading {uploadedCount.toLocaleString()} / {uploadTotal.toLocaleString()} questions…
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Uploading in batches of {CHUNK_SIZE.toLocaleString()} — do not close this tab
                  </p>
                </div>
              ) : (
                <Button
                  onClick={uploadCsv}
                  disabled={!subjectId || uploading}
                  className="w-full bg-gradient-hero text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {csvRows.length.toLocaleString()} Questions to Supabase
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── AI-powered importer ── */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display font-semibold mb-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> AI-Powered Importer
          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Max {MAX_AI_PARSE} questions
          </span>
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Paste a past paper or upload its PDF — AI extracts every MCQ. Review then save.
        </p>

        <div className="space-y-3">
          <div>
            <Label>Target Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All parsed questions go to this subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.exams?.name} — {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Paste past-paper text</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className="mt-1 font-mono text-xs"
              placeholder={"1. Which of the following...\nA) ...\nB) ...\nC) ...\nD) ...\nAnswer: B"}
            />
            <Button onClick={onPasteText} disabled={parsing || !text.trim()} className="mt-2 w-full">
              {parsing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Parse text with AI
            </Button>
          </div>

          <div>
            <Label>Or upload a PDF</Label>
            <label className="mt-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 cursor-pointer hover:bg-secondary/50 transition">
              <Upload className="h-4 w-4" />
              <span className="text-sm">{parsing ? "Parsing PDF…" : "Choose PDF (max 8MB)"}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={parsing}
                onChange={(e) => e.target.files?.[0] && onPdf(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {parsed.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Preview ({parsed.length})</span>
              <Button
                onClick={saveAiParsed}
                disabled={saving || !subjectId}
                size="sm"
                className="bg-gradient-hero text-white"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Save all
              </Button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {parsed.map((q, i) => (
                <div key={i} className="rounded-lg bg-secondary p-3 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium flex-1">
                      {i + 1}. {q.question}
                    </p>
                    <button
                      onClick={() => removeOne(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <ul className="mt-1 space-y-0.5 text-muted-foreground">
                    {q.options.map((o, oi) => (
                      <li key={oi} className={o === q.correct_answer ? "text-success font-medium" : ""}>
                        {String.fromCharCode(65 + oi)}) {o} {o === q.correct_answer && "✓"}
                      </li>
                    ))}
                  </ul>
                  {q.topic && <p className="mt-1 text-muted-foreground">Topic: {q.topic}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CSV Template Download */}
      <div className="rounded-xl border border-border bg-secondary/30 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 mt-0.5 text-warning-foreground shrink-0" />
          <div className="text-xs">
            <p className="font-medium text-foreground mb-1">CSV Format Guide</p>
            <p className="text-muted-foreground">
              Required: <code>question</code>, <code>option_a</code>…<code>option_d</code>,{" "}
              <code>correct_answer</code> (full text or A/B/C/D letter). Optional:{" "}
              <code>option_e</code>, <code>explanation</code>, <code>topic</code>, <code>difficulty</code>.
            </p>
            <button
              onClick={() => {
                const csv =
                  "question,option_a,option_b,option_c,option_d,correct_answer,explanation,topic,difficulty\n" +
                  '"What is 2+2?","3","4","5","6","4","Basic arithmetic","Mathematics","easy"\n' +
                  '"Capital of Nigeria?","Lagos","Abuja","Kano","Ibadan","Abuja","Federal Capital","Geography","easy"\n';
                const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                const a = document.createElement("a");
                a.href = url;
                a.download = "myprep-questions-template.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary hover:bg-primary/20 transition"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Download CSV template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
