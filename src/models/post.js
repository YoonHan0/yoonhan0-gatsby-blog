export default class Post {
  constructor(node) {
    const { id, html, excerpt, frontmatter, fields } = node;
    const { slug } = fields;
    const { emoji, categories, title, description, author, date, tags } = frontmatter;

    this.id = id;
    this.excerpt = excerpt;
    this.emoji = emoji;
    this.html = html;
    this.slug = slug;
    this.title = title;
    this.description = description || ''; // 목록 카드에 보여줄 한 문장 요약
    this.author = author;
    this.date = date;
    this.categories = categories.split(' ');
    this.tags = Array.isArray(tags) ? tags.filter(Boolean) : [];
  }
}
