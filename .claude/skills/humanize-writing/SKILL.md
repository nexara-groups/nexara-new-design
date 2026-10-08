---
name: humanize-writing
description: "Audit any text for signs of AI-generated writing and rewrite it to sound natural and human. Use when asked to check if a draft sounds AI-generated, de-AI/humanize text, or find and fix AI writing tells."
---

# Humanize Writing: Audit & Fix

Adapted from Wikipedia's "Signs of AI Writing" field guide (WP:AISIGNS), generalized beyond Wikipedia to any prose: articles, marketing copy, emails, proposals, reports, social posts.

Use this skill in two passes: **audit** the text against the checklists below, quoting the actual offending phrases with a category label, then **rewrite** to fix what you found. Do both passes even if the user only asked for one — a fix without a visible audit hides what changed; an audit without a fix leaves them to do the work.

## Ground rules before you start

- These are *signs*, not proof. A single instance of any one item below is weak evidence. The signal gets strong when several co-occur in the same passage, or when a pattern appears somewhere a careful human wouldn't bother with it (e.g., in a one-line summary or footer).
- Don't flag on these alone — they are **not** reliable AI tells by themselves: perfect grammar, a formal/academic register, unsourced claims, isolated transition words ("Additionally", "Notably"), or oddly placed markup from copy-paste/editor bugs.
- The goal of the rewrite is a piece that reads like it was written by a specific, knowledgeable person — not a thesaurus pass. Swapping "delve" for "explore" and calling it done is itself a tell (see Vocabulary below); fix the underlying pattern, not just the word.
- Preserve every fact, number, name, citation, and the author's actual claims. Never soften or invent specificity you don't have — if the original was vague because the source material is vague, say so plainly rather than manufacturing false precision.

## Pass 1: Audit

Go through the text once per category below. For each hit, quote the exact phrase and note which category it falls under. Compact findings list, most-frequent/strongest patterns first. If nothing in a category applies, skip it silently — don't pad the report with "no issues found in X."

### A. Overused vocabulary ("AI words")
Flag words used more than once, or used even once in a context where a plainer word would do:
additionally (sentence-opener), align with, boasts (meaning "has"), bolstered, crucial, deep dive, delve, emphasizing, enduring, enhance, ensuring, fostering, garner, highlight/highlighting (verb), interplay, intricate/intricacies, key (as filler adjective), landscape (abstract, e.g. "the evolving landscape"), meticulous(ly), pivotal, robust, showcase(ing), tapestry (abstract), testament, underscore(s) (verb), valuable, vibrant, cultivate/cultivating, encompassing, resonate/align with, groundbreaking, renowned, diverse array, in the heart of, nestled.
Grok-flavored variant: causal, empirical, correlate used loosely as scientific-sounding filler.

### B. Sentence-level patterns
- **Avoidance of "is/are/has"**: constructions like *serves as, stands as, functions as, operates as, represents a, boasts/features/maintains/offers a* used in place of a plain "is" or "has" (e.g. "the gallery serves as an exhibition space" instead of "the gallery is an exhibition space"; "ventured into politics as a candidate" instead of "was a candidate").
- **Vague connection-words**: *in connection with, connected to/with, in association with, associated with* used instead of stating the actual relationship directly (who did what, when).
- **Vague attribution / weasel wording**: *industry reports, observers have cited, experts argue, some critics argue, several sources/publications* (when only one or two are actually cited), "such as" preceding a list implied to be non-exhaustive with no evidence more examples exist.
- **Superficial tacked-on analysis**: a present-participle ("-ing") clause bolted onto the end of a sentence that adds no real information — *highlighting/underscoring/emphasizing/reflecting/symbolizing/contributing to/cultivating/fostering ...* Especially suspicious when attached to a named source that plausibly never said anything like it.
- **Undue emphasis on significance/legacy**: sentences whose only content is that something "plays a pivotal/crucial role," "is a testament to," "marks a turning point," "reflects broader trends," "sets the stage for," "leaves an indelible mark," etc., with no concrete claim underneath.
- **Canned notability/coverage language**: *independent coverage, [type] media outlets, trade publications, cited/featured/profiled in, maintains an active social media presence* — describing the existence and category of sources instead of summarizing what they actually say.
- **Promotional/travel-brochure tone**: *boasts a, vibrant, rich, profound, showcasing, exemplifies, commitment to, natural beauty, groundbreaking, renowned, diverse array* — especially in writing that's supposed to be neutral (a bio, a wiki-style entry, a report).
- **Negative parallelism**: "not just X, it's Y"; "not only ... but ..."; "it's not ..., it's ..."; "X rather than Y" used as a rhetorical flourish rather than a real contrast.
- **Rule of three**: reflexive triplets — "innovative, transformative, and groundbreaking" — or three parallel bullet/clause items where two (or a plain list) would say the same thing.
- **Canned "Challenges"/"Future Outlook" close**: a closing paragraph or section that opens with "Despite its [positive spin], X faces several challenges..." and ends on vague optimism or unsupported speculation about the future.
- **Section summaries that restate**: "In summary," "In conclusion," "Overall," followed by a restatement adding no new information.
- **Editorializing asides / didactic disclaimers**: "it's important to note/remember/consider," "worth noting," inserted opinion about the importance of what was just said rather than an actual point.
- **Knowledge-gap speculation dressed as fact**: "while specific details are limited/scarce," "not widely available/documented," "maintains a low profile" — used to paper over missing information instead of just saying "I don't know" or leaving it out.
- **Leftover chatbot phrases**: "I hope this helps," "Of course!," "Certainly!," "You're absolutely right!," "Would you like me to...," "is there anything else," "let me know," "here is a..." — correspondence-style language accidentally left in content.
- **Letter-style phrasing in non-letter content**: "I hope this message finds you well," "Dear [X] Team," "I am writing to..." appearing where no letter was called for.

### C. Formatting tells
- Title Case Applied To Every Word Of Every Heading (vs. sentence case).
- Heading placed at the very top restating the document's own title.
- A heading that contains only sub-headings and no text of its own.
- Mechanical overuse of **bold**, especially bolding the same term every time it appears, or bolding as a substitute for actual emphasis.
- Inline-header vertical lists: "**Bold Label**: description" repeated down a list, especially several in a row, especially in triplets (see Rule of three).
- Em dashes (—) used more than once or twice, especially with spaces around them ( — like this — ) in places a comma, colon, or parenthesis would read more naturally.
- Curly/smart quotes (“ ” ‘ ’) mixed inconsistently with straight quotes in the same piece.
- Emoji used as bullet points or heading decoration in non-casual writing.
- A stray thematic break (---, ***, or a line of underscores/dashes) between sections, left over from Markdown.
- Skipped heading levels (jumping from H1 straight to H3).

### D. Leftover AI-tool artifacts (near-certain proof if present)
These are raw tool output that leaked through copy-paste and should never appear in finished text:
- ChatGPT: `:contentReference[oaicite:...]`, `oai_citation`, `turn0search0`-style tokens, `citeturn...`, `{"attribution":{"attributableIndex":...}}`, `utm_source=chatgpt.com` / `utm_source=openai` in URLs.
- Gemini: `[cite: 1]`, `(start_span)` / `(end_span)`.
- Grok: `grok_card`, `grok_render_citation_card_json`, `referrer=grok.com` in URLs.
- DeepSeek: lenticular brackets with a dagger, e.g. `【85†L261-269】`.
- Perplexity: `[attached_file:1]`, `ppl-ai-file-upload` in URLs.
- Generic: fenced ```` ```wikitext ```` or similar code-fence wrapping around what should be plain prose; a stray "Would you like me to turn this into..." left mid-document.
Delete these outright — they're bugs, not style.

### E. Syntax patterns human writing has more of (their *absence* is the tell — fix by adding these back, not removing them)
- Plain "is/has" constructions: *there is a, it has a*.
- Plain-word choices over stiff synonyms: *wrote* not "authored," *moved* not "relocated," *used* not "utilized," *tried* not "attempted," *died* not "passed away."
- Occasional superlative/definitive claims where actually true: *one of the best, is the only, was the first* (AI text tends to hedge these away even when the source supports them).
- Hedging qualifiers and intensifiers used naturally: *very, perhaps, tends to* (AI text over-smooths these out along with the personality they carry).
- Ordinary wordy human constructions are fine and don't need stripping out: *as a result of, in order to, the fact that* — over-editing these away can make prose sound more machine-polished, not less.

## Pass 2: Rewrite

For each finding, fix the underlying issue rather than pattern-matching a substitution:

1. **Vocabulary hits (A)** — replace with the plainest word that fits, and vary sentence structure around it so it doesn't just become a different flavor of filler.
2. **Sentence patterns (B)** — state the actual fact directly. "The gallery serves as an exhibition space" → "The gallery is an exhibition space." "Sources indicate he was associated with leadership of X" → name what he actually did, if you know it, or cut the sentence if you don't.
3. **Vague attribution / significance / notability filler (B)** — either name the actual source and what it actually says, or delete the sentence. Don't launder "some say X is important" into better prose; cut it.
4. **Rule of three / negative parallelism / canned closers** — break the rhythm. Use two items or four, not always three. Say the plain version of a contrast instead of the rhetorical "not just X, it's Y" shape.
5. **Formatting (C)** — sentence-case headings, remove decorative bold, convert inline-header lists to prose or a plain wikitext/markdown list without bold labels, cut excess em dashes to commas/periods/parens, normalize quote style to one convention, remove stray emoji and thematic breaks.
6. **Artifacts (D)** — delete entirely; if a real citation was intended, ask the user for the actual source rather than guessing.
7. **Syntax (E)** — where you've stripped these away as "errors," put them back where they're true. If something genuinely is the best/first/only, say so plainly.

After rewriting, do a final read for two failure modes specific to this exercise: (a) did the fix just swap one canned phrase for another equally generic one, and (b) did removing hedges/qualifiers make a claim more confident than the source material supports — that's a factual-accuracy regression, not a style win. Fix both before delivering.

## Output

Deliver: (1) a short audit list of what was found, grouped by category, with the offending phrase quoted; (2) the rewritten text; (3) if the rewrite is long, a one-line note on the most consequential changes (not a line-by-line diff narration).

Source: Wikipedia:Signs of AI writing (WP:AISIGNS), adapted for general use — https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing