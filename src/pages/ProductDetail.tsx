import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductDetailCard } from '@/components/product/ProductDetailCard';
import { products as initialProducts, Product } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('teratur_products');
    let allProducts: Product[] = [];
    
    if (stored) {
      try {
        allProducts = JSON.parse(stored);
      } catch {
        allProducts = initialProducts;
      }
    } else {
      allProducts = initialProducts;
    }
    
    const found = allProducts.find((p) => p.id === id);
    setProduct(found || null);
    setLoading(false);
  }, [id]);

  if (loading) return <Layout><div>Loading...</div></Layout>;

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
          <Link to="/products" className="text-primary hover:underline">
            Kembali ke daftar produk
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Produk
        </Link>

        <ProductDetailCard product={product} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
