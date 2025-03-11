import useAppletManagerStore from "../../stores/useAppletManagerStore";

import "./Content.scss";

function Content() {
  const applets = useAppletManagerStore((s) => s.applets);
  return (
    <main className="content">
      {Object.values(applets).map((definition) => (
        <definition.component {...definition.props} key={definition.key}>
          {definition.children}
        </definition.component>
      ))}
    </main>
  );
}

export default Content;
