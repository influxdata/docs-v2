export interface KapaHarnessRequest {
  mode: 'ai';
  query: string;
  submit: boolean;
  groups: string[];
}
export interface KapaHarness {
  requests: KapaHarnessRequest[];
  finishRender: (() => void) | null;
}
declare global {
  interface Window {
    kapaHarness: KapaHarness;
  }
}

export interface DocsDatePickerElement extends HTMLElement {
  datepicker: { setDate(date: string): void };
}
export interface ContextualAskAiLink extends HTMLAnchorElement {
  dataset: DOMStringMap & { query: string };
}
