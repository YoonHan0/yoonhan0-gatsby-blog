---
emoji: ✍️
title: 코드 수정 필요한 내용 정리
date: '2025-01-20 17:30:00'
author: 윤한영
tags: blog gatsby theme 개츠비 테마
categories: 블로그 featured 테스트2 테스트3 테스트4 테스트5 테스트6 테스트7 테스트8 테스트9 테스트10 테스트11 테스트12 테스트13 테스트14
---

## 👋 수정사항

1. 메인페이지의 카데고리 제거, post에서만 카테고리 표시

2. 메인페이지에서 사용되던 more 버튼 제거, post 중 All을 제외한 카테고리에서 사용

3. posts에서 확인되는 글 목록에서 태그가 여러 건이 됐을 때 그리드 깨짐![post-tag-list-error](post-tag-list-error.png)<br />태그가 5개 이상이 되면 `...` 처리하도록 수정![post-tag-list-answer](post-tag-list-answer.png)

4. 태그가 여러 건이 있을 때 글 내부에서 그리드 깨짐![post-tag-description-error](post-tag-description-error.png)<br />화면 끝에 다다르면 다음 줄로 정렬되도록 수정![post-tag-description-answer](post-tag-description-answer.png)<br />

5. 포스터 미리보기에 나타나는 일자를 영어 표기에서 한글 표기로 수정![post-card-date-en](post-card-date-en.png)<br />토스였나 배민이었나 회사 기술 블로그에 게시 일자를 한글로 표기했었는데 더 내 스타일인 것 같아 한글로 수정![post-card-date-kr](post-card-date-kr.png)
<details>
  <summary>수정된 코드 보기</summary>

  ```jsx
  // post-card\index.js
  import ...
  import "moment/locale/ko";    // 한글 지원을 위한 import
  ...

  function PostCard({ post }) {
  const { id, slug, title, excerpt, date, categories } = post;
  
  const formmatedDate = moment(date).format("YYYY년 MM월 DD일");  // 원하는 포맷으로 설정

  return (
    <div className="post-card-wrapper">
      <Link className="post-card" key={id} to={slug}>
        <div className="title">{title}</div>
        <p className="description" dangerouslySetInnerHTML={{ __html: excerpt }} />
        <div className="info">
          <div className="date">{formmatedDate}</div>
          <div className="categories">
            {
              categories.slice(0, 5).map((category) => (
                <Link className="category" key={category} to={`/posts/${category}`}>
                  {category}
                </Link>
              ))
            }
            { categories.length > 5 && '...' }
          </div>
        </div>
      </Link>
    </div>
  );
}
export default PostCard;
```
</details>
<br />

6. 다크모드로 변경 시 화면 배경색 맞지 않는 부분 수정

> 페이지 헤더 수정
다크모드 사용 시 메인 페이지 헤더의 배경색이 올바르게 수정되지 않는 것 같아 수정하였음.
![dark-mode-pageHeader.png](dark-mode-pageHeader.png)

📝 수정 화면
![dark-mode-pageHeader2.png](dark-mode-pageHeader2.png)

<details>
  <summary>src/layout/index.js</summary>

  ```jsx
  /* ----- src/layout/index.js ----- */
  // PageHeader 컴포넌트에 className 추가
  ...
  return (
    <div className="page-wrapper">
      <PageHeader className="page-header" siteTitle={title || `Title`} />
      <main className="page-content">{children}</main>
      <PageFooter
        author={author.name || `Author`}
        githubUrl={author.social?.github || `https://www.github.com`}
      />
      <ThemeSwitch />
    </div>
  );
};

export default Layout;
  ```
</details>
<details>
  <summary>src/layout/style.scss</summary>

  ```scss
  /* ----- src/layout/style.scss ----- */
  // className="page-header"에 스타일 추가
  .page-wrapper {
    ...
    .page-header {
        background-color: var(--background-color) !important;   // 추가
    }
    .page-content {
        ...
    }
}
  ```
</details>

</br>








## 📚 수정이 필요한 내용




</br>
</br>
</br>

---
<details>
  <summary>개발자가 개발만 잘하면 회사는 망한다</summary>
  
    개발자는 개발만 잘하면 될까요?

    최근 IT 업계에서는 개발 역량 외에도 협업과 커뮤니케이션 같은 소프트 스킬의 중요성이 점점 커지고 있는데요.

    그런 의미에서 이번 우아한테크코스 영상 "개발자가 개발만 잘하면 회사는 망한다"를 흥미롭게 보았습니다.

    대부분의 개발자는 하드 스킬, 즉 기술적인 역량에 집중하는 경향이 있습니다. 그러나 한 연구에 따르면, 개발자가 혼자 뛰어난 기술을 갖추는 것보다 팀 전체의 효과적인 협업이 우수한 성과를 낸다고 합니다.

    특히, 인공지능이 단순 반복적인 작업을 대체해 나가는 지금의 환경에서는 개발자에게 요구되는 역량도 변화하고 있습니다. 팀원들과의 원활한 소통, 프로젝트 조율 능력, 비즈니스 이해도와 같은 소프트 스킬이 중요한 경쟁력으로 부상하고 있는데요.

    결론적으로, 앞으로의 "잘하는 개발자"란 단순히 기술적 역량만을 갖춘 사람이 아니라, 탄탄한 개발 실력을 바탕으로 소프트 스킬까지 더한 균형 잡힌 개발자 가 될 것입니다.

<a href="https://www.youtube.com/watch?v=XudqDRk2syQ">참고링크</a>
</details>

```toc

```
