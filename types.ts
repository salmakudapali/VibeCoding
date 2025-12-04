export enum Subject {
  MATH = 'MATH',
  ENGLISH = 'ENGLISH',
  SCIENCE = 'SCIENCE'
}

export enum GameMode {
  CLASSIC = 'CLASSIC',
  STORY = 'STORY'
}

export interface GameState {
  view: 'MENU' | 'GAME';
  subject: Subject | null;
  mode: GameMode | null;
}

export interface GameContent {
  id: string;
  subject: Subject;
  text: string;           // The main question text
  story?: string;         // Optional story context
  answer: string;         // Answer (string for uniformity)
  options: string[];      // Options
  visualType?: string;    // Icon key for visual hints
  
  // Math specific data (optional)
  mathParams?: {
    num1: number;
    num2: number;
    operator: '+' | '-';
  };
}