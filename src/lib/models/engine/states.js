// 统一"开采状态"体系：未开采 / 已回采空间 / 充填 / 崩落 / 留矿 / 残留 / 当前分层。
// 状态是对象属性（userData.mining_state），不是新建图层；图层仍沿用交付成果05对象类型。
export const STATE_INFO = {
  unmined: {
    label: '未开采矿体',
    short: '未开采',
    color: '#B45E36',
    mined: false,
    backfilled: false,
  },
  mined_out: {
    label: '已回采空间',
    short: '已回采空腔',
    color: '#2A2622',
    mined: true,
    backfilled: false,
  },
  caved_ore: {
    label: '崩落矿石（已回采）',
    short: '崩落矿石',
    color: '#855338',
    mined: true,
    backfilled: false,
  },
  caved_rock: {
    label: '崩落围岩',
    short: '崩落围岩',
    color: '#716D64',
    mined: false,
    backfilled: false,
  },
  retained_ore: {
    label: '留矿堆（暂留矿石）',
    short: '留矿堆',
    color: '#B07A48',
    mined: true,
    backfilled: false,
  },
  residual: {
    label: '残留矿体（永久损失）',
    short: '残留矿体',
    color: '#95603E',
    mined: true,
    backfilled: false,
  },
  backfill: {
    label: '充填体（已充填）',
    short: '充填体',
    color: '#78967F',
    mined: true,
    backfilled: true,
  },
  backfill_pillar: {
    label: '人工矿柱（胶结充填）',
    short: '人工矿柱',
    color: '#78967F',
    mined: true,
    backfilled: true,
  },
  current_slice: {
    label: '当前回采分层',
    short: '当前分层',
    color: '#B45E36',
    mined: true,
    backfilled: false,
  },
  excavation: {
    label: '巷道/井筒（已开挖）',
    short: '巷道/井筒',
    color: '#83A0AB',
    mined: true,
    backfilled: false,
  },
  object: {
    label: '工程对象',
    short: '工程对象',
    color: '#83A0AB',
    mined: false,
    backfilled: false,
  },
};

/** 按对象类型给默认状态；方法内可显式覆盖 */
export function stateDefaults(type_code) {
  switch (type_code) {
    case 'ORE':
    case 'PILLAR-R':
      return { state: 'unmined', mined: false, backfilled: false };
    case 'STOPE-A':
    case 'STOPE-P':
      return { state: 'mined_out', mined: true, backfilled: false };
    case 'FILL':
    case 'FILL-AC':
    case 'SURF':
      return { state: 'backfill', mined: true, backfilled: true };
    case 'PILLAR-A':
      return { state: 'backfill_pillar', mined: true, backfilled: true };
    case 'MUCK':
      return { state: 'caved_ore', mined: true, backfilled: false };
    case 'DRAW-RES':
      return { state: 'residual', mined: true, backfilled: false };
    case 'DEV-CUT':
    case 'BASE-STR':
      return { state: 'mined_out', mined: true, backfilled: false };
    case 'DRIFT':
    case 'PASS':
      return { state: 'excavation', mined: true, backfilled: false };
    case 'ROCK':
      return { state: 'object', mined: false, backfilled: false };
    default:
      return { state: 'object', mined: false, backfilled: false };
  }
}
