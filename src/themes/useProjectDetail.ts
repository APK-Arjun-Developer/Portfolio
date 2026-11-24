import { useParams } from 'react-router-dom';
import { projects } from '../data/personal';

export function useProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const index = projects.findIndex((project) => project.id === id);

  return {
    project: projects[index],
    next: projects[(index + 1) % projects.length],
  };
}
