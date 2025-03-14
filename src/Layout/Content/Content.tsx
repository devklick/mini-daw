import useAppletManagerStore from "../../stores/useAppletManagerStore";

import "./Content.scss";

function Content() {
  const applets = useAppletManagerStore((s) => s.applets);
  const contentRef = useAppletManagerStore((s) => s.contentRef);
  return (
    <main className="content" ref={contentRef}>
      {Object.values(applets).map(
        ({ component: Component, props, children, key }) => (
          <Component {...props} key={key}>
            {children}
          </Component>
        )
      )}
    </main>
  );
}

export default Content;
