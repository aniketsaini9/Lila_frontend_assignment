export type EventType = "kill" | "death" | "loot" | "storm";

export interface GameEvent {
  id: string;
  x: number;
  y: number;
  type: EventType;
  timestamp: number; // seconds into match
  isBot: boolean;
  player: string;
}

export const maps = ["Erangel", "Miramar", "Sanhok", "Vikendi"];
export const dates = ["2026-04-07", "2026-04-06", "2026-04-05", "2026-04-04"];
export const matches = ["Match #1201", "Match #1200", "Match #1199", "Match #1198"];
export const eventTypes: EventType[] = ["kill", "death", "loot", "storm"];

export const mockEvents: GameEvent[] = [
  { id: "e1", x: 22, y: 35, type: "kill", timestamp: 45, isBot: false, player: "Player_A" },
  { id: "e2", x: 55, y: 20, type: "death", timestamp: 60, isBot: false, player: "Player_B" },
  { id: "e3", x: 70, y: 60, type: "loot", timestamp: 30, isBot: true, player: "Bot_01" },
  { id: "e4", x: 40, y: 75, type: "storm", timestamp: 120, isBot: false, player: "Player_C" },
  { id: "e5", x: 15, y: 80, type: "kill", timestamp: 90, isBot: true, player: "Bot_02" },
  { id: "e6", x: 85, y: 45, type: "loot", timestamp: 150, isBot: false, player: "Player_D" },
  { id: "e7", x: 30, y: 50, type: "death", timestamp: 180, isBot: false, player: "Player_E" },
  { id: "e8", x: 60, y: 85, type: "kill", timestamp: 200, isBot: false, player: "Player_F" },
  { id: "e9", x: 48, y: 30, type: "storm", timestamp: 240, isBot: false, player: "Player_G" },
  { id: "e10", x: 75, y: 15, type: "loot", timestamp: 100, isBot: true, player: "Bot_03" },
  { id: "e11", x: 35, y: 65, type: "kill", timestamp: 270, isBot: false, player: "Player_H" },
  { id: "e12", x: 90, y: 70, type: "death", timestamp: 300, isBot: true, player: "Bot_04" },
  { id: "e13", x: 10, y: 50, type: "loot", timestamp: 80, isBot: false, player: "Player_I" },
  { id: "e14", x: 50, y: 50, type: "storm", timestamp: 330, isBot: false, player: "Player_J" },
  { id: "e15", x: 65, y: 40, type: "kill", timestamp: 350, isBot: false, player: "Player_K" },
];

export const MATCH_DURATION = 400; // seconds
