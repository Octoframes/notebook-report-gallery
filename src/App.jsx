import { AssetRecordType, Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

export default function App() {
  const handleMount = (app) => {
    const assetId = AssetRecordType.createId();
    const placeholderAsset = {
      id: assetId,
      typeName: "asset",
      type: "image",
      props: {
        w: 400,
        h: 340,
        name: "card-repo.png",
        isAnimated: false,
        mimeType: null,
        src: "https://raw.githubusercontent.com/scikit-image/scikit-image/main/skimage/data/chelsea.png",
      },
      meta: {},
    };

    app.createAssets([placeholderAsset]);
    app.createShapes([
      {
        type: "image",
        props: {
          w: 400,
          h: 340,
          assetId,
        },
      },
    ]);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "1000px",
        height: "1000px",
      }}
    >
      <Tldraw onMount={handleMount} />
    </div>
  );
}