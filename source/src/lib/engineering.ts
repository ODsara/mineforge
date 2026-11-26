/**
 * 工程数据访问层
 *
 * data/engineering/{slug}.json 是资料线逐条核对后冻结的文件，是参数、案例、工艺、
 * 未决问题的唯一来源。页面与组件一律通过本文件取值，不直接 import JSON——
 * 将来换成数据库或接口时，只改这一个文件。
 */

export interface EngParameter {
  name: string;
  value: string;
  unit: string;
  /** 教材值 / 规范值 / 设计值 / 实测值 / 国际实践值 */
  value_type: string;
  source: string;
  condition?: string;
  note?: string;
}

export interface EngProcessStep {
  step: number;
  phase: string;
  actions: string[];
  note?: string;
}

export interface EngCase {
  id: string;
  name: string;
  source: string;
  value_type: string;
  geology?: string;
  scale?: string;
  structure?: string;
  process?: string;
  draw?: string;
  pillar?: string;
  failure?: string;
  lesson?: string;
  representativeness?: string;
}

export interface EngOpenQuestion {
  id: string;
  question: string;
  status: string;
  answer?: string;
  impact?: string;
  action?: string;
}

export interface EngTermMethod {
  name_zh: string;
  name_en: string;
  aliases_zh?: string[];
  sublevel_role?: string;
  mining_unit?: string;
  draw_point?: string;
  typical_sublevel_height_m?: string | null;
}

export interface EngIdentity {
  name_zh: string;
  name_en: string;
  aliases_zh?: string[];
  abbreviation?: string | null;
  one_sentence?: string;
  classification_path?: string[];
  core_feature?: string;
}

export interface EngRecord {
  meta: {
    record_id: string;
    topic: string;
    compiled_on: string;
    review_status?: string;
    unresolved_items?: string[];
    primary_source?: string;
  };
  identity: EngIdentity;
  terminology_discrimination?: {
    criterion: string;
    rule: string;
    methods: EngTermMethod[];
    evidence?: string[];
  };
  process: EngProcessStep[];
  parameters: EngParameter[];
  case_studies?: EngCase[];
  open_questions?: EngOpenQuestion[];
}

/** 首屏四参数的选取方式：名字必填，同名多条时用 type 区分 */
export interface HeadlinePick {
  name: string;
  type?: string;
}

const modules = import.meta.glob<{ default: EngRecord }>(
  "../data/engineering/*.json",
  { eager: true }
);

const records = new Map<string, EngRecord>();
for (const [path, mod] of Object.entries(modules)) {
  const slug = path.split("/").pop()!.replace(/\.json$/, "");
  records.set(slug, mod.default);
}

export function engineeringRecord(slug: string): EngRecord | undefined {
  return records.get(slug);
}

/** 有没有核对过的工程数据——决定首页/详情页能否显示四参数与折叠区 */
export function hasEngineeringData(slug: string): boolean {
  const record = records.get(slug);
  return Boolean(record && record.parameters.length > 0);
}

/**
 * 取首屏四参数。选哪几项写在 methods.json → headline，属于编辑决策；
 * 数值、单位、出处一律来自冻结文件，组件不存任何数字。
 */
export function headlineParams(slug: string, picks: HeadlinePick[]): EngParameter[] {
  const all = records.get(slug)?.parameters ?? [];
  const out: EngParameter[] = [];
  for (const pick of picks) {
    const hit = all.find(
      (p) => p.name === pick.name && (!pick.type || p.value_type === pick.type)
    );
    if (hit) out.push(hit);
  }
  return out;
}

/** 数值与单位拆开：大字排数值，小字排单位；数字区间的连字符换成 en dash */
export function splitValue(p: EngParameter): { main: string; unit: string } {
  const main = p.value.replace(/(\d)\s*-\s*(\d)/g, "$1–$2");
  const unit = p.unit && p.unit !== "—" ? p.unit : "";
  return { main, unit };
}
