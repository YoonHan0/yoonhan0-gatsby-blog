---
emoji: 🗺️
title: elkjs + React Flow로 ERD 자동 레이아웃 만들기
description: 코드로 추출한 테이블 수십 개를 겹치지 않게 자동 배치하기 위해 elkjs로 좌표를 계산하고 React Flow로 그린 방법입니다.
date: '2026-11-11 10:00:00'
author: 윤한영
categories: Frontend
tags: [React, react-flow, elkjs]
---

## 왜 알아보게 되었나

ERD 자동 생성 시스템에서는 테이블과 관계를 **코드로 추출**합니다. 그래서 사람이 직접 박스를 배치할 수 없고, 테이블 수십 개를 **겹치지 않게, 관계선이 읽기 쉽게** 자동으로 배치해야 했습니다. 이를 위해 그리기는 React Flow, 위치 계산은 elkjs로 역할을 나눴습니다.

## 역할 분담

| 라이브러리 | 하는 일 | 하지 않는 일 |
| --- | --- | --- |
| **React Flow** | 노드·엣지 렌더링, 드래그·줌·패닝, 커스텀 노드 | 노드를 **어디에** 둘지 계산 |
| **elkjs** | 노드 크기와 연결 관계를 받아 **좌표와 선 경로** 계산 | 화면 렌더링 |

React Flow는 노드마다 `position`이 필요합니다. 이 좌표를 elkjs로 계산해서 넣어주는 구조입니다.

## elkjs란?

[ELK(Eclipse Layout Kernel)](https://eclipse.dev/elk/)를 JavaScript로 옮긴 그래프 레이아웃 엔진입니다. 여러 알고리즘 중 ERD처럼 방향이 있는 관계에는 **`layered`** 알고리즘이 잘 맞습니다.

`layered` 알고리즘은 대략 이런 순서로 동작합니다.

1. 노드를 **층(layer)** 으로 나눕니다. 참조하는 쪽과 참조되는 쪽이 서로 다른 층에 놓입니다.
2. 층 안에서 노드 순서를 바꿔 가며 **선이 교차하는 횟수를 줄입니다**.
3. 실제 좌표를 정하고, 엣지 경로를 계산합니다(예: 직각으로 꺾이는 선).

## 예제 코드

### 1. ELK 그래프로 변환하고 레이아웃 계산하기

ELK는 **노드 크기를 알아야** 배치할 수 있습니다. ERD 테이블 노드는 컬럼 수에 따라 높이가 달라지므로, 높이를 직접 계산해서 넘겨줍니다.

```js
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const NODE_WIDTH = 220;
const HEADER_HEIGHT = 36;
const ROW_HEIGHT = 24;

const layoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',              // 왼쪽 → 오른쪽으로 층 배치
  'elk.edgeRouting': 'ORTHOGONAL',       // 직각으로 꺾이는 선
  'elk.spacing.nodeNode': '40',          // 같은 층 노드 간격
  'elk.layered.spacing.nodeNodeBetweenLayers': '80', // 층 사이 간격
};

export async function layoutErd(tables, relations) {
  const graph = {
    id: 'root',
    layoutOptions,
    children: tables.map((t) => ({
      id: t.name,
      width: NODE_WIDTH,
      height: HEADER_HEIGHT + t.columns.length * ROW_HEIGHT,
    })),
    edges: relations.map((r) => ({
      id: r.key,
      sources: [r.from],
      targets: [r.to],
    })),
  };

  const result = await elk.layout(graph); // Promise: 계산이 끝나면 x, y가 채워진 그래프
  return result.children.map((n) => ({ id: n.id, x: n.x, y: n.y }));
}
```

### 2. 계산 결과를 React Flow 노드로 바꾸기

ELK의 `x`, `y`는 노드의 **왼쪽 위 기준**이고, React Flow의 `position`도 같은 기준이라 그대로 쓸 수 있습니다.

```js
const positions = await layoutErd(tables, relations);
const posById = Object.fromEntries(positions.map((p) => [p.id, p]));

const nodes = tables.map((t) => ({
  id: t.name,
  type: 'table',                          // 컬럼 목록을 그리는 커스텀 노드
  data: { table: t },
  position: { x: posById[t.name].x, y: posById[t.name].y },
}));

const edges = relations.map((r) => ({
  id: r.key,
  source: r.from,
  target: r.to,
  type: 'step',                           // 화면에서도 직각 선으로 표시
}));
```

> `react-flow-renderer` 9.x에서는 노드와 엣지를 `elements` 배열 하나로 합쳐서 넘깁니다. 10버전 이후(`reactflow`, `@xyflow/react`)부터는 `nodes`와 `edges`를 따로 넘깁니다. 버전에 맞게 넘겨주면 됩니다.

## 주의할 점

- **노드 크기를 정확하게 넘겨야 합니다.** 실제로 렌더링된 크기와 ELK에 넘긴 크기가 다르면 노드가 겹칩니다. 폰트나 패딩이 바뀌면 크기 계산 상수도 함께 바꿔야 합니다.
- **레이아웃 계산은 비동기입니다.** 테이블이 많을수록 시간이 걸리므로, 로딩 표시를 하거나 필터로 대상 테이블을 줄이는 것이 좋습니다.
- **필터가 바뀌면 레이아웃을 다시 계산합니다.** 보이는 노드만 다시 배치해야 빈 공간이 생기지 않습니다.

## 프로젝트에서는 이렇게 썼다

- [AI Agent 기반 ERD 자동 생성 시스템](/projects/erd-auto-generator/)
  - `elkjs`의 layered 알고리즘과 직각 라우팅으로 ERD를 자동 배치했습니다.
  - 모듈별·상태(후보/확정/제외)별 필터를 바꾸면 보이는 테이블만 다시 배치하도록 했습니다.

## 참고 자료

- [ELK 공식 문서 - Layout Options](https://eclipse.dev/elk/reference/options.html)
- [elkjs GitHub](https://github.com/kieler/elkjs)
- [React Flow - Layouting 예제](https://reactflow.dev/learn/layouting/layouting)
