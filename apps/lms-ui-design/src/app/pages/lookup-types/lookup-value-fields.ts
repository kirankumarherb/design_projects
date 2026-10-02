export type LookupFieldType = 'text' | 'number' | 'date';

export interface LookupFieldDef {
  key: string;
  label: string;
  type: LookupFieldType;
  maxLength?: number;
  readOnly?: boolean;
  width: string;
}

export type LookupAttrValue = string | number | null;

export interface LookupValue {
  code: string;
  meaning: string;
  description: string;
  enabled: boolean;
  startDate: string;
  endDate: string;
  attrs: Record<string, LookupAttrValue>;
}

const text = (key: string, width = 'w-[180px]'): LookupFieldDef => ({ key, label: key, type: 'text', maxLength: 500, width });
const num = (key: string, width = 'w-[140px]'): LookupFieldDef => ({ key, label: key, type: 'number', width });
const date = (key: string, width = 'w-[140px]'): LookupFieldDef => ({ key, label: key, type: 'date', width });
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const LOOKUP_EDITABLE_FIELDS: LookupFieldDef[] = [
  num('DISPLAY_SEQUENCE'),
  text('TAG'),
  text('ATTRIBUTE_CATEGORY'),
  ...range(15).map(i => text(`ATTRIBUTE${i}`)),
  ...range(15).map(i => num(`ATTRIBUTE_NUMBER${i}`)),
  ...range(15).map(i => date(`ATTRIBUTE_DATE${i}`)),
];

export const LOOKUP_AUDIT_FIELDS: LookupFieldDef[] = [
  { ...date('CREATION_DATE'), readOnly: true },
  { ...text('CREATED_BY', 'w-[160px]'), readOnly: true },
  { ...date('LAST_UPDATE_DATE'), readOnly: true },
  { ...text('LAST_UPDATED_BY', 'w-[160px]'), readOnly: true },
  { ...num('LAST_UPDATE_LOGIN'), readOnly: true },
];

export const LOOKUP_EXTRA_FIELDS: LookupFieldDef[] = [...LOOKUP_EDITABLE_FIELDS, ...LOOKUP_AUDIT_FIELDS];

export function emptyLookupAttrs(): Record<string, LookupAttrValue> {
  const attrs: Record<string, LookupAttrValue> = {};
  for (const f of LOOKUP_EXTRA_FIELDS) attrs[f.key] = f.type === 'number' ? null : '';
  return attrs;
}

export function newLookupValue(): LookupValue {
  return { code: '', meaning: '', description: '', enabled: true, startDate: '', endDate: '', attrs: emptyLookupAttrs() };
}

export function setLookupAttr(val: LookupValue, field: LookupFieldDef, raw: string) {
  if (field.readOnly) return;
  val.attrs[field.key] = field.type === 'number' ? (raw === '' ? null : Number(raw)) : raw;
}
