import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AssetRecordType, Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

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

      const rowIndex = Math.floor(index / 5);
      const columnIndex = index % 5;
      app.createShapes([
        {
          type: "image",
          x: columnIndex * 400,
          y: rowIndex * 400,
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    noClick: true, // Disable clicking on the drop zone
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          flex: 8, // 80% of the window height
          position: "relative",
          width: "100vw", // Full window width
        }}
      >
        <Tldraw
          onMount={(app) => {
            window.app = app; // save a reference to the Tldraw instance for later
          }}
        />
      </div>
      <div 
        {...getRootProps()} 
        style={{ 
          flex: 1, // 10% of the window height
          alignSelf: "center",
          width: "100%",
          maxWidth: "600px",
          height: "200px",
          border: "2px dashed #aaa",
          lineHeight: "100px",
          textAlign: "center",
          fontSize: "24px",
          color: "#aaa",
          margin: "15px auto",
          backgroundColor: isDragActive ? 'orange' : 'transparent'
        }}
      >
        <input {...getInputProps()} />
        <ToastContainer />
        <p>Drag 'n' drop a Jupyter notebook here</p>
      </div>
    </div>
  );
}

export default App;
