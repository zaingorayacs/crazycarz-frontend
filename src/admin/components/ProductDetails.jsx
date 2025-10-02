import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
  Box,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Loader from "./Loader";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Mock data for a single product
const mockProduct = {
  _id: "1",
  title: 'Apple MacBook Pro 17"',
  shortDescription: "The ultimate notebook for professionals.",
  longDescription: `Experience power and portability with the Apple MacBook Pro 17". Featuring a stunning Retina display, a powerful M1 Pro chip, and an all-day battery life. Designed for creative professionals and developers, this machine handles demanding tasks with ease.`,
  currentPrice: 2999,
  salePrice: 2799,
  inStock: 15,
  images: [
    "https://placehold.co/800x600/E5E7EB/1F2937?text=Front",
    "https://placehold.co/800x600/E5E7EB/1F2937?text=Side",
    "https://placehold.co/800x600/E5E7EB/1F2937?text=Keyboard",
    "https://placehold.co/800x600/E5E7EB/1F2937?text=Ports",
  ],
  category: "Laptop",
  company: "Apple",
  tags: ["laptop", "professional", "apple", "retina", "m1-pro"],
};

function ProductDetails() {
  const { id, tenantId } = useParams();
  const [product, setProduct] = useState();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await axiosInstance.get(`/admin/${tenantId}/products/${id}`);
        const productDetails = res.data.data;
        setProduct(productDetails);
        console.log(productDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  // Function to move to the previous image in the gallery
  const goToPrevious = () => {
    const isFirstSlide = currentImageIndex === 0;
    const newIndex = isFirstSlide
      ? product.images.length - 1
      : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
  };

  // Function to move to the next image in the gallery
  const goToNext = () => {
    const isLastSlide = currentImageIndex === product.images.length - 1;
    const newIndex = isLastSlide ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
  };

  // Handler for the Edit button click
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // Handler for the Delete button click
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  //delete product function
  const handleDeleteProduct = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/admin/${tenantId}/products/${id}`);
      console.log(res);
      setIsDeleteModalOpen(false);
      navigate("/products");
    } catch (error) {
      console.log("error while deleting the product", error);
    } finally {
      setLoading(false);
    }
  };

  //handle edit function

  const handleEditProduct = () => {
    navigate("/products/add-product", { state: { product } });
  };

  // Custom Modal Component to avoid using alert()
  const ActionModal = ({
    title,
    message,
    onConfirm,
    onClose,
    confirmText,
    confirmColor,
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${confirmColor} transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    // The main container is now a flexbox to center the content
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 font-sans text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        {/* Header with Title and Admin Actions */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-x-3">
            <Package className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Product Details
            </h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Edit size={20} />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              <Trash2 size={20} />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={product.images[currentImageIndex]}
              alt={`${product.title} - ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/800x600/E5E7EB/1F2937?text=Image+Not+Found";
              }}
            />
            {/* Navigation Buttons */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight />
                </button>
              </>
            )}

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                ></div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Product Title and Description */}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {product.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xl font-medium mb-4">
                {product.shortDescription}
              </p>

              {/* Pricing & Stock */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  $
                  {product.salePrice > 0
                    ? product.salePrice
                    : product.currentPrice}
                </span>
                {product.salePrice > 0 && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    ${product.currentPrice}
                  </span>
                )}
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${
                    product.inStock > 0
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                  }`}
                >
                  {product.inStock > 0
                    ? `In Stock (${product.inStock})`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Long Description */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {product.longDescription}
              </p>

              {/* Meta Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Box size={20} className="text-blue-500" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Category:{" "}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.category?.name || "Not Available"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Box size={20} className="text-blue-500" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Company:{" "}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.company?.name || "Not Available"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag size={20} className="text-blue-500" />
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Tags:{" "}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.tags.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Confirmation Modal */}
      {isEditModalOpen && (
        <ActionModal
          title="Edit Product"
          message={`You are about to edit the product: ${product.title}. Are you sure you want to proceed?`}
          onConfirm={handleEditProduct}
          onClose={() => setIsEditModalOpen(false)}
          confirmText="Confirm Edit"
          confirmColor="bg-blue-600 hover:bg-blue-700"
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ActionModal
          title="Delete Product"
          message={`This action cannot be undone. Are you sure you want to delete the product: ${product.title}?`}
          onConfirm={handleDeleteProduct}
          onClose={() => setIsDeleteModalOpen(false)}
          confirmText="Confirm Delete"
          confirmColor="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
}

export default ProductDetails;
