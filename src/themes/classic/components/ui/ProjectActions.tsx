import { ExternalLink, Package } from 'lucide-react';
import { GithubIcon } from '../../../../components/BrandIcons';
import type { Project } from '../../../../data/personal';
import { analytics } from '../../../../lib/analytics';

const showCode = (project: Project) => Boolean(project.github) && project.category !== 'company';

interface ProjectActionsProps {
  project: Project;
}

/** Compact Code / NPM / Demo links used on project cards. */
export function CardActionLinks({ project }: Readonly<ProjectActionsProps>) {
  return (
    <>
      {showCode(project) && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-card-ghost"
          aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
          onClick={() => analytics.projectGithubClick(project.title)}
        >
          <GithubIcon size={12} />
          Code
        </a>
      )}
      {project.npm && (
        <a
          href={project.npm}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-npm-sm"
          aria-label={`View ${project.title} on NPM (opens in new tab)`}
          onClick={() => analytics.projectNpmClick(project.title)}
        >
          <Package size={12} aria-hidden="true" />
          NPM
        </a>
      )}
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-card-ghost"
          aria-label={`View live demo for ${project.title} (opens in new tab)`}
          onClick={() => analytics.projectDemoClick(project.title)}
        >
          <ExternalLink size={12} aria-hidden="true" />
          Demo
        </a>
      )}
    </>
  );
}

interface DetailActionLinksProps extends ProjectActionsProps {
  /** Label for the NPM button ("NPM Package" in the header, "NPM" in the footer). */
  npmLabel?: string;
}

/** Full-size View Code / NPM / Live Demo buttons used on the project detail page. */
export function DetailActionLinks({
  project,
  npmLabel = 'NPM Package',
}: Readonly<DetailActionLinksProps>) {
  return (
    <>
      {showCode(project) && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glass text-sm"
          aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
          onClick={() => analytics.projectGithubClick(project.title)}
        >
          <GithubIcon size={15} />
          View Code
        </a>
      )}
      {project.npm && (
        <a
          href={project.npm}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-npm"
          aria-label={`View ${project.title} on NPM (opens in new tab)`}
          onClick={() => analytics.projectNpmClick(project.title)}
        >
          <Package size={15} aria-hidden="true" />
          {npmLabel}
        </a>
      )}
      {project.demo && (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm"
          aria-label={`View live demo for ${project.title} (opens in new tab)`}
          onClick={() => analytics.projectDemoClick(project.title)}
        >
          <ExternalLink size={15} aria-hidden="true" />
          Live Demo
        </a>
      )}
    </>
  );
}
