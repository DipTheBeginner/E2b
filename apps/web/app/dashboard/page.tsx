  "use client";
  
  import { useEffect, useState } from "react";
  import { createProjects, generateAI, getProjects } from "../api/auth";
  
  type Project = {
    id: string;
    name: string;
    sandboxId: string;
    createdAt: string;
    updatedAt: string;
  };
  
  export default function LovableDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [prompt , setPrompt] = useState("")
  
    useEffect(() => {
      async function loadProjects() {
        try {
          const data = await getProjects();
          if (data?.success) {
            setProjects(data.projects);
          }
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        }
      }
      loadProjects();
    }, []);
  
  
  
    async function onGenerate() {
      if (!prompt.trim()) {
        return;
      }
  
      try {

        const projectData = await createProjects("new project");

        if (!projectData.success) {
          console.error("Project creation failed", projectData);
          return;
        }

        console.log("Project created:", projectData.project);


        const projectId = projectData.project.id;


        const aiData = await generateAI(prompt, projectId);

        console.log("AI Response", aiData);


        const projectsData = await getProjects();

        if (projectsData.success) {
          setProjects(projectsData.projects);
        }

        setPrompt("");


        
      } catch (error) {
        console.log("Genrate failed:", error);
      }
      
        
        
    }
  
    return (
      <div className="flex h-screen w-full bg-[#06040b] text-slate-100 overflow-hidden">
        
        <aside className="w-64 h-full bg-[#080512]/90 backdrop-blur-xl border-r border-white/10 flex flex-col z-20 shrink-0">
          {/* Header / Brand */}
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <span className="text-sm font-semibold tracking-wide text-slate-200">
              Loveable
            </span>
            <button className="text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-md hover:bg-purple-600/30 transition">
              + New
            </button>
          </div>
  
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 px-2.5 py-1.5 uppercase tracking-wider">
              Recent Projects
            </p>
  
            {projects.length === 0 ? (
              <p className="text-xs text-slate-500 px-2.5 py-2">No projects found</p>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition group flex flex-col"
                >
                  <span className="truncate font-medium group-hover:text-purple-300 transition">
                    {project.name}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate mt-0.5">
                    {project.id}
                  </span>
                </button>
              ))
            )}
          </div>
  
          {/* Footer / Account indicator */}
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs font-medium text-purple-300">
                U
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-slate-200">My Workspace</span>
                <span className="text-[10px] text-slate-500">Free Tier</span>
              </div>
            </div>
          </div>
        </aside>
  
        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="relative flex-1 flex flex-col items-center justify-center h-full overflow-hidden">
          
          {/* Background Layer (Ambient glow + SVG Waves) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Ambient Glow Orbs */}
            <div className="absolute top-1/4 w-[600px] h-[350px] bg-purple-600/20 blur-[130px] rounded-full" />
            <div className="absolute top-1/3 w-[450px] h-[250px] bg-fuchsia-500/15 blur-[100px] rounded-full" />
            <div className="absolute top-1/2 w-[700px] h-[300px] bg-indigo-600/10 blur-[140px] rounded-full" />
  
            {/* Vector Wave Contours */}
            <svg
              className="absolute w-[1400px] h-[700px] opacity-40 mix-blend-screen"
              viewBox="0 0 1440 700"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0" />
                  <stop offset="25%" stopColor="#c084fc" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#e879f9" stopOpacity="0.8" />
                  <stop offset="75%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>
  
                <linearGradient id="wave-subtle" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                  <stop offset="50%" stopColor="#9333ea" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
  
              <path
                d="M-100,320 C250,150 550,450 900,280 C1150,160 1350,340 1600,290"
                stroke="url(#wave-gradient)"
                strokeWidth="2"
              />
              <path
                d="M-100,350 C260,180 580,480 920,310 C1170,190 1370,370 1600,320"
                stroke="url(#wave-gradient)"
                strokeWidth="1.5"
                opacity="0.8"
              />
              <path
                d="M-100,380 C270,210 610,510 940,340 C1190,220 1390,400 1600,350"
                stroke="url(#wave-subtle)"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <path
                d="M-100,420 C290,260 630,540 960,370 C1220,250 1410,430 1600,390"
                stroke="url(#wave-subtle)"
                strokeWidth="1"
                opacity="0.4"
              />
              <path
                d="M-100,460 C310,300 660,570 980,410 C1240,290 1430,460 1600,430"
                stroke="url(#wave-subtle)"
                strokeWidth="1"
                opacity="0.25"
              />
            </svg>
  
            <div className="absolute inset-0 bg-gradient-to-t from-[#06040b] via-transparent to-[#06040b]/80" />
          </div>
  
          {/* Center Prompt Form */}
          <main className="relative z-10 flex flex-col items-center max-w-2xl w-full px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-slate-100">
              Build something{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Loveable
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-3 mb-8">
              Chat with AI to generate apps, design systems, and components in seconds.
            </p>
  
            {/* Floating glass prompt input */}
            <div className="w-full bg-[#120d1d]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-3 shadow-[0_0_50px_-12px_rgba(168,85,247,0.25)] focus-within:border-purple-500/50 transition">
              <textarea
                rows={3}
                placeholder="Ask Loveable to create a dashboard..."
                className="w-full bg-transparent resize-none outline-none text-sm text-slate-200 placeholder:text-slate-500"
  
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
              />
  
              <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
                <span className="text-[11px] text-slate-500">
                  Press ↵ to generate
                </span>
                <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition" onClick={onGenerate}>
                  
                  Generate
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }