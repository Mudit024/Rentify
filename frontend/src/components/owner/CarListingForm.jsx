import { useForm } from 'react-hook-form';
import { ImagePlus, X } from 'lucide-react';
import { useState } from 'react';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import { FUEL_TYPES, TRANSMISSIONS } from '../../constants/index.js';

const CarListingForm = ({ defaultValues = {}, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [previews, setPreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const removePreview = (i) => {
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, images: imageFiles });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Listing Title"
          placeholder="e.g. Clean Honda Civic 2022"
          error={errors.title?.message}
          containerClassName="sm:col-span-2"
          {...register('title', { required: 'Title is required' })}
        />
        <Input
          label="Brand"
          placeholder="e.g. Toyota"
          error={errors.brand?.message}
          {...register('brand', { required: 'Brand is required' })}
        />
        <Input
          label="Model"
          placeholder="e.g. Camry"
          error={errors.model?.message}
          {...register('model', { required: 'Model is required' })}
        />
        <Input
          label="Year"
          type="number"
          placeholder="2022"
          error={errors.year?.message}
          {...register('year', { required: 'Year is required', min: { value: 1990, message: 'Year too old' } })}
        />
        <Input
          label="Color"
          placeholder="e.g. Midnight Black"
          error={errors.color?.message}
          {...register('color', { required: 'Color is required' })}
        />
        <Select
          label="Fuel Type"
          options={FUEL_TYPES}
          error={errors.fuelType?.message}
          {...register('fuelType', { required: 'Fuel type is required' })}
        />
        <Select
          label="Transmission"
          options={TRANSMISSIONS}
          error={errors.transmission?.message}
          {...register('transmission', { required: 'Transmission is required' })}
        />
        <Input
          label="Seats"
          type="number"
          min={1}
          max={12}
          error={errors.seats?.message}
          {...register('seats', { required: 'Seats required', min: 1, max: 12 })}
        />
        <Input
          label="Mileage (km/mi)"
          type="number"
          min={0}
          error={errors.mileage?.message}
          {...register('mileage', { required: 'Mileage required' })}
        />
        <Input
          label="Price Per Day ($)"
          type="number"
          min={1}
          error={errors.pricePerDay?.message}
          {...register('pricePerDay', { required: 'Price required', min: { value: 1, message: 'Must be > 0' } })}
        />
        <Input
          label="City / Location"
          placeholder="e.g. New York"
          error={errors.location?.message}
          {...register('location', { required: 'Location required' })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          rows={4}
          placeholder="Describe your car, what makes it great for renters..."
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Image uploader */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Car Images {defaultValues.images ? '(add more below)' : '(required)'}
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 hover:border-primary-400 transition-colors">
          <ImagePlus className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">Click to upload images (max 8)</p>
          <input type="file" className="hidden" accept="image/*" multiple onChange={handleImages} />
        </label>

        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square">
                <img src={src} className="h-full w-full rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Show existing images on edit */}
        {defaultValues.images?.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-500">Existing images:</p>
            <div className="grid grid-cols-4 gap-3">
              {defaultValues.images.map((img, i) => (
                <img key={i} src={img.url} className="aspect-square rounded-lg object-cover" />
              ))}
            </div>
          </div>
        )}
      </div>

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full sm:w-auto">
        {defaultValues._id ? 'Save & Resubmit for Approval' : 'List My Car'}
      </Button>
    </form>
  );
};

export default CarListingForm;
