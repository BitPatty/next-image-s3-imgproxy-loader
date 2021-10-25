import GravityType from './enums/gravity-type.enum';
import ResizeType from './enums/resize-type.enum';
import WatermarkPosition from './enums/watermark-position.enum';

type ForwardType = Partial<ImgProxyParamBuilder> & {
  modifiers: string[];
};

// See https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_advanced.md
// for possible transformations

class ImgProxyParamBuilder {
  public readonly modifiers: string[] = [];

  constructor() {}

  build(): string {
    return this.modifiers.join('/');
  }

  crop<T extends ForwardType>(
    this: T,
    options: {
      width: number;
      height: number;
      gravity?: {
        type: GravityType;
        center?: {
          x: number;
          y: number;
        };
      };
    },
  ): Omit<T, 'crop'> {
    const { width, height, gravity } = options;

    this.modifiers.push(
      [
        'crop',
        width,
        height,
        ...[gravity?.type, gravity?.center?.x, gravity?.center?.y].filter(
          (v) => v != null,
        ),
      ].join(':'),
    );

    return this;
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
        type: GravityType;
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
            type ?? ResizeType.FIT,
            width ?? 0,
            height ?? 0,
            !!enlarge,
            !!extend,
            ...[gravity?.type, gravity?.center?.x, gravity?.center?.y].filter(
              (v) => v != null,
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

  sharpen<T extends ForwardType>(
    this: T,
    options: {
      sigma: number;
    },
  ): Omit<T, 'sharpen'> {
    const { sigma } = options;
    this.modifiers.push(['sh', sigma].join(':'));
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

  addWatermark<T extends ForwardType>(
    this: T,
    options: {
      opacity: number;
      position?: WatermarkPosition;
      offset?: {
        x: number;
        y: number;
      };
      scale?: number;
    },
  ): Omit<T, 'addWatermark'> {
    const { opacity, position, offset, scale } = options;

    this.modifiers.push(
      [
        'wm',
        opacity,
        position ?? WatermarkPosition.CENTER,
        offset?.x ?? 0,
        offset?.y ?? 0,
        scale ?? 0,
      ].join(':'),
    );
    return this;
  }

  blur<T extends ForwardType>(this: T, sigma: number): Omit<T, 'blur'> {
    this.modifiers.push(['blur', sigma].join(':'));
    return this;
  }

  format<T extends ForwardType>(this: T, format: string): Omit<T, 'format'> {
    this.modifiers.push(['format', format].join(':'));
    return this;
  }

  useCacheBuster<T extends ForwardType>(
    this: T,
    buster: string,
  ): Omit<T, 'useCacheBuster'> {
    this.modifiers.push(['cb', buster].join(':'));
    return this;
  }

  stripMetadata<T extends ForwardType>(this: T): Omit<T, 'stripMetadata'> {
    this.modifiers.push(['sm', 1].join(':'));
    return this;
  }

  stripColorProfile<T extends ForwardType>(
    this: T,
  ): Omit<T, 'stripColorProfile'> {
    this.modifiers.push(['scp', 1].join(':'));
    return this;
  }

  autoRotate<T extends ForwardType>(this: T): Omit<T, 'autoRotate'> {
    this.modifiers.push(['ar', 1].join(':'));
    return this;
  }

  setFilename<T extends ForwardType>(
    this: T,
    fileName: string,
  ): Omit<T, 'setFilename'> {
    this.modifiers.push(['fn', fileName].join(':'));
    return this;
  }

  usePreset<T extends ForwardType>(
    this: T,
    presets: string | string[],
  ): Omit<T, 'usePreset'> {
    this.modifiers.push(
      ['preset', ...(Array.isArray(presets) ? presets : [presets])].join(':'),
    );
    return this;
  }
}

export default ImgProxyParamBuilder;
