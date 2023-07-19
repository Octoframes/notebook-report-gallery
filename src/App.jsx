import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AssetRecordType, Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

function App() {
  const handleMount = useCallback(async (app, imageSrcs) => {
    const gap = 100; // gap between images
    const rowWidths = [0]; // for storing the current width of each row
    let currentY = 0; // the initial y position
    let maxHeight = 0; // maximum height in each row

    for (let i = 0; i < imageSrcs.length; i++) {
      const src = imageSrcs[i];
      const { width, height } = await loadImageDimensions(src);
      const assetId = AssetRecordType.createId();
      const asset = {
        id: assetId,
        typeName: "asset",
        type: "image",
        props: {
          w: width,
          h: height,
          name: `image-${i}.png`,
          isAnimated: false,
          mimeType: "image/png",
          src: src,
        },
        meta: {},
      };

      app.createAssets([asset]);

      // Calculate x position
      const rowIndex = Math.floor(i / 5);
      let x = rowWidths[rowIndex];

      // Calculate y position
      let y = currentY;

      if (i % 5 === 0 && i !== 0) {
        // We're starting a new row, so increase y by the height of the tallest image in the previous row + gap
        currentY += maxHeight + gap;
        y = currentY;
        maxHeight = 0; // Reset maximum height for the new row

        // Initialize the width for the new row
        rowWidths[rowIndex] = 0;
      }

      // Update the width of the current row
      rowWidths[rowIndex] += width + gap;

      maxHeight = Math.max(maxHeight, height); // Calculate maximum height in each row

      app.createShapes([
        {
          type: "image",
          x: x,
          y: y,
          props: {
            w: width,
            h: height,
            assetId,
          },
        },
      ]);
    }
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
          flex: 1,
          position: "relative",
          width: "100vw",
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
          height: "100px", 
          alignSelf: "center",
          width: "100%",
          maxWidth: "600px",
          border: "2px dashed #aaa",
          lineHeight: "200px",
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

// Function to load image and get its dimensions
function loadImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
}

export default App;