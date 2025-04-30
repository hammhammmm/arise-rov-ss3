type Props = {};

export default function Loading({}: Props) {
  return (
    <div className={"loader_overlay animated fadeIn"}>
      {/* <div className="colorful center"></div> */}
      <div className="spinner center">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
