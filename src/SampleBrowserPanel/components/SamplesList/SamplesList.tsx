import useSampleStore from "../../../Samples/stores/useSamplesStore";
import SamplesListItem from "./components/SamplesListItem";
import "./SamplesList.scss";

function SamplesList() {
  const searchValue = useSampleStore((s) => s.searchValue);
  const samples = useSampleStore((s) => s.samples);

  function getSamples() {
    let candidates = Object.values(samples);
    if (searchValue) {
      candidates = candidates.filter((s) =>
        s.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return candidates.sort((a, b) => a.name.localeCompare(b.name));
  }
  return (
    <ol className="samples-list">
      {getSamples().map((s, i) => (
        <SamplesListItem sample={s} key={i} />
      ))}
    </ol>
  );
}

export default SamplesList;
