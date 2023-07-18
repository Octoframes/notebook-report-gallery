import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

export default function App() {
  const handleMount = (app) => {
    // You can use the app API here! e.g. app.selectAll()
    // app.patchAssets({
    //   myAssetId: {
    //     id: "myAssetId",
    //     type: TDAssetType.Image,
    //     fileName: "card-repo.png",
    //     src: "https://raw.githubusercontent.com/scikit-image/scikit-image/main/skimage/data/chelsea.png"
    //   }
    // });

    // app.createShapes({
    //   id: "myImage",
    //   type: TDShapeType.Image,
    //   assetId: "myAssetId",
    //   point: [64, 64],
    //   size: [400, 340]
    // });
  };

return (
        <div
        style={{
            position: "relative",
            width: "800px",
            height: "350px"
        }}
        >
        <Tldraw onMount={handleMount} />
        </div>
    )
    }