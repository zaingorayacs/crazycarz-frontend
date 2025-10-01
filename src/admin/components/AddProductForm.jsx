import React, { useState, useRef, useEffect, useCallback } from "react";
import { PackagePlus, Crop, X, ChevronDown, Loader2, Upload, Image, Save, AlertCircle } from "lucide-react";
import Cropper from "react-easy-crop";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Modal from "./ui/Modal";
import Badge from "./ui/Badge";
import toast from "react-hot-toast";

// ---------- Custom Select Component ----------
function CustomSelect({ label, id, value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleOptionClick = (option) => {
    onChange({ target: { id, value: option._id } });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white flex justify-between items-center cursor-pointer"
      >
        <span className={!value ? "text-gray-400 dark:text-gray-500" : ""}>
          {options?.find((opt) => opt._id === value)?.name || placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options?.length > 0 ? (
            options.map((option) => (
              <div
                key={option._id}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
              >
                {option.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Utility Functions ----------
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.src = url;
  });

async function getCroppedImage(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
}

// ---------- Main Component ----------
function AddProductForm() {
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { tenantId } = useParams();
  const productToEdit = location.state?.product || null;
 useEffect(() => {
  if (productToEdit) {
    setFormData({
      title: productToEdit.title || "",
      shortDescription: productToEdit.shortDescription || "",
      longDescription: productToEdit.longDescription || "",
      category: productToEdit.category?._id || "",  // assuming it's an object
      company: productToEdit.company?._id || "",
      tags: productToEdit.tags || [],
      images: [], // you can't set File objects here, handle this separately
      currentPrice: productToEdit.currentPrice || "",
      salePrice: productToEdit.salePrice || "",
      inStock: productToEdit.inStock || "",
    });

    // Optionally, if you want to show existing images in preview
    setCroppedImages(productToEdit.images || []);
  }
}, [productToEdit]);

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    category: "",
    company: "",
    tags: [],
    images: [],
    currentPrice: "",
    salePrice: "",
    inStock: "",
  });

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }
    
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (!formData.currentPrice || formData.currentPrice <= 0) {
      newErrors.currentPrice = "Valid price is required";
    }
    
    if (formData.salePrice && formData.salePrice >= formData.currentPrice) {
      newErrors.salePrice = "Sale price must be less than current price";
    }
    
    if (!formData.inStock || formData.inStock < 0) {
      newErrors.inStock = "Stock quantity is required";
    }
    
    if (formData.images.length === 0 && !productToEdit) {
      newErrors.images = "At least one product image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [tagInput, setTagInput] = useState("");
  const [croppedImages, setCroppedImages] = useState([]);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  // ---------- Fetch Categories & Companies ----------
  useEffect(() => {
 
    
       setCategoriesLoading(true);
    const getAllCategories = async ()=>{
      try {
        const res = await axiosInstance.get("/categories")
        console.log(res.data.data)
        setCategories(res.data.data)
       
      } catch (error) {
        console.log(error)
      }
      finally{
        setCategoriesLoading(false)
      }
      
    }

    getAllCategories()
          

    setCompaniesLoading(true);
    axiosInstance
      .get("/companies")
      .then((res) => setCompanies(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setCompaniesLoading(false));
  }, []);

  // ---------- Form Handlers ----------
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    console.log(formData);
    
  };

  const handleTagInputKeyDown = (e) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
        setTagInput("");
      }
    } else if (
      e.key === "Backspace" &&
      tagInput === "" &&
      formData.tags.length > 0
    ) {
      setFormData((prev) => ({ ...prev, tags: prev.tags.slice(0, -1) }));
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setFormData((prev) => ({ ...prev, images: files }));
    setCroppedImages(files.map(() => null));
    e.target.value = null;
  };

  const handleCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleOpenCropModal = (index) => {
    setCurrentImageIndex(index);
    setImageToCrop(URL.createObjectURL(formData.images[index]));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setIsCropModalOpen(true);
  };

  const handleCrop = async () => {
    const blob = await getCroppedImage(imageToCrop, croppedAreaPixels);
    const newCroppedImages = [...croppedImages];
    newCroppedImages[currentImageIndex] = URL.createObjectURL(blob);
    setCroppedImages(newCroppedImages);

    const newImages = [...formData.images];
    newImages[currentImageIndex] = new File(
      [blob],
      formData.images[currentImageIndex].name,
      { type: "image/jpeg" }
    );
    setFormData((prev) => ({ ...prev, images: newImages }));

    setIsCropModalOpen(false);
    setImageToCrop(null);
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    const isEditMode = !!productToEdit;

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("shortDescription", formData.shortDescription);
    payload.append("longDescription", formData.longDescription);
    payload.append("categoryId", formData.category);
    payload.append("companyId", formData.company);
    payload.append("currentPrice", formData.currentPrice || 0);
    payload.append("salePrice", formData.salePrice || 0);
    payload.append("inStock", formData.inStock || 0);
    payload.append("tags", JSON.stringify(formData.tags));

    // Add new images only if uploaded
    formData.images.forEach((file) => payload.append("images", file));

    try {
      let res;
      if (isEditMode) {
        res = await axiosInstance.put(`/products/${productToEdit._id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        res = await axiosInstance.post("/products", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully!");
      }
      
      // Navigate back to products list after success
      setTimeout(() => {
        navigate(`/admin/${tenantId}/products`);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Render ----------
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25">
              <PackagePlus className="h-6 w-6" />
            </div>
            {productToEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {productToEdit ? 'Update product information and details' : 'Create a new product listing'}
          </p>
        </motion.div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/${tenantId}/products`)}
          >
            Cancel
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg">
          <Card.Header>
            <Card.Title>Product Information</Card.Title>
            <Card.Description>
              Fill in all required fields to {productToEdit ? 'update' : 'create'} your product
            </Card.Description>
          </Card.Header>
          <Card.Content>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Title */}
              <Input
                label="Product Title"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange(e)}
                placeholder="e.g., Wireless Headphones"
                required
                error={errors.title}
              />

            {/* Short & Long Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="shortDescription"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Short Description
                </label>
                <textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Brief summary..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="longDescription"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Long Description
                </label>
                <textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Detailed description..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Category & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomSelect
                label="Product Category"
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                options={categories}
                placeholder="Select a category"
              />
              <CustomSelect
                label="Product Company"
                id="company"
                value={formData.company}
                onChange={handleInputChange}
                options={companies}
                placeholder="Select a company"
              />
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Product Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  id="tags-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="e.g., electronics, audio"
                  className="flex-1 min-w-[100px] bg-transparent text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Product Images (up to 5)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF (max 5)
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    multiple
                    accept="image/*"
                  />
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formData.images.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={croppedImages[idx] || URL.createObjectURL(file)}
                        alt={`Preview ${idx}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenCropModal(idx)}
                        >
                          <Crop size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="currentPrice"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Current Price
                </label>
                <input
                  type="number"
                  id="currentPrice"
                  value={formData.currentPrice || ""}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="salePrice"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Sale Price
                </label>
                <input
                  type="number"
                  id="salePrice"
                  value={formData.salePrice || ""}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="inStock"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="inStock"
                  value={formData.inStock || ""}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 flex justify-center items-center gap-2 transition-colors"
              >
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? "Submitting..." : "Add Product"}
              </button>
            </div>
          </form>
          </Card.Content>
        </Card>
      </motion.div>

      {/* Image Cropping Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 my-8 p-6 relative">
            <h3 className="text-xl font-bold mb-4">Crop Image</h3>
            <button
              onClick={() => setIsCropModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
            <div className="relative w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3} // You can change the aspect ratio here
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zoom
                </label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(e.target.value);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(false)}
                  className="px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCrop}
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default AddProductForm;
