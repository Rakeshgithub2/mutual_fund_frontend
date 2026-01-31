/**
 * Google Analytics TypeScript Type Definitions
 *
 * Provides type safety for gtag function calls.
 */

export {};

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        page_path?: string;
        page_title?: string;
        page_location?: string;
        send_page_view?: boolean;
        [key: string]: any;
      }
    ) => void;
    dataLayer?: any[];
  }

  /**
   * Google Analytics gtag function
   */
  function gtag(
    command: 'config',
    targetId: string,
    config?: {
      page_path?: string;
      page_title?: string;
      page_location?: string;
      send_page_view?: boolean;
      [key: string]: any;
    }
  ): void;

  function gtag(
    command: 'event',
    eventName: string,
    eventParams?: {
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: any;
    }
  ): void;

  function gtag(command: 'js', date: Date): void;

  function gtag(command: 'set', config: { [key: string]: any }): void;
}
