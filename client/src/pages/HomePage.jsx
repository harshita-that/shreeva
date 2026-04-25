import Navbar from '../components/Navbar'
import HeroBanner from '../components/HeroBanner'
import CategoryGrid from '../components/CategoryGrid'
import FeaturedProducts from '../components/FeaturedProducts'
import WhyUs from '../components/WhyUs'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyUs />
      <Footer />
    </div>
  )
}
