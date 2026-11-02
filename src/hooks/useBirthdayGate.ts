import { useState, useEffect, useCallback } from 'react';
import { SITE_CONFIG } from '../data/configuration';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
}

export interface BirthdayGateState {
  isBirthdayReached: boolean;
  isSimulatingBirthday: boolean;
  setSimulateBirthday: (simulate: boolean) => void;
  countdown: CountdownTime;
  doualaFormattedTime: string;
}

/**
 * Reliable timezone-aware birthday gate using Africa/Douala (UTC+01:00)
 * Automatically transitions to unlocked if the page stays open across midnight into Nov 4.
 */
export function useBirthdayGate(): BirthdayGateState {
  const targetTimestamp = new Date(SITE_CONFIG.targetBirthdayISO).getTime();

  // Check if URL has ?unlock=true or ?preview=birthday for quick testing
  const getInitialSimulation = (): boolean => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('unlock') === 'true' || params.get('preview') === 'birthday';
  };

  const [isSimulatingBirthday, setIsSimulatingBirthday] = useState<boolean>(getInitialSimulation);

  const checkDoualaBirthday = useCallback((): {
    reached: boolean;
    countdown: CountdownTime;
    formatted: string;
  } => {
    const now = new Date();
    const nowMs = now.getTime();
    const diff = targetTimestamp - nowMs;

    // Also inspect the exact calendar date in Africa/Douala timezone
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: SITE_CONFIG.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const partMap: Record<string, string> = {};
    for (const part of parts) {
      partMap[part.type] = part.value;
    }

    const doualaMonth = parseInt(partMap.month || '0', 10);
    const doualaDay = parseInt(partMap.day || '0', 10);
    const doualaYear = parseInt(partMap.year || '0', 10);

    // True if target timestamp reached OR if it is Nov 4 (month 11, day 4) in Africa/Douala
    const isDateNov4OrLater =
      doualaYear > 2026 ||
      (doualaYear === 2026 && doualaMonth > SITE_CONFIG.birthdayMonth) ||
      (doualaYear === 2026 &&
        doualaMonth === SITE_CONFIG.birthdayMonth &&
        doualaDay >= SITE_CONFIG.birthdayDay);

    const reached = diff <= 0 || isDateNov4OrLater;

    if (reached) {
      return {
        reached: true,
        countdown: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalMilliseconds: 0,
        },
        formatted: `${partMap.day}/${partMap.month}/${partMap.year} ${partMap.hour}:${partMap.minute}:${partMap.second} WAT`,
      };
    }

    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      reached: false,
      countdown: {
        days,
        hours,
        minutes,
        seconds,
        totalMilliseconds: diff,
      },
      formatted: `${partMap.day}/${partMap.month}/${partMap.year} ${partMap.hour}:${partMap.minute}:${partMap.second} WAT`,
    };
  }, [targetTimestamp]);

  const [gateData, setGateData] = useState(() => checkDoualaBirthday());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setGateData(checkDoualaBirthday());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [checkDoualaBirthday]);

  return {
    isBirthdayReached: gateData.reached || isSimulatingBirthday,
    isSimulatingBirthday,
    setSimulateBirthday: setIsSimulatingBirthday,
    countdown: gateData.countdown,
    doualaFormattedTime: gateData.formatted,
  };
}
