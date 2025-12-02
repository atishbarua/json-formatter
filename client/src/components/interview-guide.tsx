import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; // Make sure you have this or use a <hr />
import {
    ArrowLeft,
    BookOpen,
    Search,
    ExternalLink,
    Code2,
    Database,
    Globe,
    Layers,
    Star,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { Helmet } from "react-helmet-async";

// 1. Data Structure with 'popular' flag
type Category = "All" | "Frontend" | "Backend" | "DevOps" | "Interview" | "Tools";

interface Resource {
    title: string;
    url: string;
    description: string;
    source: string;
    category: Category;
    tags: string[];
    popular: boolean; // <--- NEW FLAG
}

// 2. Mock Data (You can add 100+ here)
const resources: Resource[] = [
    // --- POPULAR ITEMS (These show first) ---
    {
        title: "React Official Documentation",
        url: "https://react.dev/",
        description: "The new, interactive guide to learning React hooks.",
        source: "React Team",
        category: "Frontend",
        tags: ["react", "javascript", "official"],
        popular: true
    },
    {
        title: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        description: "The official guide to mastering the type system.",
        source: "Microsoft",
        category: "Frontend",
        tags: ["typescript", "microsoft"],
        popular: true
    },
    {
        title: "Laravel Documentation",
        url: "https://laravel.com/docs",
        description: "Documentation for the most popular PHP framework.",
        source: "Laravel",
        category: "Backend",
        tags: ["php", "laravel"],
        popular: true
    },
    {
        title: "System Design Primer",
        url: "https://github.com/donnemartin/system-design-primer",
        description: "Learn how to design large-scale systems.",
        source: "GitHub",
        category: "Backend",
        tags: ["architecture", "system design"],
        popular: true
    },

    // --- THE REST (Hidden by default until searched or expanded) ---
    {
        title: "Redux Interview Questions",
        url: "https://www.naukri.com/code360/library/redux-interview-questions",
        description: "Deep dive into store, reducers, and actions.",
        source: "Naukri",
        category: "Interview",
        tags: ["react", "redux", "state"],
        popular: false
    },
    {
        title: "React TypeScript Cheatsheet",
        url: "https://react-typescript-cheatsheet.netlify.app/",
        description: "The ultimate guide to typing React components.",
        source: "Community",
        category: "Frontend",
        tags: ["react", "typescript"],
        popular: false
    },
    {
        title: "PHP The Right Way",
        url: "https://phptherightway.com/",
        description: "Best practices for modern PHP development.",
        source: "Community",
        category: "Backend",
        tags: ["php", "best practices"],
        popular: false
    },
    {
        title: "Docker for Beginners",
        url: "https://docker-curriculum.com/",
        description: "A comprehensive tutorial on Docker.",
        source: "Prakhar S.",
        category: "DevOps",
        tags: ["docker", "containers"],
        popular: false
    },
    {
        title: "HTTP Status Codes",
        url: "https://http.cat/",
        description: "Visual guide to HTTP status codes with cats.",
        source: "Community",
        category: "Backend",
        tags: ["http", "api", "funny"],
        popular: false
    },
    // ==================== FRONTEND (React, TS, CSS) ====================
    {
        title: "React Patterns",
        url: "https://reactpatterns.com/",
        description: "A concise list of design patterns and component techniques.",
        source: "Community",
        category: "Frontend",
        tags: ["react", "patterns", "advanced"],
        popular: false
    },
    {
        title: "Redux Toolkit",
        url: "https://redux-toolkit.js.org/",
        description: "The official, opinionated, batteries-included toolset for efficient Redux.",
        source: "Redux Team",
        category: "Frontend",
        tags: ["react", "redux", "state"],
        popular: false
    },
    {
        title: "Zustand State Management",
        url: "https://github.com/pmndrs/zustand",
        description: "A small, fast and scalable bearbones state-management solution.",
        source: "Poimandres",
        category: "Frontend",
        tags: ["react", "state", "library"],
        popular: false
    },
    {
        title: "TanStack Query (React Query)",
        url: "https://tanstack.com/query/latest",
        description: "Powerful asynchronous state management for TS/JS.",
        source: "TanStack",
        category: "Frontend",
        tags: ["react", "api", "async"],
        popular: true
    },
    {
        title: "Tailwind CSS Cheatsheet",
        url: "https://nerdcave.com/tailwind-cheat-sheet",
        description: "Quickly find class names and responsive variants.",
        source: "Nerdcave",
        category: "Frontend",
        tags: ["css", "tailwind", "design"],
        popular: false
    },
    {
        title: "Modern JavaScript Tutorial",
        url: "https://javascript.info/",
        description: "From basic to advanced concepts with simple, detailed explanations.",
        source: "JS.info",
        category: "Frontend",
        tags: ["javascript", "basics", "es6"],
        popular: true
    },
    {
        title: "TypeScript Deep Dive",
        url: "https://basarat.gitbook.io/typescript/",
        description: "The definitive guide to TypeScript's internal workings.",
        source: "Basarat",
        category: "Frontend",
        tags: ["typescript", "advanced", "book"],
        popular: false
    },
    {
        title: "CSS Grid Garden",
        url: "https://cssgridgarden.com/",
        description: "A game for learning CSS Grid layout.",
        source: "Codepip",
        category: "Frontend",
        tags: ["css", "game", "grid"],
        popular: false
    },
    {
        title: "Flexbox Froggy",
        url: "https://flexboxfroggy.com/",
        description: "A game for learning CSS Flexbox.",
        source: "Codepip",
        category: "Frontend",
        tags: ["css", "game", "flexbox"],
        popular: false
    },
    {
        title: "Next.js Documentation",
        url: "https://nextjs.org/docs",
        description: "The React Framework for the Web.",
        source: "Vercel",
        category: "Frontend",
        tags: ["react", "nextjs", "ssr"],
        popular: false
    },
    {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org/",
        description: "The most complete reference for HTML, CSS, JS, APIs.",
        source: "Mozilla",
        category: "Frontend",
        tags: ["html", "css", "javascript"],
        popular: true
    },
    {
        title: "CSS Tricks",
        url: "https://css-tricks.com/",
        description: "Tips, tricks, and guides for modern CSS.",
        source: "Community",
        category: "Frontend",
        tags: ["css", "design", "frontend"],
        popular: false
    },
    {
        title: "You Don't Know JS",
        url: "https://github.com/getify/You-Dont-Know-JS",
        description: "A deep dive book series on core JavaScript mechanics.",
        source: "GitHub",
        category: "Frontend",
        tags: ["javascript", "advanced", "book"],
        popular: true
    },
    {
        title: "ES6 Features",
        url: "https://github.com/lukehoban/es6features",
        description: "A quick overview of new ES6/ES2015 features.",
        source: "GitHub",
        category: "Frontend",
        tags: ["javascript", "es6", "reference"],
        popular: false
    },
    {
        title: "Storybook",
        url: "https://storybook.js.org/",
        description: "UI component explorer for building design systems.",
        source: "Storybook",
        category: "Frontend",
        tags: ["react", "ui", "storybook"],
        popular: false
    },
    {
        title: "Framer Motion Docs",
        url: "https://www.framer.com/motion/",
        description: "Powerful animation library for React.",
        source: "Framer",
        category: "Frontend",
        tags: ["react", "animation"],
        popular: false
    },
    {
        title: "Web.dev",
        url: "https://web.dev/",
        description: "Google's official modern web development learning hub.",
        source: "Google",
        category: "Frontend",
        tags: ["performance", "seo", "accessibility"],
        popular: true
    },
    {
        title: "Bundlephobia",
        url: "https://bundlephobia.com/",
        description: "Find the cost of adding an npm package to your bundle.",
        source: "Community",
        category: "Frontend",
        tags: ["tools", "npm", "performance"],
        popular: false
    },
    {
        title: "Vite Documentation",
        url: "https://vitejs.dev/guide/",
        description: "Modern build tool that is extremely fast.",
        source: "Vite",
        category: "Frontend",
        tags: ["build", "tooling", "vite"],
        popular: false
    },
    {
        title: "Web Accessibility Guide",
        url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/",
        description: "Core principles of web accessibility.",
        source: "W3C",
        category: "Frontend",
        tags: ["accessibility", "a11y"],
        popular: false
    },


    // ==================== BACKEND (PHP, Node, DB) ====================
    {
        title: "PHP: The Right Way",
        url: "https://phptherightway.com/",
        description: "An easy-to-read, quick reference for PHP best practices.",
        source: "Community",
        category: "Backend",
        tags: ["php", "standards", "guide"],
        popular: true
    },
    {
        title: "Laravel Best Practices",
        url: "https://github.com/alexeymezenin/laravel-best-practices",
        description: "Common pitfalls and how to avoid them in Laravel.",
        source: "GitHub",
        category: "Backend",
        tags: ["php", "laravel", "clean code"],
        popular: false
    },
    {
        title: "Laracasts",
        url: "https://laracasts.com/",
        description: "The best video tutorials for Laravel, Vue, and PHP.",
        source: "Jeffrey Way",
        category: "Backend",
        tags: ["php", "video", "learning"],
        popular: false
    },
    {
        title: "Composer Documentation",
        url: "https://getcomposer.org/doc/",
        description: "Dependency Manager for PHP.",
        source: "Composer",
        category: "Backend",
        tags: ["php", "tools", "dependencies"],
        popular: false
    },
    {
        title: "Node.js Best Practices",
        url: "https://github.com/goldbergyoni/nodebestpractices",
        description: "The largest compilation of Node.js best practices.",
        source: "GitHub",
        category: "Backend",
        tags: ["node", "javascript", "backend"],
        popular: false
    },
    {
        title: "NestJS Documentation",
        url: "https://docs.nestjs.com/",
        description: "A progressive Node.js framework for building efficient server-side apps.",
        source: "NestJS",
        category: "Backend",
        tags: ["node", "nestjs", "typescript"],
        popular: false
    },
    {
        title: "PostgreSQL Exercises",
        url: "https://pgexercises.com/",
        description: "Learn SQL by doing exercises.",
        source: "PGExercises",
        category: "Backend",
        tags: ["sql", "database", "practice"],
        popular: false
    },
    {
        title: "Redis Crash Course",
        url: "https://redis.io/docs/getting-started/",
        description: "In-memory data structure store, used as a database, cache, and broker.",
        source: "Redis",
        category: "Backend",
        tags: ["database", "caching", "nosql"],
        popular: false
    },
    {
        title: "12 Factor App",
        url: "https://12factor.net/",
        description: "A methodology for building modern, scalable, maintainable software-as-a-service apps.",
        source: "Heroku",
        category: "Backend",
        tags: ["architecture", "devops", "theory"],
        popular: true
    },
    {
        title: "Express.js Guide",
        url: "https://expressjs.com/",
        description: "Fast, unopinionated, minimalist web framework for Node.js.",
        source: "Express",
        category: "Backend",
        tags: ["node", "express"],
        popular: true
    },
    {
        title: "FastAPI Docs",
        url: "https://fastapi.tiangolo.com/",
        description: "Modern, fast Python framework for APIs.",
        source: "FastAPI",
        category: "Backend",
        tags: ["python", "api"],
        popular: true
    },
    {
        title: "Python Official Docs",
        url: "https://docs.python.org/3/",
        description: "Complete Python language documentation.",
        source: "Python",
        category: "Backend",
        tags: ["python", "language"],
        popular: false
    },
    {
        title: "MongoDB University",
        url: "https://www.mongodb.com/university",
        description: "Free MongoDB training and certifications.",
        source: "MongoDB",
        category: "Backend",
        tags: ["database", "nosql"],
        popular: false
    },
    {
        title: "Redis Commands",
        url: "https://redis.io/commands/",
        description: "Official reference for Redis commands.",
        source: "Redis",
        category: "Backend",
        tags: ["redis", "cache"],
        popular: false
    },
    {
        title: "SQLBolt",
        url: "https://sqlbolt.com/",
        description: "Interactive lessons to learn SQL basics.",
        source: "SQLBolt",
        category: "Backend",
        tags: ["sql", "database"],
        popular: true
    },
    {
        title: "Prisma Docs",
        url: "https://www.prisma.io/docs",
        description: "Next-gen Node.js ORM with type-safety.",
        source: "Prisma",
        category: "Backend",
        tags: ["orm", "node", "database"],
        popular: false
    },
    {
        title: "Supabase Docs",
        url: "https://supabase.com/docs",
        description: "Open-source Firebase alternative.",
        source: "Supabase",
        category: "Backend",
        tags: ["database", "auth"],
        popular: false
    },
    {
        title: "RabbitMQ Tutorials",
        url: "https://www.rabbitmq.com/getstarted.html",
        description: "Messaging and queues made simple.",
        source: "RabbitMQ",
        category: "Backend",
        tags: ["queue", "mq", "messaging"],
        popular: false
    },
    {
        title: "API Security Checklist",
        url: "https://github.com/shieldfy/API-Security-Checklist",
        description: "Best practices to secure your APIs.",
        source: "GitHub",
        category: "Backend",
        tags: ["security", "api"],
        popular: true
    },


    // ==================== DEVOPS & TOOLS ====================
    {
        title: "Git-scm Book",
        url: "https://git-scm.com/book/en/v2",
        description: "Pro Git: The official book available online for free.",
        source: "Git",
        category: "DevOps",
        tags: ["git", "version control", "book"],
        popular: false
    },
    {
        title: "Oh Shit, Git!?!",
        url: "https://ohshitgit.com/",
        description: "Recipes for getting out of Git mistakes.",
        source: "Community",
        category: "DevOps",
        tags: ["git", "fixes", "funny"],
        popular: false
    },
    {
        title: "Docker Curriculum",
        url: "https://docker-curriculum.com/",
        description: "A comprehensive tutorial on getting started with Docker.",
        source: "Prakhar",
        category: "DevOps",
        tags: ["docker", "containers", "tutorial"],
        popular: false
    },
    {
        title: "Kubernetes Basics",
        url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
        description: "Learn the basics of K8s cluster orchestration.",
        source: "CNCF",
        category: "DevOps",
        tags: ["kubernetes", "scaling", "cloud"],
        popular: false
    },
    {
        title: "Nginx Config Generator",
        url: "https://www.digitalocean.com/community/tools/nginx",
        description: "The easiest way to configure a performant, secure, and stable NGINX server.",
        source: "DigitalOcean",
        category: "DevOps",
        tags: ["nginx", "server", "tools"],
        popular: false
    },
    {
        title: "GitHub Actions Documentation",
        url: "https://docs.github.com/en/actions",
        description: "Automate, customize, and execute your software development workflows.",
        source: "GitHub",
        category: "DevOps",
        tags: ["ci/cd", "automation", "github"],
        popular: false
    },
    {
        title: "AWS Free Training",
        url: "https://www.aws.training/",
        description: "Learn the fundamentals of AWS cloud.",
        source: "AWS",
        category: "DevOps",
        tags: ["aws", "cloud"],
        popular: false
    },
    {
        title: "Terraform Registry",
        url: "https://registry.terraform.io/",
        description: "Modules and docs for building infrastructure-as-code.",
        source: "HashiCorp",
        category: "DevOps",
        tags: ["terraform", "iac"],
        popular: false
    },
    {
        title: "Ansible Documentation",
        url: "https://docs.ansible.com/",
        description: "Automation for servers and DevOps workflows.",
        source: "RedHat",
        category: "DevOps",
        tags: ["ansible", "automation"],
        popular: false
    },
    {
        title: "Linux Journey",
        url: "https://linuxjourney.com/",
        description: "Learn Linux in small, easy lessons.",
        source: "Community",
        category: "DevOps",
        tags: ["linux", "sysadmin"],
        popular: true
    },
    {
        title: "DigitalOcean Tutorials",
        url: "https://www.digitalocean.com/community/tutorials",
        description: "High-quality tutorials on Linux, Docker, servers.",
        source: "DO",
        category: "DevOps",
        tags: ["linux", "server", "docker"],
        popular: true
    },
    {
        title: "Prometheus Docs",
        url: "https://prometheus.io/docs/",
        description: "Monitoring system & time series database.",
        source: "CNCF",
        category: "DevOps",
        tags: ["monitoring", "metrics"],
        popular: false
    },
    {
        title: "Grafana Docs",
        url: "https://grafana.com/docs/",
        description: "Open-source analytics & monitoring dashboards.",
        source: "Grafana",
        category: "DevOps",
        tags: ["dashboard", "monitoring"],
        popular: false
    },


    // ==================== INTERVIEW PREP ====================
    {
        title: "LeetCode",
        url: "https://leetcode.com/",
        description: "The gold standard for coding interview practice.",
        source: "LeetCode",
        category: "Interview",
        tags: ["algorithms", "practice", "coding"],
        popular: true
    },
    {
        title: "NeetCode.io",
        url: "https://neetcode.io/",
        description: "A better way to grind LeetCode with video solutions.",
        source: "NeetCode",
        category: "Interview",
        tags: ["algorithms", "roadmap", "video"],
        popular: true
    },
    {
        title: "System Design Interview",
        url: "https://github.com/donnemartin/system-design-primer",
        description: "Learn how to design large-scale systems.",
        source: "GitHub",
        category: "Interview",
        tags: ["design", "architecture", "scaling"],
        popular: true
    },
    {
        title: "Tech Interview Handbook",
        url: "https://www.techinterviewhandbook.org/",
        description: "Curated interview preparation materials for busy engineers.",
        source: "Yangshun Tay",
        category: "Interview",
        tags: ["guide", "resume", "behavioral"],
        popular: false
    },
    {
        title: "Frontend Interview Handbook",
        url: "https://frontendinterviewhandbook.com/",
        description: "Front-end specific interview questions and answers.",
        source: "Yangshun Tay",
        category: "Interview",
        tags: ["frontend", "html", "css"],
        popular: false
    },
    {
        title: "Big-O Cheat Sheet",
        url: "https://www.bigocheatsheet.com/",
        description: "Know your complexities of common algorithms.",
        source: "Community",
        category: "Interview",
        tags: ["algorithms", "theory", "math"],
        popular: false
    },
    {
        title: "React Interview Questions",
        url: "https://github.com/sudheerj/reactjs-interview-questions",
        description: "List of top 500 ReactJS Interview Questions & Answers.",
        source: "GitHub",
        category: "Interview",
        tags: ["react", "github", "list"],
        popular: false
    },
    {
        title: "JavaScript Interview Questions",
        url: "https://github.com/lydiahallie/javascript-questions",
        description: "A long list of advanced JS questions, and their explanations.",
        source: "Lydia Hallie",
        category: "Interview",
        tags: ["javascript", "advanced", "quiz"],
        popular: true
    },
    {
        title: "Big Frontend Dev (BFE)",
        url: "https://bigfrontend.dev/",
        description: "Frontend interview challenges and hand-coded solutions.",
        source: "Community",
        category: "Interview",
        tags: ["javascript", "frontend", "coding"],
        popular: true
    },
    {
        title: "AlgoExpert",
        url: "https://www.algoexpert.io/",
        description: "High-quality video explanations for coding interview problems.",
        source: "AlgoExpert",
        category: "Interview",
        tags: ["algorithms", "coding"],
        popular: false
    },
    {
        title: "CodeSignal",
        url: "https://codesignal.com/",
        description: "Platform used by companies for coding tests.",
        source: "CodeSignal",
        category: "Interview",
        tags: ["interview", "coding"],
        popular: false
    },
    {
        title: "Pramp",
        url: "https://www.pramp.com/",
        description: "Free peer-to-peer mock technical interviews.",
        source: "Pramp",
        category: "Interview",
        tags: ["mock interview"],
        popular: false
    },
    {
        title: "CS50",
        url: "https://cs50.harvard.edu/",
        description: "Harvard’s famous intro to computer science.",
        source: "Harvard",
        category: "Interview",
        tags: ["computer science", "basics"],
        popular: true
    },
    {
        title: "Refactoring Guru",
        url: "https://refactoring.guru/",
        description: "Design patterns, clean code, and refactoring techniques.",
        source: "Guru",
        category: "Interview",
        tags: ["patterns", "architecture"],
        popular: true
    },


    // ==================== OTHER USEFUL TOOLS ====================
    {
        title: "JSON Crack",
        url: "https://jsoncrack.com/",
        description: "Visualize JSON data into graphs.",
        source: "Tool",
        category: "Frontend", // Categorizing as frontend tool
        tags: ["json", "visualization", "tool"],
        popular: false
    },
    {
        title: "Can I Use?",
        url: "https://caniuse.com/",
        description: "Browser support tables for modern web technologies.",
        source: "Tool",
        category: "Frontend",
        tags: ["browser", "css", "compatibility"],
        popular: false
    },
    {
        title: "Regex101",
        url: "https://regex101.com/",
        description: "Build, test, and debug regex.",
        source: "Tool",
        category: "Backend",
        tags: ["regex", "tools", "parsing"],
        popular: false
    },
    {
        title: "Carbon",
        url: "https://carbon.now.sh/",
        description: "Create and share beautiful images of your source code.",
        source: "Tool",
        category: "Frontend",
        tags: ["design", "code", "sharing"],
        popular: false
    },
    {
        title: "JWT.io",
        url: "https://jwt.io/",
        description: "Debug JWTs (JSON Web Tokens).",
        source: "Auth0",
        category: "Backend",
        tags: ["security", "auth", "tokens"],
        popular: false
    },
    {
        title: "Excalidraw",
        url: "https://excalidraw.com/",
        description: "Sketch diagrams and UI wireframes with ease.",
        source: "Community",
        category: "Frontend",
        tags: ["diagram", "design", "ui"],
        popular: true
    },
    {
        title: "VSCode Extensions Marketplace",
        url: "https://marketplace.visualstudio.com/vscode",
        description: "Extensions to supercharge your development workflow.",
        source: "Microsoft",
        category: "Tools",
        tags: ["vscode", "editor"],
        popular: false
    },
    {
        title: "Apiary Blueprint",
        url: "https://apiary.io/",
        description: "Design APIs with documentation-first approach.",
        source: "Apiary",
        category: "Backend",
        tags: ["api", "design"],
        popular: false
    },
    {
        title: "Hoppscotch",
        url: "https://hoppscotch.io/",
        description: "Open-source API testing tool (Postman alternative).",
        source: "Community",
        category: "Backend",
        tags: ["api", "http", "testing"],
        popular: true
    },
    {
        title: "CyberChef",
        url: "https://gchq.github.io/CyberChef/",
        description: "Swiss Army Knife for encryption, encoding, data formats.",
        source: "GCHQ",
        category: "Tools",
        tags: ["security", "crypto"],
        popular: false
    },
    {
        title: "UptimeRobot",
        url: "https://uptimerobot.com/",
        description: "Monitor your website uptime for free.",
        source: "UptimeRobot",
        category: "Tools",
        tags: ["monitoring", "uptime"],
        popular: false
    },
    {
        title: "Crontab Guru",
        url: "https://crontab.guru/",
        description: "Quickly build and understand cron expressions.",
        source: "Community",
        category: "DevOps",
        tags: ["cron", "scheduler"],
        popular: false
    },

    // ... Add 90 more links here
];

export function InterviewGuide() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const [isExpanded, setIsExpanded] = useState(false); // Controls the "Show All" toggle

    // Logic: 
    // 1. If Searching: Show ALL matches
    // 2. If Not Searching: Show Popular OR (Popular + All if expanded)
    const displayedResources = useMemo(() => {
        // A. Filter functionality
        const filtered = resources.filter((res) => {
            const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
            const matchesSearch =
                res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesCategory && matchesSearch;
        });

        // B. Grouping Logic
        if (searchTerm.length > 0) {
            // If user is searching, return everything that matches (disable collapse logic)
            return filtered;
        }

        if (selectedCategory !== "All") {
            // If a category is picked, show all in that category
            return filtered;
        }

        // Default view (No search, "All" category)
        if (isExpanded) {
            return filtered; // Show everything
        } else {
            return filtered.filter(r => r.popular); // Show only popular
        }
    }, [searchTerm, selectedCategory, isExpanded]);

    return (
        <>
            <Helmet>
                <title>Frontend Developer Interview Guide | React, JS, Redux</title>
                <meta name="description"
                    content="Full interview preparation guide covering JS, React, Redux, RTK, Saga, Zustand, DSA and more." />
                <link rel="canonical" href="https://jsonview.help/interview-guide" />
            </Helmet>

            <div className="min-h-screen bg-background flex flex-col">
                <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <h1 className="text-xl font-semibold">Dev Resource Library</h1>
                        </div>
                        <Link href="/">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Tool
                            </Button>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
                    {/* Search Header */}
                    <div className="mb-10 text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Curated Developer Resources</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search 100+ links (e.g. 'Redux', 'System Design')..."
                                className="pl-10 h-12 text-lg shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {(["All", "Frontend", "Backend", "DevOps", "Interview", 'Tools'] as Category[]).map((cat) => (
                                <Button
                                    key={cat}
                                    variant={selectedCategory === cat ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setIsExpanded(true); // Auto expand if category selected
                                    }}
                                    className="rounded-full"
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Section Title */}
                    <div className="flex items-center gap-2 mb-6">
                        {searchTerm ? (
                            <h3 className="text-lg font-semibold">Search Results ({displayedResources.length})</h3>
                        ) : (
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                {isExpanded ? "All Resources" : "🔥 Most Popular"}
                            </h3>
                        )}
                    </div>

                    {/* The Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {displayedResources.map((res, index) => (
                            <a
                                key={index}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group h-full block"
                            >
                                <Card className={`h-full p-5 hover:shadow-lg transition-all flex flex-col ${res.popular ? 'border-primary/40 bg-primary/5' : 'hover:border-primary/50'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 rounded-lg bg-background shadow-sm group-hover:bg-primary/10 transition-colors">
                                            {res.category === "Frontend" && <Code2 className="h-4 w-4 text-blue-500" />}
                                            {res.category === "Backend" && <Database className="h-4 w-4 text-orange-500" />}
                                            {res.category === "DevOps" && <Layers className="h-4 w-4 text-purple-500" />}
                                            {res.category === "Interview" && <Globe className="h-4 w-4 text-green-500" />}
                                        </div>
                                        {res.popular && (
                                            <Badge variant="default" className="text-[10px] h-5 bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                                                POPULAR
                                            </Badge>
                                        )}
                                    </div>

                                    <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                                        {res.title}
                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>

                                    <p className="text-sm text-muted-foreground flex-1 mb-3 line-clamp-2">
                                        {res.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1 mt-auto">
                                        {res.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider text-muted-foreground bg-background border px-1.5 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            </a>
                        ))}
                    </div>

                    {/* Empty State */}
                    {displayedResources.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg">
                            <Search className="h-10 w-10 mx-auto mb-4 opacity-20" />
                            <p>No resources found for "{searchTerm}".</p>
                        </div>
                    )}

                    {/* "Show All" Collapsible Trigger */}
                    {!searchTerm && selectedCategory === "All" && (
                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="bg-background px-8 shadow-sm hover:bg-muted"
                                >
                                    {isExpanded ? (
                                        <>
                                            <ChevronUp className="h-4 w-4 mr-2" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4 mr-2" />
                                            View All {resources.length} Resources
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-16 text-center pt-8">
                        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} JSON Formatter & Library</p>
                    </div>
                </main>
            </div>
        </>
    );
}