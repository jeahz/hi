import '../App.css';
import HeroSection from '../components/HeroSection/HeroSection';
import Cards from '../components/Cards/Cards';
import './Home.css'

const Home = () => {
  return (
    <>
    <div className="home">
    <HeroSection/> 
    <Cards/>
    </div>
    </>
    )
}

export default Home;
