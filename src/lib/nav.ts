/**
 * 导航状态计算
 * 全站唯一的「当前所在页面」判定逻辑，Header 与 Footer 共用，避免各处手写。
 */

export interface NavItem {
  label: string;
  href: string;
}

/** 统一为带尾斜杠的形式，避免 /methods 与 /methods/ 两种写法导致选中态失效 */
export function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const clean = pathname.split("?")[0].split("#")[0];
  if (clean === "/") return "/";
  return clean.endsWith("/") ? clean : `${clean}/`;
}

/** 当前路径是否命中某个导航项（含其子路由） */
export function isActive(pathname: string, href: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/") return current === "/";
  return current === target || current.startsWith(target);
}

/** 返回当前路径命中的最深层导航项，用于「关于」等短路径不被「/」误匹配 */
export function activeNavHref(pathname: string, items: NavItem[]): string | undefined {
  let best: string | undefined;
  for (const item of items) {
    if (isActive(pathname, item.href)) {
      if (!best || normalizePath(item.href).length > normalizePath(best).length) {
        best = item.href;
      }
    }
  }
  return best;
}
