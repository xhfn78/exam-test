import { NextRequest, NextResponse } from 'next/server';
import { Question } from '@/types/exam';

// 크롤링 대상 사이트 설정
const CRAWL_SOURCES = {
  comcbt: {
    name: 'comcbt.com',
    baseUrl: 'https://www.comcbt.com',
    examCode: '전기기능장',
  },
  // 추가 사이트 설정 가능
};

interface CrawlRequest {
  source: keyof typeof CRAWL_SOURCES;
  year?: number;
  count?: number;
}

interface CrawlResponse {
  questions: Question[];
  source: string;
  crawledAt: string;
  error?: string;
}

// 크롤링 API 엔드포인트
export async function POST(request: NextRequest): Promise<NextResponse<CrawlResponse>> {
  try {
    const body: CrawlRequest = await request.json();
    const { source, year, count = 10 } = body;

    if (!CRAWL_SOURCES[source]) {
      return NextResponse.json(
        { questions: [], source, crawledAt: new Date().toISOString(), error: '지원하지 않는 소스입니다.' },
        { status: 400 }
      );
    }

    // 크롤링 수행 (현재는 시뮬레이션)
    const questions = await crawlQuestions(source, year, count);

    return NextResponse.json({
      questions,
      source: CRAWL_SOURCES[source].name,
      crawledAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('크롤링 오류:', error);
    return NextResponse.json(
      { questions: [], source: '', crawledAt: new Date().toISOString(), error: '크롤링 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 크롤링 수행 함수 (확장 가능한 구조)
async function crawlQuestions(
  source: keyof typeof CRAWL_SOURCES,
  year?: number,
  count: number = 10
): Promise<Question[]> {
  const sourceConfig = CRAWL_SOURCES[source];

  // 실제 크롤링 로직은 여기에 구현
  // 현재는 샘플 데이터 반환 (크롤링된 형태의 문제)
  const crawledQuestions: Question[] = getCrawledSampleQuestions(count, year);

  console.log(`${sourceConfig.name}에서 ${crawledQuestions.length}개 문제 크롤링 완료`);

  return crawledQuestions;
}

// 크롤링된 형태의 샘플 문제 (실제 크롤링 데이터로 대체 예정)
function getCrawledSampleQuestions(count: number, year?: number): Question[] {
  // 다양한 난이도의 실전형 문제들
  const sampleQuestions: Question[] = [
    {
      id: 0,
      question: "3상 유도 전동기의 동기속도가 1800rpm이고, 슬립이 5%일 때 실제 회전속도는?",
      options: ["1710rpm", "1800rpm", "1890rpm", "1755rpm"],
      answer: 0,
      explanation: "실제 회전속도 = 동기속도 × (1 - 슬립) = 1800 × (1 - 0.05) = 1800 × 0.95 = 1710rpm",
      category: { subject: "전기기기", topic: "유도기", subtopic: "유도전동기" },
      source: "crawled",
      year: year || 2023,
      difficulty: "medium",
      tags: ["계산문제", "유도전동기", "슬립"]
    },
    {
      id: 0,
      question: "그림과 같은 3상 Y결선 변압기에서 1차측 선간전압이 22,900V일 때, 2차측 상전압은? (권수비 N1:N2 = 100:1)",
      options: ["132.2V", "229V", "396.7V", "76.3V"],
      answer: 0,
      explanation: "Y결선에서 선간전압 = √3 × 상전압\n1차 상전압 = 22900/√3 = 13,220V\n2차 상전압 = 13220/100 = 132.2V",
      category: { subject: "전기기기", topic: "변압기", subtopic: "3상변압기" },
      source: "crawled",
      year: year || 2023,
      diagram: {
        type: "circuit",
        content: `
      1차측 (Y결선)          2차측 (Y결선)
         A ──┬── a
         B ──┼── b           N1:N2 = 100:1
         C ──┴── c
            │
           ─┴─ (중성점)
        `,
        description: "Y-Y 결선 3상 변압기 회로도"
      },
      difficulty: "hard",
      tags: ["계산문제", "변압기", "Y결선"]
    },
    {
      id: 0,
      question: "정격 10MVA, 22.9kV/6.6kV 변압기의 %임피던스가 7.5%일 때, 2차측 단락전류는 약 몇 kA인가?",
      options: ["11.7kA", "15.2kA", "8.7kA", "19.5kA"],
      answer: 0,
      explanation: "정격전류 In = S/(√3×V) = 10×10⁶/(√3×6600) = 874.8A\n단락전류 Is = In/(%Z/100) = 874.8/(7.5/100) = 11,664A ≈ 11.7kA",
      category: { subject: "송·배전", topic: "단락전류", subtopic: "단락전류계산" },
      source: "crawled",
      year: year || 2022,
      difficulty: "hard",
      tags: ["계산문제", "단락전류", "%임피던스"]
    },
    {
      id: 0,
      question: "3상 농형 유도전동기의 기동방법 중 기동토크가 가장 큰 것은?",
      options: [
        "Y-Δ 기동",
        "기동보상기법",
        "리액터 기동",
        "전전압 기동(직입기동)"
      ],
      answer: 3,
      explanation: "전전압 기동(직입기동)은 전전압을 인가하므로 기동토크가 가장 크다.\n기동토크 비교: 직입(100%) > 기동보상기(τ²배) > 리액터(x²배) > Y-Δ(1/3배)",
      category: { subject: "전기기기", topic: "유도기", subtopic: "유도전동기" },
      source: "crawled",
      year: year || 2022,
      difficulty: "medium",
      tags: ["이론문제", "유도전동기", "기동법"]
    },
    {
      id: 0,
      question: "KEC에서 규정하는 저압 전로의 절연저항 기준으로 옳은 것은? (대지전압 300V 이하)",
      options: [
        "0.1MΩ 이상",
        "0.2MΩ 이상",
        "0.3MΩ 이상",
        "0.4MΩ 이상"
      ],
      answer: 2,
      explanation: "KEC 212.3에 따라 대지전압 300V 이하인 경우 절연저항은 0.3MΩ 이상이어야 한다.\n- 대지전압 150V 이하: 0.1MΩ 이상\n- 대지전압 150V~300V: 0.3MΩ 이상\n- 대지전압 300V 초과: 0.4MΩ 이상",
      category: { subject: "한국전기설비규정(KEC)", topic: "저압전기설비", subtopic: "절연저항" },
      source: "crawled",
      year: year || 2023,
      difficulty: "easy",
      tags: ["이론문제", "KEC", "절연저항"]
    },
    {
      id: 0,
      question: "그림과 같은 RC 직렬회로에 교류전압 100V를 인가했을 때 전류는 5A이다. R=16Ω일 때 용량성 리액턴스 Xc는?",
      options: ["8Ω", "12Ω", "16Ω", "20Ω"],
      answer: 1,
      explanation: "임피던스 Z = V/I = 100/5 = 20Ω\nZ = √(R² + Xc²)에서 Xc = √(Z² - R²) = √(20² - 16²) = √(400 - 256) = √144 = 12Ω",
      category: { subject: "전기이론", topic: "교류회로", subtopic: "교류전력" },
      source: "crawled",
      year: year || 2021,
      diagram: {
        type: "circuit",
        content: `
      ┌──[R=16Ω]──[C]──┐
      │                │
     (~)  AC 100V      │
      │                │
      └────────────────┘
        `,
        description: "RC 직렬 회로"
      },
      difficulty: "medium",
      tags: ["계산문제", "RC회로", "임피던스"]
    },
    {
      id: 0,
      question: "IGBT(Insulated Gate Bipolar Transistor)의 특성으로 옳지 않은 것은?",
      options: [
        "전압제어 소자이다",
        "MOSFET과 BJT의 장점을 결합한 소자이다",
        "대전력 용도에 적합하다",
        "스위칭 속도가 MOSFET보다 빠르다"
      ],
      answer: 3,
      explanation: "IGBT는 MOSFET의 전압구동 특성과 BJT의 대전류 처리 능력을 결합한 소자이다.\n스위칭 속도는 MOSFET이 더 빠르고, IGBT는 중간 정도의 스위칭 속도를 가진다.",
      category: { subject: "전력전자", topic: "전력용 반도체", subtopic: "IGBT" },
      source: "crawled",
      year: year || 2023,
      difficulty: "medium",
      tags: ["이론문제", "IGBT", "전력반도체"]
    },
    {
      id: 0,
      question: "다음 논리회로의 출력 Y는? (입력 A=1, B=0, C=1)",
      options: ["0", "1", "불확정", "논리오류"],
      answer: 1,
      explanation: "AND 게이트: A·B = 1·0 = 0\nOR 게이트: (A·B) + C = 0 + 1 = 1\n따라서 출력 Y = 1",
      category: { subject: "디지털공학", topic: "조합논리회로", subtopic: "논리게이트" },
      source: "crawled",
      year: year || 2022,
      diagram: {
        type: "circuit",
        content: `
      A ──┬──┐
          │ AND├──┐
      B ──┴──┘   │
                 ├──OR──► Y
      C ─────────┘
        `,
        description: "AND-OR 조합 논리회로"
      },
      difficulty: "easy",
      tags: ["이론문제", "논리회로", "조합논리"]
    },
    {
      id: 0,
      question: "케이블 포설 시 허용 굽힘반경에 대한 설명으로 옳은 것은?",
      options: [
        "단심 케이블은 완성 외경의 6배 이상",
        "다심 케이블은 완성 외경의 8배 이상",
        "차폐형 케이블은 완성 외경의 12배 이상",
        "모든 케이블은 완성 외경의 4배 이상"
      ],
      answer: 2,
      explanation: "케이블 굽힘반경 기준:\n- 단심 케이블: 완성 외경의 8배 이상\n- 다심 케이블: 완성 외경의 6배 이상\n- 차폐형/알루미늄 피복 케이블: 완성 외경의 12배 이상",
      category: { subject: "전기설비설계및시공", topic: "배선공사", subtopic: "케이블공사" },
      source: "crawled",
      year: year || 2023,
      difficulty: "medium",
      tags: ["이론문제", "케이블", "시공"]
    },
    {
      id: 0,
      question: "생산관리에서 재고관리 모형 중 경제적 주문량(EOQ)을 결정하는 요소가 아닌 것은?",
      options: [
        "연간 수요량",
        "주문비용",
        "재고유지비용",
        "제품 불량률"
      ],
      answer: 3,
      explanation: "경제적 주문량(EOQ) = √(2DS/H)\nD: 연간 수요량, S: 주문비용, H: 재고유지비용\n불량률은 EOQ 계산에 포함되지 않는다.",
      category: { subject: "공업경영", topic: "생산관리", subtopic: "재고관리" },
      source: "crawled",
      year: year || 2021,
      difficulty: "easy",
      tags: ["이론문제", "EOQ", "재고관리"]
    },
  ];

  // 요청된 수만큼 반환 (순환)
  const result: Question[] = [];
  for (let i = 0; i < count; i++) {
    result.push({ ...sampleQuestions[i % sampleQuestions.length] });
  }

  return result;
}

// GET 요청으로 사용 가능한 소스 목록 반환
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    sources: Object.entries(CRAWL_SOURCES).map(([key, value]) => ({
      id: key,
      name: value.name,
      examCode: value.examCode,
    })),
  });
}
