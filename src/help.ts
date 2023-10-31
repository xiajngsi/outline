export function deepMerge<T, U>(target: T, source: U): T & U {
  for (const key in source) {
    if (isObject(source[key])) {
      // @ts-ignore
      if (!target[key]) Object.assign(target, { [key]: {} });
      // @ts-ignore
      deepMerge(target[key] as T & U, source[key] as any);
    } else {
      // @ts-ignore
      Object.assign(target, { [key]: source[key] });
    }
  }
  
  return target as T & U;
}

function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export const getHeaderNumber = (node: {nodeName: string}) => {
  const headerNum = Number(node.nodeName.slice(-1))
  return isNaN(headerNum) ? 1 : headerNum
};

export const nodeAddAnchorName = (node: HTMLElement, tagNodeIndex: string) => {
  node.setAttribute('data-id', tagNodeIndex);
};

export const getContentIdBySiteMap = (siteContentIdMap: Record<string, string>) => {
  const host = location.host
  const target = Object.keys(siteContentIdMap).find((websitePathname) => {
    return host.endsWith(websitePathname)
  })
  if(target) {
    return siteContentIdMap[target]
  }
  return ''
}