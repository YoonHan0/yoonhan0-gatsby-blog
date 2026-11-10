import { Link } from 'gatsby';
import React from 'react';
import { PROJECT_TYPE_LABEL } from '../../models/project';
import IconButtonBar from '../icon-button-bar';
import './style.scss';

function ProjectHeader({ project }) {
  const { title, emoji, projectType, company, period, role, team, techStack, links } = project;
  const rows = [
    ['소속', company],
    ['기간', period],
    ['역할', role],
    ['팀 구성', team],
  ].filter(([, value]) => value);

  return (
    <header className="project-header">
      <Link className="back" to="/projects">
        ← 프로젝트 목록
      </Link>
      {emoji && <div className="emoji">{emoji}</div>}
      <span className={`type ${projectType}`}>{PROJECT_TYPE_LABEL[projectType]} 프로젝트</span>
      <h1 className="title">{title}</h1>

      <dl className="overview">
        {rows.map(([label, value]) => (
          <React.Fragment key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </React.Fragment>
        ))}
        {techStack.length > 0 && (
          <>
            <dt>기술 스택</dt>
            <dd className="tech-stack">
              {techStack.map((tech) => (
                <span className="tech" key={tech}>
                  {tech}
                </span>
              ))}
            </dd>
          </>
        )}
      </dl>
      {Object.values(links).some(Boolean) && (
        <div className="links">
          <IconButtonBar links={links} />
        </div>
      )}
    </header>
  );
}

export default ProjectHeader;
