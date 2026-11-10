import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import React from 'react';
import { PROJECT_TYPE_LABEL } from '../../models/project';
import './style.scss';

function ProjectCard({ project }) {
  const { slug, title, emoji, thumbnail, projectType, company, period, summary, techStack } = project;
  return (
    <Link className="project-card" to={slug}>
      <div className="thumbnail">
        {thumbnail ? (
          <GatsbyImage image={thumbnail} alt={title} />
        ) : (
          <div className="placeholder">{emoji || '🛠️'}</div>
        )}
      </div>
      <div className="content">
        <div className="meta">
          <span className={`type ${projectType}`}>{PROJECT_TYPE_LABEL[projectType]}</span>
          {company && <span className="company">{company}</span>}
          {period && <span className="period">{period}</span>}
        </div>
        <div className="title">{title}</div>
        {summary && <p className="summary">{summary}</p>}
        <div className="tech-stack">
          {techStack.map((tech) => (
            <span className="tech" key={tech}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
