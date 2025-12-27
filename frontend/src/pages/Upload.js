import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import { toast } from "react-hot-toast";

export default function Upload() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadState, setUploadState] = useState("idle");
  const [preview, setPreview] = useState(null);

  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/json",
    "text/xml",
    "application/xml"
  ];

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && allowedTypes.includes(droppedFile.type)) {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a valid file: CSV, Excel, JSON, or XML");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a valid file: CSV, Excel, JSON, or XML");
      setFile(null);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a file!");
      return;
    }

    setUploadState("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        setUploadState("success");
        setProgress(100);
        setPreview(data);
        localStorage.setItem("insightify_df", JSON.stringify(data.preview));
        toast.success("File uploaded successfully!");
        navigate("/chat", { state: { df: data.preview } });
      } else {
        const errorMsg = data.error || "Upload failed";
        toast.error(errorMsg);
        setUploadState("idle");
      }
    } catch (error) {
      toast.error("Upload failed: " + error.message);
      setUploadState("idle");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full min-h-screen flex flex-col items-center justify-start pt-20"
      style={{
        background: "linear-gradient(135deg, #1b8442ff 0%, #009135ff 50%, #00aa3eff 100%)",
        color: "white",
      }}
    >
      <h2 className="text-3xl font-bold text-white mb-10">Upload Your Dataset</h2>

      <motion.div
        className="w-[500px] h-[200px] border-2 border-dashed border-emerald flex flex-col items-center justify-center rounded-xl cursor-pointer bg-white"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {!file ? (
          <>
            <p className="text-gray-600">Drag & Drop Your File</p>
            <p className="text-sm text-gray-400">or click to browse</p>
          </>
        ) : (
          <p className="text-emerald font-semibold">{file.name}</p>
        )}
      </motion.div>

      <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />

      {uploadState === "uploading" && (
        <div className="w-[500px] bg-gray-200 rounded-full mt-5">
          <div
            className="bg-emerald text-xs font-bold text-white text-center p-1 rounded-full"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      <motion.button
        className="mt-6 bg-emerald text-white px-6 py-3 rounded-xl hover:bg-emeraldDark transition-default"
        onClick={uploadFile}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {uploadState === "uploading" ? <PulseLoader color="#0BA37F" size={10} /> : "Upload File"}
      </motion.button>

      {/* Preview Table */}
      {preview && preview.columns && preview.preview && (
        <motion.div
          className="mt-10 w-[90%] p-6 rounded-3xl backdrop-blur-2xl bg-white/12 border border-white/20 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">📊 Data Preview</h3>

          <p className="text-gray-200 mb-4">
            Rows: {preview.rows} | Columns: {preview.columns.length}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white">
              <thead>
                <tr className="border-b border-white/20">
                  {preview.columns.map((col) => (
                    <th key={col} className="p-3 text-left font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.preview.map((row, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {preview.columns.map((col) => (
                      <td key={col} className="p-3">
                        {row[col]?.toString()}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Cleaning Report */}
      {preview && preview.cleaning_report && (
        <motion.div
          className="mt-6 p-6 w-[90%] rounded-3xl backdrop-blur-2xl bg-white/12 border border-white/20 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white mb-3">🧹 Cleaning Report</h3>
          <pre className="text-sm bg-black/20 p-4 rounded-xl overflow-auto text-gray-200">
            {JSON.stringify(preview.cleaning_report, null, 2)}
          </pre>
        </motion.div>
      )}

      {/* Export Report Button */}
      {preview && (
        <motion.button
          onClick={async () => {
            const res = await fetch("http://127.0.0.1:8000/api/export", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ report: preview, charts: preview.charts }),
            });

            const data = await res.json();
            toast.success(`PDF Generated: ${data.file}`);
          }}
          className="mt-6 bg-emerald text-white px-6 py-3 rounded-xl hover:bg-emeraldDark transition-default"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📄 Export Report as PDF
        </motion.button>
      )}
    </motion.div>
  );
}
