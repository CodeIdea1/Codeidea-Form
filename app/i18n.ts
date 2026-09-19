export type Lang = "en" | "ar";

export const t = {
  en: {
    dir: "ltr" as const,
    fontHeading: "var(--font-geist-sans)",
    fontBody: "var(--font-geist-sans)",
    fontMono: "var(--font-geist-mono)",

    earlyAccess: "Early Access",
    firstCohortLimited: "First Cohort · Limited",

    line1: ["LEARN", "TO", "BUILD"],
    line2: ["WHAT YOU ADMIRE."],
    heroSub:
      "The animations, interactions, and experiences you've been asking us how to create. Now, it's your turn.",
    joinCTA: "Join Early Access →",
    mugTip: "Grab a coffee, let's create ✨",
    firstCohortBadge: "First Cohort · Limited Early Access",
    scroll: "Scroll",

    sectionLabel01: "01 — The Question",
    questionIntro: "For months, you've been asking us the same question.",
    questionQuote: ["\"How do you build", "websites like this?\""],
    questionAccent: "websites like this?\"",
    questionClose:
      "The interactions. The motion. The feeling that a website is alive.\nWe heard you.",

    sectionLabel02: "02 — The Answer",
    answerLine1: "Now, you get to learn",
    answerLine2: "what happens behind the screen.",
    answerSub:
      "Creative development. Web animation. Interaction design. Creative coding. The thinking, techniques, and details that turn code into an experience.",
    answerBadge: "First Cohort · Coming Soon",

    sectionLabel03: "03 — The Journey",
    journeyHeadline: ["What happens after", "you join."],
    journeyAccent: "you join.",
    steps: [
      {
        num: "01",
        title: "Join",
        headline: "Put Your Name Down",
        body: "Start with a few simple details — your name, email, WhatsApp, and what you want to learn.",
        timing: null,
      },
      {
        num: "02",
        title: "Assess",
        headline: "Tell Us Where You Are",
        body: "We'll send you a short assessment to understand your current level, interests, goals, and experience.",
        timing: "Within 2–3 days",
      },
      {
        num: "03",
        title: "Discover",
        headline: "Build Your Learning Path",
        body: "Your answers help us understand where you are — and what you should learn next. No guessing. No one-size-fits-all path.",
        timing: null,
      },
      {
        num: "04",
        title: "Start",
        headline: "Your Next Step",
        body: "Once everything is ready, we'll send you the details for joining the first cohort.",
        timing: "First Cohort · Coming Soon",
      },
    ],

    sectionLabel04: "04 — What You're Joining",
    whatHeadline: ["Don't just learn to code.", "Learn to create experiences."],
    whatAccent: "Learn to create experiences.",
    disciplines: [
      "Creative Web Development",
      "Advanced Web Animation",
      "Interactive Experiences",
      "Motion & Interaction",
      "Creative Coding",
    ],
    whatFootnote:
      "This is only a glimpse. The full curriculum comes after the assessment — because where you start matters.",

    sectionLabel05: "05 — Early Access",
    formHeadline: ["Your first step", "starts here."],
    formAccent: "starts here.",
    formSub:
      "One minute to tell us who you are and what you want to build.",
    labelName: "Full Name",
    labelEmail: "Email Address",
    labelWhatsapp: "WhatsApp Number",
    labelInterest: "What do you want to learn?",
    placeholderName: "Your full name",
    placeholderEmail: "your@email.com",
    placeholderWhatsapp: "+1 234 567 8900",
    placeholderInterest: "Select an area",
    interests: [
      "Web Development",
      "Web Animation",
      "Creative Development",
      "Interaction & Motion",
      "Everything",
      "Other",
    ],
    submitCTA: "Join Early Access →",
    submitting: "Joining Early Access...",
    formDisclaimer:
      "No payment. No commitment. Just your place in the first cohort queue.",
    errRequired: "Required",
    errEmail: "Valid email required",
    errPhone: "Valid number required",

    successTitle: "YOU'RE IN.",
    successSub:
      "Your place on the Early Access list is confirmed.\nWe'll send your assessment by email or WhatsApp as soon as it's ready.",
    miniJourney: [
      { status: "NOW", label: "Early Access confirmed", done: true },
      { status: "NEXT", label: "Assessment arrives", done: false },
      { status: "THEN", label: "Find your learning path", done: false },
      { status: "SOON", label: "First cohort begins", done: false },
    ],

    footerLeft: "Early Access · First Cohort",
    footerRight: "Limited · Assessment Based",

    menu: [
      { num: "00", label: "Start", section: 0 },
      { num: "01", label: "The Question", section: 1 },
      { num: "02", label: "The Answer", section: 2 },
      { num: "03", label: "The Journey", section: 3 },
      { num: "04", label: "What You're Joining", section: 4 },
      { num: "05", label: "Early Access", section: 5 },
    ],
    menuBrand: "MORS",
    menuClose: "Close",
    menuCopyright: "© 2026 MORS",
  },

  ar: {
    dir: "rtl" as const,
    fontHeading: "var(--font-arabic)",
    fontBody: "var(--font-arabic)",
    fontMono: "var(--font-arabic)",

    earlyAccess: "وصول مبكر",
    firstCohortLimited: "الدفعة الأولى · أماكن محدودة",

    line1: ["تعلّم أن تبني", "ما يبهرك."],
    line2: [],
    heroSub:
      "الأنيميشن، التفاعل، والتجارب اللي دايمًا بتسألونا: كيف بنعملها؟\nدلوقتي، دورك تبنيها.",
    joinCTA: "انضم للوصول المبكر ←",
    mugTip: "احضر قهوتك، وهيا نبدع ✨",
    firstCohortBadge: "الدفعة الأولى · وصول مبكر محدود",
    scroll: "اكتشف",

    sectionLabel01: "٠١ — السؤال",
    questionIntro: "من شهور وأنتم تسألوننا نفس السؤال.",
    questionQuote: ["\"كيف تبنون مواقع", "بهالمستوى؟\""],
    questionAccent: "بهالمستوى؟\"",
    questionClose:
      "الحركة. التفاعل. الإحساس إن الموقع حيّ.\nسمعناكم.",

    sectionLabel02: "٠٢ — الجواب",
    answerLine1: "دلوقتي، هتتعلم",
    answerLine2: "إيه اللي بيحصل ورا الشاشة.",
    answerSub:
      "التطوير الإبداعي. أنيميشن الويب. تصميم التفاعل. البرمجة الإبداعية. طريقة التفكير، والتقنيات، والتفاصيل اللي بتحوّل الكود إلى تجربة.",
    answerBadge: "الدفعة الأولى · قريبًا",

    sectionLabel03: "٠٣ — الرحلة",
    journeyHeadline: ["إيه اللي بيحصل", "بعد ما تنضم؟"],
    journeyAccent: "بعد ما تنضم؟",
    steps: [
      {
        num: "٠١",
        title: "انضم",
        headline: "ابدأ من هنا",
        body: "ابدأ ببعض البيانات البسيطة — اسمك، إيميلك، رقم واتساب، وإيه اللي حابب تتعلمه.",
        timing: null,
      },
      {
        num: "٠٢",
        title: "قيّم",
        headline: "خلّينا نعرف مستواك",
        body: "هنبعتلك تقييم قصير يساعدنا نفهم مستواك الحالي، اهتماماتك، أهدافك، وخبرتك.",
        timing: "خلال يومين إلى ثلاثة",
      },
      {
        num: "٠٣",
        title: "اكتشف",
        headline: "نحدد طريق تعلّمك",
        body: "إجاباتك بتساعدنا نعرف أنت فين دلوقتي — وإيه اللي محتاج تتعلمه بعد كده.\nمن غير تخمين. ومن غير مسار واحد للجميع.",
        timing: null,
      },
      {
        num: "٠٤",
        title: "ابدأ",
        headline: "خطوتك الجاية",
        body: "لما كل شيء يكون جاهز، هنبعتلك تفاصيل الانضمام للدفعة الأولى.",
        timing: "الدفعة الأولى · قريبًا",
      },
    ],

    sectionLabel04: "٠٤ — ماذا ستتعلّم",
    whatHeadline: ["مش بس هتتعلم تكتب كود.", "هتتعلم تصنع تجارب."],
    whatAccent: "هتتعلم تصنع تجارب.",
    disciplines: [
      "تطوير الويب الإبداعي",
      "أنيميشن الويب المتقدم",
      "التجارب التفاعلية",
      "الحركة والتفاعل",
      "البرمجة الإبداعية",
    ],
    whatFootnote:
      "دي مجرد لمحة. المنهج الكامل بييجي بعد التقييم — لأن البداية الصح بتفرق.",

    sectionLabel05: "٠٥ — الوصول المبكر",
    formHeadline: ["خطوتك الأولى", "تبدأ من هنا."],
    formAccent: "تبدأ من هنا.",
    formSub:
      "دقيقة واحدة نعرف فيها أنت مين، وإيه اللي نفسك تبنيه.",
    labelName: "اسمك الكامل",
    labelEmail: "الإيميل",
    labelWhatsapp: "رقم واتساب",
    labelInterest: "إيه اللي حابب تتعلمه؟",
    placeholderName: "اكتب اسمك هنا",
    placeholderEmail: "your@email.com",
    placeholderWhatsapp: "+20 1X XXX XXXX",
    placeholderInterest: "اختار مجال",
    interests: [
      "تطوير الويب",
      "أنيميشن الويب",
      "التطوير الإبداعي",
      "الحركة والتفاعل",
      "كل شيء",
      "غير ذلك",
    ],
    submitCTA: "انضم للوصول المبكر ←",
    submitting: "جاري الانضمام...",
    formDisclaimer:
      "مفيش دفع. مفيش التزام. بس مكانك في قائمة الدفعة الأولى.",
    errRequired: "هذا الحقل مطلوب",
    errEmail: "أدخل إيميل صحيح",
    errPhone: "أدخل رقم صحيح",

    successTitle: "أنت على القائمة.",
    successSub:
      "تم تأكيد مكانك في قائمة الوصول المبكر.\nهنبعتلك التقييم على واتساب أو الإيميل بمجرد ما يكون جاهز.",
    miniJourney: [
      { status: "الآن", label: "تم تأكيد مكانك", done: true },
      { status: "التالي", label: "يوصلك التقييم", done: false },
      { status: "بعدها", label: "تعرف مسار تعلّمك", done: false },
      { status: "قريبًا", label: "تبدأ الدفعة الأولى", done: false },
    ],

    footerLeft: "وصول مبكر · الدفعة الأولى",
    footerRight: "أماكن محدودة · بناءً على التقييم",

    menu: [
      { num: "٠٠", label: "البداية", section: 0 },
      { num: "٠١", label: "السؤال", section: 1 },
      { num: "٠٢", label: "الجواب", section: 2 },
      { num: "٠٣", label: "الرحلة", section: 3 },
      { num: "٠٤", label: "ماذا ستتعلّم", section: 4 },
      { num: "٠٥", label: "الوصول المبكر", section: 5 },
    ],
    menuBrand: "MORS",
    menuClose: "إغلاق",
    menuCopyright: "© ٢٠٢٦ MORS",
  },
} as const;

export type Translations = typeof t.en | typeof t.ar;