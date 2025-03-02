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
  appletMap: Map<string, ComponentDefinition>;
  highestZIndex: number;
  getAppletDefinitions(): Array<ComponentDefinition>;
  addApplet<Props extends BaseProps = BaseProps>(
    appletId: string,
    definition: ComponentDefinition<Props>
  ): void;
  closeApplet(appletId: string): void;
  focusApplet(appletId: string): void;
  hideApplet(appletId: string): void;
}

const useAppletManagerStore = create<AppletManagerStoreState>()((set, get) => ({
  contentRef: React.createRef<HTMLDivElement>(),
  appletMap: new Map(),
  highestZIndex: 0,
  addApplet(appletId, definition) {
    const appletMap = new Map(get().appletMap);
    const highestZIndex = get().highestZIndex + 1;
    definition.props.zIndex = highestZIndex;

    appletMap.set(appletId, definition as unknown as ComponentDefinition);

    set({ appletMap, highestZIndex });
  },
  closeApplet(appletId) {
    const appletMap = get().appletMap;
    appletMap.delete(appletId);
    let highestZIndex = get().highestZIndex;
    if (appletMap.size) highestZIndex = 1;

    set({ appletMap, highestZIndex });
  },
  focusApplet(appletId) {
    let highestZIndex = get().highestZIndex;
    const appletMap = get().appletMap;
    const applet = appletMap.get(appletId);
    if (!applet) return;

    if (applet.props.zIndex === highestZIndex) return;

    highestZIndex++;
    applet.props.zIndex = highestZIndex;
    applet.props.hidden = false;

    set({ appletMap, highestZIndex });
  },
  getAppletDefinitions() {
    return Array.from(get().appletMap.values());
  },
  hideApplet(appletId) {
    const appletMap = get().appletMap;
    const applet = appletMap.get(appletId);
    if (!applet) return;
    applet.props.hidden = true;
    set({ appletMap });
  },
}));

export default useAppletManagerStore;
