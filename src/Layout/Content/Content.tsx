import useAppletManagerStore from "../../stores/useAppletManagerStore";

import "./Content.scss";

function Content() {
  const applets = useAppletManagerStore((s) => s.applets);
  return (
    <main className="content">
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
