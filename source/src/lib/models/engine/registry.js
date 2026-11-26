// 对象清单：每个 LOD1 对象携带交付成果05§五规定的可追溯字段，
// 并支持导出 JSON（对应交付成果12的 G7/A10 依据追溯门）。
// 本轮新增统一"开采状态"字段：mining_state / mined / backfilled。
import { stateDefaults } from './states.js';

export function createRegistry(methodCode) {
  const objects = [];
  let seq = 0;

  function tag(mesh, meta) {
    seq += 1;
    const type = meta.type_code || 'OBJ';
    const object_id = meta.object_id || `${methodCode.replace('-', '')}-${type}-${String(seq).padStart(3, '0')}`;
    const d = stateDefaults(type);
    const mining_state = meta.mining_state || d.state;
    const mined = meta.mined ?? d.mined;
    const backfilled = meta.backfilled ?? d.backfilled;
    const record = {
      object_id,
      type_code: type,
      mining_method: methodCode,
      name: meta.name || '',
      mining_state,
      mined,
      backfilled,
      source_tier: meta.source_tier || '【图】',
      textbook_ref: meta.textbook_ref || '',
      figure_ref: meta.figure_ref || '',
      elevation_z: meta.elevation_z ?? null,
      dimensions: meta.dimensions || '',
      stage: meta.stage || '',
      assumption: !!meta.assumption,
      connectivity: meta.connectivity || [],
    };
    mesh.userData = { ...record };
    objects.push({ ...record, mesh });
    return mesh;
  }

  function toJSON(methodMeta) {
    return {
      method: methodMeta,
      exported_at: new Date().toISOString(),
      note: '对象清单由模型运行时导出；tier=【教】教材明文/【图】图纸读取/【推】推断/【假】建模假设；mining_state=未开采/已回采/充填/崩落/留矿/残留/当前分层',
      objects: objects.map(({ mesh, ...rest }) => rest),
    };
  }

  return { objects, tag, toJSON };
}
