import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f3' }}>
      {/* Navigation */}
      <nav className="nav-glass" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff385c' }}>SkillBridge</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/student" 
                  style={{ padding: '10px 16px', borderRadius: '20px', backgroundColor: '#e5e5e0', color: '#211922', fontWeight: 500 }}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#e60023', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ padding: '10px 20px', borderRadius: '20px', color: '#211922', fontWeight: 500 }}>
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#e60023', color: 'white', fontWeight: 500 }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '56px', fontWeight: 700, color: '#211922', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Master Digital Skills
        </h1>
        <p style={{ fontSize: '18px', color: '#62625b', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Learn digital literacy, earn rewards, and build your future with SkillBridge.
        </p>
        
        {!isAuthenticated && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link 
              to="/register" 
              style={{ padding: '14px 28px', borderRadius: '24px', backgroundColor: '#e60023', color: 'white', fontWeight: 600, fontSize: '16px' }}
            >
              Explore now
            </Link>
            <Link 
              to="/login" 
              style={{ padding: '14px 28px', borderRadius: '24px', backgroundColor: '#e5e5e0', color: '#211922', fontWeight: 600, fontSize: '16px' }}
            >
              Log in
            </Link>
          </div>
        )}

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '60px' }}>
          <div className="card" style={{ textAlign: 'left', padding: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Learn New Skills</h3>
            <p style={{ color: '#62625b' }}>Access courses on digital literacy, programming, and more.</p>
          </div>
          <div className="card" style={{ textAlign: 'left', padding: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏆</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Earn Rewards</h3>
            <p style={{ color: '#62625b' }}>Collect points, badges, and certificates as you learn.</p>
          </div>
          <div className="card" style={{ textAlign: 'left', padding: '24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🤝</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Get Sponsored</h3>
            <p style={{ color: '#62625b' }}>Apply for NGO sponsorship to fund your education.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#f6f6f3', padding: '32px 16px', textAlign: 'center', borderTop: '1px solid #e5e5e0' }}>
        <p style={{ color: '#91918c', fontSize: '14px' }}>© 2024 SkillBridge. All rights reserved.</p>
      </footer>
    </div>
  );
}