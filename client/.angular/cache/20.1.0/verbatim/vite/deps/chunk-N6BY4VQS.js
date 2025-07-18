import {
  toCssPixel
} from "./chunk-EJDUWVHF.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  Input,
  NgModule,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵstyleMap,
  ɵɵstyleProp
} from "./chunk-H6TTZC7H.js";
import {
  __spreadValues
} from "./chunk-ZY5HDIHX.js";

// node_modules/ng-zorro-antd/fesm2022/ng-zorro-antd-skeleton.mjs
var _c0 = ["nzType", "button"];
var _c1 = ["nzType", "avatar"];
var _c2 = ["nzType", "input"];
var _c3 = ["nzType", "image"];
var _c4 = ["*"];
function NzSkeletonComponent_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 0);
    ɵɵelement(1, "nz-skeleton-element", 4);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("nzSize", ctx_r0.avatar.size || "default")("nzShape", ctx_r0.avatar.shape || "circle");
  }
}
function NzSkeletonComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "h3", 5);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵstyleProp("width", ctx_r0.toCSSUnit(ctx_r0.title.width));
  }
}
function NzSkeletonComponent_Conditional_0_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "li");
  }
  if (rf & 2) {
    const ɵ$index_15_r2 = ctx.$index;
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵstyleProp("width", ctx_r0.toCSSUnit(ctx_r0.widthList[ɵ$index_15_r2]));
  }
}
function NzSkeletonComponent_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "ul", 3);
    ɵɵrepeaterCreate(1, NzSkeletonComponent_Conditional_0_Conditional_3_For_2_Template, 1, 2, "li", 6, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵrepeater(ctx_r0.rowsList);
  }
}
function NzSkeletonComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, NzSkeletonComponent_Conditional_0_Conditional_0_Template, 2, 2, "div", 0);
    ɵɵelementStart(1, "div", 1);
    ɵɵconditionalCreate(2, NzSkeletonComponent_Conditional_0_Conditional_2_Template, 1, 2, "h3", 2);
    ɵɵconditionalCreate(3, NzSkeletonComponent_Conditional_0_Conditional_3_Template, 3, 0, "ul", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(!!ctx_r0.nzAvatar ? 0 : -1);
    ɵɵadvance(2);
    ɵɵconditional(!!ctx_r0.nzTitle ? 2 : -1);
    ɵɵadvance();
    ɵɵconditional(!!ctx_r0.nzParagraph ? 3 : -1);
  }
}
function NzSkeletonComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
var NzSkeletonElementDirective = class _NzSkeletonElementDirective {
  nzActive = false;
  nzType;
  nzBlock = false;
  static ɵfac = function NzSkeletonElementDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSkeletonElementDirective)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _NzSkeletonElementDirective,
    selectors: [["nz-skeleton-element"]],
    hostAttrs: [1, "ant-skeleton", "ant-skeleton-element"],
    hostVars: 4,
    hostBindings: function NzSkeletonElementDirective_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-skeleton-active", ctx.nzActive)("ant-skeleton-block", ctx.nzBlock);
      }
    },
    inputs: {
      nzActive: [2, "nzActive", "nzActive", booleanAttribute],
      nzType: "nzType",
      nzBlock: [2, "nzBlock", "nzBlock", booleanAttribute]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSkeletonElementDirective, [{
    type: Directive,
    args: [{
      selector: "nz-skeleton-element",
      host: {
        class: "ant-skeleton ant-skeleton-element",
        "[class.ant-skeleton-active]": "nzActive",
        "[class.ant-skeleton-block]": "nzBlock"
      }
    }]
  }], null, {
    nzActive: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzType: [{
      type: Input
    }],
    nzBlock: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var NzSkeletonElementButtonComponent = class _NzSkeletonElementButtonComponent {
  nzShape = "default";
  nzSize = "default";
  static ɵfac = function NzSkeletonElementButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSkeletonElementButtonComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSkeletonElementButtonComponent,
    selectors: [["nz-skeleton-element", "nzType", "button"]],
    inputs: {
      nzShape: "nzShape",
      nzSize: "nzSize"
    },
    attrs: _c0,
    decls: 1,
    vars: 10,
    consts: [[1, "ant-skeleton-button"]],
    template: function NzSkeletonElementButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵdomElement(0, "span", 0);
      }
      if (rf & 2) {
        ɵɵclassProp("ant-skeleton-button-square", ctx.nzShape === "square")("ant-skeleton-button-round", ctx.nzShape === "round")("ant-skeleton-button-circle", ctx.nzShape === "circle")("ant-skeleton-button-lg", ctx.nzSize === "large")("ant-skeleton-button-sm", ctx.nzSize === "small");
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSkeletonElementButtonComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      selector: 'nz-skeleton-element[nzType="button"]',
      template: `
    <span
      class="ant-skeleton-button"
      [class.ant-skeleton-button-square]="nzShape === 'square'"
      [class.ant-skeleton-button-round]="nzShape === 'round'"
      [class.ant-skeleton-button-circle]="nzShape === 'circle'"
      [class.ant-skeleton-button-lg]="nzSize === 'large'"
      [class.ant-skeleton-button-sm]="nzSize === 'small'"
    ></span>
  `
    }]
  }], null, {
    nzShape: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }]
  });
})();
var NzSkeletonElementAvatarComponent = class _NzSkeletonElementAvatarComponent {
  nzShape = "circle";
  nzSize = "default";
  styleMap = {};
  ngOnChanges(changes) {
    if (changes.nzSize && typeof this.nzSize === "number") {
      const sideLength = `${this.nzSize}px`;
      this.styleMap = {
        width: sideLength,
        height: sideLength,
        "line-height": sideLength
      };
    } else {
      this.styleMap = {};
    }
  }
  static ɵfac = function NzSkeletonElementAvatarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSkeletonElementAvatarComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSkeletonElementAvatarComponent,
    selectors: [["nz-skeleton-element", "nzType", "avatar"]],
    inputs: {
      nzShape: "nzShape",
      nzSize: "nzSize"
    },
    features: [ɵɵNgOnChangesFeature],
    attrs: _c1,
    decls: 1,
    vars: 10,
    consts: [[1, "ant-skeleton-avatar"]],
    template: function NzSkeletonElementAvatarComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵdomElement(0, "span", 0);
      }
      if (rf & 2) {
        ɵɵstyleMap(ctx.styleMap);
        ɵɵclassProp("ant-skeleton-avatar-square", ctx.nzShape === "square")("ant-skeleton-avatar-circle", ctx.nzShape === "circle")("ant-skeleton-avatar-lg", ctx.nzSize === "large")("ant-skeleton-avatar-sm", ctx.nzSize === "small");
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSkeletonElementAvatarComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      selector: 'nz-skeleton-element[nzType="avatar"]',
      template: `
    <span
      class="ant-skeleton-avatar"
      [class.ant-skeleton-avatar-square]="nzShape === 'square'"
      [class.ant-skeleton-avatar-circle]="nzShape === 'circle'"
      [class.ant-skeleton-avatar-lg]="nzSize === 'large'"
      [class.ant-skeleton-avatar-sm]="nzSize === 'small'"
      [style]="styleMap"
    ></span>
  `
    }]
  }], null, {
    nzShape: [{
      type: Input
    }],
    nzSize: [{
      type: Input
    }]
  });
})();
var NzSkeletonElementInputComponent = class _NzSkeletonElementInputComponent {
  nzSize = "default";
  static ɵfac = function NzSkeletonElementInputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSkeletonElementInputComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSkeletonElementInputComponent,
    selectors: [["nz-skeleton-element", "nzType", "input"]],
    inputs: {
      nzSize: "nzSize"
    },
    attrs: _c2,
    decls: 1,
    vars: 4,
    consts: [[1, "ant-skeleton-input"]],
    template: function NzSkeletonElementInputComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵdomElement(0, "span", 0);
      }
      if (rf & 2) {
        ɵɵclassProp("ant-skeleton-input-lg", ctx.nzSize === "large")("ant-skeleton-input-sm", ctx.nzSize === "small");
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSkeletonElementInputComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      selector: 'nz-skeleton-element[nzType="input"]',
      template: `
    <span
      class="ant-skeleton-input"
      [class.ant-skeleton-input-lg]="nzSize === 'large'"
      [class.ant-skeleton-input-sm]="nzSize === 'small'"
    ></span>
  `
    }]
  }], null, {
    nzSize: [{
      type: Input
    }]
  });
})();
var NzSkeletonElementImageComponent = class _NzSkeletonElementImageComponent {
  static ɵfac = function NzSkeletonElementImageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSkeletonElementImageComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSkeletonElementImageComponent,
    selectors: [["nz-skeleton-element", "nzType", "image"]],
    attrs: _c3,
    decls: 3,
    vars: 0,
    consts: [[1, "ant-skeleton-image"], ["viewBox", "0 0 1098 1024", "xmlns", "http://www.w3.org/2000/svg", 1, "ant-skeleton-image-svg"], ["d", "M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z", 1, "ant-skeleton-image-path"]],
    template: function NzSkeletonElementImageComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵdomElementStart(0, "span", 0);
        ɵɵnamespaceSVG();
        ɵɵdomElementStart(1, "svg", 1);
        ɵɵdomElement(2, "path", 2);
        ɵɵdomElementEnd()();
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSkeletonElementImageComponent, [{
    type: Component,
    args: [{
      changeDetection: ChangeDetectionStrategy.OnPush,
      selector: 'nz-skeleton-element[nzType="image"]',
      template: `
    <span class="ant-skeleton-image">
      <svg class="ant-skeleton-image-svg" viewBox="0 0 1098 1024" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z"
          class="ant-skeleton-image-path"
        />
      </svg>
    </span>
  `
    }]
  }], null, null);
})();
var NzSkeletonComponent = class _NzSkeletonComponent {
  cdr = inject(ChangeDetectorRef);
  nzActive = false;
  nzLoading = true;
  nzRound = false;
  nzTitle = true;
  nzAvatar = false;
  nzParagraph = true;
  title;
  avatar;
  paragraph;
  rowsList = [];
  widthList = [];
  toCSSUnit(value = "") {
    return toCssPixel(value);
  }
  getTitleProps() {
    const hasAvatar = !!this.nzAvatar;
    const hasParagraph = !!this.nzParagraph;
    let width = "";
    if (!hasAvatar && hasParagraph) {
      width = "38%";
    } else if (hasAvatar && hasParagraph) {
      width = "50%";
    }
    return __spreadValues({
      width
    }, this.getProps(this.nzTitle));
  }
  getAvatarProps() {
    const shape = !!this.nzTitle && !this.nzParagraph ? "square" : "circle";
    const size = "large";
    return __spreadValues({
      shape,
      size
    }, this.getProps(this.nzAvatar));
  }
  getParagraphProps() {
    const hasAvatar = !!this.nzAvatar;
    const hasTitle = !!this.nzTitle;
    const basicProps = {};
    if (!hasAvatar || !hasTitle) {
      basicProps.width = "61%";
    }
    if (!hasAvatar && hasTitle) {
      basicProps.rows = 3;
    } else {
      basicProps.rows = 2;
    }
    return __spreadValues(__spreadValues({}, basicProps), this.getProps(this.nzParagraph));
  }
  getProps(prop) {
    return prop && typeof prop === "object" ? prop : {};
  }
  getWidthList() {
    const {
      width,
      rows
    } = this.paragraph;
    let widthList = [];
    if (width && Array.isArray(width)) {
      widthList = width;
    } else if (width && !Array.isArray(width)) {
      widthList = [];
      widthList[rows - 1] = width;
    }
    return widthList;
  }
  updateProps() {
    this.title = this.getTitleProps();
    this.avatar = this.getAvatarProps();
    this.paragraph = this.getParagraphProps();
    this.rowsList = [...Array(this.paragraph.rows)];
    this.widthList = this.getWidthList();
    this.cdr.markForCheck();
  }
  ngOnInit() {
    this.updateProps();
  }
  ngOnChanges(changes) {
    if (changes.nzTitle || changes.nzAvatar || changes.nzParagraph) {
      this.updateProps();
    }
  }
  static ɵfac = function NzSkeletonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSkeletonComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _NzSkeletonComponent,
    selectors: [["nz-skeleton"]],
    hostAttrs: [1, "ant-skeleton"],
    hostVars: 6,
    hostBindings: function NzSkeletonComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("ant-skeleton-with-avatar", !!ctx.nzAvatar)("ant-skeleton-active", ctx.nzActive)("ant-skeleton-round", ctx.nzRound);
      }
    },
    inputs: {
      nzActive: [2, "nzActive", "nzActive", booleanAttribute],
      nzLoading: [2, "nzLoading", "nzLoading", booleanAttribute],
      nzRound: [2, "nzRound", "nzRound", booleanAttribute],
      nzTitle: "nzTitle",
      nzAvatar: "nzAvatar",
      nzParagraph: "nzParagraph"
    },
    exportAs: ["nzSkeleton"],
    features: [ɵɵNgOnChangesFeature],
    ngContentSelectors: _c4,
    decls: 2,
    vars: 1,
    consts: [[1, "ant-skeleton-header"], [1, "ant-skeleton-content"], [1, "ant-skeleton-title", 3, "width"], [1, "ant-skeleton-paragraph"], ["nzType", "avatar", 3, "nzSize", "nzShape"], [1, "ant-skeleton-title"], [3, "width"]],
    template: function NzSkeletonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵconditionalCreate(0, NzSkeletonComponent_Conditional_0_Template, 4, 3)(1, NzSkeletonComponent_Conditional_1_Template, 1, 0);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.nzLoading ? 0 : 1);
      }
    },
    dependencies: [NzSkeletonElementDirective, NzSkeletonElementAvatarComponent],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSkeletonComponent, [{
    type: Component,
    args: [{
      selector: "nz-skeleton",
      exportAs: "nzSkeleton",
      host: {
        class: "ant-skeleton",
        "[class.ant-skeleton-with-avatar]": "!!nzAvatar",
        "[class.ant-skeleton-active]": "nzActive",
        "[class.ant-skeleton-round]": "nzRound"
      },
      template: `
    @if (nzLoading) {
      @if (!!nzAvatar) {
        <div class="ant-skeleton-header">
          <nz-skeleton-element
            nzType="avatar"
            [nzSize]="avatar.size || 'default'"
            [nzShape]="avatar.shape || 'circle'"
          ></nz-skeleton-element>
        </div>
      }
      <div class="ant-skeleton-content">
        @if (!!nzTitle) {
          <h3 class="ant-skeleton-title" [style.width]="toCSSUnit(title.width)"></h3>
        }
        @if (!!nzParagraph) {
          <ul class="ant-skeleton-paragraph">
            @for (row of rowsList; track row; let i = $index) {
              <li [style.width]="toCSSUnit(widthList[i])"></li>
            }
          </ul>
        }
      </div>
    } @else {
      <ng-content></ng-content>
    }
  `,
      imports: [NzSkeletonElementDirective, NzSkeletonElementAvatarComponent],
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None
    }]
  }], null, {
    nzActive: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzLoading: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzRound: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    nzTitle: [{
      type: Input
    }],
    nzAvatar: [{
      type: Input
    }],
    nzParagraph: [{
      type: Input
    }]
  });
})();
var NzSkeletonModule = class _NzSkeletonModule {
  static ɵfac = function NzSkeletonModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NzSkeletonModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _NzSkeletonModule,
    imports: [NzSkeletonElementDirective, NzSkeletonComponent, NzSkeletonElementButtonComponent, NzSkeletonElementAvatarComponent, NzSkeletonElementImageComponent, NzSkeletonElementInputComponent],
    exports: [NzSkeletonElementDirective, NzSkeletonComponent, NzSkeletonElementButtonComponent, NzSkeletonElementAvatarComponent, NzSkeletonElementImageComponent, NzSkeletonElementInputComponent]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NzSkeletonModule, [{
    type: NgModule,
    args: [{
      imports: [NzSkeletonElementDirective, NzSkeletonComponent, NzSkeletonElementButtonComponent, NzSkeletonElementAvatarComponent, NzSkeletonElementImageComponent, NzSkeletonElementInputComponent],
      exports: [NzSkeletonElementDirective, NzSkeletonComponent, NzSkeletonElementButtonComponent, NzSkeletonElementAvatarComponent, NzSkeletonElementImageComponent, NzSkeletonElementInputComponent]
    }]
  }], null, null);
})();

export {
  NzSkeletonComponent,
  NzSkeletonModule
};
//# sourceMappingURL=chunk-N6BY4VQS.js.map
