import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AssetRecordType, Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { Base64 } from "js-base64";

function App() {
  const handleMount = useCallback((app, imageSrcs) => {
    imageSrcs.forEach((src, index) => {
      const assetId = AssetRecordType.createId();
      const asset = {
        id: assetId,
        typeName: "asset",
        type: "image",
        props: {
          w: 400,
          h: 340,
          name: `image-${index}.png`,
          isAnimated: false,
          mimeType: "image/png",
          src: src,
        },
        meta: {},
      };

      app.createAssets([asset]);
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
    });
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const notebook = JSON.parse(e.target.result);
          const imageSrcs = notebook.cells
            .flatMap((cell) =>
              cell.outputs
                ? cell.outputs.flatMap((output) =>
                    output.data && output.data["image/png"]
                      ? [
                          "data:image/png;base64," + output.data["image/png"],
                        ]
                      : []
                  )
                : []
            )
            .filter(Boolean);
          handleMount(window.app, imageSrcs);
        } catch (error) {
          toast.error("Error parsing Jupyter notebook: " + error);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <ToastContainer />
      <p>Drag 'n' drop a Jupyter notebook here, or click to select one</p>
      <div
        style={{
          position: "relative",
          width: "1000px",
          height: "1000px",
        }}
      >
        <Tldraw
          onMount={(app) => {
            window.app = app; // save a reference to the Tldraw instance for later
          }}
        />
      </div>
    </div>
  );
}

export default App;
