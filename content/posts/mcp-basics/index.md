---
emoji: 🔌
title: MCP(Model Context Protocol) 개념 정리
description: AI가 사내 시스템을 안전하게 조회하도록 연결해준 MCP의 구조와 동작 방식을 정리했습니다.
date: '2026-11-12 10:00:00'
author: 윤한영
categories: AI
tags: [MCP, Claude, Claude CLI, AI Agent, JSON-RPC]
---

## 왜 알아보게 되었나

ERD 자동 생성 시스템과 e나라도움 진단 플러그인, 두 프로젝트 모두에서 **AI가 사내 시스템의 정보를 조회**해야 했습니다. 이때 AI와 외부 시스템을 잇는 표준 방식으로 MCP를 사용했고, 구조를 제대로 이해하려고 개념을 정리했습니다.

## MCP란?

**MCP(Model Context Protocol)** 는 LLM 애플리케이션이 외부 데이터나 도구에 접근하는 방법을 표준화한 **오픈 프로토콜**입니다. Anthropic이 2024년 11월에 공개했습니다.

흔히 "AI용 USB-C"에 비유합니다. 그전에는 AI 앱마다, 연동할 시스템마다 연결 코드를 따로 만들어야 했습니다(M × N). MCP를 쓰면 시스템 쪽은 **MCP 서버를 한 번** 만들고, AI 앱 쪽은 **MCP 클라이언트를 한 번** 구현하면 서로 연결됩니다(M + N).

## 구성 요소

| 역할 | 설명 | 예시 |
| --- | --- | --- |
| **Host** | 사용자가 쓰는 LLM 애플리케이션 | Claude Desktop, Claude Code, 사내 콘솔 |
| **Client** | Host 안에서 서버 하나와 1:1로 연결을 유지하는 모듈 | Host가 서버마다 하나씩 생성 |
| **Server** | 도구·데이터를 MCP 규격으로 노출하는 프로그램 | DB 메타데이터 조회 서버, 로그 조회 서버 |

## 서버가 제공하는 3가지

- **Tools**: 모델이 **호출하는 함수**입니다. 예: `describe_table(tableName)`. 호출 여부는 모델이 판단합니다.
- **Resources**: 모델에게 **읽기 컨텍스트**로 제공하는 데이터입니다. 파일 내용, 스키마 문서처럼 URI로 식별합니다.
- **Prompts**: 서버가 미리 정의해둔 **프롬프트 템플릿**입니다. 사용자가 골라서 사용합니다.

## 통신 방식

- 메시지 형식은 **JSON-RPC 2.0**입니다.
- 전송 계층은 두 가지가 표준입니다.
  - **stdio**: Host가 서버를 하위 프로세스로 실행하고, 표준 입출력으로 메시지를 주고받습니다. 로컬 도구에 적합합니다.
  - **Streamable HTTP**: 원격 서버에 HTTP로 연결합니다.

연결 흐름은 다음과 같습니다.

1. `initialize` 요청으로 서로의 프로토콜 버전과 지원 기능(capabilities)을 교환합니다.
2. 클라이언트가 `tools/list`로 서버가 제공하는 도구 목록과 입력 스키마를 받습니다.
3. 모델이 도구가 필요하다고 판단하면 `tools/call`로 호출하고, 결과를 다시 모델에게 전달합니다.

## 예제: 도구 정의와 호출

서버는 도구의 이름, 설명, 입력 스키마(JSON Schema)를 공개합니다. 모델은 **설명(description)을 읽고** 언제 이 도구를 쓸지 결정하기 때문에, 설명을 구체적으로 쓰는 것이 중요합니다.

```json
{
  "name": "describe_table",
  "description": "테이블의 컬럼, 타입, PK 정보를 조회합니다. 관계 추론 전에 테이블 구조를 확인할 때 사용하세요.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "tableName": { "type": "string", "description": "조회할 테이블명 (예: NCZ_ORDER)" }
    },
    "required": ["tableName"]
  }
}
```

호출 요청은 이런 형태입니다.

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": { "name": "describe_table", "arguments": { "tableName": "NCZ_ORDER" } }
}
```

## 주의할 점

- **도구는 곧 권한입니다.** 모델이 호출할 수 있는 도구가 많을수록 의도하지 않은 동작이 일어날 여지도 커집니다. 꼭 필요한 도구만, 가능하면 **조회 전용**으로 노출하는 것이 좋습니다.
- **자격증명은 서버 바깥에서 주입합니다.** 도구의 인자나 응답에 비밀번호·토큰이 들어가면 모델 컨텍스트에 그대로 남습니다.
- **응답 크기를 관리해야 합니다.** 대용량 결과를 그대로 돌려주면 컨텍스트를 금방 다 씁니다. 요약해서 주거나, 페이지 단위로 나누거나, 필요한 부분만 다시 조회하게 해야 합니다.

## 프로젝트에서는 이렇게 썼다

- [AI Agent 기반 ERD 자동 생성 시스템](/projects/erd-auto-generator/)
  - DB를 AI에 직접 노출하지 않으려고 `describe_table` 같은 **메타데이터 조회 전용 MCP 서버**를 만들었습니다.
  - 백엔드가 이 서버를 JSON-RPC로 호출하는 중계 구조로 설계했습니다.
- [e나라도움 연동 오류 자동 진단 플러그인](/projects/enaradoum-diagnosis-plugin/)
  - 호스트 앱이 플러그인 도구를 MCP로 노출하고, 자격증명은 호스트의 금고에서 주입했습니다.
  - Claude CLI에는 `--allowedTools`로 조회 전용 도구만 허용했습니다.

## 참고 자료

- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io)
- [MCP Specification](https://modelcontextprotocol.io/specification)
