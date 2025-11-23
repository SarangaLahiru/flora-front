import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { LuFlower2, LuLeaf, LuShieldCheck, LuSparkles, LuSprout, LuTruck } from 'react-icons/lu';
import { FiArrowRight } from 'react-icons/fi';

const heroHighlights = [
  { label: 'Same-day delivery', sub: 'Before 4 PM', icon: <LuTruck className="text-lg" /> },
  { label: 'Luxury packaging', sub: 'Complimentary', icon: <LuSparkles className="text-lg" /> },
  { label: 'Live tracking', sub: 'Door to vase', icon: <LuShieldCheck className="text-lg" /> },
];

const houseCollections = [
  {
    title: 'Atelier Bouquets',
    description: 'Artfully curated statements for grand entrances & heartfelt moments.',
    accent: 'New drop',
    image:
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Tablescapes',
    description: 'Styled stems for dining rituals, from brunch terraces to golden-hour dinners.',
    accent: 'Signature edit',
    image:
      'https://images.unsplash.com/photo-1445527815219-ecbfec67492e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Self-care blooms',
    description: 'Mindfully chosen botanicals to recharge your rituals and routines.',
    accent: 'Editor’s pick',
    image:
      'https://images.unsplash.com/photo-1468818438311-4bab781ab9b8?auto=format&fit=crop&w=900&q=80',
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await productService.getFeaturedProducts();
      setFeaturedProducts(data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-20 pb-20 bg-white">
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div className="space-y-8">
              <div className="chip w-fit">
                <LuFlower2 />
                Established 2012 · Flora Studio
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                  Bloom-first experiences for homes, gatherings & unforgettable gifting.
                </h1>
                <p className="text-lg md:text-xl text-charcoal-600 max-w-2xl">
                  Hand-tied stems, heirloom botanicals, and curated rituals arrive same-day in
                  climate-smart packaging, ready to wow every doorstep.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Link to="/products" className="btn-primary">
                  Shop the edit
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link to="/events" className="btn-secondary">
                  Events & installations
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-white/40">
                {heroHighlights.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center text-primary-500">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-charcoal-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="card overflow-hidden aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80"
                  alt="Floral arrangement"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-soft w-56">
                <p className="text-sm text-charcoal-500">This week’s muse</p>
                <p className="text-lg font-semibold text-charcoal-900">Sakura Reverie</p>
                <p className="text-sm text-primary-500 font-medium">52 stems curated</p>
              </div>
              <div className="absolute -top-6 -right-4 bg-primary-600 text-white rounded-3xl p-5 shadow-glow">
                <p className="text-xs uppercase tracking-wide">Flora loyalty</p>
                <p className="text-3xl font-display leading-tight">+420</p>
                <p className="text-sm text-white/80">members gifted today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <LuTruck className="text-2xl" />,
              title: 'Concierge delivery',
              copy: 'Temperature-controlled vans & live tracking window.',
            },
            {
              icon: <LuShieldCheck className="text-2xl" />,
              title: 'Artisan guarantee',
              copy: 'Handled by in-house florists—never outsourced.',
            },
            {
              icon: <LuLeaf className="text-2xl" />,
              title: 'Sustainable sourcing',
              copy: 'Certified growers & recyclable luxe packaging.',
            },
          ].map((service) => (
            <div key={service.title} className="card card-hover p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
                {service.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-charcoal-500">{service.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="chip mb-3">
              <LuSprout />
              Curated by Flora stylists
            </p>
            <h2 className="text-4xl font-semibold">Studio collections</h2>
            <p className="text-charcoal-500">
              Signature capsules for weddings, corporate gifting, and elevated daily rituals.
            </p>
          </div>
          <Link to="/events" className="btn-outline">
            Explore installations
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {houseCollections.map((collection) => (
            <article key={collection.title} className="card card-hover overflow-hidden">
              <div className="h-72 overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="chip">{collection.accent}</span>
                <h3 className="text-2xl font-semibold">{collection.title}</h3>
                <p className="text-charcoal-500">{collection.description}</p>
                <button className="btn-soft text-primary-600 font-semibold">
                  View capsule <FiArrowRight className="inline ml-2" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <p className="chip mx-auto w-fit">
            <LuFlower2 />
            In-demand this week
          </p>
          <h2 className="text-4xl font-semibold">Featured botanicals</h2>
          <p className="text-charcoal-500 max-w-2xl mx-auto">
            Handpicked by our lead florists: seasonal stems, limited artist collaborations, and
            cult-favorite subscriptions.
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <p className="font-medium text-charcoal-600">No featured products available</p>
          </div>
        )}

        <div className="text-center">
          <Link to="/products" className="btn-primary">
            View all creations
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card card-hover p-10 md:p-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <p className="uppercase tracking-[0.3em] text-white/80 text-xs">Flora membership</p>
            <h2 className="text-3xl md:text-4xl font-semibold">
              Build your personalized bloom plan & unlock members-only tastings.
            </h2>
            <p className="text-lg text-white/85">
              Complimentary concierge, early access to artist capsules, and 2-hour delivery perks.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary bg-white text-primary-600 hover:text-white">
                Become a member
              </Link>
              <Link to="/login" className="btn-secondary text-white border-white/40">
                I already have an account
              </Link>
            </div>
          </div>
          <LuFlower2 className="absolute -right-6 -bottom-6 text-white/20 text-[220px]" />
        </div>
      </section>
    </div>
  );
};

export default Home;
