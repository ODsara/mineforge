import * as THREE from "three";
import { applyCutPlane } from "./adapt.ts";
import { createPlan } from "./reviewed/cases.js";
import { methods } from "./reviewed/content.js";
import { buildModel, createMaterials, disposeModel, verifyGeometry } from "./reviewed/models.js";
import type { BuildOpts, BuildVariant, LayerName, ModelAnchor, ModelBuildResult } from "./types.ts";

const colors = {
  ore: "#B8794C", pillar: "#A65F43", rock: "#83786B", rockLight: "#A89B87",
  rockDark: "#55483D", access: "#A59881", trim: "#D8C9A8", bed: "#655747",
  fill: "#829073", pipe: "#BCD3A5", concrete: "#B8B0A0",
  broken: "#D3A475", waste: "#8E877C", work: "#F2BD80", edge: "#453023",
};

const layerNames: Record<string, LayerName> = {
  ore: "矿体", pillar: "矿柱", access: "巷道", shaft: "井筒", void: "采场空区",
  fill: "充填体", broken: "崩落体", waste: "崩落体", work: "切割工程", rock: "围岩",
};
const shaftKinds = new Set(["shaft", "gravity", "chute", "bell", "fillBore"]);
const phaseInfo = {
  dev: { name: "开拓工程", color: "#967154" },
  prep: { name: "采准工程", color: "#A08064" },
  cut: { name: "切割工程", color: "#A6531F" },
  stope: { name: "回采与出矿", color: "#B46D42" },
  fill: { name: "充填作业", color: "#75866A" },
  post: { name: "采场处理", color: "#8D7563" },
} as const;
type Phase = keyof typeof phaseInfo;

type Vec3 = [number, number, number];
type Plan = ReturnType<typeof createPlan>;
type Frame = {
  root: THREE.Group;
  layers: Record<string, THREE.Group>;
  annotations: { layer: string; name: string; world: THREE.Vector3 }[];
  flows: { path: THREE.CurvePath<THREE.Vector3>; particles: THREE.Mesh[] }[];
  growingFill: { mesh: THREE.Mesh; floor: number; delay: number }[];
  activePipe: boolean;
  pipeTrace: THREE.Group;
};

type SessionOpts = { variant?: BuildVariant; step?: number; progress?: number; cut?: number };

export interface ReviewedSession {
  group: THREE.Group;
  bounds: THREE.Box3;
  clipPlane: THREE.Plane;
  stepCount: number;
  step(i: number): ModelAnchor[];
  explore(p: number): ModelAnchor[];
  setCut(p: number): void;
  setVariant(variant: BuildVariant): void;
  progressLabel(p: number): string;
  progressStep(p: number): number;
  focusPoints(): Record<string, Vec3>;
  animate(now: number, reducedMotion: boolean): boolean;
  dispose(): void;
}

const materialColors = () => {
  const layers = { ...colors };
  const style = typeof document === "undefined" ? null : getComputedStyle(document.documentElement);
  if (style) for (const key of Object.keys(colors) as (keyof typeof colors)[]) {
    const name = key.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase());
    layers[key] = style.getPropertyValue("--mf-model-" + name).trim() || colors[key];
  }
  return layers;
};

function phaseOf(label: string, i: number): Phase {
  if (i === 0) return "dev";
  if (i === 1) return "prep";
  if (i === 2 || label === "下分段切割") return "cut";
  if (/充填$|充填循环/.test(label)) return "fill";
  if (/放顶$|留柱$|矿房采毕$/.test(label)) return "post";
  return "stope";
}

function layerList(plans: Plan[]): LayerName[] {
  const active = new Set<string>(["work", "rock"]);
  for (const plan of plans) {
    for (const volume of plan.volumes) active.add(volume.layer);
    for (const link of plan.links) active.add(shaftKinds.has(link.kind) ? "shaft" : link.layer);
    for (const mark of plan.technical) active.add(mark.style);
  }
  const names = LAYER_ORDER.filter(key => active.has(key)).map(key => layerNames[key]);
  return [...new Set(names)];
}
const LAYER_ORDER = ["ore", "access", "shaft", "void", "pillar", "fill", "broken", "waste", "work", "rock"];

function boundsOf(plans: Plan[]): THREE.Box3 {
  const box = new THREE.Box3();
  const point = new THREE.Vector3();
  for (const plan of plans) {
    for (const { bounds: [x0, x1, y0, y1, z0, z1] } of plan.volumes) {
      box.expandByPoint(point.set(x0, y0, z0)).expandByPoint(point.set(x1, y1, z1));
    }
    for (const link of plan.links) {
      for (const [x, y, z] of [link.a, link.b]) box.expandByPoint(point.set(x, y, z));
    }
    for (const { a, b } of plan.technical) {
      for (const [x, y, z] of [a, b]) box.expandByPoint(point.set(x, y, z));
    }
  }
  return box.expandByScalar(0.3);
}

function interest(anchor: Frame["annotations"][number], slot: number): number {
  const { name, layer } = anchor;
  if (slot === 0) return /主井|阶段运输|回风井|上部回风|井架/.test(name) ? 8 : 2;
  if (/工作面|前缘|人工假顶|点柱|切割槽|充填下料口|本工序|凿岩硐室/.test(name)) return 10;
  if (/充填体|矿石溜井|中心上山|回采进路|放矿斜溜井 1$|漏斗/.test(name)) return 8;
  if (layer === "rock" || /地表|井口|第 \d+ |联络道|附属设施/.test(name)) return 1;
  return ["fill", "work", "void", "broken", "pillar"].includes(layer) ? 6 : 4;
}

export function makeReviewedBuilder(key: string, engineCode: string) {
  const method = (methods as Record<string, { steps: [string, string][] }>)[key];
  const steps = method.steps.map(([label, note], i) => ({ label, note, phase: phaseOf(label, i) }));
  const stepCount = steps.length;
  const phases = [...new Set(steps.map(step => step.phase))].map(id => ({ id, ...phaseInfo[id] }));
  const working = steps.flatMap((step, i) => step.phase === "stope" ? [i] : []);
  const defaults = { cut: 0, progress: working[Math.floor(working.length / 2)] / (stepCount - 1) || 0.55 };
  const stepDuration = 3.4;
  const plans = steps.map((_, i) => createPlan(key, i));
  const LAYERS = layerList(plans);
  const LAYERS_OFF: string[] = ["围岩"];
  const STAGES = steps.map(step => step.label);
  const bounds = boundsOf(plans);

  const index = (step: number) => THREE.MathUtils.clamp(Number.isFinite(step) ? Math.trunc(step) - 1 : 0, 0, stepCount - 1);
  const position = (p: number) => Math.round(THREE.MathUtils.clamp(p, 0, 1) * (stepCount - 1));
  const createLive = (opts: SessionOpts = {}): ReviewedSession => {
    const group = new THREE.Group();
    const output = new Map<LayerName, THREE.Group>();
    for (const layer of Object.keys(layerNames)) {
      const name = layerNames[layer];
      if (output.has(name)) continue;
      const target = new THREE.Group();
      target.name = "L_" + name;
      output.set(name, target);
      group.add(target);
    }
    const materialSet = createMaterials(materialColors());
    const clipPlane = new THREE.Plane();
    for (const material of Object.values(materialSet)) material.clippingPlanes = [clipPlane];

    let frame: Frame | undefined;
    let slot = -1;
    let variant: BuildVariant = opts.variant ?? "iso";
    let cut = opts.cut;
    let started = 0;

    function mount(next: number) {
      if (next === slot) return;
      if (frame) {
        for (const node of Object.values(frame.layers)) node.removeFromParent();
        disposeModel(frame);
      }
      slot = next;
      started = 0;
      frame = buildModel(materialSet, key, slot, plans[slot]) as unknown as Frame;
      for (const [tag, node] of Object.entries(frame.layers)) {
        if (tag === "base") group.add(node);
        else output.get(layerNames[tag])?.add(node);
      }
      frame.pipeTrace.visible = frame.activePipe;
      group.updateMatrixWorld(true);
    }

    function anchors(): ModelAnchor[] {
      return (frame?.annotations ?? [])
        .filter(({ world }) => clipPlane.distanceToPoint(world) >= 0)
        .sort((a, b) => interest(b, slot) - interest(a, slot))
        .slice(0, 8)
        .map(({ name, world, layer }) => ({ label: name, pos: world.toArray(), layer: layerNames[layer] }));
    }

    function focusPoints(): Record<string, Vec3> {
      const anchor = (frame?.annotations ?? [])
        .filter(({ layer, world }) => ["void", "work", "pillar", "fill", "shaft"].includes(layer) && clipPlane.distanceToPoint(world) >= 0)
        .sort((a, b) => interest(b, slot) - interest(a, slot))[0];
      return { "细部": anchor?.world.toArray() ?? bounds.getCenter(new THREE.Vector3()).toArray() };
    }

    mount(opts.progress === undefined ? index(opts.step ?? stepCount) : position(opts.progress));
    applyCutPlane(clipPlane, bounds, { variant, cut });

    return {
      group, bounds: bounds.clone(), clipPlane, stepCount,
      step(n) {
        mount(index(n));
        cut = undefined;
        applyCutPlane(clipPlane, bounds, { variant });
        return anchors();
      },
      explore(p) {
        mount(position(p));
        applyCutPlane(clipPlane, bounds, { variant, cut: cut ?? 0 });
        return anchors();
      },
      setCut(p) {
        cut = THREE.MathUtils.clamp(p, 0, 1);
        applyCutPlane(clipPlane, bounds, { variant, cut });
      },
      setVariant(v) {
        variant = v;
        cut = undefined;
        applyCutPlane(clipPlane, bounds, { variant });
      },
      progressLabel: p => steps[position(p)].label,
      progressStep: p => position(p) + 1,
      focusPoints,
      animate(now, reducedMotion) {
        if (!frame) return false;
        if (!started) started = now;
        const time = (now - started) / 1000;
        for (const { path, particles } of frame.flows) {
          particles.forEach((particle, i) => {
            const point = reducedMotion ? (i + 1) / 4 : (time * 0.31 + i / 3) % 1;
            path.getPointAt(point, particle.position);
            particle.scale.setScalar(0.085);
          });
        }
        for (const { mesh, floor, delay } of frame.growingFill) {
          const scale = reducedMotion ? 1 : THREE.MathUtils.clamp((time - delay) / 1.52, 0.035, 1);
          mesh.scale.y = scale;
          mesh.position.y = floor * (1 - scale);
        }
        return !reducedMotion && (frame.flows.length > 0 || (frame.growingFill.length > 0 && time < 2.45));
      },
      dispose() {
        if (frame) {
          for (const node of Object.values(frame.layers)) node.removeFromParent();
          disposeModel(frame);
        }
        frame = undefined;
        for (const material of Object.values(materialSet)) material.dispose();
      },
    };
  };

  function build(opts: BuildOpts = {}): ModelBuildResult {
    const n = opts.step ?? opts.stage ?? stepCount;
    const session = createLive({ ...opts, step: n });
    const anchors = session.step(n);
    session.animate(1, true);
    return {
      group: session.group,
      anchors,
      bbox: { min: bounds.min.toArray(), max: bounds.max.toArray() },
      focusPoints: session.focusPoints(),
    };
  }

  return {
    engineCode, PARAMS: {}, steps, phases, STAGES, LAYERS, LAYERS_OFF, defaults, stepDuration, build, createLive,
    selfCheck: () => plans.flatMap((plan, i) => verifyGeometry(plan).map(error => steps[i].label + " · " + error)),
  };
}
