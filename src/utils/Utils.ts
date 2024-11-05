const BASE_CSS_VARS = [
    '--chart-1',
    '--chart-2',
    '--chart-3',
    '--chart-4',
    '--chart-5'
  ];
  
  class ColorManager {
    private static instance: ColorManager;
    private colorCache: Record<string, string> = {};
    private usedColors: Set<string> = new Set();
    private colorIndex = 0;
  
    private constructor() {}
  
    public static getInstance(): ColorManager {
      if (!ColorManager.instance) {
        ColorManager.instance = new ColorManager();
      }
      return ColorManager.instance;
    }
  
    private getCSSVarColor(cssVar: string): string {
      return `hsl(var(${cssVar}))`;
    }
  
    private extractHSLFromColor(color: string): { h: number; s: number; l: number } {
      const temp = document.createElement('div');
      temp.style.color = color;
      document.body.appendChild(temp);
      const computedColor = getComputedStyle(temp).color;
      document.body.removeChild(temp);
  
      const rgb = computedColor.match(/\d+/g)?.map(Number) || [0, 0, 0];
      const [r, g, b] = rgb.map(x => x / 255);
  
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
  
      let h = 0;
      const l = (max + min) / 2;
      const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  
      if (d !== 0) {
        switch (max) {
          case r: h = 60 * (((g - b) / d) % 6); break;
          case g: h = 60 * ((b - r) / d + 2); break;
          case b: h = 60 * ((r - g) / d + 4); break;
        }
      }
  
      h = (h + 360) % 360;
  
      return { h, s: s * 100, l: l * 100 };
    }
  
    private generateNextColor(baseHSL: { h: number; s: number; l: number }, index: number): string {
      // 더 작은 색상 간격으로 조정
      const hueStep = 20; // 기존 45에서 20으로 줄임
      
      // 기본 색상에서 미세하게 변화
      const newHue = (baseHSL.h + (index * hueStep)) % 360;
      
      // 채도와 명도의 변화폭을 줄임
      const saturationVariation = 3; // 기존 5에서 3으로 줄임
      const lightnessVariation = 2; // 기존 5에서 2로 줄임
      
      // 기존 색상의 채도와 명도를 최대한 유지
      const newSat = Math.max(
        baseHSL.s - 5,
        Math.min(
          baseHSL.s + 5,
          baseHSL.s + (index % 3 - 1) * saturationVariation
        )
      );
      
      const newLight = Math.max(
        baseHSL.l - 3,
        Math.min(
          baseHSL.l + 3,
          baseHSL.l + (index % 2 - 0.5) * lightnessVariation
        )
      );
  
      return `hsl(${newHue} ${newSat}% ${newLight}%)`;
    }
  
    public getColorForCategory(category: string): string {
      if (this.colorCache[category]) {
        return this.colorCache[category];
      }
  
      if (this.colorIndex < BASE_CSS_VARS.length) {
        const color = this.getCSSVarColor(BASE_CSS_VARS[this.colorIndex]);
        this.colorCache[category] = color;
        this.usedColors.add(color);
        this.colorIndex++;
        return color;
      }
  
      // 모든 기본 색상의 HSL 값을 가져와서 평균 계산
      const baseColors = BASE_CSS_VARS.map(cssVar => {
        const color = this.getCSSVarColor(cssVar);
        return this.extractHSLFromColor(color);
      });
  
      // 평균 HSL 값 계산
      const avgHSL = {
        h: baseColors[baseColors.length - 1].h, // 마지막 색상의 색조 사용
        s: baseColors.reduce((acc, curr) => acc + curr.s, 0) / baseColors.length,
        l: baseColors.reduce((acc, curr) => acc + curr.l, 0) / baseColors.length
      };
  
      const variantIndex = this.colorIndex - BASE_CSS_VARS.length + 1;
      const newColor = this.generateNextColor(avgHSL, variantIndex);
  
      this.colorCache[category] = newColor;
      this.usedColors.add(newColor);
      this.colorIndex++;
  
      return newColor;
    }
  
    public reset(): void {
      this.colorCache = {};
      this.usedColors.clear();
      this.colorIndex = 0;
    }
  }
  
  export const generateColorForCategory = (category: string): string => {
    return ColorManager.getInstance().getColorForCategory(category);
  };
  
  export const resetColorCache = () => {
    ColorManager.getInstance().reset();
  };