module.exports = {
  title: `yoonhan0.com`,
  description: `윤한영`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://yoonhan0.netlify.app`, // 커스텀 도메인 연결 시 변경
  ogImage: `/og-image.png`, // Path to your in the 'static' folder ( 공유할 때 보이는 미리보기 이미지 )
  comments: {
    utterances: {
      repo: ``, // `zoomkoding/zoomkoding-gatsby-blog`,
    },
  },
  ga: '0', // Google Analytics Tracking ID
  author: {
    name: `윤한영`,
    bio: {
      role: `개발자`,
      description: ['비즈니스 로직을 이해하는', '사람에 가치를 두는', '능동적으로 일하는'],
      thumbnail: '103.png', // assets 폴더 내에 이미지를 넣고 출력하고 싶은 이미지 기재
    },
    social: {
      github: `https://github.com/YoonHan0`, // `https://github.com/zoomKoding`,
      linkedIn: ``, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: ``, // `zoomkoding@gmail.com`,
      velog: `https://velog.io/@yoon_han0/posts`,
    },
    dropdown: {
      velog: 'https://velog.io/@yoon_han0',
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2025.01 ~',
        activity: '개인 블로그 개발 및 운영',
        links: {
          post: '/gatsby-starter-zoomkoding-introduction',
          github: 'https://github.com/YoonHan0/yoonhan0-blog',
          demo: 'https://www.yoonhan0.com',
        },
      },
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
    ],
  },
};
