import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Benefit from './components/Benefit';
import HowItWorks from './components/HowItWork';
import FeaturesSection from './components/Feature';
import UserRolesSection from './components/UserRolesSection';
import RegistrationSteps from './components/RegistrationStep';
import ContactForm from './components/ContactForm';
import Hero from './components/Hero';

export default function Home() {
  return (
    <div className='bg-white overflow-hidden'>
      <Navbar />

      <main className="mx-auto max-w-[1220px] flex-grow space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div data-aos="fade-up">
          <Hero/>
        </div>
        <div data-aos="fade-right"><Benefit /></div>
        <div data-aos="fade-left"><HowItWorks /></div>
        <div data-aos="zoom-in"><FeaturesSection /></div>
        <div data-aos="fade-up"><UserRolesSection /></div>
        <div data-aos="fade-up"><RegistrationSteps /></div>
        <div data-aos="fade-up"><ContactForm /></div>
      </main>

      <Footer />
    </div>
  );
}