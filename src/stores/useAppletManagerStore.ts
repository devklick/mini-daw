import React from "react";
import { create } from "zustand";

/*
  Things that are displayed within the DAW's main content section can be 
  considered as applets. Examples:

    - Sequencer (exists)
    - Arranger (future)
    - Plugins (future)

  These will generally all have the option to open, close, hide the applet
*/

export interface BaseProps {
  zIndex?: number;
  hidden?: boolean;
  children?: React.ReactNode;
}

interface ComponentDefinition<Props extends BaseProps = BaseProps> {
  component: React.FC<Props>;
  props: Props;
  children?: React.ReactNode;
  key: string | number;
}

interface AppletManagerStoreState {
  contentRef: React.RefObject<HTMLDivElement | null>;
  applets: Record<string, ComponentDefinition>;
  highestZIndex: number;
  getAppletDefinitions(): Array<ComponentDefinition>;
  addApplet<Props extends BaseProps = BaseProps>(
    appletId: string,
    definition: ComponentDefinition<Props>
  ): void;
  closeApplet(appletId: string): void;
  focusApplet(appletId: string): void;
  hideApplet(appletId: string): void;
  toggleHide(appletId: string): void;
}

const useAppletManagerStore = create<AppletManagerStoreState>()((set, get) => ({
  contentRef: React.createRef<HTMLDivElement>(),
  applets: {},
  highestZIndex: 0,
  addApplet(appletId, definition) {
    const applets = { ...get().applets };
    const highestZIndex = get().highestZIndex + 1;
    definition.props.zIndex = highestZIndex;

    applets[appletId] = definition as unknown as ComponentDefinition;

    set({ applets, highestZIndex });
  },
  closeApplet(appletId) {
    const applets = { ...get().applets };
    delete applets[appletId];
    let highestZIndex = get().highestZIndex;
    if (applets.size) highestZIndex = 1;

    set({ applets, highestZIndex });
  },
  focusApplet(appletId) {
    set((state) => {
      // console.log("Focusing applet");
      let { highestZIndex } = state;
      const { applets } = state;
      if (!applets[appletId]) return {};

      if (
        !applets[appletId].props.hidden &&
        applets[appletId].props.zIndex === highestZIndex
      ) {
        return {};
      }

      const updatedApplet = { ...applets[appletId] };

      if (updatedApplet.props.zIndex !== highestZIndex) {
        highestZIndex++;
        updatedApplet.props.zIndex = highestZIndex;
      }

      updatedApplet.props.hidden = false;

      console.log({ applets, highestZIndex });

      const updatedApplets = { ...applets };
      updatedApplets[appletId] = updatedApplet;

      return {
        applets: updatedApplets,
        highestZIndex,
      };
    });
  },
  getAppletDefinitions() {
    return Array.from(Object.values(get().applets));
  },
  hideApplet(appletId) {
    const applets = { ...get().applets };
    const applet = applets[appletId];
    if (!applet) return;
    applet.props.hidden = true;
    set({ applets });
  },
  toggleHide(appletId) {
    const applet = get().applets[appletId];
    if (!applet) return;
    if (applet.props.hidden) {
      get().focusApplet(appletId);
    } else {
      get().hideApplet(appletId);
    }
  },
}));

export default useAppletManagerStore;
