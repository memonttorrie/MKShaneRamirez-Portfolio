// Shared factual source for the browser fallback and the Cloudflare Worker.
export const KNOWLEDGE = {
  person: {
    name: "Ma. Khrisha Shane Ramirez",
    shortName: "Shane",
    role: "Year 4 Computer Engineering student at José Rizal University, graduating in 2027",
    location: "Pasig, Philippines",
    availability: "Open to internship opportunities in data analytics, including work with Python, SQL, Excel, and machine learning.",
    about: "Shane is in her fourth year of Computer Engineering at José Rizal University. She is learning by building NLP and computer-vision experiments, Python data projects, and Excel work that makes information easier to use. Before focusing on tech, she spent more than three years working with clients, leads, and business needs. That experience shaped her approach: start with a useful question, do careful work, then explain what someone can do with the answer."
  },
  skills: [
    { name: "Python (pandas, scikit-learn)", selfRated: 85 },
    { name: "Data cleaning and visualization", selfRated: 85 },
    { name: "Microsoft Excel", selfRated: 90 },
    { name: "NLP and text classification", selfRated: 70 },
    { name: "PyTorch", selfRated: 65 },
    { name: "MySQL", selfRated: 65 },
    { name: "Power BI", selfRated: 60 },
    { name: "Model evaluation (F1, confusion matrix)", selfRated: 75 }
  ],
  tools: ["Slack", "Visual Studio Code", "Hugging Face", "Canva", "HubSpot", "Google Workspace", "MySQL", "Excel", "Power BI", "Supabase", "Apify Console"],
  strengths: [
    "Customer communication: built through customer service and client-facing work.",
    "Outbound sales: experience with outbound sales accounts and outreach.",
    "Lead generation: finding prospects and maintaining organized lead pipelines.",
    "Coordination: coordinating schedules, records, and follow-up across work."
  ],
  projects: [
    { area: "NLP", title: "Taglish Real Estate Text Classification", description: "Classified Taglish listings into four property types and buyer inquiries into three sentiment classes. Compared TF-IDF with Logistic Regression and SVM against fine-tuned XLM-RoBERTa.", tools: ["Python", "scikit-learn", "PyTorch", "Hugging Face"], status: "Student and portfolio project" },
    { area: "Computer vision", title: "AI Image Classification for Waste", description: "Classified four waste categories from images with 91% accuracy using a PyTorch CNN trained on 1,250 labeled images.", tools: ["PyTorch", "CNN"], status: "Student and portfolio project" },
    { area: "Signal processing", title: "Face Detection with DSP Enhancement", description: "Improved detection stability in a real-time detector using Gaussian, median, and FFT filters on noisy frames.", tools: ["OpenCV", "FFT", "DNN"], status: "Student and portfolio project" },
    { area: "Predictive modeling", title: "Student Performance Prediction", description: "An early-warning model to flag first-year students who may need a tutor, comparing Linear Regression, Logistic Regression, and KNN on survey data.", tools: ["Regression", "KNN", "Survey data"], status: "Student and portfolio project" },
    { area: "Excel analytics", title: "Real Estate Leads Database", description: "A multi-sheet leads database with analysis sheets and charts, built on synthetic US and Australian market data.", tools: ["Excel", "Charts"], status: "Student and portfolio project" },
    { area: "Thesis", title: "AI Textile Sorting", description: "Shane was Thesis Team Leader on a computer-vision system that classifies post-consumer garments for reuse or recycling.", tools: ["Computer vision", "Classification"], status: "Thesis project" },
    { area: "Property inquiry funnel concept", title: "Real Estate Lead Funnel", description: "A property-sales funnel for a Metro Manila real-estate virtual assistant, showing how buyer inquiries move toward qualification, viewings, and reservations.", tools: ["HTML", "CSS", "Responsive UI"], status: "Portfolio concept; sample figures and static form" },
    { area: "B2B prospecting funnel concept", title: "SuiteLine PH Funnel", description: "A B2B outbound prospecting funnel for Philippine sales teams, presenting executive contact-list packages and a free sample request.", tools: ["HTML", "CSS", "Conversion design"], status: "Portfolio concept; sample pricing and static form" },
    { area: "Sales analytics", title: "Funnelcast · US Sales Funnel & Forecast", description: "An interactive funnel prototype using a 146-prospect US sample, editable stage conversion rates, deal value, and annual target to forecast expected deals and revenue. Funnel stage rates and targets are editable assumptions, not verified business results.", tools: ["HTML", "CSS", "JavaScript", "Forecasting"], status: "Portfolio concept with sample assumptions" }
  ],
  roadmap: [
    { title: "Interactive Analytics Dashboard", description: "A clean dashboard that turns a real-world dataset into a few useful, explorable insights.", status: "Planned idea, not completed" },
    { title: "Filipino Language Explorer", description: "An experiment in classifying Filipino and Taglish text, with a focus on transparent model evaluation.", status: "Planned idea, not completed" },
    { title: "Smarter Textile Sorting", description: "A next iteration of the thesis direction: explore how visual features can support more practical garment sorting.", status: "Planned idea, not completed" },
    { title: "Student Support Signals", description: "Explore a responsible early-warning dashboard that helps educators spot when students may need support.", status: "Planned idea, not completed" }
  ],
  careerJourney: ["Data Analyst", "Data Scientist", "AI / ML"],
  experience: [
    { dates: "Dec 2024 – Jan 2026", role: "Lead Generation Specialist", employer: "Landco Pacific Corporation", arrangement: "Remote", description: "Scraped and compiled 3,000–5,000 leads with Python and Excel, then managed a pipeline of 150+ leads per month." },
    { dates: "Oct 2025 – Jul 2026", role: "Liaison Officer (Freelance)", employer: "YLT Construction Services", arrangement: "Hybrid", description: "Maintained legal documents and daily construction reports; coordinated site manpower schedules." },
    { dates: "Mar 2023 – Present (as listed on the site)", role: "Real Estate Property Specialist", employer: "Prince Jun Development Corp.", arrangement: "Part-time", description: "Processed property title and ownership documents for condo and rental clients." },
    { dates: "Nov 2021 – Nov 2023", role: "Customer Service Representative", employer: "Inspiro Relia Inc.", arrangement: "Outbound sales account", description: "The site lists the role and dates but does not include a role description." }
  ],
  certifications: {
    dataAndTechnology: [
      "AWS Academy Cloud Foundations",
      "AWS Academy Machine Learning Foundations",
      "AWS Academy Machine Learning for NLP",
      "AWS AI Practitioner Exam Prep",
      "Data Science Essentials with Python (Cisco Networking Academy)",
      "Google Data Analytics Foundations (Google / Coursera)"
    ],
    growth: [
      "Enactus Philippines National Competition (Team Leader, Top 60)",
      "Administrative Professional Foundations (LinkedIn Learning)",
      "Career Essentials in Administrative Assistance (Microsoft and LinkedIn)",
      "Real Estate Appraisal (Coursera)",
      "Advanced Lead Generation (LinkedIn Learning)",
      "Note Taking for Business Professionals (LinkedIn Learning)",
      "Sales Strategies and Approaches (LinkedIn Learning)"
    ],
    total: 13
  },
  framework: {
    workflow: [
      { title: "Understand the question", description: "Clarify who needs an answer, what decision it should support, and what a useful result would look like.", tools: ["Goal setting", "Context", "Success criteria"] },
      { title: "Prepare the data", description: "Inspect available data, check quality, handle missing or inconsistent values, and document important limitations.", tools: ["Python", "pandas", "Excel"] },
      { title: "Explore and model", description: "Use exploratory analysis and suitable statistical or machine-learning methods to look for patterns and test assumptions.", tools: ["EDA", "scikit-learn", "Model evaluation"] },
      { title: "Explain the result", description: "Present the important findings clearly, note uncertainty, and suggest realistic next steps for the people using the work.", tools: ["Visualization", "Storytelling", "Iteration"] }
    ],
    areas: [
      { title: "Data preparation", description: "Cleaning, organizing, and checking datasets so analysis starts from a more dependable foundation.", tools: ["Python", "pandas", "Excel"] },
      { title: "Data analysis & visualization", description: "Exploring trends, summarizing results, and presenting information in a way that supports understanding.", tools: ["Matplotlib", "Power BI", "Excel"] },
      { title: "Machine-learning exploration", description: "Building and comparing introductory classification and prediction models with attention to evaluation.", tools: ["scikit-learn", "PyTorch", "F1 / confusion matrix"] },
      { title: "NLP & computer vision", description: "Coursework and project work exploring text classification, image classification, and practical model workflows.", tools: ["Hugging Face", "NLP", "OpenCV"] },
      { title: "Business & lead operations", description: "Bringing client-facing experience and lead pipeline coordination into data-oriented problem solving.", tools: ["Lead generation", "Communication", "Coordination"] },
      { title: "Clear communication", description: "Connecting technical work to the original question and describing limitations and takeaways plainly.", tools: ["Documentation", "Presentations", "Collaboration"] }
    ],
    note: "These are areas Shane has studied and applied in coursework, personal projects, or professional experience, not promised commercial services. Skill percentages are self-assessed, not formal test scores."
  },
  contact: {
    location: "Pasig, Philippines",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/shaneramirezva" },
      { label: "GitHub", url: "https://github.com/memonttorrie" },
      { label: "Behance", url: "https://www.behance.net/shaneramirez3/projects" },
      { label: "Medium", url: "https://medium.com/@memonttorie" }
    ],
    resume: "resume/Resume_ShaneRamirez.pdf",
    emailStatus: "The current email button points to the placeholder you@example.com, so the assistant must not present it as a working address."
  },
  fallbackAnswers: [
    { topic: "internship", keywords: ["internship", "intern", "recruiter", "recruiting", "hire", "hiring", "candidate", "resume", "cv", "availability", "available"], answer: "Shane is open to data analytics internships and is in Year 4 of Computer Engineering, graduating in 2027. Her listed experience includes Python, SQL/MySQL, Excel, data analysis, and machine-learning projects such as Taglish NLP and waste image classification. For a fuller overview, use Get my resume or Get in touch." },
    { topic: "Funnelcast project", keywords: ["funnelcast", "sales funnel", "forecast", "146 prospects", "revenue forecast"], answer: "Funnelcast is an interactive sales-funnel and forecasting concept based on a 146-prospect US sample. Visitors can adjust stage-conversion rates, average deal value, and an annual target to see the projected deals, revenue, and target gap. The rates and targets are editable assumptions, not verified sales results." },
    { topic: "projects", keywords: ["project", "projects", "built", "portfolio", "work", "sample", "thesis"], answer: "The portfolio features projects in Taglish NLP, waste image classification, face detection, student performance prediction, Excel lead analysis, textile sorting, and a real-estate lead-funnel persona page. They’re student, thesis, or portfolio concepts, so they show learning and applied practice rather than production guarantees." },
    { topic: "Taglish NLP project", keywords: ["taglish", "nlp", "text classification", "roberta", "sentiment", "property types"], answer: "The Taglish real-estate text project classified listings into four property types and buyer inquiries into three sentiment classes. Shane compared TF-IDF with Logistic Regression and SVM against fine-tuned XLM-RoBERTa, using Python, scikit-learn, PyTorch, and Hugging Face." },
    { topic: "waste image classification project", keywords: ["waste", "image classification", "computer vision", "cnn", "images", "91 accuracy"], answer: "The waste image classifier sorted images into four categories and reached 91% accuracy on 1,250 labeled images with a PyTorch CNN. That result describes this project dataset; it isn’t a claim of production performance." },
    { topic: "face detection project", keywords: ["face detection", "dsp", "fft", "noisy frames", "opencv"], answer: "The face-detection project aimed to improve stability in a real-time detector by testing Gaussian, median, and FFT filters on noisy frames. It used OpenCV, FFT, and a DNN." },
    { topic: "student performance project", keywords: ["student performance", "tutor", "early warning", "regression", "knn"], answer: "The student performance project explored an early-warning model for first-year students who may need a tutor. It compared Linear Regression, Logistic Regression, and KNN on survey data." },
    { topic: "real-estate leads project", keywords: ["real estate leads", "leads database", "excel database", "synthetic data"], answer: "The Excel real-estate leads database used synthetic US and Australian market data. It had multiple sheets for the database, analysis, and charts." },
    { topic: "textile sorting thesis", keywords: ["textile sorting", "garment sorting", "thesis", "reuse", "recycling"], answer: "Shane was the Thesis Team Leader on an academic computer-vision system that classifies post-consumer garments for reuse or recycling. A planned smarter-sorting iteration is still a roadmap idea." },
    { topic: "skills", keywords: ["skill", "skills", "tools", "tool", "python", "sql", "excel", "power bi", "machine learning", "nlp", "pytorch", "mysql"], answer: "Shane’s listed skills include Excel, Python with pandas and scikit-learn, data cleaning and visualization, model evaluation, NLP, PyTorch, MySQL, and Power BI. The percentages on the site are self-ratings, so they’re best read as a snapshot of current experience, not formal proficiency scores." },
    { topic: "career path", keywords: ["career path", "career journey", "long term goal", "career goals", "data scientist", "career aspiration"], answer: "Shane’s stated goal is to grow from data analyst toward data scientist, then build skills to bring useful AI and machine-learning systems into the real world. It’s a direction she is working toward, not a claim that she has already reached those roles." },
    { topic: "experience", keywords: ["experience", "job", "career", "employer", "work history", "lead generation", "customer service"], answer: "Shane’s background combines lead generation, real-estate property support, construction coordination, and customer service. That client-facing experience informs how she frames useful data questions and communicates results." },
    { topic: "certifications", keywords: ["certificate", "certificates", "certification", "credential", "course"], answer: "The portfolio lists 13 certificates across AWS Academy, AWS Skills Centers, Cisco Networking Academy, Google/Coursera, Enactus, Microsoft and LinkedIn, and LinkedIn Learning. The Certificates section has the full list and PDF previews." },
    { topic: "contact", keywords: ["contact", "email", "reach", "linkedin", "github", "resume", "behance", "medium"], answer: "You can reach Shane through the LinkedIn or GitHub links in the Contact section, or download her resume from the sidebar. The site’s email button is currently a placeholder, so LinkedIn or GitHub is the reliable route for now." },
    { topic: "roadmap", keywords: ["future", "roadmap", "planned", "next project", "plans"], answer: "The roadmap includes an analytics dashboard, a Filipino/Taglish text-classification explorer, another textile-sorting iteration, and a student-support dashboard. Those are planned explorations, not completed projects." },
    { topic: "framework", keywords: ["framework", "workflow", "process", "approach", "how work"], answer: "Shane’s framework is to understand the question, prepare and check the data, explore or model, then explain findings and limitations. That keeps the analysis connected to a real decision instead of treating a model score as the whole answer." },
    { topic: "learning advice", keywords: ["learn data analytics", "learning data analytics", "start data analytics", "begin data analytics", "career advice", "how do i learn", "how to learn"], answer: "A practical way to learn data analytics is to pick a small question, clean a real dataset in spreadsheets or Python, summarize what you find, and explain what the result can’t tell you. A finished, clearly described project usually teaches more than collecting tools without using them. Shane’s portfolio follows that question-to-insight approach in her own student projects." }
  ]
};

if (typeof window !== "undefined") window.PORTFOLIO_KNOWLEDGE = KNOWLEDGE;
