'use client';

import { useState, useCallback } from 'react';

interface CBTCalculatorProps {
  onClose: () => void;
}

export default function CBTCalculator({ onClose }: CBTCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = (left: number, right: number, op: string): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right !== 0 ? left / right : 0;
      default: return right;
    }
  };

  const equals = useCallback(() => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  }, [display, previousValue, operation]);

  const sqrt = useCallback(() => {
    const value = parseFloat(display);
    if (value >= 0) {
      setDisplay(String(Math.sqrt(value)));
      setWaitingForOperand(true);
    }
  }, [display]);

  const percent = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
    setWaitingForOperand(true);
  }, [display]);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  const ButtonClass = "w-12 h-10 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400";
  const NumberButton = `${ButtonClass} bg-white hover:bg-gray-100 text-gray-800 border border-gray-300`;
  const OperatorButton = `${ButtonClass} bg-[#2a4a6f] hover:bg-[#3a5a7f] text-white`;
  const FunctionButton = `${ButtonClass} bg-gray-200 hover:bg-gray-300 text-gray-700`;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#e8eef3] rounded-lg shadow-2xl border-2 border-[#1e3a5f] overflow-hidden">
        {/* 헤더 */}
        <div className="bg-[#1e3a5f] text-white px-4 py-2 flex items-center justify-between cursor-move">
          <span className="font-semibold">계산기</span>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded p-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 디스플레이 */}
        <div className="p-2">
          <div className="bg-white border-2 border-gray-300 rounded px-3 py-2 text-right">
            <span className="font-mono text-2xl text-gray-800">{display}</span>
          </div>
        </div>

        {/* 버튼 패드 */}
        <div className="p-2 grid grid-cols-5 gap-1">
          {/* Row 1 */}
          <button onClick={clear} className={`${FunctionButton} col-span-1 text-red-600`}>C</button>
          <button onClick={backspace} className={FunctionButton}>
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
          <button onClick={percent} className={FunctionButton}>%</button>
          <button onClick={sqrt} className={FunctionButton}>√</button>
          <button onClick={() => performOperation('/')} className={OperatorButton}>÷</button>

          {/* Row 2 */}
          <button onClick={() => inputDigit('7')} className={NumberButton}>7</button>
          <button onClick={() => inputDigit('8')} className={NumberButton}>8</button>
          <button onClick={() => inputDigit('9')} className={NumberButton}>9</button>
          <button onClick={toggleSign} className={FunctionButton}>±</button>
          <button onClick={() => performOperation('*')} className={OperatorButton}>×</button>

          {/* Row 3 */}
          <button onClick={() => inputDigit('4')} className={NumberButton}>4</button>
          <button onClick={() => inputDigit('5')} className={NumberButton}>5</button>
          <button onClick={() => inputDigit('6')} className={NumberButton}>6</button>
          <button onClick={() => inputDigit('(')} className={FunctionButton}>(</button>
          <button onClick={() => performOperation('-')} className={OperatorButton}>−</button>

          {/* Row 4 */}
          <button onClick={() => inputDigit('1')} className={NumberButton}>1</button>
          <button onClick={() => inputDigit('2')} className={NumberButton}>2</button>
          <button onClick={() => inputDigit('3')} className={NumberButton}>3</button>
          <button onClick={() => inputDigit(')')} className={FunctionButton}>)</button>
          <button onClick={() => performOperation('+')} className={OperatorButton}>+</button>

          {/* Row 5 */}
          <button onClick={() => inputDigit('0')} className={`${NumberButton} col-span-2`}>0</button>
          <button onClick={inputDecimal} className={NumberButton}>.</button>
          <button onClick={equals} className={`${OperatorButton} col-span-2 bg-[#1e3a5f]`}>=</button>
        </div>
      </div>
    </div>
  );
}
