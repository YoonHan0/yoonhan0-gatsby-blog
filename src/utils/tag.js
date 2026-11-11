/**
 * 기술 스택 이름 ↔ 글 태그 매칭 유틸
 * - 대소문자 무시, 끝의 버전 숫자 무시 ("React 18" == "React", "Spring Boot 3.5" == "Spring Boot")
 * - "/"로 묶인 이름은 각각 비교 ("Grafana/Loki" 는 "Grafana", "Loki" 태그 모두와 매칭)
 */
const normalize = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s*v?\d+(\.\d+)*$/, '') // 끝의 버전 숫자 제거
    .trim();

const tokens = (value) => String(value || '').split('/').map(normalize).filter(Boolean);

export const isTagMatch = (query, tag) => {
  const q = tokens(query);
  const t = tokens(tag);
  return q.some((a) => t.includes(a));
};

export const postHasTag = (post, query) => post.tags.some((tag) => isTagMatch(query, tag));

/** /posts 페이지에서 해당 태그로 검색하는 URL */
export const tagUrl = (tag) => `/posts?tag=${encodeURIComponent(tag)}`;
