import Gallery from '../models/Gallery.js';



export const createGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      console.log('❌ No file received');
      return res.status(400).json({ message: 'No image uploaded' });
    }

    console.log('✅ File received:', req.file);
    console.log('📦 Body:', req.body);

    const { category } = req.body;

    const newImage = new Gallery({
      imageUrl: req.file.path,
      category: category || 'Uncategorized',
    });

    const saved = await newImage.save();
    console.log('✅ Image saved:', saved);

    res.status(201).json({ message: 'Image uploaded and saved', data: saved });
  } catch (error) {
    console.error('❌ Error during image upload:', error);
    res.status(500).json({ message: 'Failed to save image', error: error.message });
  }
};

export const getGalleryImages = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category && category.toLowerCase() !== 'all' ? { category } : {};
    const images = await Gallery.find(filter).sort({ uploadedAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch images' });
  }
};

export const getGalleryImageById = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.status(200).json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch image' });
  }
};

export const updateGalleryImage = async (req, res) => {
  try {
    console.log('📦 Body:', req.body);
    console.log('🖼️ File:', req.file);

    const updateData = {};
    if (req.body.category) updateData.category = req.body.category;
    if (req.file) updateData.imageUrl = req.file.path;

    const updated = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Image not found' });

    console.log('✅ Image updated:', updated);
    res.status(200).json({ message: 'Image updated', data: updated });
  } catch (error) {
    console.error('❌ Error updating image:', error);
    res.status(500).json({ message: 'Failed to update image', error: error.message });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Image not found' });
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
};
