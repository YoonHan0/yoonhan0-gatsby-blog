export default class Project {
  constructor(node) {
    const { id, html, fields, frontmatter } = node;
    const {
      title, emoji, projectType, company, period, role, team, summary, techStack, featured, thumbnail, links,
    } = frontmatter;

    this.id = id;
    this.html = html;
    this.slug = fields.slug;
    this.title = title;
    this.emoji = emoji;
    this.projectType = projectType === 'side' ? 'side' : 'company';
    this.company = company;
    this.period = period;
    this.role = role;
    this.team = team;
    this.summary = summary;
    this.techStack = techStack || [];
    this.featured = !!featured;
    this.thumbnail = thumbnail?.childImageSharp?.gatsbyImageData || null;
    this.links = links || {};
  }
}

export const PROJECT_TYPE_LABEL = { company: '회사', side: '사이드' };

