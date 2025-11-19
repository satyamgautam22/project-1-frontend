import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = "http://127.0.0.1:5000/api";

const Uploadingproject = () => {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ title: "", description: "", imageUrl: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const resetForm = () => {
    setForm({ title: "", description: "", imageUrl: "" });
    setSelectedImage(null);
    setPreview(null);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/projects");
      setProjects(res.data?.projects || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return null;
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setUploadingImage(true);
      const res = await axios.post("/data/uploadimage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.imageUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = form.imageUrl;

      if (!selectedImage && !imageUrl) {
        toast.error("Please upload an image for the project");
        setSaving(false);
        return;
      }

      if (selectedImage) {
        const uploadedUrl = await handleImageUpload();
        if (!uploadedUrl) {
          toast.error("Image upload failed, project not saved");
          setSaving(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      if (editingId) {
        await axios.put(`/projects/${editingId}`, { ...form, imageUrl });
        toast.success("Project updated");
      } else {
        await axios.post("/projects", { ...form, imageUrl });
        toast.success("Project added");
      }

      resetForm();
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    const toastId = toast.loading("Deleting…");
    try {
      await axios.delete(`/projects/${id}`);
      toast.success("Deleted", { id: toastId });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project", {
        id: toastId,
      });
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      imageUrl: project.imageUrl || "",
    });
    setEditingId(project._id);
    setPreview(project.imageUrl || null);
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    resetForm();
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Project Dashboard
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4 mb-10 border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border p-3 rounded w-full"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project Title"
            required
          />
        </div>

        <textarea
          className="border p-3 rounded w-full resize-none"
          rows="4"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Project Description"
          required
        />

        {/* Image Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-28 w-28 object-cover rounded-lg border shadow"
            />
          )}
          {uploadingImage && (
            <p className="text-sm text-gray-500">Uploading image…</p>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="bg-blue-600 disabled:opacity-60 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-gray-600 hover:underline text-sm"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Project List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">
            Loading projects…
          </p>
        ) : projects.length > 0 ? (
          projects.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition"
            >
              <img
                src={p.imageUrl || "/no-image.png"}
                alt={p.title || "No Image"}
                onError={(e) => (e.currentTarget.src = "/no-image.png")}
                className="object-cover h-48 w-full"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {p.description}
                </p>
                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No projects available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Uploadingproject;
