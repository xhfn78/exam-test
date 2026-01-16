'use client';

import { Question, UserAnswer } from '@/types/exam';
import AnswerOptions from './AnswerOptions';
import CircuitDiagram from './CircuitDiagram';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: UserAnswer | undefined;
  onSelectAnswer: (optionIndex: number) => void;
  showExplanation?: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onSelectAnswer,
  showExplanation = false,
}: QuestionCardProps) {
  const isCorrect = userAnswer?.isCorrect;
  const hasAnswered = userAnswer?.selectedOption !== null && userAnswer?.selectedOption !== undefined;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {/* 문제 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          문제 {questionNumber} / {totalQuestions}
        </span>
        <span className="text-sm text-gray-500">
          {question.category.subject} &gt; {question.category.topic}
        </span>
      </div>

      {/* 문제 내용 */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed whitespace-pre-wrap">
          {question.question}
        </h2>
      </div>

      {/* 회로도/다이어그램 (있는 경우) */}
      {question.diagram && (
        <div className="mb-6">
          <CircuitDiagram diagram={question.diagram} />
        </div>
      )}

      {/* 난이도 및 태그 표시 */}
      {(question.difficulty || question.tags) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {question.difficulty && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {question.difficulty === 'easy' ? '쉬움' :
               question.difficulty === 'medium' ? '보통' : '어려움'}
            </span>
          )}
          {question.tags?.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 선택지 */}
      <AnswerOptions
        options={question.options}
        selectedOption={userAnswer?.selectedOption ?? null}
        correctAnswer={showExplanation ? question.answer : undefined}
        onSelect={onSelectAnswer}
        disabled={showExplanation}
      />

      {/* 해설 (결과 화면에서만 표시) */}
      {showExplanation && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          {/* 정답 여부 표시 */}
          <div className={`mb-4 p-3 rounded-lg ${
            isCorrect
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-green-800">정답입니다!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-red-800">
                    오답입니다. 정답: {question.answer + 1}번
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 해설 내용 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              해설
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {question.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
