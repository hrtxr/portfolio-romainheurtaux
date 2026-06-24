const { useRef } = React;

const ProjectCard = ({ project }) => {
    const cardRef = useRef();
    const innerRef = useRef();

    const handleMouseMove = (e) => {
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 10;
        const y = (e.clientY - top - height / 2) / 10;

        gsap.to(innerRef.current, {
            rotateY: x,
            rotateX: -y,
            duration: 0.5,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        gsap.to(innerRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.5,
            ease: 'power2.out',
        });
    };

    return (
        <a 
            href={`/project/${project.id}`}
            ref={cardRef}
            className="perspective-1000 w-full h-64 block cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div 
                ref={innerRef}
                className="relative w-full h-full rounded-none overflow-hidden transition-transform duration-500 transform-style-3d bg-cover bg-center border border-graphite grayscale-[10%] contrast-[105%]"
                style={{ backgroundImage: `url('/static/${encodeURI(project.image_url)}')` }}
            >
                <div className="absolute inset-0 bg-obsidian/40 hover:bg-void/80 transition-colors duration-300 flex flex-col justify-end p-6 text-signal">
                    <h3 className="font-modius text-xl mb-1">{project.title}</h3>
                    <p className="text-steel text-xs uppercase tracking-widest font-tech line-clamp-2">{project.short_description}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {project.technologies.slice(0, 3).map((tech, index) => (
                                <span key={index} className="px-2 py-1 bg-carbon/80 backdrop-blur-sm border border-graphite text-[10px] uppercase tracking-widest text-muted">
                                    {tech}
                                </span>
                            ))}
                            {project.technologies.length > 3 && (
                                <span className="px-2 py-1 bg-carbon/80 backdrop-blur-sm border border-graphite text-[10px] uppercase tracking-widest text-muted">
                                    +{project.technologies.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </a>
    );
};

// Component Gallery
const ProjectGallery = ({ projects, category }) => {
    const filteredProjects = category === 'All' 
        ? projects 
        : projects.filter(p => p.category === category);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
};

window.ProjectCard = ProjectCard;
window.ProjectGallery = ProjectGallery;
