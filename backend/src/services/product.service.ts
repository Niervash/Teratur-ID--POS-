import { Product, Prisma } from '@prisma/client';
import prisma from '@config/database';
import logger from '@utils/logger';
import { CreateProductRequest, UpdateProductRequest } from '@types/index';

export class ProductService {
  /**
   * Create new product
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    try {
      // Calculate HPP
      const hpp = (data.bbb || 0) + (data.btkl || 0) + (data.bop || 0);

      const product = await prisma.product.create({
        data: {
          sku: data.sku,
          name: data.name,
          description: data.description,
          category: data.category,
          unitPrice: data.unitPrice,
          bbb: data.bbb || 0,
          btkl: data.btkl || 0,
          bop: data.bop || 0,
          hpp: hpp,
          profitMargin: data.profitMargin || 0,
          imageUrl: data.imageUrl,
        },
      });

      // Create inventory record
      await prisma.inventory.create({
        data: {
          productId: product.id,
          quantityOnHand: 0,
        },
      });

      logger.info(`Product created: ${product.sku} - ${product.name}`);
      return product;
    } catch (error) {
      logger.error('Create product error:', error);
      throw error;
    }
  }

  /**
   * Get all products with pagination
   */
  async getProducts(page: number = 1, limit: number = 10, category?: string) {
    try {
      const skip = (page - 1) * limit;

      const where: Prisma.ProductWhereInput = {
        isActive: true,
        ...(category && { category }),
      };

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          include: { inventory: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Get products error:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      return await prisma.product.findUnique({
        where: { id },
        include: {
          inventory: true,
          recipes: true,
        },
      });
    } catch (error) {
      logger.error('Get product error:', error);
      throw error;
    }
  }

  /**
   * Get product by SKU
   */
  async getProductBySku(sku: string): Promise<Product | null> {
    try {
      return await prisma.product.findUnique({
        where: { sku },
        include: { inventory: true },
      });
    } catch (error) {
      logger.error('Get product by SKU error:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    try {
      // Calculate HPP if components changed
      let hpp = undefined;
      if (data.bbb !== undefined || data.btkl !== undefined || data.bop !== undefined) {
        const product = await prisma.product.findUnique({ where: { id } });
        if (product) {
          hpp = (data.bbb ?? product.bbb) + (data.btkl ?? product.btkl) + (data.bop ?? product.bop);
        }
      }

      const product = await prisma.product.update({
        where: { id },
        data: {
          ...data,
          hpp: hpp as any,
          updatedAt: new Date(),
        },
      });

      logger.info(`Product updated: ${product.sku}`);
      return product;
    } catch (error) {
      logger.error('Update product error:', error);
      throw error;
    }
  }

  /**
   * Delete product (soft delete)
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await prisma.product.update({
        where: { id },
        data: { deletedAt: new Date(), isActive: false },
      });

      logger.info(`Product deleted: ${id}`);
    } catch (error) {
      logger.error('Delete product error:', error);
      throw error;
    }
  }

  /**
   * Get categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const categories = await prisma.product.findMany({
        where: { isActive: true },
        distinct: ['category'],
        select: { category: true },
      });

      return categories.map(c => c.category).filter(Boolean) as string[];
    } catch (error) {
      logger.error('Get categories error:', error);
      throw error;
    }
  }

  /**
   * Get product HPP details
   */
  async getProductHppDetails(id: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return {
        productId: product.id,
        productName: product.name,
        unitPrice: product.unitPrice,
        hppComponents: {
          bbb: product.bbb, // Biaya Bahan Baku
          btkl: product.btkl, // Biaya Tenaga Kerja Langsung
          bop: product.bop, // Biaya Overhead Pabrik
        },
        totalHpp: product.hpp,
        profitMargin: product.profitMargin,
        profitAmount: product.unitPrice - product.hpp,
        profitPercentage: ((product.unitPrice - product.hpp) / product.unitPrice) * 100,
      };
    } catch (error) {
      logger.error('Get product HPP details error:', error);
      throw error;
    }
  }
}

export default new ProductService();