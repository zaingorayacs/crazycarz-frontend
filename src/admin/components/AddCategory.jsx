import React, { useState } from 'react';
import { Tag, Loader2, Upload, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { createTenantApi } from '../utils/tenantApi';

function AddCategoryForm() {
  const { tenantId } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoryName.trim() === '') {
      setErrorMessage('Category name is required');
      return;
    }

    try {
      setLoading(true);
      setSubmissionSuccess(false);
      setErrorMessage('');

      const api = createTenantApi(tenantId);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('categoryName', categoryName);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }

      const response = await api.post('/categories/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Category added successfully:', response);

      // Reset form after successful submission
      setCategoryName('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setSubmissionSuccess(true);

      // Hide the success message after 3 seconds
      setTimeout(() => setSubmissionSuccess(false), 3000);

    } catch (error) {
      console.error('Error adding category:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen justify-center items-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-8'>
      <div className='max-w-2xl mx-auto w-full'>

        {/* Header Section */}
        <div className="text-gray-900 dark:text-gray-100 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-x-2">
            <Tag className="h-7 w-7 text-blue-500" />
            Add New Category
          </h1>
        </div>

        {/* Conditional Success Message */}
        {submissionSuccess && (
          <div className='w-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6 shadow-sm border border-green-200 dark:border-green-800 transition-opacity duration-300'>
            Category added successfully!
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className='w-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 shadow-sm border border-red-200 dark:border-red-800'>
            {errorMessage}
          </div>
        )}

        {/* Main Form Section */}
        <div className='w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>Category Details</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-8'>Enter the name of the new category you wish to add.</p>

          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* Category Name Input */}
            <div>
              <label htmlFor='categoryName' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Category Name
              </label>
              <input
                type='text'
                id='categoryName'
                value={categoryName}
                onChange={handleInputChange}
                placeholder='e.g., Electronics'
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Description
              </label>
              <textarea
                id='description'
                value={description}
                onChange={handleDescriptionChange}
                placeholder='Enter category description...'
                rows='3'
                className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Category Image (Optional)
              </label>
              
              {!imagePreview ? (
                <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'>
                  <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    <Upload className='w-10 h-10 mb-3 text-gray-400' />
                    <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                      <span className='font-semibold'>Click to upload</span> or drag and drop
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>PNG, JPG or WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className='relative'>
                  <img
                    src={imagePreview}
                    alt='Category preview'
                    className='w-full h-48 object-cover rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={removeImage}
                    className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                  >
                    <X className='w-5 h-5' />
                  </button>
                </div>
              )}
            </div>

            {/* Button with integrated loader */}
            <div className='flex justify-end'>
              <button
                type='submit'
                className='px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 justify-center'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Adding...</span>
                  </>
                ) : (
                  'Add Category'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCategoryForm;
