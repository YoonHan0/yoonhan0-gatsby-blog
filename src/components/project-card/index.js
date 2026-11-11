import { Link, navigate } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import React from 'react';
import { PROJECT_TYPE_LABEL } from '../../models/project';
import { tagUrl } from '../../utils/tag';
import './style.scss';

const MAX_TECH = 3; // 카드에는 기술 스택을 최대 3개까지만 표시 (나머지는 +N)

// 카드 전체가 링크라서 칩은 <a> 대신 클릭 핸들러로 이동 (a 태그 중첩 방지)
const onTechClick = (tech) => (e) => {
  e.preventDefault();
  e.stopPropagation();
  navigate(tagUrl(tech));
};

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
          {techStack.slice(0, MAX_TECH).map((tech) => (
            <span
              className="tech link"
              key={tech}
              role="link"
              tabIndex={0}
              title={`'${tech}' 관련 글 보기`}
              onClick={onTechClick(tech)}
              onKeyDown={(e) => e.key === 'Enter' && onTechClick(tech)(e)}
            >
              {tech}
            </span>
          ))}
          {techStack.length > MAX_TECH && <span className="tech more">+{techStack.length - MAX_TECH}</span>}
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
