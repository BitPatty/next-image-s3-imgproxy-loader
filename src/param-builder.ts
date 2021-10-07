type ResizeType = 'fit' | 'fill' | 'auto';

type GravityType =
  | 'no'
  | 'so'
  | 'ea'
  | 'we'
  | 'noea'
  | 'nowe'
  | 'soea'
  | 'sowe'
  | 'ce';

type ForwardType = Partial<ImgProxyParamBuilder> & {
  modifiers: string[];
};

// See https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md
// for possible transformations

class ImgProxyParamBuilder {
  public readonly fileName: string;
  public readonly modifiers: string[] = [];

  constructor() {}

  build(): string {
    return this.modifiers.join('/');
  }

  resize<T extends ForwardType>(
    this: T,
    options?: {
      type?: ResizeType;
      width?: number;
      height?: number;
      enlarge?: boolean;
      extend?: boolean;
      gravity?: {
        type: Omit<GravityType, 'sm'>;
        center?: {
          x: number;
          y: number;
        };
      };
    },
  ): Omit<T, 'resize'> {
    const { type, width, height, enlarge, extend, gravity } = options ?? {};
    this.modifiers.push(
      options
        ? [
            'resize',
            type ?? 'fit',
            width ?? 0,
            height ?? 0,
            !!enlarge,
            !!extend,
            ...[gravity?.type, gravity?.center?.x, gravity?.center?.y].filter(
              (v) => !!v,
            ),
          ].join(':')
        : ['resize', type ?? 'fit'].join(':'),
    );
    return this;
  }

  setDpr<T extends ForwardType>(this: T, value: number): Omit<T, 'setDpr'> {
    this.modifiers.push(['dpr', value].join(':'));
    return this;
  }

  pad<T extends ForwardType>(
    this: T,
    value:
      | {
          top?: number;
          right?: number;
          bottom?: number;
          left?: number;
        }
      | number,
  ): Omit<T, 'pad'> {
    if (isNaN(value as unknown as number)) {
      const { top, right, bottom, left } = value as {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      };

      this.modifiers.push(
        [
          'padding',
          top ?? 0,
          right ?? top ?? 0,
          bottom ?? top ?? 0,
          left ?? right ?? top ?? 0,
        ].join(':'),
      );
    } else {
      this.modifiers.push(['padding', value].join(':'));
    }

    return this;
  }

  trim<T extends ForwardType>(
    this: T,
    options: {
      threshold: number;
      color: string;
      equalHorizontal?: boolean;
      equalVertical?: boolean;
    },
  ): Omit<T, 'trim'> {
    const { threshold, color, equalHorizontal, equalVertical } = options;

    this.modifiers.push(
      ['trim', threshold, color, !!equalHorizontal, !!equalVertical].join(':'),
    );

    return this;
  }

  rotate<T extends ForwardType>(
    this: T,
    angle: 0 | 90 | 180 | 270,
  ): Omit<T, 'rotate'> {
    this.modifiers.push(['rot', angle].join(':'));
    return this;
  }

  setQuality<T extends ForwardType>(
    this: T,
    percentage: number,
  ): Omit<T, 'setQuality'> {
    this.modifiers.push(['q', percentage].join(':'));
    return this;
  }

  setMaxBytes<T extends ForwardType>(
    this: T,
    megaBytes: number,
  ): Omit<T, 'setMaxBytes'> {
    this.modifiers.push(['mb', megaBytes].join(':'));
    return this;
  }

  setBackground<T extends ForwardType>(
    this: T,
    color: string | [number, number, number],
  ): Omit<T, 'setBackground'> {
    if (Array.isArray(color)) {
      this.modifiers.push(['bg', ...color].join(':'));
    } else {
      this.modifiers.push(['bg', color].join(':'));
    }

    return this;
  }

  blur<T extends ForwardType>(this: T, sigma: number): Omit<T, 'blur'> {
    this.modifiers.push(['blur', sigma].join(':'));
    return this;
  }
}

export default ImgProxyParamBuilder;
