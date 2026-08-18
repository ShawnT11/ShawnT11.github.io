import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseUrl = "https://theaiexplainer.com";
const lastmod = "2026-08-02";
const reviewed = "August 2, 2026";
const adClient = "ca-pub-3430860743061587";
const contactEmail = "hello@theaiexplainer.com";
const assetVersion = "20260818-1";

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

function head({ title, description, relativePath, type = "website", article, allowAds = false }) {
  const canonical = `${baseUrl}${canonicalPath(relativePath)}`;
  const adScript = allowAds
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}" crossorigin="anonymous"></script>`
    : "";
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
    <meta name="theme-color" content="#0b0f37" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${relativePath.includes("/") ? "../" : ""}styles.css?v=${assetVersion}" />
    ${adScript}
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

const trustedSourcesByCategory = {
  "AI Basics": [
    ["NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework"],
    ["OECD AI Principles", "https://oecd.ai/en/ai-principles"],
  ],
  "AI at Work": [
    ["NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework"],
    ["Google Search guidance on helpful content", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content"],
  ],
  Privacy: [
    ["FTC artificial intelligence topic page", "https://www.ftc.gov/industry/technology/artificial-intelligence"],
    ["FTC guidance on AI privacy commitments", "https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/01/ai-companies-uphold-your-privacy-confidentiality-commitments"],
  ],
  Safety: [
    ["NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework"],
    ["Google Search guidance on AI-generated content", "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content"],
  ],
  Prompts: [
    ["NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework"],
    ["Google Search guidance on AI-generated content", "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content"],
  ],
  Study: [
    ["Google Search guidance on AI-generated content", "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content"],
    ["Google Search guidance on helpful content", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content"],
  ],
  "AI Tools": [
    ["FTC artificial intelligence topic page", "https://www.ftc.gov/industry/technology/artificial-intelligence"],
    ["NIST AI Risk Management Framework", "https://www.nist.gov/itl/ai-risk-management-framework"],
  ],
};

const articleEnhancements = {
  "what-is-artificial-intelligence": {
    read: "11 min read",
    sections: [
      {
        heading: "Worked example: an AI support sorter",
        body: `<p>Imagine a small shop receives 200 support messages a week. A normal rule-based system can sort any email that contains the word "refund" into a refund folder. An AI system can go further. It may recognize that "my order arrived broken" is probably a replacement or refund issue even if the word refund never appears.</p>
        <p>That is useful, but the system still needs a review process. A customer who writes "I was charged twice and my delivery is missing" may belong in two queues. If the AI forces the message into only one category, the team may miss the billing issue. The practical lesson is that AI classification works best when a person can inspect uncertain or high-impact cases.</p>`,
      },
      {
        heading: "Questions a careful reader should ask",
        body: `<ul>
          <li>What input did the AI receive, and was any private data included?</li>
          <li>What output did it produce: a draft, a score, a label, or an action?</li>
          <li>Who checks mistakes before they affect a customer, student, patient, employee, or public claim?</li>
          <li>Can the user see why the result was suggested, or is it only a black-box answer?</li>
        </ul>`,
      },
    ],
  },
  "what-is-generative-ai": {
    read: "10 min read",
    sections: [
      {
        heading: "Before-and-after prompt example",
        body: `<p>A risky prompt gives the model too much private material and too little direction: "Here is the whole customer thread. Reply." A better prompt is narrower: "Draft a polite delay update for a customer. Say the package is delayed, give a revised delivery window, avoid refund promises, and leave placeholders for order number and name."</p>
        <p>The second version is safer because it describes the communication job without exposing unnecessary records. It also tells the model what not to add. That matters because generative AI often tries to be helpful by filling gaps, and those invented details can become real promises if a person sends the draft without review.</p>`,
      },
      {
        heading: "Three review passes before using output",
        body: `<ol>
          <li><strong>Fact pass:</strong> check names, dates, numbers, links, product details, and any current information.</li>
          <li><strong>Privacy pass:</strong> remove details that the final reader does not need to see.</li>
          <li><strong>Voice pass:</strong> edit generic wording so the final answer sounds like a real person or team.</li>
        </ol>`,
      },
    ],
  },
  "large-language-models-explained": {
    read: "12 min read",
    sections: [
      {
        heading: "Why context can fail in ordinary work",
        body: `<p>Suppose you paste a long policy document and ask for the vacation rule. The answer may be correct if the relevant paragraph is clear and nearby. It may be wrong if the document has exceptions, old sections, tables, or later updates that conflict with the first paragraph retrieved by the tool.</p>
        <p>This is why long context is not the same as reliable context. A careful workflow asks the model to identify the exact source section it used, then a person checks whether another section changes the answer. For policies, contracts, school rules, and medical or financial material, source checking matters more than fluent wording.</p>`,
      },
      {
        heading: "A practical LLM checklist",
        body: `<ul>
          <li>Put the task first, before background material.</li>
          <li>Tell the model what source text it may use.</li>
          <li>Ask it to separate facts from assumptions.</li>
          <li>Ask for "not stated" when the source does not contain an answer.</li>
          <li>Verify important claims outside the model.</li>
        </ul>`,
      },
    ],
  },
  "rag-explained-plain-english": {
    read: "11 min read",
    sections: [
      {
        heading: "What to inspect in a RAG answer",
        body: `<p>A good RAG answer should make the source visible. If a tool says "employees can carry over five days," the useful follow-up is not "Are you sure?" It is "Which document and paragraph did you use, when was it updated, and did you check exceptions?"</p>
        <p>For a small business, this can be as simple as showing the filename, date, and quoted paragraph next to the answer. For a larger team, it may require document owners, version control, access permissions, and review logs. The technology is less important than whether people can trace the answer back to the right source.</p>`,
      },
      {
        heading: "Common RAG failure patterns",
        body: `<ul>
          <li>The system retrieves the right document but the wrong paragraph.</li>
          <li>The answer ignores an exception in a later section.</li>
          <li>The source is old, duplicated, or no longer approved.</li>
          <li>The model summarizes accurately but removes an important condition.</li>
          <li>The user assumes citations prove correctness without opening them.</li>
        </ul>`,
      },
    ],
  },
  "prompt-engineering-explained": {
    read: "11 min read",
    sections: [
      {
        heading: "Prompt clinic: from vague to reviewable",
        body: `<p>Vague request: "Make this better." Reviewable request: "Rewrite this project update for a client who wants a clear status answer. Keep it under 140 words. Preserve the Friday delivery date. Do not mention internal staffing. End with one next step and flag any sentence that sounds like a guarantee."</p>
        <p>The stronger prompt is not better because it is longer. It is better because the result can be checked. You can tell whether it kept the date, avoided private staffing context, stayed within length, and ended with a next step. A reviewable prompt produces a reviewable answer.</p>`,
      },
      {
        heading: "Reusable prompt template",
        body: `<div class="prompt-box">Task: [what the AI should produce]<br />Audience: [who will use or read it]<br />Source: [what material it may use]<br />Format: [bullets, table, email, checklist]<br />Boundaries: [what not to invent, reveal, or change]<br />Review: [facts, tone, privacy, missing details]</div>`,
      },
    ],
  },
  "how-to-use-ai-without-losing-your-judgment": {
    read: "12 min read",
    sections: [
      {
        heading: "A decision table for everyday use",
        body: `<table class="decision-table">
          <thead><tr><th>Task</th><th>AI role</th><th>Human review</th></tr></thead>
          <tbody>
            <tr><td>Rewrite a routine email</td><td>Draft wording options</td><td>Check tone, facts, and promises</td></tr>
            <tr><td>Summarize meeting notes</td><td>Organize decisions and actions</td><td>Confirm owners, dates, and missing context</td></tr>
            <tr><td>Interpret a contract clause</td><td>Explain plain-language possibilities</td><td>Use qualified legal review before relying on it</td></tr>
            <tr><td>Analyze private customer data</td><td>Suggest a method or formula</td><td>Keep real data in approved systems</td></tr>
          </tbody>
        </table>`,
      },
      {
        heading: "The one-question judgment test",
        body: `<p>Before using an AI answer, ask: "Could I explain and defend this if someone challenged it?" If the answer is no, the work is not ready. You may need a source, a calculation, a policy check, a qualified reviewer, or a narrower prompt.</p>
        <p>This test is simple, but it changes behavior. It prevents AI from becoming a shortcut around responsibility. It also helps you notice when the model has produced wording that sounds polished but leaves you unable to explain the underlying decision.</p>`,
      },
    ],
  },
  "check-ai-answers-before-you-trust-them": {
    read: "11 min read",
    sections: [
      {
        heading: "A five-minute verification workflow",
        body: `<ol>
          <li>Copy the answer into a note and mark every factual claim.</li>
          <li>Separate stable claims from current claims, such as prices, laws, policies, features, and dates.</li>
          <li>Open the source, not only the citation title.</li>
          <li>Check numbers with a calculator or spreadsheet when they matter.</li>
          <li>Rewrite the final answer in your own words so you know what you are accepting.</li>
        </ol>`,
      },
      {
        heading: "Red flags that need extra checking",
        body: `<ul>
          <li>The answer includes exact statistics without a clear source.</li>
          <li>The source link exists but does not support the sentence beside it.</li>
          <li>The model uses phrases such as "generally" or "typically" for a rule that may have exceptions.</li>
          <li>The answer depends on a recent product, policy, law, or price.</li>
          <li>The output sounds like professional advice in a high-stakes area.</li>
        </ul>`,
      },
    ],
  },
  "ai-privacy-checklist-before-you-paste": {
    read: "10 min read",
    sections: [
      {
        heading: "Sanitizing example",
        body: `<p>Original text: "Can you rewrite this complaint from Maria Chen at 41 Green Street about invoice INV-1042 and her diabetes supply delivery?" Safer version: "Rewrite a complaint from a customer about a delayed medical supply order. Do not include names, addresses, invoice numbers, or health details. Keep the tone calm and ask for a status update."</p>
        <p>The safer version still gives the model the communication task. It removes identifiers, exact records, and health context that the model does not need to produce a useful draft.</p>`,
      },
      {
        heading: "Data that deserves an automatic pause",
        body: `<ul>
          <li>Credentials, recovery codes, API keys, access tokens, or private links.</li>
          <li>Customer, patient, student, employee, or applicant records.</li>
          <li>Contracts, disputes, unreleased financials, pricing, strategy, or personnel issues.</li>
          <li>Small combinations of details that identify a person even without a name.</li>
        </ul>`,
      },
    ],
  },
  "ai-hallucinations-are-a-workflow-problem": {
    read: "11 min read",
    sections: [
      {
        heading: "Why the workflow matters more than the warning",
        body: `<p>A warning that "AI can be wrong" is useful only if the work process changes. If a team still copies the answer into a report without opening sources, the warning has not reduced risk. A better workflow assigns the model a limited job, such as drafting a summary, and assigns a person the verification job.</p>
        <p>For public articles, customer emails, school submissions, internal policies, and business decisions, the review step should be visible. That can be a note, checklist, source section, approval field, or second-person review. The goal is to make mistakes catchable before they leave the draft stage.</p>`,
      },
      {
        heading: "A simple hallucination test",
        body: `<p>Ask the model to rewrite its answer using only facts from a source you provide. Then compare the new answer with the first answer. Any fact that appears in the first answer but not in the source should be treated as unsupported until verified elsewhere.</p>`,
      },
    ],
  },
  "ai-for-excel-users": {
    read: "11 min read",
    sections: [
      {
        heading: "Formula review example",
        body: `<p>If AI suggests a formula to count shipped orders in July, test it against a tiny table where you already know the answer. Include one shipped order in July, one pending order in July, one shipped order in June, one blank date, and one text date. This exposes date handling, status matching, and blank-cell assumptions.</p>
        <p>That small test is faster than debugging a full workbook later. It also makes the AI useful without giving it private rows, customer names, payroll figures, or sales data.</p>`,
      },
      {
        heading: "What to keep in the spreadsheet",
        body: `<ul>
          <li>Final calculations, totals, and reconciliations.</li>
          <li>Raw private data and confidential rows.</li>
          <li>Version history for important formulas.</li>
          <li>Manual checks for unusual cases, blanks, duplicates, and regional settings.</li>
        </ul>`,
      },
    ],
  },
};

for (const article of articles) {
  const enhancement = articleEnhancements[article.slug];
  if (enhancement?.read) article.read = enhancement.read;
  if (enhancement?.sections) article.sections.push(...enhancement.sections);
  article.sources = [
    ...(trustedSourcesByCategory[article.category] || trustedSourcesByCategory["AI Basics"]),
    ...(enhancement?.sources || []),
  ];
}

const toolPages = [
  {
    slug: "ai-privacy-risk-checker",
    title: "AI Privacy Risk Checker",
    description:
      "A simple checklist tool that helps you decide whether text is safe to paste into an AI assistant.",
    intro:
      "Select the kinds of information you plan to include. The checker gives a practical risk level and safer next steps. It runs in your browser and does not send your selections anywhere.",
    guidance: {
      heading: "What the checker is designed to catch",
      paragraphs: [
        "The risk checker focuses on the details that people most often paste without noticing: identifiers, customer records, employee information, contracts, credentials, unreleased business plans, and financial context. A prompt can look harmless when read quickly, but one name, invoice number, private link, or exact figure may be enough to expose more than the task requires.",
        "The result is intentionally conservative. A low-risk result does not mean every output is correct, and a high-risk result does not mean AI can never be used. It means the prompt should be rewritten, sanitized, or moved into an approved workplace tool before any real data is shared.",
      ],
      steps: [
        "Start by selecting every type of information that appears in the text you plan to paste.",
        "Read the risk reasons, then remove anything the AI does not need to complete the task.",
        "Replace real names, account details, and exact numbers with roles, ranges, or fictional examples.",
        "If regulated or confidential data remains, stop and use the policy-approved process for that material.",
      ],
      limits:
        "This page is an educational checklist, not legal, privacy, security, medical, or compliance advice. It cannot know your contracts, local laws, account settings, or employer policy.",
    },
    faq: [
      [
        "Does this tool send my answers anywhere?",
        "No. The checker runs in the browser using the choices on the page. It is designed as a local decision aid, not as a data collection form.",
      ],
      [
        "What should I do with a high-risk result?",
        "Rewrite the prompt with fictional examples, remove identifiers, or use an approved workplace tool with the right data protections. If regulated data remains, ask the responsible person before using AI.",
      ],
      [
        "Why can public information still need checking?",
        "Public information is usually lower privacy risk, but an AI answer can still be outdated, incomplete, or misread. Privacy risk and factual accuracy are separate checks.",
      ],
    ],
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
    guidance: {
      heading: "Why a prompt builder helps",
      paragraphs: [
        "Many workplace email prompts fail because they paste the whole situation into an AI tool and ask for a finished answer. That usually adds privacy risk and weakens the final message. A better prompt names the purpose, audience, tone, and boundaries first, then leaves private details as placeholders until you know what the draft actually needs.",
        "This builder keeps the AI in a drafting role. It asks for a useful structure without allowing the model to invent dates, owners, prices, apologies, refunds, or promises. After the draft is created, the sender should add the real facts, check the tone, and remove anything that does not match the relationship.",
      ],
      steps: [
        "Choose the closest purpose and audience before adding private context.",
        "Keep the boundary specific, such as no invented dates or no refund promises.",
        "Copy the generated prompt, then replace placeholders with only the facts needed for the email.",
        "Before sending, check the recipient, commitment, deadline, and any sensitive detail.",
      ],
      limits:
        "The builder cannot decide what your company, client, school, or regulator allows you to share. It also cannot verify whether the final email is accurate.",
    },
    faq: [
      [
        "Why not paste the full email thread first?",
        "Long threads often include names, private details, old decisions, and irrelevant context. A narrow prompt lets you get a draft structure before deciding what facts the model actually needs.",
      ],
      [
        "What should I edit after the draft is generated?",
        "Check the recipient, relationship, deadline, promised action, tone, and any sentence that could create a commitment. Replace placeholders with verified facts only.",
      ],
      [
        "Can I use this for customer or legal messages?",
        "Use extra review. Customer, legal, financial, medical, employment, or compliance messages can create real obligations, so the final wording should be approved by the right person.",
      ],
    ],
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
    guidance: {
      heading: "How the recommendation should be used",
      paragraphs: [
        "The best AI assistant is usually the one that fits a repeated task, not the one with the loudest product claim. Writing, research, spreadsheets, coding, and study all need different review habits. A tool that is helpful for public brainstorming may be the wrong place for customer records or confidential workbooks.",
        "The picker turns the choice into three questions: what are you trying to do, how sensitive is the data, and do current sources matter? Those questions are simple, but they prevent a common mistake: using one general AI chat for every task without thinking about privacy, source quality, integrations, or how the result will be checked.",
      ],
      steps: [
        "Choose the main task, then decide whether your data is public, internal, or sensitive.",
        "Say whether current sources matter; this changes the kind of verification needed.",
        "Use the recommendation as a starting point for a small test, not as final approval.",
        "Keep a written note of what failed, what needed editing, and what policy checks were required.",
      ],
      limits:
        "This picker does not approve vendors, replace procurement review, or evaluate security controls. Sensitive work still needs the right account, admin settings, and policy review.",
    },
    faq: [
      [
        "Why does sensitivity matter so much?",
        "The same task can be low-risk with fictional information and high-risk with customer, employee, legal, financial, or confidential records. The data changes the approval path.",
      ],
      [
        "What does current-source need mean?",
        "Some tasks depend on fresh facts, such as pricing, laws, product features, policies, and dates. For those tasks, choose tools that can show sources and still verify the sources yourself.",
      ],
      [
        "Should I use many AI assistants at once?",
        "For sensitive or repeated work, a smaller approved toolset is easier to govern. Testing many tools can spread private context and make review harder.",
      ],
    ],
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

function renderSourceSection(article) {
  if (!article.sources?.length) return "";
  return `<section class="source-list">
          <h2>Sources and further reading</h2>
          <p>These links are included so readers can compare this plain-English guide with primary or policy-oriented resources.</p>
          <ul>
            ${article.sources
              .map(([label, url]) => `<li><a href="${url}">${label}</a></li>`)
              .join("\n            ")}
          </ul>
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
    allowAds: true,
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
        <section class="content-section reviewer-note">
          <h2>Editorial review note</h2>
          <p>This guide was reviewed for plain-language clarity, privacy cautions, high-stakes limits, and whether the suggested workflow keeps a person responsible for final judgment. It is educational content, not legal, medical, financial, security, or professional compliance advice.</p>
        </section>
        ${renderSourceSection(article)}
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

function renderToolGuidance(tool) {
  return `<section class="content-section">
        <h2>${tool.guidance.heading}</h2>
        ${tool.guidance.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n        ")}
      </section>
      <section class="content-section">
        <h2>Use it as a review step</h2>
        <ol>
          ${tool.guidance.steps.map((step) => `<li>${step}</li>`).join("\n          ")}
        </ol>
        <p>${tool.guidance.limits}</p>
      </section>
      <section class="content-section faq-section">
        <h2>Common questions</h2>
        ${tool.faq
          .map(
            ([question, answer]) => `<h3>${question}</h3>
        <p>${answer}</p>`
          )
          .join("\n        ")}
      </section>
      <section class="source-list">
        <h2>Related guides</h2>
        <ul>
          <li><a href="../articles/ai-privacy-checklist-before-you-paste.html">A Privacy Checklist Before You Paste Text Into AI</a></li>
          <li><a href="../articles/check-ai-answers-before-you-trust-them.html">How to Check an AI Answer Before You Trust It</a></li>
          <li><a href="../articles/how-to-use-ai-without-losing-your-judgment.html">How to Use AI Without Losing Your Judgment</a></li>
        </ul>
      </section>`;
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
      ${renderToolGuidance(tool)}
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
    allowAds: true,
  })}
  <body>
    ${header("home")}
    <main id="main">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">AI LITERACY WITHOUT THE HYPE</p>
          <h1>Use AI with <span class="highlight">your judgment intact.</span></h1>
          <p>The AI Explainer turns confusing AI tools into clear next steps for your work, privacy, study, and everyday decisions.</p>
          <div class="hero-links">
            <a class="button" href="articles.html">Browse the guides <span aria-hidden="true">→</span></a>
            <a class="button secondary" href="tools/ai-privacy-risk-checker.html">Check a privacy risk</a>
          </div>
          <p class="hero-note">Clear input. Careful review. Better decisions.</p>
        </div>
        <div class="hero-visual" aria-label="A three-step way to use AI well">
          <article class="visual-card primary"><span>01 · Understand</span><strong>Get the idea before you trust the answer.</strong></article>
          <article class="visual-card"><span>02 · Check</span><strong>Keep private details and weak claims in view.</strong></article>
          <article class="visual-card accent"><span>03 · Decide</span><strong>Use the useful part. Keep the final call.</strong></article>
        </div>
      </section>
      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Start here</p>
          <h2>Featured guides</h2>
          <a href="articles.html">View all guides</a>
        </div>
        <div class="guide-grid">
          ${featured}
        </div>
      </section>
      <section class="section-block tinted">
        <div class="section-heading">
          <p class="eyebrow">Useful tools</p>
          <h2>Tools for safer AI habits</h2>
          <a href="tools.html">View all tools</a>
        </div>
        <div class="tool-grid">
          ${tools}
        </div>
      </section>
      <section class="section-block topic-paths">
        <div class="section-heading">
          <p class="eyebrow">Topic paths</p>
          <h2>Read by situation</h2>
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
    allowAds: true,
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
          <h2>How these tools are designed</h2>
          <p>Each tool is intentionally narrow. It asks for a small set of choices, gives a plain-language result, and points readers back to a human review step. The tools are not meant to replace workplace policy, legal review, privacy review, or source checking.</p>
          <p>The tools work best when readers use public, fictional, or sanitized examples first. If the task involves customer, employee, student, medical, legal, financial, security, or confidential business data, the safer choice is to use an approved tool and follow the relevant policy before sharing any real information.</p>
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
      <p>The site is maintained as an editorial resource rather than a tool directory. Each guide is written to answer a specific reader question, explain the limits of AI assistance, and give a practical review step that can be used before someone trusts an output.</p>
      <h2>Who is responsible for the content</h2>
      <p>Articles are published under The AI Explainer Editorial Desk so the site can keep one consistent review standard. The site owner is responsible for final publication decisions, corrections, page updates, advertising boundaries, and reader contact through <a href="mailto:${contactEmail}">${contactEmail}</a>.</p>
      <h2>Editorial focus</h2>
      <p>Articles focus on clear examples, responsible use, practical checklists, and source-aware explanations. The site avoids hype, copied summaries, fake certainty, and advice that should come from qualified legal, medical, financial, or security professionals.</p>
      <h2>How the site is maintained</h2>
      <p>Guides are reviewed for clarity, usefulness, safety notes, and outdated references. Tool comparisons are written as decision frameworks because AI products change frequently. When a topic depends on current pricing, product features, laws, policies, or medical and financial decisions, readers are told to verify details with primary sources or qualified professionals.</p>
      <h2>What the site does not do</h2>
      <p>The AI Explainer does not provide legal, medical, financial, security, immigration, tax, or professional compliance advice. It also does not claim that AI tools are safe for every workplace or every kind of data. The goal is to help readers ask better questions before they rely on a tool.</p>
      <h2>Reader contact</h2>
      <p>For corrections, privacy questions, permissions, or general feedback, email <a href="mailto:${contactEmail}">${contactEmail}</a>. Include the page URL and the specific sentence or issue that needs review.</p>`,
  },
  {
    relativePath: "contact.html",
    active: "contact",
    title: "Contact and Corrections | The AI Explainer",
    description:
      "Correction, privacy, copyright, and site notice information for The AI Explainer.",
    eyebrow: "Contact",
    h1: "Contact and corrections.",
    body: `<p>Use this page for corrections, privacy questions, copyright questions, permissions, advertising notices, and general feedback about The AI Explainer.</p>
      <p>Email: <a href="mailto:${contactEmail}">${contactEmail}</a>. Typical review time is 3 to 5 business days for ordinary site messages. Include the page URL, the exact sentence or issue, and enough context to review the concern.</p>
      <h2>Correction requests</h2>
      <p>If an article may be unclear or outdated, include the article title, the relevant paragraph, and the source or reason for the correction. Corrections are reviewed for accuracy and usefulness. If a change materially affects a reader's understanding, the page may be updated with a new review date.</p>
      <h2>What to include</h2>
      <ul>
        <li>The page URL and article title.</li>
        <li>The sentence, heading, tool result, or link that needs review.</li>
        <li>A short explanation of the issue and any primary source that supports the correction.</li>
        <li>Your preferred contact address for follow-up.</li>
      </ul>
      <h2>Privacy and sensitive information</h2>
      <p>Do not send passwords, account details, private legal documents, medical records, financial records, customer files, confidential business documents, or urgent safety requests. The site publishes general educational information and cannot provide emergency, legal, medical, financial, or security assistance.</p>
      <h2>Advertising and sponsorship</h2>
      <p>The site may display advertising. Sponsored placements, if accepted in the future, must be clearly labeled and may not override editorial judgment. Do not ask for ad clicks, paid link placement that changes article conclusions, or undisclosed sponsored recommendations.</p>
      <h2>Response limits</h2>
      <p>The contact inbox is for site-related messages. It cannot provide individual AI tool recommendations for private cases, review confidential documents, troubleshoot emergency problems, or give professional advice. For high-stakes matters, contact a qualified professional or the organization responsible for the data or decision.</p>`,
  },
  {
    relativePath: "editorial-policy.html",
    active: "",
    title: "Editorial Policy | The AI Explainer",
    description:
      "The editorial policy for The AI Explainer, including content standards, updates, AI assistance, corrections, and advertising boundaries.",
    eyebrow: "Editorial policy",
    h1: "How The AI Explainer writes and reviews content.",
    body: `<p><strong>Last reviewed:</strong> ${reviewed}</p>
      <h2>Purpose</h2>
      <p>The AI Explainer publishes practical AI literacy content for everyday readers. The goal is to make AI concepts, tools, prompts, privacy risks, and workplace use easier to understand and easier to evaluate.</p>
      <h2>Content standards</h2>
      <p>Every article should answer a real reader question, define important terms, explain limits, and include practical checks. Articles should not rely on copied summaries, exaggerated claims, or generic advice that could apply to any topic.</p>
      <h2>Who, how, and why</h2>
      <p><strong>Who:</strong> pages are published by The AI Explainer Editorial Desk. <strong>How:</strong> articles may use AI for outlining or readability checks, but final wording, examples, warnings, and corrections are reviewed before publication. <strong>Why:</strong> the site exists to help ordinary readers use AI with better judgment, not to produce search-engine pages or tool hype.</p>
      <h2>Use of AI assistance</h2>
      <p>AI tools may be used for outlining, drafting, editing, or checking readability. Human review is required before publication. Final responsibility for wording, examples, safety notes, and updates belongs to the site owner or editorial reviewer.</p>
      <h2>Sources and verification</h2>
      <p>When a page discusses current products, policies, prices, legal requirements, medical topics, financial decisions, or other high-stakes matters, readers are told to verify details with primary sources or qualified professionals. Articles are written to support practical judgment, not replace it.</p>
      <h2>Corrections and updates</h2>
      <p>AI products, search experiences, and privacy settings change. Pages may be updated when examples become outdated, explanations can be clearer, or a reader reports an issue. Material changes should keep the article useful rather than simply adding keywords. Correction requests can be sent to <a href="mailto:${contactEmail}">${contactEmail}</a>.</p>
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
    body: `<p><strong>Last reviewed:</strong> ${reviewed}</p>
      <p>This Privacy Policy explains how The AI Explainer handles information related to this website. The site is an informational publication and does not require readers to create an account.</p>
      <h2>Information you provide</h2>
      <p>If you email the site, messages may include your email address, name, page URL, correction request, permissions request, or any other information you choose to provide. Do not send confidential personal information, passwords, account details, legal documents, medical records, financial records, customer files, or other sensitive material.</p>
      <h2>Browser-based tools</h2>
      <p>The free tools on this site are designed to run in your browser. They do not require login and are not designed to transmit your selections to The AI Explainer.</p>
      <h2>Cookies and advertising</h2>
      <p>The site may use third-party advertising services such as Google AdSense. These services may use cookies or similar technologies to serve and measure ads. Google explains how it uses information from sites and apps that use its services at <a href="https://policies.google.com/technologies/partner-sites">policies.google.com/technologies/partner-sites</a>. Readers can manage ad personalization through their browser and Google account settings.</p>
      <h2>Analytics and logs</h2>
      <p>Hosting providers and analytics tools may collect standard technical information such as pages visited, device type, browser type, referring pages, approximate location, and time of visit. This information is used to understand site performance and improve the reader experience.</p>
      <h2>Email and retention</h2>
      <p>Messages sent to the contact address may be retained long enough to review the request, respond, and keep a record of corrections or permissions decisions. Readers should avoid sending information they would not want stored in an ordinary email inbox.</p>
      <h2>Your choices</h2>
      <p>You can read the site without creating an account. You can disable or clear cookies in your browser settings, manage Google ad personalization through your Google account, and avoid sending personal information through email unless it is necessary for the request.</p>
      <h2>Children</h2>
      <p>This site is written for a general audience and is not directed to children under 13. Readers should follow school, parent, and local rules when using AI tools.</p>
      <h2>Contact</h2>
      <p>For privacy questions, email <a href="mailto:${contactEmail}">${contactEmail}</a>.</p>`,
  },
  {
    relativePath: "terms.html",
    active: "",
    title: "Terms and Disclaimer | The AI Explainer",
    description:
      "Terms of use and disclaimer for The AI Explainer, including educational use, no professional advice, advertising, and external links.",
    eyebrow: "Terms",
    h1: "Terms and disclaimer.",
    body: `<p><strong>Last reviewed:</strong> ${reviewed}</p>
      <h2>Educational content</h2>
      <p>The AI Explainer provides general educational information about artificial intelligence, AI tools, prompts, privacy habits, and everyday work use cases. The content is not professional legal, medical, financial, security, academic, or business advice.</p>
      <h2>No guarantee of accuracy</h2>
      <p>The site aims to publish clear and useful information, but AI products and policies change. Readers should verify important facts, product features, prices, rules, laws, and safety requirements with appropriate primary sources or qualified professionals.</p>
      <h2>External links and tools</h2>
      <p>The site may link to external resources. External websites have their own policies, content, and availability. The AI Explainer is not responsible for third-party content or services.</p>
      <h2>Advertising</h2>
      <p>The site may show advertisements. Advertising does not create an endorsement unless clearly stated. Do not click ads in a way that is artificial, misleading, or intended to inflate revenue.</p>
      <h2>No professional relationship</h2>
      <p>Reading the site, using a browser-based tool, or emailing a correction request does not create a professional, advisory, attorney-client, medical, financial, security, employment, or consulting relationship. Readers remain responsible for checking facts and choosing the right professional review for high-stakes decisions.</p>
      <h2>Use of the site</h2>
      <p>Readers may use the site for personal learning. Do not misuse the site, attempt to disrupt it, scrape it aggressively, or copy substantial portions for republication without permission.</p>
      <h2>Changes to pages</h2>
      <p>Articles and tools may be updated as AI products, privacy practices, search experiences, and reader questions change. Updated pages should keep the original purpose clear and should not add keywords or claims that do not help readers.</p>
      <h2>Contact</h2>
      <p>For permissions, corrections, privacy questions, or content concerns, email <a href="mailto:${contactEmail}">${contactEmail}</a>.</p>`,
  },
  {
    relativePath: "copyright.html",
    active: "",
    title: "Copyright | The AI Explainer",
    description:
      "Copyright and content usage information for The AI Explainer.",
    eyebrow: "Copyright",
    h1: "Copyright and content use.",
    body: `<p><strong>Last reviewed:</strong> ${reviewed}</p>
      <p>Unless otherwise noted, original text, page structure, and site materials published on The AI Explainer are protected by copyright.</p>
      <h2>Allowed use</h2>
      <p>You may link to articles, quote short excerpts with attribution, and use the site for personal learning or internal reference. Do not republish full articles or large portions of the site without permission.</p>
      <h2>Uses that need permission</h2>
      <p>Ask before copying full articles, adapting multiple guides into another site, republishing tool text, translating substantial portions, selling printed versions, or using the site as source material for a competing content collection. Attribution does not replace permission when the copied portion is substantial.</p>
      <h2>AI-assisted reuse</h2>
      <p>Do not use automated tools to scrape, rewrite, or mass-republish the site in a way that substitutes for the original pages. Short quotations, links, and ordinary reader notes are welcome when they help people find the original article.</p>
      <h2>Copyright concerns</h2>
      <p>If you believe content on this site should be reviewed for copyright reasons, email <a href="mailto:${contactEmail}">${contactEmail}</a> with the page URL, details of the issue, and your contact information.</p>`,
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
  --bg: #f7f5ef;
  --surface: #fffdf8;
  --surface-2: #efede6;
  --ink: #151515;
  --ink-soft: #343434;
  --muted: #6f6b62;
  --line: #d9d4c8;
  --line-strong: #c3bcae;
  --brand: #0f766e;
  --brand-dark: #0b4f49;
  --blue: #1f4fa3;
  --amber: #9d5b12;
  --rose: #92334c;
  --shadow-sm: 0 1px 1px rgba(21, 21, 21, 0.04);
  --shadow-md: 0 8px 24px rgba(21, 21, 21, 0.06);
  --radius: 8px;
  --max: 1160px;
  --measure: 760px;
  --gutter: clamp(18px, 4vw, 32px);
  --font: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
  --font-display: "Source Serif 4", Georgia, "Times New Roman", serif;
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
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

body::selection {
  background: rgba(15, 118, 110, 0.18);
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
  position: static;
  z-index: 20;
  border-bottom: 1px solid var(--line);
  background: var(--surface);
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
  font-weight: 850;
  letter-spacing: 0;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius);
  background: var(--ink);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
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
  font-weight: 760;
}

.site-nav a[aria-current="page"],
.site-nav a:hover {
  background: #edf7f5;
  color: var(--brand-dark);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 56px;
  align-items: end;
  padding-block: 68px 44px;
  border-bottom: 1px solid var(--line);
}

.eyebrow {
  margin-bottom: 12px;
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 900;
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
  letter-spacing: 0;
  line-height: 1.08;
}

h1 {
  max-width: 12ch;
  font-size: 4.6rem;
}

.hero-copy > p:not(.eyebrow),
.page-hero p,
.article-dek {
  color: var(--ink-soft);
  font-size: 1.1rem;
  line-height: 1.7;
}

.hero-copy > p:not(.eyebrow) {
  max-width: 62ch;
  margin: 22px 0 0;
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero-links a {
  color: var(--brand-dark);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 5px;
}

.hero-links a + a::before {
  content: "/";
  margin-right: 12px;
  color: var(--line-strong);
  text-decoration: none;
}

.hero-facts {
  margin: 0;
  border-top: 2px solid var(--ink);
}

.hero-facts div {
  display: grid;
  gap: 4px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

.hero-facts dt {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
}

.hero-facts dd {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
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
  font-weight: 850;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.button:hover {
  border-color: var(--brand-dark);
  background: var(--brand-dark);
  color: #fff;
}

.button.secondary {
  background: #fff;
  color: var(--brand-dark);
}

.button.secondary:hover {
  background: #e6f3f2;
  color: var(--brand-dark);
}

.section-block {
  padding-block: 56px;
}

.section-block.tinted {
  border-block: 1px solid var(--line);
  background: rgba(255, 253, 248, 0.58);
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
  font-size: 2rem;
}

.section-heading a,
.related-guides a,
.content-section a,
.page-content a {
  color: var(--brand-dark);
  font-weight: 850;
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
  background: var(--surface);
  box-shadow: none;
}

.guide-card,
.tool-card,
.path-grid a {
  min-height: 100%;
  padding: 22px;
  border-top: 3px solid var(--ink);
}

.guide-card:hover,
.tool-card:hover,
.path-grid a:hover {
  border-color: var(--line-strong);
}

.guide-card h3,
.tool-card h3,
.path-grid strong {
  display: block;
  margin-bottom: 10px;
  font-size: 1.25rem;
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
  font-weight: 850;
}

.page-hero {
  padding-block: 54px 28px;
  border-bottom: 1px solid var(--line);
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
  font-weight: 850;
}

.article-header h1 {
  max-width: 14ch;
  font-size: 3.2rem;
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
  background: #f8fcfb;
}

.key-points span {
  padding: 16px;
  color: var(--brand-dark);
  font-weight: 850;
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
  background: #eff6ff;
  color: #1e3a8a;
  font-weight: 760;
}

.decision-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  font-size: 0.95rem;
}

.decision-table th,
.decision-table td {
  padding: 12px;
  border-bottom: 1px solid var(--line);
  text-align: left;
  vertical-align: top;
}

.decision-table th {
  background: #eef6f7;
  color: var(--brand-dark);
  font-weight: 900;
}

.decision-table tr:last-child td {
  border-bottom: 0;
}

.source-list {
  margin-top: 36px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #f8fafc;
}

.source-list h2,
.faq-section h2 {
  margin-bottom: 10px;
  font-size: 1.7rem;
}

.source-list p {
  margin-bottom: 12px;
  color: var(--muted);
}

.source-list a {
  color: var(--brand-dark);
  font-weight: 850;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.reviewer-note {
  padding: 18px;
  border-left: 4px solid var(--brand);
  background: #f0fdfa;
}

.faq-section h3 {
  margin-top: 18px;
  margin-bottom: 6px;
  font-size: 1.08rem;
  line-height: 1.3;
}

.takeaway {
  margin-top: 40px;
  padding: 24px;
  border-color: rgba(217, 119, 6, 0.32);
  background: #fffbeb;
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
  font-weight: 900;
}

.tool-panel label {
  display: grid;
  gap: 8px;
  color: var(--ink);
  font-weight: 780;
}

.tool-panel label:has(input[type="checkbox"]) {
  grid-template-columns: auto 1fr;
  align-items: start;
  font-weight: 680;
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
  background: #f8fafc;
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
    gap: 32px;
    padding-top: 48px;
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
    max-width: 11ch;
    font-size: 3rem;
  }

  .hero-copy > p:not(.eyebrow),
  .page-hero p,
  .article-dek {
    max-width: 36ch;
    font-size: 1rem;
  }

  .key-points {
    grid-template-columns: 1fr;
  }

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

const editorialTheme = String.raw`

/* Bold editorial system shared by every page. */
:root {
  color-scheme: dark;
  --bg: #0b0f37;
  --bg-strong: #111748;
  --surface: #fffdf2;
  --surface-2: #ebe9e0;
  --ink: #fffdf2;
  --ink-soft: #ced0e2;
  --muted: #aeb2ca;
  --line: rgba(255, 253, 242, 0.52);
  --line-strong: rgba(255, 253, 242, 0.72);
  --brand: #ff6571;
  --brand-dark: #b83c54;
  --blue: #4168f5;
  --amber: #fff233;
  --rose: #ff6571;
  --mint: #72f1c1;
  --shadow-sm: 5px 6px 0 rgba(235, 233, 224, 0.92);
  --shadow-md: 8px 9px 0 rgba(235, 233, 224, 0.9);
  --shadow-lg: 11px 12px 0 rgba(235, 233, 224, 0.88);
  --radius: 16px;
  --font: "DM Sans", "Aptos", "Segoe UI", ui-sans-serif, system-ui, sans-serif;
  --font-display: "DM Sans", "Aptos", "Segoe UI", ui-sans-serif, system-ui, sans-serif;
  --font-note: "Caveat", "Segoe Print", cursive;
}

body {
  background:
    radial-gradient(circle at 8% 14%, rgba(53, 80, 193, 0.43), transparent 31rem),
    radial-gradient(circle at 91% 36%, rgba(126, 42, 122, 0.28), transparent 28rem),
    linear-gradient(135deg, #12184b 0%, var(--bg) 45%, #070a29 100%);
}

body::selection { background: var(--amber); color: #0b103c; }
a:hover { color: var(--amber); }
:focus-visible { outline-color: var(--amber); }

.site-header {
  position: sticky;
  top: 0;
  border-bottom-color: rgba(255, 253, 242, 0.16);
  background: rgba(8, 11, 42, 0.84);
  backdrop-filter: blur(16px);
}

.header-inner { min-height: 82px; }
.brand { color: var(--ink); font-family: var(--font); font-size: 1.12rem; font-weight: 800; letter-spacing: -0.04em; }
.brand:hover { color: var(--ink); }
.brand-mark { border-radius: 12px; background: var(--brand); color: #0b103c; box-shadow: none; }
.site-nav { gap: 4px; }
.site-nav a { border-bottom: 2px solid transparent; border-radius: 0; color: var(--ink-soft); font-weight: 750; }
.site-nav a[aria-current="page"], .site-nav a:hover { border-bottom-color: var(--amber); background: transparent; color: var(--ink); }

.eyebrow {
  margin-bottom: 14px;
  color: var(--mint);
  font-family: ui-monospace, "Cascadia Code", Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

h1, h2, h3 { color: var(--ink); font-family: var(--font-display); font-weight: 700; letter-spacing: -0.07em; line-height: 0.98; }
h1 { font-size: clamp(3.25rem, 7.1vw, 6.5rem); }
h1 .highlight { padding: 0 0.08em 0.04em; background: var(--amber); box-decoration-break: clone; -webkit-box-decoration-break: clone; color: #0b103c; }

.hero {
  grid-template-columns: minmax(0, 1.25fr) minmax(310px, 0.74fr);
  gap: clamp(38px, 7vw, 100px);
  align-items: center;
  min-height: min(720px, calc(100vh - 82px));
  padding-block: clamp(74px, 10vw, 140px) clamp(54px, 8vw, 96px);
}

.hero-copy > p:not(.eyebrow), .page-hero p, .article-dek { color: var(--ink-soft); font-size: clamp(1.05rem, 0.55vw + 0.94rem, 1.25rem); }
.hero-copy > p:not(.eyebrow) { max-width: 54ch; margin-top: 25px; }
.hero-links { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 32px; }
.hero-links a { margin: 0; }
.hero-links a + a::before { display: none; }

.button, .hero-links .button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 11px 21px;
  border: 0;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 9px 0 #a9364b;
  color: #0b103c;
  font-weight: 850;
  text-decoration: none;
  transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease;
}

.button:hover, .hero-links .button:hover { background: #ff7880; box-shadow: 0 5px 0 #a9364b; color: #0b103c; transform: translateY(4px); }
.button.secondary, .hero-links .button.secondary { border: 2px solid var(--line); background: transparent; box-shadow: none; color: var(--ink); }
.button.secondary:hover, .hero-links .button.secondary:hover { border-color: var(--amber); background: var(--amber); color: #0b103c; transform: none; }
.hero-note { margin-top: 32px !important; color: var(--mint) !important; font-family: var(--font-note); font-size: 1.4rem !important; font-weight: 700; }

.hero-visual { position: relative; display: grid; align-content: center; min-height: 425px; padding: 30px; }
.hero-visual::before { position: absolute; inset: 0; z-index: -1; border: 2px solid var(--line); border-radius: 26px; background: linear-gradient(120deg, rgba(68, 101, 246, 0.22), transparent 52%), linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent); content: ""; transform: rotate(2.5deg); }
.visual-card { width: min(100%, 292px); padding: 22px; border: 2px solid #0b103c; border-radius: 14px; background: var(--surface); box-shadow: var(--shadow-sm); color: #0b103c; transform: rotate(-3deg); }
.visual-card + .visual-card { margin-top: 26px; margin-left: auto; transform: rotate(2deg); }
.visual-card.accent { border-color: #0b103c; background: var(--amber); transform: rotate(-1deg); }
.visual-card span { display: block; color: #b83c54; font-family: ui-monospace, "Cascadia Code", Consolas, monospace; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
.visual-card strong { display: block; margin-top: 9px; font-size: clamp(1.2rem, 0.9vw + 1rem, 1.55rem); line-height: 1.08; }

.section-block { padding-block: clamp(55px, 8vw, 104px); }
.section-block.tinted { background: linear-gradient(115deg, rgba(65, 104, 245, 0.13), rgba(255, 101, 113, 0.1)); border-block: 1px solid rgba(255, 253, 242, 0.16); }
.section-heading { margin-bottom: 30px; }
.section-heading h2, .content-section h2, .takeaway h2, .related-guides h2, .page-content h2 { font-size: clamp(2.2rem, 3vw + 1rem, 4.1rem); }
.section-heading a, .related-guides a, .content-section a, .page-content a { color: var(--amber); text-decoration-thickness: 2px; }
.guide-grid, .tool-grid, .path-grid { gap: 22px; }

.guide-card, .tool-card, .path-grid a, .info-panel, .tool-panel, .page-content, .takeaway, .key-points, .related-guides {
  border: 2px solid #0b103c;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  color: #0b103c;
}
.guide-card, .tool-card, .path-grid a { padding: 25px; }
.guide-card:hover, .tool-card:hover, .path-grid a:hover { border-color: #0b103c; box-shadow: var(--shadow-md); color: #0b103c; transform: translate(-2px, -3px) rotate(-0.4deg); }
.guide-card:nth-child(3n + 2), .tool-card:nth-child(3n + 2) { background: var(--amber); }
.guide-card:nth-child(3n), .tool-card:nth-child(3n) { border-color: var(--ink); background: var(--blue); color: var(--ink); }
.guide-card:nth-child(3n) h3, .tool-card:nth-child(3n) h3, .guide-card:nth-child(3n) p, .tool-card:nth-child(3n) p { color: var(--ink); }
.guide-card:nth-child(3n) .eyebrow, .tool-card:nth-child(3n) .eyebrow { color: var(--amber); }
.guide-card:nth-child(3n) span, .tool-card:nth-child(3n) span { color: var(--mint); }
.guide-card h3, .tool-card h3, .path-grid strong { color: #0b103c; font-size: clamp(1.3rem, 0.62vw + 1.1rem, 1.75rem); line-height: 1.08; }
.guide-card p:not(.eyebrow), .tool-card p:not(.eyebrow), .path-grid span { color: #3c4165; }
.guide-card .eyebrow, .tool-card .eyebrow { color: #b83c54; }
.guide-card span, .tool-card span { color: #b83c54; font-family: ui-monospace, "Cascadia Code", Consolas, monospace; font-size: 0.78rem; font-weight: 700; }
.path-grid a { border-color: var(--line); background: transparent; box-shadow: none; color: var(--ink); }
.path-grid a:nth-child(2n) { background: rgba(255, 255, 255, 0.06); }
.path-grid a:hover { border-color: var(--amber); background: var(--amber); box-shadow: 5px 6px 0 var(--brand); }
.path-grid strong { color: var(--ink); }
.path-grid a:hover strong { color: #0b103c; }
.path-grid span { color: var(--ink-soft); }
.path-grid a:hover span { color: #36395b; }

.page-hero { padding-block: clamp(68px, 10vw, 130px) 38px; }
.article-layout, .tool-layout, .simple-page { padding-bottom: 100px; }
.article-layout { padding-top: 62px; }
.back-link { color: var(--mint); font-family: ui-monospace, "Cascadia Code", Consolas, monospace; font-size: 0.82rem; }
.back-link::before { content: "← "; margin-right: 6px; }
.article-header h1 { font-size: clamp(2.8rem, 6vw, 5.45rem); }
.article-meta { border-bottom-color: rgba(255, 253, 242, 0.16); color: var(--muted); font-family: ui-monospace, "Cascadia Code", Consolas, monospace; font-size: 0.78rem; }
.article-meta span + span::before { color: var(--amber); }
.key-points { border-color: #0b103c; background: var(--amber); box-shadow: var(--shadow-sm); }
.key-points span { color: #0b103c; }
.key-points span + span { border-left-color: #0b103c; }
.content-section { margin-top: 42px; }
.content-section p, .content-section li { color: var(--ink-soft); }
.prompt-box { padding: 21px; border: 2px solid #0b103c; border-left: 2px solid #0b103c; border-radius: 12px; background: var(--amber); box-shadow: 5px 6px 0 var(--brand); color: #0b103c; }
.decision-table { border: 2px solid var(--line); background: rgba(255, 255, 255, 0.04); color: var(--ink); }
.decision-table th, .decision-table td { border-bottom-color: rgba(255, 253, 242, 0.16); }
.decision-table th { background: var(--blue); color: var(--ink); }
.source-list { padding: 25px; border: 2px solid var(--line); background: rgba(255, 255, 255, 0.06); }
.source-list p { color: var(--muted); }
.source-list a { color: var(--mint); }
.reviewer-note { padding: 21px; border: 2px solid var(--amber); border-left: 8px solid var(--amber); background: rgba(255, 242, 51, 0.1); }
.takeaway { padding: 27px; background: var(--brand); box-shadow: 6px 7px 0 #a9364b; }
.takeaway h2, .takeaway p { color: #0b103c; }
.related-guides { padding: 25px; }

.tool-panel { padding: 27px; background: var(--surface); }
.tool-panel legend, .tool-panel label { color: #0b103c; }
input, select, textarea { border: 2px solid #4b4d69; color: #0b103c; }
input:focus, select:focus, textarea:focus { border-color: var(--blue); outline-color: rgba(65, 104, 245, 0.2); }
input[type="checkbox"] { accent-color: var(--brand); }
.tool-output { border: 2px dashed #686b87; background: #f1f0e9; color: #0b103c; }
.info-panel { background: var(--amber); }
.info-panel, .info-panel p, .info-panel h2, .page-content, .page-content h2, .page-content h3 { color: #0b103c; }
.page-content p, .page-content li { color: #3c4165; }
.page-content a { color: #b83c54; }

.site-footer { border-top-color: rgba(255, 253, 242, 0.16); background: #070a29; }
.footer-inner { padding-block: 44px; }
.footer-inner p { color: var(--muted); }
.footer-inner a { color: var(--ink-soft); }
.footer-inner a:hover { color: var(--amber); }

@media (max-width: 880px) {
  .hero { grid-template-columns: 1fr; min-height: 0; padding-top: 74px; }
  .hero-visual { max-width: 520px; min-height: 360px; }
}

@media (max-width: 680px) {
  .header-inner { padding-block: 14px; }
  h1 { font-size: clamp(2.8rem, 13vw, 4.2rem); }
  .hero-visual { min-height: auto; padding: 32px 20px; }
  .visual-card, .visual-card + .visual-card, .visual-card.accent { width: calc(100% - 20px); margin-inline: auto; }
  .visual-card + .visual-card { margin-top: 22px; }
  .key-points span + span { border-top: 2px solid #0b103c; border-left: 0; }
  .guide-grid, .tool-grid, .path-grid { gap: 17px; }
  .button, .hero-links .button { width: 100%; }
  .hero-links { width: 100%; }
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
writeFile("styles.css", css + editorialTheme);
writeFile("script.js", js);
writeFile("robots.txt", `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`);
writeFile("sitemap.xml", renderSitemap());
writeFile("ads.txt", "google.com, pub-3430860743061587, DIRECT, f08c47fec0942fa0");

console.log(`Generated ${articles.length} guides, ${toolPages.length} tools, and ${simplePages.length + 3} core pages.`);
