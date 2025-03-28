import { useRef } from "react";
import Container from "../../components/Container";
import "./Arranger.scss";
import ArrangerTracks from "./components/ArrangerTracks";

function Arranger() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <Container scrollX scrollY ref={containerRef}>
      <ArrangerTracks containerRef={containerRef} />
    </Container>
  );
}

export default Arranger;
