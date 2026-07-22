import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = "https://theaiexplainer.com";
const lastmod = "2026-07-20";
const reviewed = "July 20, 2026";
const adClient = "ca-pub-3430860743061587";
const assetVersion = "20260722-4";

function writeFile(relativePath, content) {
  const absolutePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content.trimStart() + "\n", "utf8");
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function canonicalPath(relativePath) {
  if (relativePath === "index.html") return "/";
  return `/${relativePath.replace(/\\/g, "/")}`;
}

function head({ title, description, relativePath, type = "website", article }) {
  const canonical = `${baseUrl}${canonicalPath(relativePath)}`;
  const jsonLd = article
    ? `<script type="application/ld+json">${escapeJson({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        dateModified: lastmod,
        datePublished: "2026-07-20",
        author: {
          "@type": "Organization",
          name: "The AI Explainer Editorial Desk",
        },
        publisher: {
          "@type": "Organization",
          name: "The AI Explainer",
          url: baseUrl,
        },
        mainEntityOfPage: canonical,
      })}</script>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="google-adsense-account" content="${adClient}" />
    <meta name="theme-color" content="#0f766e" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${relativePath.includes("/") ? "../" : ""}styles.css?v=${assetVersion}" />
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}" crossorigin="anonymous"></script>
    <script defer src="${relativePath.includes("/") ? "../" : ""}script.js?v=${assetVersion}"></script>
    ${jsonLd}
  </head>`;
}

function header(active, prefix = "") {
  const is = (name) => (active === name ? ` aria-current="page"` : "");
  return `<header class="site-header">
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="header-inner">
        <a class="brand" href="${prefix}index.html" aria-label="The AI Explainer home">
          <span class="brand-mark" aria-hidden="true">AI</span>
          <span>The AI Explainer</span>
        </a>
        <nav class="site-nav" aria-label="Main navigation">
          <a href="${prefix}articles.html"${is("articles")}>Guides</a>
          <a href="${prefix}tools.html"${is("tools")}>Tools</a>
          <a href="${prefix}about.html"${is("about")}>About</a>
          <a href="${prefix}contact.html"${is("contact")}>Contact</a>
        </nav>
      </div>
    </header>`;
}

function footer(prefix = "") {
  return `<footer class="site-footer">
      <div class="footer-inner">
        <div>
          <strong>The AI Explainer</strong>
          <p>Plain-English AI guides for everyday work, study, privacy, and better judgment.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="${prefix}about.html">About</a>
          <a href="${prefix}editorial-policy.html">Editorial Policy</a>
          <a href="${prefix}privacy.html">Privacy Policy</a>
          <a href="${prefix}terms.html">Terms</a>
          <a href="${prefix}copyright.html">Copyright</a>
          <a href="${prefix}contact.html">Contact</a>
        </nav>
      </div>
    </footer>`;
}

const articles = [
  {
    slug: "what-is-artificial-intelligence",
    category: "AI Basics",
    title: "What Is Artificial Intelligence? A Plain-English Guide",
    seoTitle: "What Is Artificial Intelligence? | The AI Explainer",
    description:
      "A clear beginner explanation of artificial intelligence, how it differs from normal software, and where human judgment still matters.",
    read: "8 min read",
    intro:
      "Artificial intelligence is software designed to perform tasks that normally require human-like judgment, pattern recognition, language understanding, planning, or prediction. It is not magic, and it is not a person. It is a system trained or designed to produce useful outputs from inputs.",
    points: ["AI finds patterns", "It does not understand like a person", "Useful output still needs review"],
    sections: [
      {
        heading: "The short answer",
        body: `<p>Artificial intelligence, often shortened to AI, is a broad name for computer systems that can recognize patterns, make predictions, classify information, generate content, or support decisions. A spam filter uses AI-like techniques to decide whether a message looks suspicious. A photo app may use AI to group pictures by faces or objects. A modern chatbot uses AI to generate answers in natural language.</p>
        <p>The important point is that AI works from data, rules, examples, probabilities, and feedback. It can look surprisingly fluent, but fluency is not the same as understanding, responsibility, or truth.</p>`,
      },
      {
        heading: "How AI is different from ordinary software",
        body: `<p>Traditional software usually follows instructions written by developers. If this happens, do that. AI systems often learn patterns from examples instead. A model trained on many support tickets can learn what a billing complaint tends to look like. A language model trained on huge amounts of text can learn what a helpful answer often sounds like.</p>
        <p>This makes AI flexible, but it also makes AI less predictable than a simple calculator. The same prompt can produce different wording. A confident answer can contain a mistake. A useful summary can leave out the one detail your decision depends on.</p>`,
      },
      {
        heading: "Common types of AI you may meet",
        body: `<ul>
          <li><strong>Recommendation systems:</strong> suggest videos, products, songs, or articles based on patterns.</li>
          <li><strong>Classification systems:</strong> sort emails, images, documents, leads, or support requests into categories.</li>
          <li><strong>Prediction systems:</strong> estimate likely outcomes such as demand, risk, churn, or delivery time.</li>
          <li><strong>Generative AI:</strong> creates text, images, code, audio, summaries, and drafts from instructions.</li>
        </ul>`,
      },
      {
        heading: "Where beginners go wrong",
        body: `<p>The biggest beginner mistake is treating AI as an authority instead of a tool. AI can help you start, compare, rewrite, summarize, brainstorm, and notice patterns. It should not quietly replace your responsibility to check names, numbers, sources, private information, legal obligations, or final decisions.</p>
        <p>A better habit is to ask, "What job am I giving this system, and what part must I still verify myself?" That one question turns AI from a black box into a workflow choice.</p>`,
      },
      {
        heading: "A simple way to think about AI",
        body: `<p>Use AI when the cost of a first draft is high and the cost of review is reasonable. Avoid relying on AI when the cost of a mistake is high and you cannot independently verify the answer. That is why AI can be excellent for drafting a meeting summary, but risky for giving final advice about a contract, a diagnosis, or a financial decision.</p>`,
      },
    ],
    takeaway:
      "AI is best understood as pattern-based software that can assist work. It becomes safer and more useful when people keep context, verification, and final judgment in the loop.",
  },
  {
    slug: "what-is-generative-ai",
    category: "AI Basics",
    title: "What Is Generative AI?",
    description:
      "A beginner-friendly explanation of generative AI, what it can create, why it can be useful, and why every output still needs review.",
    read: "7 min read",
    intro:
      "Generative AI is AI that creates new content from instructions. It can draft text, summarize documents, write code, generate images, produce outlines, and turn rough ideas into a first version.",
    points: ["Creates new outputs", "Learns from patterns", "Needs human editing"],
    sections: [
      {
        heading: "The short answer",
        body: `<p>Generative AI creates a response instead of choosing from a small list of saved answers. When you ask it to write an email, it predicts a likely email based on your instruction and the patterns it learned during training. When you ask for an image, it creates pixels that match the prompt. When you ask for code, it generates code that resembles useful examples it has learned from.</p>
        <p>The result may be helpful, but it is not guaranteed to be true, original, complete, private, or appropriate for your situation.</p>`,
      },
      {
        heading: "What generative AI is useful for",
        body: `<ul>
          <li>Drafting emails, outlines, summaries, checklists, and first versions.</li>
          <li>Rewriting text for clarity, tone, or structure.</li>
          <li>Explaining a topic at a simpler or more advanced level.</li>
          <li>Creating study questions, examples, and practice conversations.</li>
          <li>Turning messy notes into organized next steps.</li>
        </ul>`,
      },
      {
        heading: "What it is not",
        body: `<p>Generative AI is not a source by itself. It may mention facts without showing where they came from. It may mix correct information with invented details. It may sound calm and professional while misunderstanding the task. That is why you should treat output as a draft or assistant response, not as final proof.</p>
        <p>If a claim matters, verify it with a reliable source. If private information matters, remove it before prompting. If the decision matters, involve a qualified person.</p>`,
      },
      {
        heading: "A practical example",
        body: `<p>Imagine you need to write a difficult customer email. A weak use of generative AI is: "Reply to this customer," followed by the full private thread. A stronger use is: "Draft a calm reply to a customer who received a delayed order. Apologize, give a revised delivery window, and avoid making promises about refunds." The second prompt gives the model the job without exposing unnecessary information.</p>`,
      },
      {
        heading: "The best beginner habit",
        body: `<p>Ask generative AI for options, not final decisions. Request three versions, a checklist, a critique, or questions you should answer before sending. This keeps you in control and makes the model useful without giving it authority it does not deserve.</p>`,
      },
    ],
    takeaway:
      "Generative AI is most reliable as a drafting and thinking partner. It saves time when you review, edit, and verify the output before using it.",
  },
  {
    slug: "large-language-models-explained",
    category: "AI Basics",
    title: "Large Language Models Explained in Plain English",
    description:
      "A simple explanation of large language models, tokens, training data, prompts, context windows, and why fluent answers can still be wrong.",
    read: "9 min read",
    intro:
      "A large language model, or LLM, is an AI model trained to work with language. It predicts and generates text based on patterns it learned from large collections of writing and code.",
    points: ["Predicts language", "Uses context", "Fluency is not proof"],
    sections: [
      {
        heading: "The short answer",
        body: `<p>A large language model is a system that takes text input and produces text output. It does this by estimating what words, phrases, or structures are likely to come next. Modern LLMs can follow instructions, answer questions, summarize text, translate, write code, and explain ideas because language contains many patterns about how people describe tasks.</p>
        <p>The model is "large" because it has many learned parameters and was trained on very large datasets. Large does not mean perfect. It means the system has absorbed many patterns, including useful patterns, outdated patterns, biased patterns, and patterns that can lead to plausible mistakes.</p>`,
      },
      {
        heading: "What tokens are",
        body: `<p>LLMs do not usually read text exactly the way people do. They break text into pieces called tokens. A token may be a word, part of a word, a number, or punctuation. The model processes these tokens and predicts likely next tokens.</p>
        <p>This is one reason long prompts can become expensive or confusing. The model has a limited context window, which is the amount of text it can consider at once. Important instructions buried in a large prompt can be weakened by surrounding noise.</p>`,
      },
      {
        heading: "Why LLMs can answer many topics",
        body: `<p>Language is connected to almost every field. Recipes, contracts, software documentation, essays, emails, lesson plans, reviews, and support tickets all contain reusable structures. LLMs learn those structures. That is why the same model can draft a polite email, explain a spreadsheet formula, and outline a lesson.</p>
        <p>However, knowing the shape of an answer is not the same as knowing whether the answer is true in your situation.</p>`,
      },
      {
        heading: "Why confident mistakes happen",
        body: `<p>An LLM is optimized to produce likely and helpful text, not to feel doubt like a person. If your question asks for a fact it does not have, it may still produce a smooth answer. If your prompt contains a false assumption, it may continue from that assumption. If the topic changed recently, the model may be outdated unless it can browse or use trusted external sources.</p>`,
      },
      {
        heading: "How to use LLMs better",
        body: `<ul>
          <li>Give the model a clear task, audience, and output format.</li>
          <li>Separate facts from instructions.</li>
          <li>Ask it to list assumptions and uncertainty.</li>
          <li>Verify names, numbers, dates, citations, and policies elsewhere.</li>
          <li>Do not paste confidential data unless your tool and policy allow it.</li>
        </ul>`,
      },
    ],
    takeaway:
      "An LLM is powerful because it works with language patterns. It is safest when you use it for drafts, transformations, and explanations while checking important facts yourself.",
  },
  {
    slug: "rag-explained-plain-english",
    category: "AI Basics",
    title: "RAG Explained in Plain English",
    description:
      "A beginner explanation of retrieval-augmented generation, why it helps AI answer with documents, and what can still go wrong.",
    read: "8 min read",
    intro:
      "RAG stands for retrieval-augmented generation. It is a way to help an AI answer using external information, such as documents, help articles, policies, notes, or a database.",
    points: ["Retrieves context", "Generates an answer", "Still needs source checks"],
    sections: [
      {
        heading: "The short answer",
        body: `<p>RAG combines two steps. First, the system retrieves relevant information from a source you provide or connect. Second, a generative AI model uses that retrieved information to answer the question. Instead of asking the model to rely only on what it learned during training, RAG gives it current or private context at the moment of the request.</p>`,
      },
      {
        heading: "A simple workplace example",
        body: `<p>Suppose a company has a 60-page employee handbook. A normal chatbot may not know the handbook. A RAG system can search the handbook for passages about leave policy, send the relevant passages to the model, and ask the model to answer in plain English.</p>
        <p>This can be useful because the answer is grounded in a specific document. It is also easier to show the passages used, which helps reviewers check the response.</p>`,
      },
      {
        heading: "Why RAG is not automatic truth",
        body: `<p>RAG improves grounding, but it does not remove every risk. The retrieval step can pull the wrong section. The source document can be outdated. The model can summarize a passage too broadly. The answer can miss exceptions hidden elsewhere in the document.</p>
        <p>For important use cases, the system should show sources, timestamps, document owners, and confidence boundaries. A good answer should make it easy to inspect where it came from.</p>`,
      },
      {
        heading: "When RAG is useful",
        body: `<ul>
          <li>Answering questions from company policies, product docs, or support content.</li>
          <li>Summarizing a collection of notes or reports.</li>
          <li>Helping employees find internal knowledge faster.</li>
          <li>Reducing outdated answers by using current documents.</li>
        </ul>`,
      },
      {
        heading: "Questions to ask before trusting a RAG answer",
        body: `<p>Ask what sources were searched, whether the answer cites exact passages, when those sources were updated, and whether the system ignored any documents. If the tool cannot show its sources, treat the answer as a helpful lead, not a final answer.</p>`,
      },
    ],
    takeaway:
      "RAG helps AI answer from selected information, but source quality, retrieval quality, and human review still decide whether the answer is trustworthy.",
  },
  {
    slug: "ai-agents-explained",
    category: "AI Basics",
    title: "What Is an AI Agent?",
    description:
      "A clear explanation of AI agents, how they differ from chatbots, and what to check before letting them take actions.",
    read: "8 min read",
    intro:
      "An AI agent is an AI system that can pursue a goal through multiple steps, often using tools, memory, files, browsers, apps, or APIs along the way.",
    points: ["Has a goal", "Uses tools", "Needs boundaries"],
    sections: [
      {
        heading: "The short answer",
        body: `<p>A basic chatbot responds to a prompt. An AI agent can plan a sequence of actions, use tools, observe results, and continue until it reaches a goal or hits a limit. For example, an agent might research vendors, compare prices, draft an email, and prepare a summary.</p>
        <p>The word "agent" is used broadly, so it is worth asking what the system can actually do. Some agents only draft steps. Others can browse, edit files, send messages, update records, or spend money.</p>`,
      },
      {
        heading: "Why agents feel powerful",
        body: `<p>Agents reduce the amount of manual switching between apps. Instead of asking ten separate questions, you can state a goal. The system can decide which information it needs, call tools, and revise its plan. This is useful for repetitive tasks, research workflows, data cleanup, and operational checklists.</p>`,
      },
      {
        heading: "The risk is action",
        body: `<p>The more an AI can do, the more important permissions become. A wrong answer is one problem. A wrong action is another. If an agent can email customers, delete files, change settings, or submit forms, mistakes can leave the chat window and affect real people.</p>
        <p>Good agent design includes confirmations, logs, undo options, narrow permissions, and clear boundaries around money, private data, and external communication.</p>`,
      },
      {
        heading: "Safe beginner uses",
        body: `<ul>
          <li>Ask an agent to draft a plan before it takes action.</li>
          <li>Use it to organize public research, not private records.</li>
          <li>Let it create a checklist, then approve each step yourself.</li>
          <li>Start with read-only access before granting write access.</li>
        </ul>`,
      },
      {
        heading: "A review checklist",
        body: `<p>Before using an agent, ask: What tools can it access? What actions can it take without approval? Can I see a log? Can I stop it? Can I undo changes? Does it handle confidential data? If those answers are unclear, keep the task manual or lower the agent's permissions.</p>`,
      },
    ],
    takeaway:
      "AI agents are useful because they can act across steps. They become risky when permissions are broad and review is weak.",
  },
  {
    slug: "prompt-engineering-explained",
    category: "Prompts",
    title: "Prompt Engineering Explained Without the Hype",
    description:
      "A practical guide to writing prompts that give AI a clear task, enough context, and useful boundaries without making prompts unnecessarily long.",
    read: "8 min read",
    intro:
      "Prompt engineering is the practice of giving AI clear instructions, context, examples, and boundaries so the output is easier to use and easier to check.",
    points: ["Define the job", "Give useful context", "Set review boundaries"],
    sections: [
      {
        heading: "The short answer",
        body: `<p>A prompt is not a magic phrase. It is a work request. Better prompts tell the AI what role to play, what output to produce, who the audience is, what information to use, what to avoid, and how the result will be judged.</p>
        <p>Longer prompts are not automatically better. A clear short prompt beats a long prompt filled with conflicting instructions.</p>`,
      },
      {
        heading: "A simple prompt structure",
        body: `<ol>
          <li><strong>Task:</strong> What should the AI do?</li>
          <li><strong>Context:</strong> What does it need to know?</li>
          <li><strong>Audience:</strong> Who will read or use the output?</li>
          <li><strong>Format:</strong> Should it produce bullets, a table, an email, or a checklist?</li>
          <li><strong>Boundaries:</strong> What should it avoid or flag?</li>
        </ol>`,
      },
      {
        heading: "Example",
        body: `<p>Weak prompt: "Write this better."</p>
        <p>Stronger prompt: "Rewrite this update for a busy project manager. Keep it under 120 words, use a calm professional tone, keep the delivery date unchanged, and flag any sentence that sounds like a promise we cannot guarantee."</p>`,
      },
      {
        heading: "Ask for uncertainty",
        body: `<p>For research or decisions, ask the model to separate what it knows from what it is assuming. You can say: "List assumptions before the answer," or "If a fact depends on current policy or pricing, tell me to verify it." This reduces the chance that a polished answer hides weak ground.</p>`,
      },
      {
        heading: "Keep control",
        body: `<p>The best prompts do not make the model responsible for your judgment. They make the model easier to supervise. Ask for drafts, options, critiques, checklists, and questions. Then decide what belongs in the final work.</p>`,
      },
    ],
    takeaway:
      "Prompt engineering is less about secret wording and more about clear work design: job, context, format, limits, and review.",
  },
  {
    slug: "how-to-use-ai-without-losing-your-judgment",
    category: "AI at Work",
    title: "How to Use AI Without Losing Your Judgment",
    description:
      "A practical guide for using AI as a drafting and thinking tool while keeping human review, context, and responsibility in the loop.",
    read: "9 min read",
    intro:
      "AI is most useful when it makes thinking easier to inspect, not when it quietly replaces thinking. The goal is to use the tool without handing over judgment.",
    points: ["Use AI for drafts", "Review important claims", "Keep final responsibility"],
    sections: [
      {
        heading: "Start with the job, not the tool",
        body: `<p>Before opening an AI tool, name the task. Are you trying to summarize, rewrite, compare, brainstorm, extract action items, or check for gaps? A clear job makes the output easier to judge. A vague request like "help me with this" often produces a vague answer that feels useful but does not move the work forward.</p>`,
      },
      {
        heading: "Use AI where review is easy",
        body: `<p>AI is strong when you can quickly review the result: rewriting an email, turning notes into an agenda, listing possible questions, or making a rough outline. It is weaker when the answer depends on current facts, private context, legal meaning, medical details, financial risk, or a person's safety.</p>
        <p>The practical rule is simple: if you cannot check the output, do not rely on it.</p>`,
      },
      {
        heading: "Ask for alternatives",
        body: `<p>One answer can make you passive. Three options make you compare. Ask for a concise version, a warmer version, and a more direct version. Ask for risks and tradeoffs. Ask what a skeptical reviewer would question. This turns the model into a way to widen your thinking instead of narrowing it.</p>`,
      },
      {
        heading: "Keep private context out when it is not needed",
        body: `<p>Many tasks do not require the original private document. You can describe the situation in generic terms, remove names, replace exact numbers with ranges, and ask for a template. Add detail only when it is necessary and allowed by your tool, workplace, and policy.</p>`,
      },
      {
        heading: "Make a final human pass",
        body: `<p>Before sending, publishing, or deciding, check the facts, tone, names, dates, numbers, assumptions, missing context, and audience. The final version should sound like something you understand and can defend. If you would not be comfortable explaining why it is correct, it is not ready.</p>`,
      },
    ],
    takeaway:
      "Use AI to produce drafts, options, and questions. Keep responsibility for facts, tone, privacy, and final decisions with a person.",
  },
  {
    slug: "check-ai-answers-before-you-trust-them",
    category: "Safety",
    title: "How to Check an AI Answer Before You Trust It",
    description:
      "A practical verification process for AI answers, including facts, sources, assumptions, numbers, dates, and hidden uncertainty.",
    read: "8 min read",
    intro:
      "AI answers often sound more certain than they are. A simple checking habit helps you keep useful suggestions while catching the mistakes that matter.",
    points: ["Check claims", "Verify sources", "Test assumptions"],
    sections: [
      {
        heading: "Start by finding the claims",
        body: `<p>Read the answer and highlight anything that could be true or false: names, numbers, dates, rules, definitions, quotes, prices, comparisons, and recommendations. These are claims. Claims need checking. Style suggestions and brainstorming ideas need judgment, but factual claims need evidence.</p>`,
      },
      {
        heading: "Ask where the answer came from",
        body: `<p>If the tool provides sources, open them and confirm that they actually support the claim. Do not trust a citation just because it exists. A source can be outdated, unrelated, misread, or too weak for the conclusion. If the tool does not provide sources, treat factual output as a lead to investigate.</p>`,
      },
      {
        heading: "Watch for current information",
        body: `<p>Some answers change quickly: prices, product features, laws, visa rules, tax rules, software interfaces, sports schedules, company leadership, and medical guidance. If the answer depends on time, verify it against a current primary source before using it.</p>`,
      },
      {
        heading: "Check numbers separately",
        body: `<p>AI can make arithmetic mistakes and can also use the wrong assumptions. Recalculate important numbers yourself. For tables, check totals, units, currencies, date ranges, percentages, and whether rows are missing. A clean-looking table can still be wrong.</p>`,
      },
      {
        heading: "Use a skeptical second prompt",
        body: `<p>After receiving an answer, ask: "What assumptions did you make? What could be wrong? What should I verify independently?" This does not prove the answer, but it often reveals weak areas. Then verify those areas outside the model.</p>`,
      },
    ],
    takeaway:
      "Trust AI answers only after you identify the claims, verify important facts, and decide whether the remaining uncertainty is acceptable.",
  },
  {
    slug: "ai-privacy-checklist-before-you-paste",
    category: "Privacy",
    title: "A Privacy Checklist Before You Paste Text Into AI",
    description:
      "A practical privacy checklist for deciding what text, documents, and business context should or should not be pasted into AI tools.",
    read: "7 min read",
    intro:
      "The easiest AI mistake is also the quietest: sending more context than the task needs. A privacy-aware workflow starts before the prompt is written.",
    points: ["Remove identifiers", "Use only needed context", "Escalate sensitive material"],
    sections: [
      {
        heading: "Ask whether the original text belongs there",
        body: `<p>A prompt can feel informal, but it is still a transfer of information to a system you may not fully control. Before pasting, ask whether the task requires the original material. Often the model only needs a sanitized version: the structure of a complaint, the goal of a clause, or the tone of a message with names removed.</p>`,
      },
      {
        heading: "Remove identifiers first",
        body: `<p>Names are only one type of identifier. Email addresses, phone numbers, addresses, customer IDs, invoice numbers, order histories, device IDs, small team names, and unique combinations of details can all identify a person or organization.</p>
        <ul>
          <li>Replace real names with roles such as customer, manager, or vendor.</li>
          <li>Swap exact amounts for ranges when precision is not needed.</li>
          <li>Remove links to private files, dashboards, and documents.</li>
          <li>Keep credentials, tokens, passwords, and recovery codes out completely.</li>
        </ul>`,
      },
      {
        heading: "Separate personal risk from business risk",
        body: `<p>Personal material can harm one person. Business material can harm a company, customer, partner, employee, or negotiation. Treat unreleased strategy, pricing, legal drafts, source code, incident reports, personnel records, and customer data as sensitive even when no single sentence looks dramatic.</p>`,
      },
      {
        heading: "Use a staged prompt",
        body: `<p>Start with a generic version of the task. If the answer is too vague, add a short sanitized excerpt. If the task still requires private detail, pause and check whether your tool, account settings, employer, client agreement, or law allows that data to be used.</p>`,
      },
      {
        heading: "When in doubt, pause",
        body: `<p>If the material involves a customer, patient, student, employee, private contract, security issue, financial record, or legal matter, get the right approval before using it with AI. A slower workflow is better than a disclosure you cannot undo.</p>`,
      },
    ],
    takeaway:
      "Privacy is not only about hiding secrets. It is about limiting context to what the task actually requires.",
  },
  {
    slug: "what-ai-is-good-at-and-bad-at",
    category: "AI at Work",
    title: "What AI Is Good At, and What It Still Handles Badly",
    description:
      "A plain-language map of tasks AI can speed up, tasks it can distort, and how to decide whether AI belongs in a workflow.",
    read: "8 min read",
    intro:
      "AI can save time, but it does not help every task equally. The best uses have clear review paths. The riskiest uses hide uncertainty behind polished language.",
    points: ["Great for drafts", "Weak at accountability", "Risk depends on review"],
    sections: [
      {
        heading: "What AI is usually good at",
        body: `<ul>
          <li>Turning rough notes into a structured draft.</li>
          <li>Rewriting text for clarity, tone, or length.</li>
          <li>Creating checklists, outlines, and example scenarios.</li>
          <li>Summarizing documents when a person can check the result.</li>
          <li>Explaining unfamiliar concepts in simpler language.</li>
        </ul>`,
      },
      {
        heading: "What AI handles badly",
        body: `<p>AI struggles when the answer depends on exact truth, fresh information, private context, accountability, or values. It may invent citations, miss exceptions, assume facts not in evidence, or produce a generic answer that ignores the situation. It can also make sensitive work seem easier than it is.</p>`,
      },
      {
        heading: "The review-cost test",
        body: `<p>Ask how hard it will be to review the output. If reviewing takes less time than creating from scratch, AI may help. If reviewing requires expertise you do not have, AI may create false confidence. For example, using AI to draft a polite refund email is easy to review. Using AI to interpret a contract clause is not easy if you are not qualified to evaluate the clause.</p>`,
      },
      {
        heading: "The mistake-cost test",
        body: `<p>Ask what happens if the answer is wrong. Low-cost mistakes can be fixed: awkward wording, incomplete brainstorms, rough outlines. High-cost mistakes can harm people, money, reputation, safety, or compliance. The higher the cost, the more you need expert review and reliable sources.</p>`,
      },
      {
        heading: "A balanced workflow",
        body: `<p>Use AI early when exploring and drafting. Use people late when deciding and approving. This keeps speed where it helps and judgment where it matters.</p>`,
      },
    ],
    takeaway:
      "AI is strongest for starting, reshaping, and checking work. It is weakest when it must be the final authority.",
  },
  {
    slug: "ai-hallucinations-are-a-workflow-problem",
    category: "Safety",
    title: "AI Hallucinations Are a Workflow Problem",
    description:
      "Why AI tools sometimes produce invented answers, why the mistakes are hard to spot, and how better workflows reduce the damage.",
    read: "8 min read",
    intro:
      "An AI hallucination is an answer that sounds plausible but contains invented or unsupported information. The fix is not only a better prompt. It is a better workflow.",
    points: ["Plausible can be false", "Sources matter", "Workflow reduces harm"],
    sections: [
      {
        heading: "What a hallucination looks like",
        body: `<p>A hallucination can be a fake citation, a wrong date, an invented feature, a made-up policy, or a confident explanation of something that is not true. The danger is that the answer often looks polished. It may use professional wording and a clean structure, which makes the mistake easier to miss.</p>`,
      },
      {
        heading: "Why it happens",
        body: `<p>Generative AI produces likely language. If the prompt asks for information the model does not have, it may still produce something that fits the pattern of an answer. It can also combine fragments from different contexts or follow a false assumption in the prompt.</p>`,
      },
      {
        heading: "Why prompts are not enough",
        body: `<p>You can ask a model to be accurate, cite sources, or say when it is unsure. That helps, but it does not guarantee truth. A model can still cite a weak source, misunderstand a source, or sound certain. Verification cannot be replaced by a sentence in the prompt.</p>`,
      },
      {
        heading: "Build checks into the process",
        body: `<ul>
          <li>Use AI for drafts, not final factual authority.</li>
          <li>Ask for sources when facts matter.</li>
          <li>Open sources and compare the exact claim.</li>
          <li>Verify dates, names, numbers, and quotes separately.</li>
          <li>Keep a human approval step before publication or action.</li>
        </ul>`,
      },
      {
        heading: "When hallucinations matter most",
        body: `<p>Hallucinations are especially risky in law, medicine, finance, academic work, hiring, public claims, customer promises, security, and anything involving real people. In those settings, the workflow must assume the model can be wrong.</p>`,
      },
    ],
    takeaway:
      "Hallucinations are managed by source checks, human review, and careful task choice. Better prompts help, but workflow matters more.",
  },
  {
    slug: "use-ai-at-work-without-sounding-generic",
    category: "AI at Work",
    title: "Use AI at Work Without Sounding Generic",
    description:
      "How to use AI for emails, summaries, and drafts without losing your voice, context, or practical judgment.",
    read: "7 min read",
    intro:
      "AI writing often fails because it removes the very details that make workplace communication useful: context, audience, decision, and voice.",
    points: ["Keep context", "Edit voice", "Remove filler"],
    sections: [
      {
        heading: "The generic AI pattern",
        body: `<p>Generic AI writing often starts with broad praise, uses vague transitions, avoids hard tradeoffs, and sounds more formal than the situation requires. It may be grammatically correct while saying very little. At work, that creates friction because people need clear decisions, owners, dates, and next steps.</p>`,
      },
      {
        heading: "Give the model real constraints",
        body: `<p>Instead of asking for a better email, specify the audience, relationship, purpose, tone, length, and what cannot be promised. For example: "Write a direct update for a client. Keep it under 140 words. Say the report will arrive Friday. Do not blame the vendor. End with one clear next step."</p>`,
      },
      {
        heading: "Add details after the first draft",
        body: `<p>Use AI to get structure, then add the human details: the actual decision, the specific date, the real concern, the reason the recipient cares, and the sentence that sounds like you. This is faster than writing from a blank page and better than sending untouched AI output.</p>`,
      },
      {
        heading: "Cut filler aggressively",
        body: `<p>Remove phrases such as "I hope this message finds you well" when they do not fit. Delete abstract claims like "in today's fast-paced world." Replace "we are committed to ensuring a seamless experience" with the actual action you will take.</p>`,
      },
      {
        heading: "Use AI as an editor",
        body: `<p>One strong prompt is: "Make this clearer and shorter, but preserve my meaning and do not add claims." This keeps AI in an editing role. It improves readability without inventing commitments.</p>`,
      },
    ],
    takeaway:
      "AI can improve workplace writing when you keep the real context, edit the voice, and remove generic filler before sending.",
  },
  {
    slug: "write-ai-prompts-that-keep-you-in-control",
    category: "Prompts",
    title: "Write AI Prompts That Keep You in Control",
    description:
      "A practical prompt-writing method that gives AI a job, a boundary, and a way to be checked.",
    read: "8 min read",
    intro:
      "A better prompt is not longer by default. It gives the model a job, a boundary, and a way to be checked.",
    points: ["Job", "Boundary", "Check"],
    sections: [
      {
        heading: "Use the job-boundary-check pattern",
        body: `<p>Start with the job: what should the AI produce? Add the boundary: what should it avoid, preserve, or flag? Add the check: how should you evaluate the result? This pattern works for emails, summaries, research, policy drafts, and learning prompts.</p>`,
      },
      {
        heading: "Example for a summary",
        body: `<p>Weak prompt: "Summarize this."</p>
        <p>Controlled prompt: "Summarize these notes for a project lead. Use five bullets. Keep action items separate from background. Do not invent owners or dates. If an owner is missing, write 'owner not stated'."</p>`,
      },
      {
        heading: "Example for a decision",
        body: `<p>Instead of asking, "What should we do?" ask: "List three options, the tradeoff for each, the information still missing, and the decision that would be easiest to reverse." This keeps you from accepting a single confident recommendation too quickly.</p>`,
      },
      {
        heading: "Use negative instructions carefully",
        body: `<p>Instructions like "do not be vague" are less useful than specific standards. Say "include dates, owners, and next steps where provided." Say "if the source does not include a number, do not estimate one." Specific boundaries are easier for the model to follow and easier for you to check.</p>`,
      },
      {
        heading: "Save reusable prompts",
        body: `<p>When a prompt works, save the structure, not only the words. A reusable prompt should have placeholders for audience, purpose, source material, output format, and review criteria. This turns prompting into a repeatable work process.</p>`,
      },
    ],
    takeaway:
      "Control comes from clear task design: tell the AI what to produce, what not to assume, and how the output will be checked.",
  },
  {
    slug: "ai-as-a-learning-tool-not-a-shortcut",
    category: "Study",
    title: "AI as a Learning Tool, Not a Shortcut",
    description:
      "How students and self-learners can use AI to practice, explain, question, and test themselves without outsourcing the learning.",
    read: "8 min read",
    intro:
      "AI can help you learn faster when it makes you practice. It can weaken learning when it replaces the part where you struggle, recall, and explain.",
    points: ["Practice more", "Do not outsource thinking", "Check school rules"],
    sections: [
      {
        heading: "Use AI to create practice",
        body: `<p>Ask AI for quizzes, examples, flashcards, and explanations at different levels. Then answer before looking at the solution. Learning improves when you retrieve information, make mistakes, and correct them. Reading a perfect AI explanation is not the same as knowing the material.</p>`,
      },
      {
        heading: "Ask for hints, not answers",
        body: `<p>For homework or problem solving, ask the model to give one hint at a time. You can say: "Do not solve it yet. Ask me the next question I should answer." This keeps effort with the learner and uses AI like a tutor rather than a shortcut.</p>`,
      },
      {
        heading: "Explain it back",
        body: `<p>After studying, explain the idea in your own words and ask AI to identify gaps. This is more useful than asking it to explain from scratch because it shows what you actually understand.</p>`,
      },
      {
        heading: "Respect rules and attribution",
        body: `<p>Schools, universities, and courses have different rules. Some allow AI for brainstorming or feedback. Some restrict it for graded work. Check the rule before using AI, and do not submit AI output as your own thinking when the assignment requires your own work.</p>`,
      },
      {
        heading: "Avoid the illusion of understanding",
        body: `<p>A smooth explanation can make a topic feel learned. Test yourself without the tool. If you cannot solve a similar problem, define the term, or explain the tradeoff, you have not finished learning yet.</p>`,
      },
    ],
    takeaway:
      "Use AI to generate practice, hints, questions, and feedback. Do not let it replace recall, reasoning, or original work.",
  },
  {
    slug: "small-team-ai-policy-that-people-follow",
    category: "AI at Work",
    title: "A Small-Team AI Policy People Will Actually Follow",
    description:
      "A practical AI policy model for small teams that need clear rules without burying everyone in legal language.",
    read: "9 min read",
    intro:
      "Small teams need AI rules that people can remember. A policy that is too vague will be ignored. A policy that is too complex will be bypassed.",
    points: ["Define allowed use", "Protect sensitive data", "Require review"],
    sections: [
      {
        heading: "Start with allowed tasks",
        body: `<p>People need to know what is clearly allowed. For many teams, safe starting uses include drafting public blog outlines, rewriting non-sensitive emails, summarizing public information, creating internal checklists, and brainstorming names or ideas. Listing allowed tasks reduces confusion.</p>`,
      },
      {
        heading: "Name prohibited data",
        body: `<p>Be specific about what cannot be pasted into general AI tools: passwords, API keys, customer personal data, financial records, contracts, unreleased strategy, employee records, medical information, legal disputes, and source code unless approved. "Be careful" is not a policy. Clear examples are.</p>`,
      },
      {
        heading: "Create an approval path",
        body: `<p>Some use cases are not obviously safe or unsafe. Give people a simple way to ask. For example: "If the prompt includes client data, confidential business information, regulated data, or a customer-facing promise, ask the team lead before using AI."</p>`,
      },
      {
        heading: "Require human review",
        body: `<p>Every AI-assisted output that leaves the team should be reviewed by a person. The reviewer checks accuracy, tone, missing context, sensitive information, and whether the output makes promises the team cannot keep.</p>`,
      },
      {
        heading: "Keep the policy short",
        body: `<p>A useful small-team policy can fit on one page: allowed uses, prohibited data, approval path, review requirements, tool list, and owner. Review it monthly as tools and business needs change.</p>`,
      },
    ],
    takeaway:
      "A small-team AI policy works when it gives clear examples, protects sensitive data, and makes review part of the workflow.",
  },
  {
    slug: "ai-for-excel-users",
    category: "AI at Work",
    title: "AI for Excel Users: Practical Uses and Safe Limits",
    description:
      "How spreadsheet users can use AI for formulas, cleanup plans, summaries, and analysis questions without leaking data or trusting wrong numbers.",
    read: "9 min read",
    intro:
      "AI can help spreadsheet users write formulas, explain errors, plan cleanup, and summarize patterns. It should not replace checking the actual workbook.",
    points: ["Explain formulas", "Plan cleanup", "Verify numbers"],
    sections: [
      {
        heading: "Useful spreadsheet tasks",
        body: `<ul>
          <li>Explain what a formula does in plain English.</li>
          <li>Suggest a formula based on column names and desired output.</li>
          <li>Turn messy cleanup steps into a checklist.</li>
          <li>Draft a summary of trends after you provide verified numbers.</li>
          <li>Create documentation for a workbook so teammates understand it.</li>
        </ul>`,
      },
      {
        heading: "Do not paste sensitive workbooks",
        body: `<p>Spreadsheets often contain personal data, payroll, customer lists, sales figures, pricing, or strategy. Before using AI, remove rows, names, identifiers, and exact figures that are not needed. Often you can share column names and a small fake sample instead of real data.</p>`,
      },
      {
        heading: "Ask for formulas in context",
        body: `<p>A useful prompt includes the spreadsheet app, column names, example input, desired output, and edge cases. For example: "In Excel, column A has order dates and column B has status. Write a formula that counts shipped orders from July 2026. Explain how to adjust the month."</p>`,
      },
      {
        heading: "Check formulas before trusting them",
        body: `<p>AI-generated formulas can use the wrong function, wrong separator, wrong date handling, or wrong range. Test formulas on a small known example. Check blanks, duplicates, text numbers, regional separators, and edge cases.</p>`,
      },
      {
        heading: "Use AI for explanations after analysis",
        body: `<p>Let the spreadsheet calculate. Then use AI to help explain the result clearly. Provide verified totals and ask for a concise narrative, caveats, and questions a manager may ask. This keeps the math in the workbook and the writing assistance in the AI tool.</p>`,
      },
    ],
    takeaway:
      "AI is useful for spreadsheet thinking and communication, but formulas, data, and final numbers still need spreadsheet-level verification.",
  },
  {
    slug: "ai-meeting-notes-guide",
    category: "AI at Work",
    title: "How to Use AI for Meeting Notes Without Creating Confusion",
    seoTitle: "AI Meeting Notes Guide | The AI Explainer",
    description:
      "A practical guide to using AI for agendas, summaries, decisions, and action items while avoiding invented owners or missing context.",
    read: "8 min read",
    intro:
      "AI can make meeting notes faster, but a polished summary can still miss decisions or invent action items. The workflow matters.",
    points: ["Separate decisions", "Verify owners", "Send clean notes"],
    sections: [
      {
        heading: "Start with a clear output format",
        body: `<p>Ask for sections such as decisions, action items, open questions, risks, and background. This structure makes the summary easier to review. It also prevents one long paragraph from hiding missing details.</p>`,
      },
      {
        heading: "Protect meeting privacy",
        body: `<p>Meeting transcripts can include names, customer issues, employee concerns, strategy, financial details, or legal matters. Use approved tools for workplace meetings. If you are unsure, summarize manually or remove sensitive details before using AI.</p>`,
      },
      {
        heading: "Never let AI invent owners or dates",
        body: `<p>A strong prompt says: "If an owner or date is not stated, write 'not stated' instead of guessing." This is important because invented action items create follow-up problems. People may be assigned work they did not agree to.</p>`,
      },
      {
        heading: "Review against the source",
        body: `<p>Compare the summary with the agenda, transcript, chat, and your own notes. Check whether decisions were final or only discussed. Check whether deadlines are real. Check whether sensitive details should be removed before sharing.</p>`,
      },
      {
        heading: "Use AI before and after meetings",
        body: `<p>Before a meeting, AI can draft an agenda from goals and open questions. After a meeting, it can turn rough notes into a clean summary. The person running the meeting should still approve the final notes.</p>`,
      },
    ],
    takeaway:
      "AI meeting notes are useful when they separate facts from guesses and when a person checks decisions, owners, dates, and sensitive context.",
  },
  {
    slug: "what-not-to-share-with-ai-tools",
    category: "Privacy",
    title: "What Not to Share With AI Tools",
    description:
      "A practical list of information you should avoid entering into AI tools unless your tool, policy, and legal obligations allow it.",
    read: "8 min read",
    intro:
      "The safest AI prompt is the one that contains only what the task needs. Some information should stay out of prompts unless you have explicit approval and the right tool.",
    points: ["No secrets", "No unnecessary personal data", "Use approved tools"],
    sections: [
      {
        heading: "Credentials and security information",
        body: `<p>Do not paste passwords, recovery codes, API keys, private keys, access tokens, security questions, system prompts, vulnerability details, or internal security procedures into general AI tools. If a prompt needs an example, use fake values.</p>`,
      },
      {
        heading: "Personal and customer data",
        body: `<p>Names, addresses, emails, phone numbers, IDs, health details, student records, financial records, order histories, and support conversations can be sensitive. Remove or generalize them unless your organization has approved the tool and the use case.</p>`,
      },
      {
        heading: "Confidential business information",
        body: `<p>Unreleased products, pricing, strategy, sales pipelines, contracts, board materials, investor updates, personnel issues, and private negotiations should be treated as sensitive. A short prompt can still reveal a lot when details are unique.</p>`,
      },
      {
        heading: "Legal, medical, and financial documents",
        body: `<p>These documents often carry obligations beyond convenience. AI can help summarize general public information, but private legal, medical, or financial records should be handled under the right professional and policy controls.</p>`,
      },
      {
        heading: "Safer alternatives",
        body: `<p>Use fictional examples, anonymized summaries, small excerpts, approved enterprise tools, or manual review. If you cannot complete the task without sensitive data, ask for permission before proceeding.</p>`,
      },
    ],
    takeaway:
      "If the information would be harmful in the wrong inbox, do not paste it into a general AI tool without clear approval.",
  },
  {
    slug: "chatgpt-vs-claude-vs-gemini",
    category: "AI Tools",
    title: "ChatGPT vs Claude vs Gemini for Everyday Work",
    description:
      "A practical comparison framework for choosing AI assistants for writing, research, analysis, study, and office work.",
    read: "9 min read",
    intro:
      "AI tools change quickly, so the best question is not which assistant wins forever. The better question is which assistant fits your task, privacy needs, workflow, and review process today.",
    points: ["Match the task", "Check privacy settings", "Test with real workflows"],
    sections: [
      {
        heading: "Do not choose from hype alone",
        body: `<p>Most major AI assistants can draft, summarize, explain, brainstorm, and rewrite. The difference appears in workflow details: file handling, source links, coding support, office integration, writing style, memory, privacy controls, speed, and cost. A good choice depends on the work you repeat every week.</p>`,
      },
      {
        heading: "Use a task-based test",
        body: `<p>Pick three real tasks: one email, one document summary, and one research question. Run the same sanitized prompt in each tool. Compare accuracy, clarity, useful follow-up questions, source handling, and how much editing the answer needs.</p>`,
      },
      {
        heading: "Check the privacy model",
        body: `<p>Before using any assistant for work, check account type, data controls, training settings, retention, admin controls, and company policy. A tool that is fine for public brainstorming may not be approved for customer information or confidential documents.</p>`,
      },
      {
        heading: "Look at integrations",
        body: `<p>If your work lives in Google Workspace, Microsoft 365, code repositories, or specific research tools, integrations may matter more than raw model preference. The assistant that sits closest to your documents can save time, but it also needs the right permissions.</p>`,
      },
      {
        heading: "A practical recommendation",
        body: `<p>Choose one primary assistant for routine work and one secondary assistant for checking important drafts or comparing approaches. Do not spread private data across many tools. Keep a small set of approved tools and learn them well.</p>`,
      },
    ],
    takeaway:
      "The best AI assistant is the one that fits your repeated tasks, privacy constraints, integrations, and review habits.",
  },
];

const toolPages = [
  {
    slug: "ai-privacy-risk-checker",
    title: "AI Privacy Risk Checker",
    description:
      "A simple checklist tool that helps you decide whether text is safe to paste into an AI assistant.",
    intro:
      "Select the kinds of information you plan to include. The checker gives a practical risk level and safer next steps. It runs in your browser and does not send your selections anywhere.",
    markup: `<form class="tool-panel" data-tool="privacy-checker">
        <fieldset>
          <legend>What does your prompt include?</legend>
          <label><input type="checkbox" value="4" data-reason="Personal identifiers should usually be removed or replaced." /> Names, emails, phone numbers, addresses, or IDs</label>
          <label><input type="checkbox" value="5" data-reason="Customer, employee, student, patient, or financial data needs approved handling." /> Customer, employee, student, patient, or financial records</label>
          <label><input type="checkbox" value="5" data-reason="Secrets should not be pasted into general AI tools." /> Passwords, API keys, tokens, or security details</label>
          <label><input type="checkbox" value="4" data-reason="Private contracts and legal material need policy review." /> Contracts, legal drafts, or confidential negotiations</label>
          <label><input type="checkbox" value="3" data-reason="Internal strategy and pricing may reveal business-sensitive context." /> Internal strategy, pricing, sales pipeline, or unreleased plans</label>
          <label><input type="checkbox" value="1" data-reason="Public information is usually lower risk, but facts still need checking." /> Public information or fictional sample data only</label>
        </fieldset>
        <button class="button" type="button" data-action="privacy-check">Check risk</button>
        <output class="tool-output" data-output="privacy-result">Choose the information types above, then run the checker.</output>
      </form>
      <section class="content-section">
        <h2>How to use the result</h2>
        <p>This tool is a practical guide, not legal advice. If your prompt includes regulated, confidential, or customer data, use an approved tool and follow your organization policy before pasting anything.</p>
      </section>`,
  },
  {
    slug: "email-prompt-builder",
    title: "Email Prompt Builder",
    description:
      "Build a clear AI prompt for workplace email drafts without exposing more context than needed.",
    intro:
      "Choose the email purpose, audience, tone, and boundaries. The builder creates a prompt you can copy into your AI assistant, then edit with your real details.",
    markup: `<form class="tool-panel" data-tool="email-builder">
        <label>Purpose
          <select name="purpose">
            <option>send a project update</option>
            <option>ask for missing information</option>
            <option>follow up after a meeting</option>
            <option>decline a request politely</option>
            <option>apologize for a delay</option>
          </select>
        </label>
        <label>Audience
          <select name="audience">
            <option>a client</option>
            <option>a manager</option>
            <option>a teammate</option>
            <option>a vendor</option>
            <option>a customer</option>
          </select>
        </label>
        <label>Tone
          <select name="tone">
            <option>clear and professional</option>
            <option>warm but concise</option>
            <option>direct and respectful</option>
            <option>calm and apologetic</option>
          </select>
        </label>
        <label>Boundary
          <input name="boundary" type="text" value="do not invent dates, owners, prices, or promises" />
        </label>
        <button class="button" type="button" data-action="build-email-prompt">Build prompt</button>
        <textarea class="tool-output text-output" data-output="email-prompt" rows="8" readonly>Complete the fields, then build your prompt.</textarea>
      </form>
      <section class="content-section">
        <h2>Before you paste context</h2>
        <p>Use roles instead of real names when possible. Remove private account details, confidential terms, and long threads the model does not need. Add the final facts yourself before sending.</p>
      </section>`,
  },
  {
    slug: "ai-tool-picker",
    title: "AI Tool Picker for Everyday Work",
    description:
      "A lightweight decision tool for choosing the right kind of AI assistant for writing, research, spreadsheets, coding, or study.",
    intro:
      "Answer a few practical questions. The tool recommends the type of AI assistant to start with and what to verify before using it.",
    markup: `<form class="tool-panel" data-tool="tool-picker">
        <label>Main task
          <select name="task">
            <option value="writing">Writing and editing</option>
            <option value="research">Research and source checking</option>
            <option value="spreadsheet">Spreadsheets and data cleanup</option>
            <option value="coding">Coding or technical troubleshooting</option>
            <option value="study">Study and learning practice</option>
          </select>
        </label>
        <label>Data sensitivity
          <select name="sensitivity">
            <option value="public">Public or fictional information</option>
            <option value="internal">Internal but not confidential</option>
            <option value="sensitive">Customer, employee, legal, financial, or confidential data</option>
          </select>
        </label>
        <label>Need current sources?
          <select name="sources">
            <option value="no">No, this is mostly drafting or rewriting</option>
            <option value="yes">Yes, facts and sources matter</option>
          </select>
        </label>
        <button class="button" type="button" data-action="pick-tool">Get recommendation</button>
        <output class="tool-output" data-output="tool-picker-result">Choose your task, then get a recommendation.</output>
      </form>
      <section class="content-section">
        <h2>What this picker does not decide</h2>
        <p>It does not approve a tool for confidential work. For sensitive data, your organization policy, account settings, contract terms, and legal obligations matter more than a general recommendation.</p>
      </section>`,
  },
];

function articleCard(article, prefix = "") {
  return `<article class="guide-card">
      <p class="eyebrow">${article.category}</p>
      <h3><a href="${prefix}articles/${article.slug}.html">${article.title}</a></h3>
      <p>${article.description}</p>
      <span>${article.read}</span>
    </article>`;
}

function toolCard(tool, prefix = "") {
  return `<article class="tool-card">
      <p class="eyebrow">Free tool</p>
      <h3><a href="${prefix}tools/${tool.slug}.html">${tool.title}</a></h3>
      <p>${tool.description}</p>
      <span>Runs in your browser</span>
    </article>`;
}

const categoryAdvice = {
  "AI Basics": {
    setting:
      "Use this concept when you are trying to understand what an AI tool can reasonably do before you rely on it. A basic definition is only useful when it helps you decide what to try, what to check, and what not to assume.",
    caution:
      "The safest habit is to translate the concept into a simple workflow question: what information goes in, what output comes out, and who reviews the result?",
    prompt:
      "Explain this AI concept for a non-technical reader. Use one workplace example, one everyday example, and one warning about what people often misunderstand. End with three facts I should verify before relying on a tool that uses this concept.",
  },
  "AI at Work": {
    setting:
      "Use this guide for repeated workplace tasks where clarity, review, and privacy matter more than speed alone. The point is not to automate everything. The point is to let AI handle a draft or structure while a person keeps the business context.",
    caution:
      "Before using the output, check whether it changes a commitment, exposes private details, adds facts that were not in the source, or removes a nuance that your team actually needs.",
    prompt:
      "Help me improve this workplace task. First ask what the audience, deadline, risk, and source material are. Then produce a draft with clear assumptions, missing information, and a short review checklist before I send or use it.",
  },
  Privacy: {
    setting:
      "Use this guide before you paste text, upload a file, or connect a tool that can read private context. Privacy decisions are easiest before the data enters the prompt. After that, you may not be able to undo the disclosure.",
    caution:
      "If the material includes real people, customers, employees, contracts, credentials, financial records, or unique business details, pause and use a safer version of the task.",
    prompt:
      "Review this planned AI prompt for privacy risk. Do not rewrite it yet. List the sensitive details, suggest replacements or removals, and tell me whether a generic version would be enough for the task.",
  },
  Safety: {
    setting:
      "Use this guide whenever an AI answer may influence a decision, publication, customer message, school submission, or business action. The more visible or costly the output is, the more explicit the checking process should be.",
    caution:
      "Do not let a confident tone replace evidence. Separate useful wording from factual claims, then verify the claims through reliable sources or qualified review.",
    prompt:
      "Act as a critical reviewer. Identify every factual claim, assumption, missing source, number, date, and possible overstatement in this AI-generated answer. Do not fix the answer until you list what needs verification.",
  },
  Prompts: {
    setting:
      "Use this guide when your AI results feel vague, generic, too long, or hard to review. Better prompting is not about secret phrases. It is about designing a clearer task with boundaries and a review path.",
    caution:
      "A prompt should reduce ambiguity without adding private details the model does not need. If the prompt becomes a long dump of context, stop and separate the source, task, and checks.",
    prompt:
      "Turn my rough request into a better AI prompt. Keep it short. Include the task, audience, context, output format, boundaries, and verification steps. Ask one clarifying question only if the request cannot be answered safely.",
  },
  Study: {
    setting:
      "Use this guide when AI is part of learning, practice, tutoring, or self-study. The best learning use cases make you answer, explain, compare, and correct your own mistakes.",
    caution:
      "If the tool completes the thinking for you, learning may feel easier while your own recall gets weaker. Ask for hints, examples, and feedback instead of finished work.",
    prompt:
      "Tutor me on this topic without giving the final answer immediately. Ask one question at a time, give hints if I struggle, and make me explain the idea back in my own words before you summarize.",
  },
  "AI Tools": {
    setting:
      "Use this guide when comparing tools, not chasing a permanent winner. AI products change quickly, so a useful comparison should focus on task fit, privacy controls, source handling, workflow integration, and review effort.",
    caution:
      "Test tools with a small real workflow before moving important work into them. A tool that looks impressive in a demo may still fail on your files, rules, or review standards.",
    prompt:
      "Help me compare AI tools for a specific task. Ask about my task, data sensitivity, source needs, integrations, budget, and review process. Then recommend what type of tool to test first and what failure signs to watch for.",
  },
};

function renderApplicationSections(article) {
  const advice = categoryAdvice[article.category] || categoryAdvice["AI Basics"];
  return `<section class="content-section">
          <h2>How to apply this guide</h2>
          <p>${advice.setting}</p>
          <ul>
            <li>Write the task in one sentence before opening an AI tool.</li>
            <li>Decide which parts need human review: ${article.points.join(", ").toLowerCase()}.</li>
            <li>Remove private or unnecessary context before prompting.</li>
            <li>Check whether the final output changes a fact, promise, number, date, or decision.</li>
          </ul>
          <p>${advice.caution}</p>
        </section>
        <section class="content-section">
          <h2>A safer prompt to try</h2>
          <p>Use this starter prompt when you want help with the idea in this guide but still want the model to show its limits.</p>
          <div class="prompt-box">${advice.prompt}</div>
        </section>`;
}

function renderArticle(article) {
  const related = articles
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, 2);
  const fallbackRelated = related.length ? related : articles.filter((item) => item.slug !== article.slug).slice(0, 2);
  const pageTitle = article.seoTitle || `${article.title} | The AI Explainer`;
  return `${head({
    title: pageTitle,
    description: article.description,
    relativePath: `articles/${article.slug}.html`,
    type: "article",
    article,
  })}
  <body>
    ${header("articles", "../")}
    <main id="main" class="article-layout">
      <article class="article-main">
        <a class="back-link" href="../articles.html">Back to all guides</a>
        <header class="article-header">
          <p class="eyebrow">${article.category}</p>
          <h1>${article.title}</h1>
          <p class="article-dek">${article.intro}</p>
          <div class="article-meta">
            <span>The AI Explainer Editorial Desk</span>
            <span>Reviewed ${reviewed}</span>
            <span>${article.read}</span>
          </div>
        </header>
        <aside class="key-points" aria-label="Key points">
          ${article.points.map((point) => `<span>${point}</span>`).join("\n          ")}
        </aside>
        ${article.sections
          .map(
            (section) => `<section class="content-section">
          <h2>${section.heading}</h2>
          ${section.body}
        </section>`
          )
          .join("\n        ")}
        ${renderApplicationSections(article)}
        <section class="takeaway">
          <h2>Best takeaway</h2>
          <p>${article.takeaway}</p>
        </section>
        <nav class="related-guides" aria-label="Related guides">
          <h2>Read next</h2>
          ${fallbackRelated.map((item) => `<a href="${item.slug}.html">${item.title}</a>`).join("\n          ")}
        </nav>
      </article>
    </main>
    ${footer("../")}
  </body>
</html>`;
}

function renderTool(tool) {
  return `${head({
    title: `${tool.title} | The AI Explainer`,
    description: tool.description,
    relativePath: `tools/${tool.slug}.html`,
  })}
  <body>
    ${header("tools", "../")}
    <main id="main" class="tool-layout">
      <section class="page-hero narrow">
        <p class="eyebrow">Free AI tool</p>
        <h1>${tool.title}</h1>
        <p>${tool.intro}</p>
      </section>
      ${tool.markup}
    </main>
    ${footer("../")}
  </body>
</html>`;
}

function renderHome() {
  const featured = articles.slice(0, 6).map((article) => articleCard(article)).join("\n          ");
  const tools = toolPages.map((tool) => toolCard(tool)).join("\n          ");
  return `${head({
    title: "The AI Explainer | Clear AI Guides for Everyday Work",
    description:
      "Plain-English AI guides, privacy checklists, prompt examples, and free tools for people who use AI at work, school, and daily life.",
    relativePath: "index.html",
  })}
  <body>
    ${header("home")}
    <main id="main">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">AI literacy without the hype</p>
          <h1>Understand AI tools before you trust them.</h1>
          <p>The AI Explainer publishes practical guides for everyday users who want clear answers about prompts, privacy, AI assistants, workplace use, and verification.</p>
          <div class="hero-actions">
            <a class="button" href="articles.html">Browse guides</a>
            <a class="button secondary" href="tools.html">Try free tools</a>
          </div>
        </div>
        <div class="hero-visual" aria-label="AI explanation workflow">
          <div class="visual-card primary">
            <span>Prompt</span>
            <strong>Clear task</strong>
          </div>
          <div class="visual-card">
            <span>Check</span>
            <strong>Sources and privacy</strong>
          </div>
          <div class="visual-card accent">
            <span>Use</span>
            <strong>Human-reviewed output</strong>
          </div>
        </div>
      </section>
      <section class="trust-strip" aria-label="Editorial focus">
        <div><strong>${articles.length}</strong><span>plain-English guides</span></div>
        <div><strong>${toolPages.length}</strong><span>browser-based tools</span></div>
        <div><strong>No hype</strong><span>practical review checklists</span></div>
      </section>
      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Start here</p>
          <h2>Core AI guides</h2>
          <a href="articles.html">View all guides</a>
        </div>
        <div class="guide-grid">
          ${featured}
        </div>
      </section>
      <section class="section-block tinted">
        <div class="section-heading">
          <p class="eyebrow">Useful tools</p>
          <h2>Make safer AI decisions</h2>
          <a href="tools.html">View all tools</a>
        </div>
        <div class="tool-grid">
          ${tools}
        </div>
      </section>
      <section class="section-block topic-paths">
        <div class="section-heading">
          <p class="eyebrow">Topic paths</p>
          <h2>Learn by situation</h2>
        </div>
        <div class="path-grid">
          <a href="articles.html#ai-basics"><strong>AI Basics</strong><span>Definitions, LLMs, RAG, agents, and generative AI.</span></a>
          <a href="articles.html#ai-at-work"><strong>AI at Work</strong><span>Email, meetings, spreadsheets, policies, and team habits.</span></a>
          <a href="articles.html#privacy"><strong>Privacy and Safety</strong><span>What not to paste, how to verify, and when to pause.</span></a>
          <a href="articles.html#prompts"><strong>Prompts</strong><span>Reusable prompt patterns that keep people in control.</span></a>
        </div>
      </section>
    </main>
    ${footer()}
  </body>
</html>`;
}

function renderArticlesIndex() {
  const groups = [
    ["AI Basics", "ai-basics"],
    ["AI at Work", "ai-at-work"],
    ["Privacy", "privacy"],
    ["Safety", "safety"],
    ["Prompts", "prompts"],
    ["Study", "study"],
    ["AI Tools", "ai-tools"],
  ];
  return `${head({
    title: "AI Guides | The AI Explainer",
    description:
      "Browse beginner-friendly AI guides about AI basics, prompts, privacy, workplace use, hallucinations, tools, and responsible AI habits.",
    relativePath: "articles.html",
  })}
  <body>
    ${header("articles")}
    <main id="main">
      <section class="page-hero">
        <p class="eyebrow">Guides library</p>
        <h1>Clear explanations for practical AI use.</h1>
        <p>Every guide starts with the short answer, then gives examples, limits, and checks so readers can use AI without losing judgment.</p>
      </section>
      ${groups
        .map((group) => {
          const items = articles.filter((article) => article.category === group[0]);
          if (!items.length) return "";
          return `<section class="section-block" id="${group[1]}">
        <div class="section-heading">
          <p class="eyebrow">${group[0]}</p>
          <h2>${group[0]} guides</h2>
        </div>
        <div class="guide-grid">
          ${items.map((article) => articleCard(article)).join("\n          ")}
        </div>
      </section>`;
        })
        .join("\n      ")}
    </main>
    ${footer()}
  </body>
</html>`;
}

function renderToolsIndex() {
  return `${head({
    title: "Free AI Tools | The AI Explainer",
    description:
      "Free browser-based AI tools for privacy checking, email prompt building, and choosing the right AI assistant for everyday work.",
    relativePath: "tools.html",
  })}
  <body>
    ${header("tools")}
    <main id="main">
      <section class="page-hero">
        <p class="eyebrow">Free tools</p>
        <h1>Small tools for safer AI habits.</h1>
        <p>These tools are intentionally simple. They help you prepare a better prompt, avoid oversharing, and choose the right type of AI assistant for a task.</p>
      </section>
      <section class="section-block">
        <div class="tool-grid">
          ${toolPages.map((tool) => toolCard(tool)).join("\n          ")}
        </div>
      </section>
      <section class="section-block">
        <div class="info-panel">
          <h2>Privacy note</h2>
          <p>The tools on this site run in your browser. They do not require account sign-in and do not send your selections to The AI Explainer.</p>
        </div>
      </section>
    </main>
    ${footer()}
  </body>
</html>`;
}

function renderSimplePage({ relativePath, active, title, description, eyebrow, h1, body }) {
  return `${head({ title, description, relativePath })}
  <body>
    ${header(active)}
    <main id="main" class="simple-page">
      <section class="page-hero narrow">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${h1}</h1>
      </section>
      <article class="page-content">
        ${body}
      </article>
    </main>
    ${footer()}
  </body>
</html>`;
}

const simplePages = [
  {
    relativePath: "about.html",
    active: "about",
    title: "About | The AI Explainer",
    description:
      "Learn about The AI Explainer, an independent plain-English AI literacy website for everyday readers.",
    eyebrow: "About",
    h1: "The AI Explainer explains AI in plain English.",
    body: `<p>The AI Explainer is an independent AI literacy website for readers who want practical, easy-to-understand explanations of artificial intelligence, AI tools, privacy risks, and everyday work use cases.</p>
      <p>The main audience is non-technical readers: office workers, students, freelancers, small business owners, and curious people who want to use AI carefully without needing a computer science background.</p>
      <h2>Editorial focus</h2>
      <p>Articles focus on clear examples, responsible use, practical checklists, and source-aware explanations. The site avoids hype, copied summaries, fake certainty, and advice that should come from qualified legal, medical, financial, or security professionals.</p>
      <h2>How the site is maintained</h2>
      <p>Guides are reviewed for clarity, usefulness, safety notes, and outdated references. Tool comparisons are written as decision frameworks because AI products change frequently.</p>`,
  },
  {
    relativePath: "contact.html",
    active: "contact",
    title: "Contact and Corrections | The AI Explainer",
    description:
      "Correction, privacy, copyright, and site notice information for The AI Explainer.",
    eyebrow: "Contact",
    h1: "Contact and corrections.",
    body: `<p>No public email inbox is configured for this site yet. This page is kept for transparency and will be updated when an official contact channel is available.</p>
      <p>For future correction, privacy, copyright, or site notice requests, prepare the page URL, the exact sentence or issue, and enough context to review the concern. Do not send passwords, account details, private legal documents, medical records, financial records, or other confidential personal information.</p>
      <h2>Correction requests</h2>
      <p>If an article may be unclear or outdated, include the article title, the relevant paragraph, and the source or reason for the correction. Corrections are reviewed for accuracy and usefulness.</p>
      <h2>Advertising and sponsorship</h2>
      <p>The site may display advertising. Sponsored placements, if accepted in the future, must be clearly labeled and may not override editorial judgment.</p>`,
  },
  {
    relativePath: "editorial-policy.html",
    active: "",
    title: "Editorial Policy | The AI Explainer",
    description:
      "The editorial policy for The AI Explainer, including content standards, updates, AI assistance, corrections, and advertising boundaries.",
    eyebrow: "Editorial policy",
    h1: "How The AI Explainer writes and reviews content.",
    body: `<h2>Purpose</h2>
      <p>The AI Explainer publishes practical AI literacy content for everyday readers. The goal is to make AI concepts, tools, prompts, privacy risks, and workplace use easier to understand and easier to evaluate.</p>
      <h2>Content standards</h2>
      <p>Every article should answer a real reader question, define important terms, explain limits, and include practical checks. Articles should not rely on copied summaries, exaggerated claims, or generic advice that could apply to any topic.</p>
      <h2>Use of AI assistance</h2>
      <p>AI tools may be used for outlining, drafting, editing, or checking readability. Human review is required before publication. Final responsibility for wording, examples, safety notes, and updates belongs to the site owner or editorial reviewer.</p>
      <h2>Corrections and updates</h2>
      <p>AI products, search experiences, and privacy settings change. Pages may be updated when examples become outdated, explanations can be clearer, or a reader reports an issue. Material changes should keep the article useful rather than simply adding keywords.</p>
      <h2>Advertising boundary</h2>
      <p>Advertising may help support the site, but ads do not determine article conclusions. Any sponsored content or affiliate relationship should be disclosed clearly if introduced.</p>`,
  },
  {
    relativePath: "privacy.html",
    active: "",
    title: "Privacy Policy | The AI Explainer",
    description:
      "Privacy policy for The AI Explainer, including cookies, advertising, analytics, contact messages, and browser-based tools.",
    eyebrow: "Privacy policy",
    h1: "Privacy Policy.",
    body: `<p>This Privacy Policy explains how The AI Explainer handles information related to this website. The site is an informational publication and does not require readers to create an account.</p>
      <h2>Information you provide</h2>
      <p>If a future official contact channel is added, messages may include the information you choose to provide. Do not send confidential personal information, passwords, account details, legal documents, medical records, or financial records.</p>
      <h2>Browser-based tools</h2>
      <p>The free tools on this site are designed to run in your browser. They do not require login and are not designed to transmit your selections to The AI Explainer.</p>
      <h2>Cookies and advertising</h2>
      <p>The site may use third-party advertising services such as Google AdSense. These services may use cookies or similar technologies to serve and measure ads. Readers can manage ad personalization through their browser and Google account settings.</p>
      <h2>Analytics and logs</h2>
      <p>Hosting providers and analytics tools may collect standard technical information such as pages visited, device type, browser type, referring pages, approximate location, and time of visit. This information is used to understand site performance and improve the reader experience.</p>
      <h2>Children</h2>
      <p>This site is written for a general audience and is not directed to children under 13. Readers should follow school, parent, and local rules when using AI tools.</p>
      <h2>Contact</h2>
      <p>The official contact channel has not been configured yet. This policy will be updated when one is available.</p>`,
  },
  {
    relativePath: "terms.html",
    active: "",
    title: "Terms and Disclaimer | The AI Explainer",
    description:
      "Terms of use and disclaimer for The AI Explainer, including educational use, no professional advice, advertising, and external links.",
    eyebrow: "Terms",
    h1: "Terms and disclaimer.",
    body: `<h2>Educational content</h2>
      <p>The AI Explainer provides general educational information about artificial intelligence, AI tools, prompts, privacy habits, and everyday work use cases. The content is not professional legal, medical, financial, security, academic, or business advice.</p>
      <h2>No guarantee of accuracy</h2>
      <p>The site aims to publish clear and useful information, but AI products and policies change. Readers should verify important facts, product features, prices, rules, laws, and safety requirements with appropriate primary sources or qualified professionals.</p>
      <h2>External links and tools</h2>
      <p>The site may link to external resources. External websites have their own policies, content, and availability. The AI Explainer is not responsible for third-party content or services.</p>
      <h2>Advertising</h2>
      <p>The site may show advertisements. Advertising does not create an endorsement unless clearly stated. Do not click ads in a way that is artificial, misleading, or intended to inflate revenue.</p>
      <h2>Use of the site</h2>
      <p>Readers may use the site for personal learning. Do not misuse the site, attempt to disrupt it, scrape it aggressively, or copy substantial portions for republication without permission.</p>`,
  },
  {
    relativePath: "copyright.html",
    active: "",
    title: "Copyright | The AI Explainer",
    description:
      "Copyright and content usage information for The AI Explainer.",
    eyebrow: "Copyright",
    h1: "Copyright and content use.",
    body: `<p>Unless otherwise noted, original text, page structure, and site materials published on The AI Explainer are protected by copyright.</p>
      <h2>Allowed use</h2>
      <p>You may link to articles, quote short excerpts with attribution, and use the site for personal learning or internal reference. Do not republish full articles or large portions of the site without permission.</p>
      <h2>Copyright concerns</h2>
      <p>If you believe content on this site should be reviewed for copyright reasons, prepare the page URL and details of the issue. This page will list the official review channel once it is configured.</p>`,
  },
];

function renderSitemap() {
  const paths = [
    "index.html",
    "articles.html",
    "tools.html",
    ...simplePages.map((page) => page.relativePath),
    ...articles.map((article) => `articles/${article.slug}.html`),
    ...toolPages.map((tool) => `tools/${tool.slug}.html`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (item) => `  <url>
    <loc>${baseUrl}${canonicalPath(item)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

const css = String.raw`
:root {
  color-scheme: light;
  --bg: #e9f7f4;
  --bg-strong: #d8f0ff;
  --surface: #ffffff;
  --surface-2: #edf8f7;
  --ink: #081421;
  --ink-soft: #274052;
  --muted: #5f7884;
  --line: #c7ddd9;
  --line-strong: #adcac8;
  --brand: #0f766e;
  --brand-dark: #0b4f49;
  --blue: #315fda;
  --blue-deep: #1d3b8f;
  --amber: #c76a11;
  --rose: #a91e49;
  --theme-wash: #c7f2ea;
  --theme-lilac: #dce6ff;
  --shadow-sm: 0 1px 2px rgba(8, 20, 33, 0.07);
  --shadow-md: 0 16px 40px rgba(8, 20, 33, 0.1);
  --shadow-lg: 0 26px 70px rgba(8, 20, 33, 0.14);
  --radius: 8px;
  --max: 1160px;
  --measure: 760px;
  --gutter: clamp(18px, 4vw, 32px);
  --font: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  --font-display: "Sora", "Inter", ui-sans-serif, system-ui, sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  text-size-adjust: 100%;
}

body {
  margin: 0;
  min-width: 320px;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 12% 8%, rgba(21, 190, 166, 0.22), transparent 34rem),
    radial-gradient(circle at 82% 12%, rgba(49, 95, 218, 0.18), transparent 32rem),
    linear-gradient(180deg, #e8f7f4 0, #f1f8ff 46%, #eaf6f0 100%),
    var(--bg);
  color: var(--ink);
  font-family: var(--font);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

body::selection {
  background: rgba(49, 95, 218, 0.2);
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  color: var(--brand-dark);
}

p,
ul,
ol {
  margin-top: 0;
}

img,
svg {
  display: block;
  max-width: 100%;
}

button,
input,
select,
textarea {
  font: inherit;
}

:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.28);
  outline-offset: 3px;
}

.skip-link {
  position: absolute;
  left: var(--gutter);
  top: -56px;
  z-index: 30;
  padding: 9px 12px;
  border-radius: var(--radius);
  background: var(--ink);
  color: #fff;
  font-weight: 800;
}

.skip-link:focus {
  top: 12px;
}

.header-inner,
.footer-inner,
.hero,
.section-block,
.page-hero,
.article-layout,
.tool-layout,
.simple-page {
  width: min(var(--max), calc(100% - (var(--gutter) * 2)));
  margin-inline: auto;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid rgba(120, 169, 163, 0.38);
  background: rgba(232, 247, 244, 0.86);
  backdrop-filter: blur(18px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 72px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--ink);
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--brand), var(--blue));
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  box-shadow: var(--shadow-sm);
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}

.site-nav a {
  padding: 8px 11px;
  border-radius: var(--radius);
  color: var(--ink-soft);
  font-size: 14px;
  font-weight: 700;
}

.site-nav a[aria-current="page"],
.site-nav a:hover {
  background: rgba(15, 118, 110, 0.11);
  color: var(--brand-dark);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.78fr);
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
  padding-block: clamp(56px, 8vw, 96px) 44px;
}

.eyebrow {
  margin-bottom: 12px;
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.35;
  text-transform: uppercase;
}

h1,
h2,
h3 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.04;
}

h1 {
  max-width: 13ch;
  font-size: clamp(3rem, 7vw, 5.9rem);
}

.hero-copy > p:not(.eyebrow),
.page-hero p,
.article-dek {
  color: var(--ink-soft);
  font-size: clamp(1.02rem, 0.5vw + 0.92rem, 1.22rem);
  line-height: 1.7;
}

.hero-copy > p:not(.eyebrow) {
  max-width: 62ch;
  margin: 22px 0 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding-inline: 18px;
  border: 1px solid var(--brand);
  border-radius: var(--radius);
  background: var(--brand);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.button:hover {
  border-color: var(--brand-dark);
  background: var(--brand-dark);
  color: #fff;
}

.button.secondary {
  background: rgba(255, 255, 255, 0.66);
  color: var(--brand-dark);
}

.button.secondary:hover {
  background: rgba(199, 242, 234, 0.74);
  color: var(--brand-dark);
}

.hero-visual {
  position: relative;
  min-height: 390px;
  isolation: isolate;
}

.hero-visual::before {
  content: "";
  position: absolute;
  inset: 28px 22px;
  z-index: -1;
  border: 1px solid rgba(15, 118, 110, 0.24);
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(15, 118, 110, 0.2), rgba(49, 95, 218, 0.14)),
    repeating-linear-gradient(90deg, rgba(93, 140, 151, 0.38) 0 1px, transparent 1px 58px),
    repeating-linear-gradient(180deg, rgba(93, 140, 151, 0.3) 0 1px, transparent 1px 58px);
}

.visual-card {
  position: relative;
  width: min(100%, 288px);
  margin-left: auto;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-md);
}

.visual-card + .visual-card {
  margin-top: 30px;
  margin-right: auto;
  margin-left: 0;
}

.visual-card.accent {
  margin-right: 18px;
  margin-left: auto;
  border-color: rgba(217, 119, 6, 0.34);
}

.visual-card span {
  display: block;
  color: var(--rose);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.visual-card strong {
  display: block;
  margin-top: 7px;
  font-size: clamp(1.18rem, 0.55vw + 1rem, 1.55rem);
  line-height: 1.22;
}

.trust-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: min(var(--max), calc(100% - (var(--gutter) * 2)));
  margin: 0 auto 34px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-sm);
}

.trust-strip div {
  padding: 18px 22px;
}

.trust-strip div + div {
  border-left: 1px solid var(--line);
}

.trust-strip strong,
.trust-strip span {
  display: block;
}

.trust-strip strong {
  font-size: 21px;
  line-height: 1.2;
}

.trust-strip span {
  margin-top: 3px;
  color: var(--muted);
  font-size: 14px;
}

.section-block {
  padding-block: clamp(42px, 6vw, 76px);
}

.section-block.tinted {
  width: 100%;
  max-width: none;
  padding-inline: max(var(--gutter), calc((100vw - var(--max)) / 2));
  background:
    linear-gradient(135deg, rgba(15, 118, 110, 0.14), rgba(49, 95, 218, 0.1)),
    linear-gradient(180deg, #dff4ef, #e8f2ff);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 22px;
  margin-bottom: 22px;
}

.section-heading h2,
.content-section h2,
.takeaway h2,
.related-guides h2,
.page-content h2 {
  font-size: clamp(1.85rem, 2vw + 1.25rem, 3rem);
}

.section-heading a,
.related-guides a,
.content-section a,
.page-content a {
  color: var(--brand-dark);
  font-weight: 800;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 4px;
}

.guide-grid,
.tool-grid,
.path-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 16px;
}

.guide-card,
.tool-card,
.path-grid a,
.info-panel,
.tool-panel,
.page-content,
.takeaway,
.key-points,
.related-guides {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: var(--shadow-sm);
}

.guide-card,
.tool-card,
.path-grid a {
  min-height: 100%;
  padding: 22px;
}

.guide-card:hover,
.tool-card:hover,
.path-grid a:hover {
  border-color: rgba(15, 118, 110, 0.38);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.guide-card h3,
.tool-card h3,
.path-grid strong {
  display: block;
  margin-bottom: 10px;
  font-size: clamp(1.15rem, 0.35vw + 1rem, 1.38rem);
  line-height: 1.18;
}

.guide-card p:not(.eyebrow),
.tool-card p:not(.eyebrow),
.path-grid span {
  color: var(--muted);
}

.guide-card span,
.tool-card span {
  color: var(--amber);
  font-size: 13px;
  font-weight: 800;
}

.page-hero {
  padding-block: clamp(48px, 7vw, 82px) 26px;
}

.page-hero.narrow,
.simple-page .page-hero {
  max-width: var(--measure);
}

.page-hero h1 {
  max-width: 15ch;
}

.page-hero p {
  max-width: 64ch;
  margin: 18px 0 0;
}

.article-layout,
.tool-layout,
.simple-page {
  max-width: var(--measure);
  padding-bottom: 76px;
}

.article-layout {
  padding-top: 48px;
}

.article-main {
  display: block;
}

.back-link {
  display: inline-flex;
  margin-bottom: 30px;
  color: var(--brand-dark);
  font-weight: 800;
}

.article-header h1 {
  max-width: 14ch;
  font-size: clamp(2.45rem, 5vw, 4.6rem);
}

.article-dek {
  margin: 18px 0 0;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0;
  margin-top: 22px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  font-size: 14px;
}

.article-meta span + span::before {
  content: "/";
  margin-inline: 9px;
  color: var(--line-strong);
}

.key-points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  margin: 28px 0 36px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(199, 242, 234, 0.52), rgba(220, 230, 255, 0.42));
}

.key-points span {
  padding: 16px;
  color: var(--brand-dark);
  font-weight: 800;
}

.key-points span + span {
  border-left: 1px solid var(--line);
}

.content-section {
  margin-top: 36px;
}

.content-section h2,
.takeaway h2,
.related-guides h2,
.page-content h2 {
  margin-bottom: 12px;
  line-height: 1.12;
}

.content-section p,
.content-section li,
.page-content p,
.page-content li {
  color: #1f2937;
}

.content-section li + li,
.page-content li + li {
  margin-top: 7px;
}

.prompt-box {
  margin-top: 14px;
  padding: 18px;
  border: 1px solid rgba(37, 99, 235, 0.22);
  border-left: 4px solid var(--blue);
  border-radius: var(--radius);
  background: #eef4ff;
  color: #1e3a8a;
  font-weight: 700;
}

.takeaway {
  margin-top: 40px;
  padding: 24px;
  border-color: rgba(217, 119, 6, 0.32);
  background: #fff5df;
}

.takeaway p {
  margin-bottom: 0;
  color: #45320d;
}

.related-guides {
  display: grid;
  gap: 11px;
  margin-top: 28px;
  padding: 22px;
}

.tool-layout {
  padding-bottom: 76px;
}

.tool-panel {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.tool-panel fieldset {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  border: 0;
}

.tool-panel legend {
  margin-bottom: 8px;
  color: var(--ink);
  font-weight: 800;
}

.tool-panel label {
  display: grid;
  gap: 8px;
  color: var(--ink);
  font-weight: 700;
}

.tool-panel label:has(input[type="checkbox"]) {
  grid-template-columns: auto 1fr;
  align-items: start;
  font-weight: 600;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: #fff;
  color: var(--ink);
}

input,
select {
  min-height: 44px;
  padding: 8px 11px;
}

textarea {
  min-height: 170px;
  padding: 12px;
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  border-color: rgba(37, 99, 235, 0.6);
  outline: 3px solid rgba(37, 99, 235, 0.16);
}

input[type="checkbox"] {
  width: 18px;
  min-height: 18px;
  margin-top: 4px;
  accent-color: var(--brand);
}

.tool-output {
  display: block;
  min-height: 74px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #f3faf9;
  color: var(--ink);
  white-space: pre-wrap;
}

.info-panel,
.page-content {
  padding: 24px;
}

.page-content h2 {
  margin-top: 30px;
}

.site-footer {
  border-top: 1px solid #0f172a;
  background: #0b1220;
  color: #e2e8f0;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding-block: 34px;
}

.footer-inner p {
  max-width: 430px;
  margin: 7px 0 0;
  color: #a9b6c7;
}

.footer-inner nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px 18px;
}

.footer-inner a {
  color: #e2e8f0;
}

@media (max-width: 880px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 52px;
  }

  .hero-visual {
    min-height: 330px;
  }
}

@media (max-width: 680px) {
  :root {
    --gutter: 15px;
  }

  .header-inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    padding-block: 14px;
  }

  .site-nav {
    justify-content: flex-start;
  }

  .site-nav a {
    padding: 7px 8px;
  }

  h1 {
    max-width: 10ch;
    font-size: clamp(2.25rem, 9vw, 2.85rem);
  }

  .hero h1 {
    max-width: 9ch;
  }

  .hero-copy > p:not(.eyebrow),
  .page-hero p,
  .article-dek {
    max-width: 36ch;
    font-size: 1rem;
  }

  .hero-visual {
    width: 100%;
    max-width: 100%;
    min-height: auto;
    overflow: hidden;
    padding: 18px 0;
  }

  .hero-visual::before {
    inset: 0;
  }

  .visual-card,
  .visual-card + .visual-card,
  .visual-card.accent {
    width: calc(100% - 28px);
    margin-inline: auto;
  }

  .visual-card + .visual-card {
    margin-top: 18px;
  }

  .trust-strip,
  .key-points {
    grid-template-columns: 1fr;
  }

  .trust-strip div + div,
  .key-points span + span {
    border-top: 1px solid var(--line);
    border-left: 0;
  }

  .section-heading,
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }

  .footer-inner nav {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition: none !important;
  }
}
`;

const js = String.raw`
function text(selector, value) {
  const target = document.querySelector(selector);
  if (target) target.textContent = value;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.getAttribute("data-action");

  if (action === "privacy-check") {
    const form = button.closest("[data-tool='privacy-checker']");
    const checked = [...form.querySelectorAll("input[type='checkbox']:checked")];
    if (!checked.length) {
      text("[data-output='privacy-result']", "Select at least one information type first.");
      return;
    }
    const score = checked.reduce((total, item) => total + Number(item.value), 0);
    const reasons = checked.map((item) => item.dataset.reason).filter(Boolean);
    let level = "Low risk";
    let advice = "Use a short prompt, avoid unnecessary details, and verify the output.";
    if (score >= 8) {
      level = "High risk";
      advice = "Do not paste this into a general AI tool. Remove sensitive data, use an approved tool, or ask for policy guidance.";
    } else if (score >= 4) {
      level = "Medium risk";
      advice = "Sanitize the prompt first. Replace identifiers, remove private details, and share only what the task requires.";
    }
    text("[data-output='privacy-result']", level + "\n\n" + advice + "\n\nWhy:\n- " + reasons.join("\n- "));
  }

  if (action === "build-email-prompt") {
    const form = button.closest("[data-tool='email-builder']");
    const data = new FormData(form);
    const prompt = "Draft an email to " + data.get("audience") + " to " + data.get("purpose") + ".\n\n"
      + "Tone: " + data.get("tone") + ".\n"
      + "Length: 120-180 words.\n"
      + "Boundary: " + data.get("boundary") + ".\n\n"
      + "Use placeholders for private details. Keep the message specific, clear, and easy to review. End with one practical next step.";
    const output = form.querySelector("[data-output='email-prompt']");
    if (output) output.value = prompt;
  }

  if (action === "pick-tool") {
    const form = button.closest("[data-tool='tool-picker']");
    const data = new FormData(form);
    const task = data.get("task");
    const sensitivity = data.get("sensitivity");
    const sources = data.get("sources");
    const map = {
      writing: "Start with a general AI writing assistant and ask for options, critique, and concise rewrites.",
      research: "Use an AI assistant that can cite or open sources, then verify every important claim in the original source.",
      spreadsheet: "Use an assistant that can explain formulas and cleanup steps, but keep final calculations in the spreadsheet.",
      coding: "Use a coding-focused assistant with file context and tests, then run the code before trusting it.",
      study: "Use a tutor-style assistant for hints, quizzes, and feedback rather than complete answers."
    };
    let warning = "Public or fictional information is easiest to test with.";
    if (sensitivity === "internal") warning = "Check your workplace policy before pasting internal context.";
    if (sensitivity === "sensitive") warning = "Use only an approved tool for sensitive data, and avoid pasting raw records.";
    const sourceNote = sources === "yes"
      ? "Because current facts matter, require source links and open them yourself."
      : "Because this is mostly drafting, focus on clarity, tone, and human review.";
    text("[data-output='tool-picker-result']", map[task] + "\n\n" + warning + "\n\n" + sourceNote);
  }
});
`;

writeFile("index.html", renderHome());
writeFile("articles.html", renderArticlesIndex());
writeFile("tools.html", renderToolsIndex());
for (const page of simplePages) writeFile(page.relativePath, renderSimplePage(page));
for (const article of articles) writeFile(`articles/${article.slug}.html`, renderArticle(article));
for (const tool of toolPages) writeFile(`tools/${tool.slug}.html`, renderTool(tool));
writeFile("styles.css", css);
writeFile("script.js", js);
writeFile("robots.txt", `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`);
writeFile("sitemap.xml", renderSitemap());
writeFile("ads.txt", "google.com, pub-3430860743061587, DIRECT, f08c47fec0942fa0");

console.log(`Generated ${articles.length} guides, ${toolPages.length} tools, and ${simplePages.length + 3} core pages.`);
