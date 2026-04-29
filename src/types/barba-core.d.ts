declare module "@barba/core" {
  export type BarbaTransitionData = {
    current: { container: Element };
    next: { container: Element };
  };

  export type BarbaTransition = {
    name?: string;
    leave?: (data: BarbaTransitionData) => unknown;
    enter?: (data: BarbaTransitionData) => unknown;
  };

  export type BarbaInitOptions = {
    transitions: BarbaTransition[];
  };

  const barba: {
    init: (options: BarbaInitOptions) => void;
  };

  export default barba;
}
