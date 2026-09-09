import React, { useRef, useCallback, useEffect } from "react";

interface UsePressAndHoldOptions {
  onStep: (step: number) => void;
  initialDelay?: number;
  disabled?: boolean;
}

export function usePressAndHold({
  onStep,
  initialDelay = 320,
  disabled = false,
}: UsePressAndHoldOptions) {
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isHoldingRef = useRef<boolean>(false);
  const isTouchRef = useRef<boolean>(false);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isHoldingRef.current = false;
  }, []);

  const runTick = useCallback(() => {
    if (!isHoldingRef.current || disabledRef.current) {
      clearTimers();
      return;
    }

    const elapsed = Date.now() - startTimeRef.current;

    // Curva de aceleração gradual e inteligente
    let nextInterval = 100;
    let step = 1;

    if (elapsed > 4000) {
      nextInterval = 25;
      step = 10;
    } else if (elapsed > 2400) {
      nextInterval = 35;
      step = 5;
    } else if (elapsed > 1400) {
      nextInterval = 50;
      step = 2;
    } else if (elapsed > 600) {
      nextInterval = 75;
      step = 1;
    } else {
      nextInterval = 110;
      step = 1;
    }

    onStepRef.current(step);
    timerRef.current = setTimeout(runTick, nextInterval);
  }, [clearTimers]);

  const startPress = useCallback(
    (isTouch = false) => {
      if (disabledRef.current) return;
      if (isHoldingRef.current) return;

      clearTimers();
      isHoldingRef.current = true;
      isTouchRef.current = isTouch;
      startTimeRef.current = Date.now();

      // Primeiro clique imediato (1 unidade)
      onStepRef.current(1);

      // Inicia o timer de repetição acelerada após initialDelay
      timerRef.current = setTimeout(runTick, initialDelay);
    },
    [clearTimers, initialDelay, runTick]
  );

  const stopPress = useCallback(() => {
    clearTimers();
    setTimeout(() => {
      isTouchRef.current = false;
    }, 100);
  }, [clearTimers]);

  // Limpa timers ao desmontar ou se a janela perder foco
  useEffect(() => {
    const handleGlobalRelease = () => {
      if (isHoldingRef.current) {
        clearTimers();
      }
    };

    window.addEventListener("mouseup", handleGlobalRelease);
    window.addEventListener("touchend", handleGlobalRelease);
    window.addEventListener("blur", handleGlobalRelease);

    return () => {
      clearTimers();
      window.removeEventListener("mouseup", handleGlobalRelease);
      window.removeEventListener("touchend", handleGlobalRelease);
      window.removeEventListener("blur", handleGlobalRelease);
    };
  }, [clearTimers]);

  return {
    buttonProps: {
      onMouseDown: (e: React.MouseEvent) => {
        if (e.button !== 0) return; // Apenas botão principal do mouse
        if (isTouchRef.current) return;
        startPress(false);
      },
      onMouseUp: stopPress,
      onMouseLeave: stopPress,
      onTouchStart: (e: React.TouchEvent) => {
        // Previne zoom ou seleção de texto nativa do mobile
        isTouchRef.current = true;
        startPress(true);
      },
      onTouchEnd: stopPress,
      onTouchCancel: stopPress,
      onContextMenu: (e: React.MouseEvent) => {
        e.preventDefault();
      },
    },
  };
}
