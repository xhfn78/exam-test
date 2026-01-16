'use client';

import { Diagram, CircuitData, ComponentData } from '@/types/exam';

interface CircuitDiagramProps {
  diagram: Diagram;
}

export default function CircuitDiagram({ diagram }: CircuitDiagramProps) {
  // 회로도 타입에 따른 렌더링
  if (diagram.type === 'circuit') {
    return <CircuitRenderer diagram={diagram} />;
  }

  if (diagram.type === 'table') {
    return <TableRenderer diagram={diagram} />;
  }

  if (diagram.type === 'formula') {
    return <FormulaRenderer diagram={diagram} />;
  }

  if (diagram.type === 'graph') {
    return <GraphRenderer diagram={diagram} />;
  }

  return null;
}

// 회로도 렌더러 (SVG 기반)
function CircuitRenderer({ diagram }: { diagram: Diagram }) {
  // 구조화된 회로 데이터가 있으면 SVG로 렌더링
  if (diagram.data) {
    return <SVGCircuit data={diagram.data} description={diagram.description} />;
  }

  // 기본: 설명 텍스트 기반 표시
  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-semibold text-slate-700">회로도</span>
      </div>
      {diagram.description && (
        <p className="text-slate-800 font-medium text-base leading-relaxed">
          {diagram.description}
        </p>
      )}
    </div>
  );
}

// SVG 기반 회로도 컴포넌트
function SVGCircuit({ data, description }: { data: CircuitData; description?: string }) {
  const { type, components } = data;

  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
      {/* 회로도 SVG */}
      <div className="p-4 bg-slate-50">
        <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto" style={{ maxHeight: '200px' }}>
          {/* 배경 그리드 */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* 회로 타입에 따른 렌더링 */}
          {type === 'series-rl' && <SeriesRLCircuit components={components} />}
          {type === 'parallel-rl' && <ParallelRLCircuit components={components} />}
          {type === 'series-rc' && <SeriesRCCircuit components={components} />}
          {type === 'series-rlc' && <SeriesRLCCircuit components={components} />}
          {type === 'transformer' && <TransformerCircuit components={components} />}
          {type === 'three-phase' && <ThreePhaseCircuit components={components} />}
          {type === 'bridge' && <BridgeCircuit components={components} />}
          {type === 'voltage-divider' && <VoltageDividerCircuit components={components} />}
          {type === 'current-source' && <CurrentSourceCircuit components={components} />}
        </svg>
      </div>

      {/* 설명 */}
      {description && (
        <div className="px-4 py-3 bg-blue-50 border-t border-slate-200">
          <p className="text-sm text-slate-700">{description}</p>
        </div>
      )}

      {/* 부품 값 표시 */}
      {components && components.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 flex flex-wrap gap-3">
          {components.map((comp, idx) => (
            <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
              {comp.label}: {comp.value}{comp.unit}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// 직렬 RL 회로
function SeriesRLCircuit({ components }: { components?: ComponentData[] }) {
  const R = components?.find(c => c.type === 'R');
  const L = components?.find(c => c.type === 'L');
  const V = components?.find(c => c.type === 'V');

  return (
    <g>
      {/* 전원 */}
      <circle cx="50" cy="100" r="20" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <text x="50" y="105" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">~</text>
      {V && <text x="50" y="75" textAnchor="middle" className="text-xs fill-slate-600">{V.value}{V.unit}</text>}

      {/* 연결선 */}
      <line x1="70" y1="100" x2="120" y2="100" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="80" x2="50" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="50" x2="350" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="350" y1="50" x2="350" y2="100" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="120" x2="50" y2="150" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="150" x2="350" y2="150" stroke="#374151" strokeWidth="2" />
      <line x1="350" y1="150" x2="350" y2="100" stroke="#374151" strokeWidth="2" />

      {/* 저항 R */}
      <rect x="120" y="90" width="60" height="20" fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x="150" y="130" textAnchor="middle" className="text-xs fill-red-600 font-semibold">
        R{R ? ` = ${R.value}${R.unit}` : ''}
      </text>

      {/* 인덕터 L */}
      <path d="M220,100 Q235,80 250,100 Q265,120 280,100 Q295,80 310,100" fill="none" stroke="#8b5cf6" strokeWidth="2" />
      <text x="265" y="130" textAnchor="middle" className="text-xs fill-purple-600 font-semibold">
        L{L ? ` = ${L.value}${L.unit}` : ''}
      </text>

      {/* 연결 */}
      <line x1="180" y1="100" x2="220" y2="100" stroke="#374151" strokeWidth="2" />
      <line x1="310" y1="100" x2="350" y2="100" stroke="#374151" strokeWidth="2" />

      {/* VL 표시 */}
      <text x="265" y="85" textAnchor="middle" className="text-xs fill-purple-600">VL</text>
    </g>
  );
}

// 병렬 RL 회로
function ParallelRLCircuit({ components }: { components?: ComponentData[] }) {
  const R = components?.find(c => c.type === 'R');
  const X = components?.find(c => c.type === 'X' || c.type === 'L');

  return (
    <g>
      {/* 입력 단자 */}
      <circle cx="50" cy="70" r="5" fill="#374151" />
      <circle cx="50" cy="130" r="5" fill="#374151" />
      <text x="30" y="75" textAnchor="middle" className="text-xs fill-slate-600 font-semibold">a</text>
      <text x="30" y="135" textAnchor="middle" className="text-xs fill-slate-600 font-semibold">b</text>

      {/* 메인 라인 */}
      <line x1="50" y1="70" x2="120" y2="70" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="130" x2="120" y2="130" stroke="#374151" strokeWidth="2" />

      {/* 분기점 */}
      <line x1="120" y1="70" x2="120" y2="130" stroke="#374151" strokeWidth="2" />
      <line x1="280" y1="70" x2="280" y2="130" stroke="#374151" strokeWidth="2" />

      {/* 저항 R (상단) */}
      <line x1="120" y1="70" x2="150" y2="70" stroke="#374151" strokeWidth="2" />
      <rect x="150" y="60" width="80" height="20" fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x="190" y="50" textAnchor="middle" className="text-xs fill-red-600 font-semibold">
        R{R ? ` = ${R.value}${R.unit}` : ''}
      </text>
      <line x1="230" y1="70" x2="280" y2="70" stroke="#374151" strokeWidth="2" />

      {/* 리액턴스 X (하단) */}
      <line x1="120" y1="130" x2="150" y2="130" stroke="#374151" strokeWidth="2" />
      <rect x="150" y="120" width="80" height="20" fill="none" stroke="#8b5cf6" strokeWidth="2" />
      <text x="190" y="155" textAnchor="middle" className="text-xs fill-purple-600 font-semibold">
        X{X ? ` = ${X.value}${X.unit}` : ''}
      </text>
      <line x1="230" y1="130" x2="280" y2="130" stroke="#374151" strokeWidth="2" />

      {/* 출력 단자 */}
      <line x1="280" y1="70" x2="350" y2="70" stroke="#374151" strokeWidth="2" />
      <line x1="280" y1="130" x2="350" y2="130" stroke="#374151" strokeWidth="2" />
      <circle cx="350" cy="70" r="5" fill="#374151" />
      <circle cx="350" cy="130" r="5" fill="#374151" />
    </g>
  );
}

// 직렬 RC 회로
function SeriesRCCircuit({ components }: { components?: ComponentData[] }) {
  const R = components?.find(c => c.type === 'R');
  const C = components?.find(c => c.type === 'C');
  const V = components?.find(c => c.type === 'V');

  return (
    <g>
      {/* 전원 */}
      <circle cx="50" cy="100" r="20" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <text x="50" y="105" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">~</text>
      {V && <text x="50" y="75" textAnchor="middle" className="text-xs fill-slate-600">{V.value}{V.unit}</text>}

      {/* 연결선 */}
      <line x1="70" y1="100" x2="120" y2="100" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="80" x2="50" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="50" x2="350" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="350" y1="50" x2="350" y2="100" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="120" x2="50" y2="150" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="150" x2="350" y2="150" stroke="#374151" strokeWidth="2" />
      <line x1="350" y1="150" x2="350" y2="100" stroke="#374151" strokeWidth="2" />

      {/* 저항 R */}
      <rect x="120" y="90" width="60" height="20" fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x="150" y="130" textAnchor="middle" className="text-xs fill-red-600 font-semibold">
        R{R ? ` = ${R.value}${R.unit}` : ''}
      </text>

      {/* 커패시터 C */}
      <line x1="250" y1="80" x2="250" y2="120" stroke="#22c55e" strokeWidth="2" />
      <line x1="270" y1="80" x2="270" y2="120" stroke="#22c55e" strokeWidth="2" />
      <text x="260" y="140" textAnchor="middle" className="text-xs fill-green-600 font-semibold">
        C{C ? ` = ${C.value}${C.unit}` : ''}
      </text>

      {/* 연결 */}
      <line x1="180" y1="100" x2="250" y2="100" stroke="#374151" strokeWidth="2" />
      <line x1="270" y1="100" x2="350" y2="100" stroke="#374151" strokeWidth="2" />
    </g>
  );
}

// 직렬 RLC 회로
function SeriesRLCCircuit({ components }: { components?: ComponentData[] }) {
  const R = components?.find(c => c.type === 'R');
  const L = components?.find(c => c.type === 'L');
  const C = components?.find(c => c.type === 'C');

  return (
    <g>
      {/* 전원 */}
      <circle cx="40" cy="100" r="18" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <text x="40" y="105" textAnchor="middle" className="text-sm fill-blue-600 font-bold">~</text>

      {/* 상단 라인 */}
      <line x1="40" y1="82" x2="40" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="40" y1="50" x2="360" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="360" y1="50" x2="360" y2="100" stroke="#374151" strokeWidth="2" />

      {/* 하단 라인 */}
      <line x1="40" y1="118" x2="40" y2="150" stroke="#374151" strokeWidth="2" />
      <line x1="40" y1="150" x2="360" y2="150" stroke="#374151" strokeWidth="2" />
      <line x1="360" y1="150" x2="360" y2="100" stroke="#374151" strokeWidth="2" />

      {/* 연결선 */}
      <line x1="58" y1="100" x2="90" y2="100" stroke="#374151" strokeWidth="2" />

      {/* 저항 R */}
      <rect x="90" y="90" width="50" height="20" fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x="115" y="125" textAnchor="middle" className="text-[10px] fill-red-600 font-semibold">
        R{R ? `=${R.value}${R.unit}` : ''}
      </text>
      <line x1="140" y1="100" x2="170" y2="100" stroke="#374151" strokeWidth="2" />

      {/* 인덕터 L */}
      <path d="M170,100 Q182,85 194,100 Q206,115 218,100 Q230,85 242,100" fill="none" stroke="#8b5cf6" strokeWidth="2" />
      <text x="206" y="125" textAnchor="middle" className="text-[10px] fill-purple-600 font-semibold">
        L{L ? `=${L.value}${L.unit}` : ''}
      </text>
      <line x1="242" y1="100" x2="280" y2="100" stroke="#374151" strokeWidth="2" />

      {/* 커패시터 C */}
      <line x1="280" y1="85" x2="280" y2="115" stroke="#22c55e" strokeWidth="2" />
      <line x1="295" y1="85" x2="295" y2="115" stroke="#22c55e" strokeWidth="2" />
      <text x="287" y="135" textAnchor="middle" className="text-[10px] fill-green-600 font-semibold">
        C{C ? `=${C.value}${C.unit}` : ''}
      </text>
      <line x1="295" y1="100" x2="360" y2="100" stroke="#374151" strokeWidth="2" />
    </g>
  );
}

// 변압기 회로
function TransformerCircuit({ components }: { components?: ComponentData[] }) {
  return (
    <g>
      {/* 1차측 코일 */}
      <path d="M80,60 Q95,60 95,75 Q95,90 80,90 Q95,90 95,105 Q95,120 80,120 Q95,120 95,135 Q95,150 80,150"
            fill="none" stroke="#3b82f6" strokeWidth="2" />
      <text x="60" y="105" textAnchor="middle" className="text-xs fill-blue-600 font-semibold">N1</text>

      {/* 철심 */}
      <line x1="120" y1="50" x2="120" y2="160" stroke="#374151" strokeWidth="3" />
      <line x1="130" y1="50" x2="130" y2="160" stroke="#374151" strokeWidth="3" />

      {/* 2차측 코일 */}
      <path d="M170,60 Q155,60 155,75 Q155,90 170,90 Q155,90 155,105 Q155,120 170,120 Q155,120 155,135 Q155,150 170,150"
            fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x="190" y="105" textAnchor="middle" className="text-xs fill-red-600 font-semibold">N2</text>

      {/* 입력 단자 */}
      <line x1="30" y1="60" x2="80" y2="60" stroke="#374151" strokeWidth="2" />
      <line x1="30" y1="150" x2="80" y2="150" stroke="#374151" strokeWidth="2" />
      <text x="20" y="65" className="text-xs fill-slate-600">V1</text>

      {/* 출력 단자 */}
      <line x1="170" y1="60" x2="220" y2="60" stroke="#374151" strokeWidth="2" />
      <line x1="170" y1="150" x2="220" y2="150" stroke="#374151" strokeWidth="2" />
      <text x="230" y="65" className="text-xs fill-slate-600">V2</text>

      {/* 권수비 표시 */}
      <text x="300" y="100" className="text-xs fill-slate-700">권수비</text>
      <text x="300" y="120" className="text-xs fill-slate-700">N1 : N2</text>
    </g>
  );
}

// 3상 회로
function ThreePhaseCircuit({ components }: { components?: ComponentData[] }) {
  return (
    <g>
      {/* Y 결선 */}
      <line x1="100" y1="100" x2="150" y2="60" stroke="#ef4444" strokeWidth="2" />
      <line x1="100" y1="100" x2="150" y2="100" stroke="#22c55e" strokeWidth="2" />
      <line x1="100" y1="100" x2="150" y2="140" stroke="#3b82f6" strokeWidth="2" />

      {/* 중성점 */}
      <circle cx="100" cy="100" r="5" fill="#374151" />
      <text x="80" y="105" className="text-xs fill-slate-600">N</text>

      {/* 상 라벨 */}
      <text x="160" y="65" className="text-xs fill-red-600 font-semibold">R (A상)</text>
      <text x="160" y="105" className="text-xs fill-green-600 font-semibold">S (B상)</text>
      <text x="160" y="145" className="text-xs fill-blue-600 font-semibold">T (C상)</text>

      {/* 부하 */}
      <rect x="220" y="50" width="40" height="20" fill="none" stroke="#ef4444" strokeWidth="2" />
      <rect x="220" y="90" width="40" height="20" fill="none" stroke="#22c55e" strokeWidth="2" />
      <rect x="220" y="130" width="40" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" />

      {/* 연결선 */}
      <line x1="150" y1="60" x2="220" y2="60" stroke="#ef4444" strokeWidth="2" />
      <line x1="150" y1="100" x2="220" y2="100" stroke="#22c55e" strokeWidth="2" />
      <line x1="150" y1="140" x2="220" y2="140" stroke="#3b82f6" strokeWidth="2" />

      {/* 전압 표시 */}
      <text x="300" y="80" className="text-xs fill-slate-700">선간전압: VL</text>
      <text x="300" y="100" className="text-xs fill-slate-700">상전압: Vp</text>
      <text x="300" y="120" className="text-xs fill-slate-700">VL = √3 × Vp</text>
    </g>
  );
}

// 브릿지 회로
function BridgeCircuit({ components }: { components?: ComponentData[] }) {
  return (
    <g>
      {/* 다이아몬드 형태 브릿지 */}
      <line x1="100" y1="100" x2="200" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="200" y1="50" x2="300" y2="100" stroke="#374151" strokeWidth="2" />
      <line x1="300" y1="100" x2="200" y2="150" stroke="#374151" strokeWidth="2" />
      <line x1="200" y1="150" x2="100" y2="100" stroke="#374151" strokeWidth="2" />

      {/* 저항 심볼 */}
      <rect x="130" y="65" width="30" height="15" fill="none" stroke="#ef4444" strokeWidth="1.5" />
      <rect x="240" y="65" width="30" height="15" fill="none" stroke="#ef4444" strokeWidth="1.5" />
      <rect x="130" y="120" width="30" height="15" fill="none" stroke="#ef4444" strokeWidth="1.5" />
      <rect x="240" y="120" width="30" height="15" fill="none" stroke="#ef4444" strokeWidth="1.5" />

      {/* 라벨 */}
      <text x="145" y="60" className="text-[10px] fill-slate-600">R1</text>
      <text x="255" y="60" className="text-[10px] fill-slate-600">R2</text>
      <text x="145" y="150" className="text-[10px] fill-slate-600">R3</text>
      <text x="255" y="150" className="text-[10px] fill-slate-600">R4</text>

      {/* 전원 연결 */}
      <line x1="50" y1="100" x2="100" y2="100" stroke="#374151" strokeWidth="2" />
      <line x1="300" y1="100" x2="350" y2="100" stroke="#374151" strokeWidth="2" />
      <text x="40" y="105" className="text-xs fill-slate-600">+</text>
      <text x="355" y="105" className="text-xs fill-slate-600">-</text>
    </g>
  );
}

// 전압분배 회로
function VoltageDividerCircuit({ components }: { components?: ComponentData[] }) {
  const R1 = components?.find(c => c.label === 'R1');
  const R2 = components?.find(c => c.label === 'R2');
  const V = components?.find(c => c.type === 'V');

  return (
    <g>
      {/* 전원 */}
      <circle cx="50" cy="100" r="20" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <line x1="45" y1="95" x2="55" y2="95" stroke="#3b82f6" strokeWidth="2" />
      <line x1="45" y1="105" x2="55" y2="105" stroke="#3b82f6" strokeWidth="2" />
      <line x1="50" y1="92" x2="50" y2="98" stroke="#3b82f6" strokeWidth="2" />
      {V && <text x="50" y="75" textAnchor="middle" className="text-xs fill-slate-600">{V.value}{V.unit}</text>}

      {/* 상단 라인 */}
      <line x1="50" y1="80" x2="50" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="50" x2="200" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="200" y1="50" x2="200" y2="70" stroke="#374151" strokeWidth="2" />

      {/* R1 */}
      <rect x="185" y="70" width="30" height="40" fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x="230" y="95" className="text-xs fill-red-600 font-semibold">
        R1{R1 ? `=${R1.value}${R1.unit}` : ''}
      </text>

      {/* 출력점 */}
      <line x1="200" y1="110" x2="200" y2="120" stroke="#374151" strokeWidth="2" />
      <line x1="200" y1="120" x2="280" y2="120" stroke="#22c55e" strokeWidth="2" />
      <circle cx="200" cy="120" r="4" fill="#22c55e" />
      <text x="290" y="125" className="text-xs fill-green-600 font-semibold">Vout</text>

      {/* R2 */}
      <line x1="200" y1="120" x2="200" y2="130" stroke="#374151" strokeWidth="2" />
      <rect x="185" y="130" width="30" height="40" fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x="230" y="155" className="text-xs fill-red-600 font-semibold">
        R2{R2 ? `=${R2.value}${R2.unit}` : ''}
      </text>

      {/* 하단 라인 */}
      <line x1="200" y1="170" x2="200" y2="190" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="190" x2="200" y2="190" stroke="#374151" strokeWidth="2" />
      <line x1="50" y1="120" x2="50" y2="190" stroke="#374151" strokeWidth="2" />

      {/* 접지 */}
      <line x1="190" y1="190" x2="210" y2="190" stroke="#374151" strokeWidth="2" />
      <line x1="193" y1="195" x2="207" y2="195" stroke="#374151" strokeWidth="1.5" />
      <line x1="196" y1="200" x2="204" y2="200" stroke="#374151" strokeWidth="1" />
    </g>
  );
}

// 전류원 회로
function CurrentSourceCircuit({ components }: { components?: ComponentData[] }) {
  const I = components?.find(c => c.type === 'I');
  const R = components?.find(c => c.type === 'R');

  return (
    <g>
      {/* 전류원 */}
      <circle cx="80" cy="100" r="20" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <line x1="80" y1="85" x2="80" y2="115" stroke="#3b82f6" strokeWidth="2" />
      <polygon points="80,85 75,95 85,95" fill="#3b82f6" />
      {I && <text x="80" y="75" textAnchor="middle" className="text-xs fill-blue-600">{I.value}{I.unit}</text>}

      {/* 연결선 */}
      <line x1="80" y1="80" x2="80" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="80" y1="50" x2="280" y2="50" stroke="#374151" strokeWidth="2" />
      <line x1="280" y1="50" x2="280" y2="80" stroke="#374151" strokeWidth="2" />

      <line x1="80" y1="120" x2="80" y2="150" stroke="#374151" strokeWidth="2" />
      <line x1="80" y1="150" x2="280" y2="150" stroke="#374151" strokeWidth="2" />
      <line x1="280" y1="150" x2="280" y2="120" stroke="#374151" strokeWidth="2" />

      {/* 저항 */}
      <rect x="260" y="80" width="40" height="40" fill="none" stroke="#ef4444" strokeWidth="2" />
      <text x="280" y="140" textAnchor="middle" className="text-xs fill-red-600 font-semibold">
        R{R ? `=${R.value}${R.unit}` : ''}
      </text>
    </g>
  );
}

// 표 렌더러
function TableRenderer({ diagram }: { diagram: Diagram }) {
  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="font-semibold text-slate-700">표</span>
      </div>
      {diagram.description && (
        <p className="text-slate-800 font-medium">{diagram.description}</p>
      )}
    </div>
  );
}

// 공식 렌더러
function FormulaRenderer({ diagram }: { diagram: Diagram }) {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
          <span className="text-amber-600 font-bold text-lg">f</span>
        </div>
        <span className="font-semibold text-slate-700">공식</span>
      </div>
      {diagram.content && (
        <div className="bg-white rounded p-3 font-mono text-lg text-center border border-amber-200">
          {diagram.content}
        </div>
      )}
      {diagram.description && (
        <p className="mt-2 text-sm text-slate-600">{diagram.description}</p>
      )}
    </div>
  );
}

// 그래프 렌더러
function GraphRenderer({ diagram }: { diagram: Diagram }) {
  return (
    <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <span className="font-semibold text-slate-700">그래프</span>
      </div>
      {diagram.description && (
        <p className="text-slate-800 font-medium">{diagram.description}</p>
      )}
    </div>
  );
}

