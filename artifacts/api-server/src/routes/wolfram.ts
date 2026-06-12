import { Router } from "express";
import { logger } from "../lib/logger";
import type { Request } from "express";
import type { Logger } from "pino";

// Extend Express Request to include pino logger
declare global {
  namespace Express {
    interface Request {
      log: Logger;
    }
  }
}

const router = Router();

const WOLFRAM_APP_ID = process.env["WOLFRAMALPHA_APP_ID"];

router.get("/wolfram", async (req, res) => {
  if (!WOLFRAM_APP_ID) {
    res.status(503).json({ error: "WolframAlpha not configured" });
    return;
  }

  const query = req.query["q"] as string | undefined;
  if (!query || !query.trim()) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }

  const format = (req.query["format"] as string) || "plaintext";

  try {
    const params = new URLSearchParams({
      appid: WOLFRAM_APP_ID,
      input: query.trim(),
      output: "json",
      format,
    });

    const url = `https://api.wolframalpha.com/v2/query?${params}`;
    req.log.info({ query: query.trim(), format }, "WolframAlpha request");

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      req.log.error({ status: response.status }, "WolframAlpha API error");
      res.status(502).json({ error: "WolframAlpha API request failed" });
      return;
    }

    const data = await response.json();
    const queryResult = data?.queryresult;

    if (!queryResult?.success) {
      res.json({
        success: false,
        pods: [],
        didyoumean: queryResult?.didyoumean ?? [],
        tips: queryResult?.tips ?? [],
      });
      return;
    }

    const pods = (queryResult.pods ?? []).map((pod: Record<string, unknown>) => ({
      title: pod.title,
      id: pod.id,
      position: pod.position,
      subpods: ((pod.subpods ?? []) as Record<string, unknown>[]).map((sp) => ({
        title: sp.title,
        plaintext: sp.plaintext,
        img: sp.img
          ? { src: (sp.img as Record<string, string>).src, alt: (sp.img as Record<string, string>).alt }
          : undefined,
      })),
    }));

    res.json({ success: true, pods, inputstring: queryResult.inputstring });
  } catch (err) {
    logger.error({ err }, "WolframAlpha fetch error");
    res.status(502).json({ error: "Failed to reach WolframAlpha" });
  }
});

router.get("/wolfram/simple", async (req, res) => {
  if (!WOLFRAM_APP_ID) {
    res.status(503).json({ error: "WolframAlpha not configured" });
    return;
  }

  const query = req.query["q"] as string | undefined;
  if (!query || !query.trim()) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }

  try {
    const params = new URLSearchParams({
      appid: WOLFRAM_APP_ID,
      i: query.trim(),
    });

    const response = await fetch(
      `https://api.wolframalpha.com/v1/result?${params}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!response.ok) {
      res.status(502).json({ error: "WolframAlpha Simple API failed" });
      return;
    }

    const text = await response.text();
    res.json({ result: text });
  } catch (err) {
    logger.error({ err }, "WolframAlpha simple fetch error");
    res.status(502).json({ error: "Failed to reach WolframAlpha" });
  }
});

export default router;
