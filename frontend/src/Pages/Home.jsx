import { Link } from "react-router";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-badge">A safe space for parents</div>

        <h1>Parenting is hard. You don't have to do it alone.</h1>

        <p>
          Connect with parents who understand what you're going through. Share
          experiences, ask questions, and find support from a community that
          truly gets it.
        </p>

        <div className="hero-buttons">
          <Link to="/community" className="hero-button">
            Join the Community
          </Link>

          <Link to="/community" className="hero-button secondary">
            Explore Discussions
          </Link>
        </div>
      </section>

      <section className="stats-section">
        <div>
          <h3>❤️</h3>
          <p>Parent to Parent Support</p>
        </div>

        <div>
          <h3>🌱</h3>
          <p>Shared Experiences</p>
        </div>

        <div>
          <h3>🤖</h3>
          <p>24/7 Parenting Assistant</p>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Community Support</h3>
          <p>Connect with parents facing similar challenges.</p>
        </div>

        <div className="feature-card">
          <h3>Anonymous Whispers</h3>
          <p>Share sensitive concerns in a safe space.</p>
        </div>

        <div className="feature-card">
          <h3>Parenting Resources</h3>
          <p>Access helpful guidance, tools, and shared experiences.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
