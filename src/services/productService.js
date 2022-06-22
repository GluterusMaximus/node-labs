import ProductDto from '../dtos/productDto.js';
import Product from '../models/productModel.js';

class ProductService {
  async getAll() {
    const products = await Product.find({});
    return products.map(product => new ProductDto(product));
  }

  async get(id) {
    const product = await Product.findById(id);

    if (!product) throw new Error('Product not found!');

    return new ProductDto(product);
  }

  async delete(id) {
    const product = await Product.findById(id);

    if (!product) throw new Error('Product not found!');

    return await product.remove();
  }

  async create(data) {
    const createdProduct = await Product.create(data);

    if (!createdProduct) throw new Error('Product creation failed');

    return new ProductDto(createdProduct);
  }

  async update(id, updatedData) {
    const product = await Product.findById(id);

    if (!product) throw new Error('Product not found');

    product.name = updatedData.name;
    product.price = updatedData.price;
    product.description = updatedData.description;
    product.brand = updatedData.brand;
    product.category = updatedData.category;
    product.countInStock = updatedData.countInStock;
    product.user = updatedData.user;

    const updatedProduct = await product.save();

    return new ProductDto(updatedProduct);
  }

  async addReview(id, { rating, comment, user }) {
    const product = await Product.findById(id);

    if (!product) throw new Error('Product not found');

    const alreadyReviewed = product.reviews.find(
      r => user.toString() === r.user._id.toString()
    );
    if (alreadyReviewed) {
      throw new Error('Product already reviewed');
    }

    const review = {
      rating: Number(rating),
      comment,
      user,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    return await product.save();
  }
}

export default new ProductService();
