import { useProjectFilter } from '../../project-filter';
import ProjectPanel from '../components/ProjectPanel';
import SectionHeader from '../components/SectionHeader';

export default function Projects() {
  const { filtered, filter } = useProjectFilter('signal');

  return (
    <div className="sg-wrap pt-14 md:pt-24">
      <SectionHeader
        as="h1"
        kicker="Work"
        title="Projects"
        intro="Company work and personal projects — full stack, frontend, and open-source."
      />

      {filter}

      <div id="projects-list" className="space-y-24 md:space-y-32">
        {filtered.map((project, i) => (
          <ProjectPanel
            key={project.id}
            project={project}
            index={i}
            flip={i % 2 === 1}
            headingAs="h2"
          />
        ))}
      </div>
    </div>
  );
}
