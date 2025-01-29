declare global {
    interface CustomTabItem {
      text: string;
      value: number;
      icon?: string;
      id: string;
      url: string;
      action?: 'Get' | 'Put' | undefined;
      repeatable?: boolean;
    }
  }
  
  export {};