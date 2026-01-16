'use client';

import { useState } from 'react';
import { examCriteria } from '@/lib/exam-criteria';
import { Subject, Topic } from '@/types/exam';

interface SubjectSelectorProps {
  onSelect: (subject: Subject, topic?: Topic) => void;
}

export default function SubjectSelector({ onSelect }: SubjectSelectorProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleSubjectClick = (subject: Subject) => {
    if (selectedSubject?.id === subject.id) {
      setSelectedSubject(null);
    } else {
      setSelectedSubject(subject);
    }
  };

  const handleStartPractice = (topic?: Topic) => {
    if (selectedSubject) {
      onSelect(selectedSubject, topic);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">과목 선택</h2>

      {/* 과목 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {examCriteria.subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => handleSubjectClick(subject)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedSubject?.id === subject.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">{subject.name}</span>
              <span className="text-sm text-gray-500">
                {subject.topics.length}개 영역
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 세부 영역 선택 */}
      {selectedSubject && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            {selectedSubject.name} - 세부 영역
          </h3>

          {/* 전체 영역 연습 */}
          <button
            onClick={() => handleStartPractice()}
            className="w-full mb-3 p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            전체 영역 연습 시작 (10문제)
          </button>

          <div className="text-sm text-gray-500 mb-2">또는 특정 영역 선택:</div>

          {/* 세부 영역 목록 */}
          <div className="space-y-2">
            {selectedSubject.topics.map((topic) => (
              <button
                key={topic.name}
                onClick={() => handleStartPractice(topic)}
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="font-medium text-gray-900">{topic.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {topic.subtopics.slice(0, 3).join(', ')}
                  {topic.subtopics.length > 3 && ` 외 ${topic.subtopics.length - 3}개`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
