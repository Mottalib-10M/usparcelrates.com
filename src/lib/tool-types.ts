/** Declarative calculators (src/lib/tool-specs.ts), rendered by components/calc/SpecTool.tsx and MiniSim.tsx. */
export type V = Record<string, number | string>;
export interface NumIn { kind?: 'num'; id: string; label: string; def: number; unit?: string; max?: number; decimals?: number; help?: string; adv?: boolean; wide?: boolean; short?: string }
/** A ZIP Code: text field, digits only, kept as typed. */
export interface ZipIn { kind: 'zip'; id: string; label: string; def: string; help?: string; adv?: boolean; wide?: boolean; short?: string }
export interface ChoiceIn { kind: 'choice'; id: string; label: string; def: string; options: Array<{ value: string; label: string }>; help?: string; adv?: boolean; wide?: boolean; short?: string }
export interface SelectIn { kind: 'select'; id: string; label: string; def: string; options: Array<{ value: string; label: string }>; dyn?: (v: V) => Array<{ value: string; label: string }>; help?: string; adv?: boolean; wide?: boolean; short?: string }
export type Input = NumIn | ZipIn | ChoiceIn | SelectIn;
export interface ToolOut {
  label: string; value: string; sub?: string;
  /** Second price printed right beside the big one: [what it is, price] (testers 2026-11-14: counter price next to the online one). */
  side?: [string, string];
  /** The answer in one sentence, right under the big figure (testers 2026-11-14). */
  answer?: string;
  /** Rows shown before the fold (default 4); the other rows and the table go into "All prices…" (testers 2026-11-14: 17 prices in a row). */
  keep?: number;
  /** Title of that fold. */
  foldLabel?: string;
  /** Lines under the headline: [label, value, bar weight?]. */
  rows: Array<[string, string, number?]>;
  table?: { caption?: string; headers: string[]; rows: string[][]; align?: Array<'l' | 'r'> };
  note?: string;
  /** What the example assumes, shown while nothing was changed. */
  example?: string;
  exampleAide?: string;
}
export interface Profile { label: string; set: V }
export interface ToolSpec {
  inputs: Input[]; run: (v: V) => ToolOut; profiles?: Profile[];
  /** Title of the folded fields while they are all empty (testers 2026-11-14: "Already filled in: length 0 in" read as a wrong size). */
  advHint?: string;
  /** Data to fetch before `run` can answer (the zone row of a ZIP Code the page does not carry). */
  pending?: (v: V) => Promise<unknown> | null;
}
