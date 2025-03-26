import {MMKV} from 'react-native-mmkv';
import setCookie from 'set-cookie-parser';

// MMKV 인스턴스 생성
export const storage = new MMKV({
  id: 'app-storage',
  encryptionKey: 'encryption-key-here',
});

// 타입 정의
type StorageKey =
  | 'user-token'
  | 'user-info'
  | 'app-settings'
  | 'session-data'
  | 'cookies';

// 저장소 유틸리티 클래스
class mmkvStorage {
  // 문자열 데이터 저장
  static setString(key: StorageKey, value: string): void {
    storage.set(key, value);
  }

  // 문자열 데이터 조회
  static getString(key: StorageKey): string | undefined {
    return storage.getString(key);
  }

  // 객체 데이터 저장
  static setObject<T>(key: StorageKey, value: T): void {
    storage.set(key, JSON.stringify(value));
  }

  // 객체 데이터 조회
  static getObject<T>(key: StorageKey): T | null {
    const value = storage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  // 불리언 데이터 저장
  static setBoolean(key: StorageKey, value: boolean): void {
    storage.set(key, value);
  }

  // 불리언 데이터 조회
  static getBoolean(key: StorageKey): boolean | undefined {
    return storage.getBoolean(key);
  }

  // 숫자 데이터 저장
  static setNumber(key: StorageKey, value: number): void {
    storage.set(key, value);
  }

  // 숫자 데이터 조회
  static getNumber(key: StorageKey): number | undefined {
    return storage.getNumber(key);
  }

  // 데이터 삭제
  static delete(key: StorageKey): void {
    storage.delete(key);
  }

  // 모든 데이터 삭제
  static clearAll(): void {
    storage.clearAll();
  }

  // 특정 키가 존재하는지 확인
  static contains(key: StorageKey): boolean {
    return storage.contains(key);
  }

  // 모든 키 목록 조회
  static getAllKeys(): string[] {
    return storage.getAllKeys();
  }
}

// 쿠키 관리를 위한 인터페이스
type Cookie = setCookie.Cookie;

type Cookies = Record<string, Cookie>;

/**
 *  쿠키 관리 유틸리티
 * @example
 * CookieStorage.set({
 *   name: 'sessionId',
 *   value: '12345',
 *   expires: new Date(Date.now() + 86400000) // 24시간 후 만
 * });
 *
 * // 네트워크 요청시 쿠키 문자열 사용
 * const cookieString = CookieStorage.toString();
 * fetch('https://api.example.com', {
 *   headers: {
 *     Cookie: cookieString
 *   }
 * });
 */
class CookieStorage {
  private static COOKIE_KEY: StorageKey = 'cookies';

  // 쿠키 저장
  static set(cookie: Cookie): void {
    const cookies = this.getAll();
    cookies[cookie.name] = cookie;
    mmkvStorage.setObject(this.COOKIE_KEY, cookies);
  }

  // 쿠키 조회
  static get(name: string): Cookie | null {
    const cookies = this.getAll();
    return cookies[name] || null;
  }

  // 모든 쿠키 조회
  static getAll(): Cookies {
    return mmkvStorage.getObject<Cookies>(this.COOKIE_KEY) || {};
  }

  // 쿠키 삭제
  static delete(name: string): void {
    const cookies = this.getAll();
    delete cookies[name];
    mmkvStorage.setObject(this.COOKIE_KEY, cookies);
  }

  // 만료된 쿠키 정리
  static cleanExpired(): void {
    const cookies = this.getAll();
    const now = new Date();

    Object.entries(cookies).forEach(([name, cookie]) => {
      if (cookie.expires && new Date(cookie.expires) < now) {
        delete cookies[name];
      }
    });

    mmkvStorage.setObject(this.COOKIE_KEY, cookies);
  }

  static clearAll(): void {
    mmkvStorage.delete(this.COOKIE_KEY);
  }

  static parseAndSet(combinedCookiesHeader: string): void {
    const splitCookieHeaders = setCookie.splitCookiesString(
      combinedCookiesHeader,
    );
    const cookies = setCookie.parse(splitCookieHeaders);
    cookies.forEach(cookie => this.set(cookie));
  }

  // 쿠키 문자열로 변환 (네트워크 요청용)
  static toString(): string {
    const cookies = this.getAll();
    return Object.values(cookies)
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
  }
}

export {mmkvStorage as Storage, CookieStorage, type Cookie};
