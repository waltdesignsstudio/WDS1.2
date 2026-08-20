import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  X, 
  BarChart3 
} from 'lucide-react';
import { SHOWCASE_PROJECTS, ProjectShowcase } from '../data/agencyData';

export const ShowcaseGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectShowcase | null>(null);

  const categories = ['All', 'Web Design', 'Video Editing', 'Growth Agency', 'Resume & CV'];

  const filteredProjects = activeFilter === 'All'
    ? SHOWCASE_PROJECTS
    : SHOWCASE_PROJECTS.filter(p => p.category === activeFilter);

  return (
    <section className="py-10 sm:py-14 relative" id="showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exquisite Outcomes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Featured Agency Showcase
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Review a selection of premium websites, visual designs, resumes, and branding outputs engineered with zero lag.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-[#141622] hover:bg-[#1f2233] text-zinc-300 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group bg-[#11131c] border border-zinc-800/80 hover:border-amber-500/50 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col shadow-lg"
            >
              {/* Image Showcase Frame with Badge */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-zinc-950">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-transparent to-black/20"></div>

                {/* Category Pill */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/30 shadow-md">
                    {project.categoryLabel}
                  </span>
                </div>

                {/* Demonstrated Outcome Banner */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-[#090b10]/95 backdrop-blur-md border border-amber-500/30 rounded-lg px-3 py-2 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                        {project.outcomeLabel}
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      {project.outcomeMetric}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {project.title}
                    </h3>
                    <div className="w-7 h-7 rounded-full bg-zinc-800/80 group-hover:bg-amber-500 group-hover:text-black flex items-center justify-center transition-colors shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech & Specifications */}
                <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-[#12141f] border border-zinc-700 rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                    {selectedProject.category} Showcase
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                <div className="rounded-lg overflow-hidden border border-zinc-800 h-56 sm:h-72 relative">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-md border border-amber-500/40 text-emerald-400 font-mono font-bold text-xs">
                    {selectedProject.outcomeLabel}: {selectedProject.outcomeMetric}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Engineering & Strategy</h4>
                  <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed">
                    {selectedProject.description} Designed from scratch with zero template bloat, optimized for maximum user attention, rapid loading times, and decisive conversion metrics.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-zinc-900 rounded-md border border-zinc-800">
                    <span className="text-zinc-500 block">Deliverable Status:</span>
                    <span className="text-emerald-400 font-bold">Deployed & Active</span>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-md border border-zinc-800">
                    <span className="text-zinc-500 block">Demonstrated Lift:</span>
                    <span className="text-amber-300 font-bold">{selectedProject.outcomeMetric}</span>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-md border border-zinc-800 col-span-2 sm:col-span-1">
                    <span className="text-zinc-500 block">Client Scope:</span>
                    <span className="text-white font-bold">{selectedProject.client}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Technologies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono text-cyan-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-800 bg-[#0d0f17] flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-zinc-400">
                  Need similar results for your business?
                </span>
                <a
                  href="/contact"
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Request Similar Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
