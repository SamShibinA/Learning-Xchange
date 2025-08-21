import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  UserPlus, 
  UserCheck, 
  Video, 
  Star, 
  User, 
  MessageCircle, 
  Calendar, 
  CreditCard, 
  Users, 
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  
  const steps = [
    { icon: UserPlus, title: 'Sign Up', description: 'Create your account and join our learning community in seconds.', colorClass: 'step-blue-1' },
    { icon: UserCheck, title: 'Choose Role', description: 'Select whether you want to learn, teach, or do both on our platform.', colorClass: 'step-blue-2' },
    { icon: Video, title: 'Join Live Sessions', description: 'Connect with tutors or students through high-quality video calls.', colorClass: 'step-blue-3' },
    { icon: Star, title: 'Rate & Earn', description: 'Build your reputation through ratings and unlock premium features.', colorClass: 'step-blue-4' },
  ];

  const features = [
    { icon: User, title: 'Tutor Profiles', description: 'Create comprehensive profiles showcasing your expertise, qualifications, and teaching style.', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Profile Setup', 'Verification'] },
    { icon: Star, title: 'Free Sessions & Ratings', description: 'Start with free sessions to build your reputation and earn ratings that unlock premium features.', image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Reputation Building', '5-Star System'] },
    { icon: Video, title: 'Live Video Calls', description: 'High-quality video sessions with screen sharing, whiteboard, and interactive tools.', image: 'https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['WebRTC', 'Screen Share'] },
    { icon: MessageCircle, title: 'Real-time Chat', description: 'Instant messaging with file sharing, code snippets, and emojis.', image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Instant Messaging', 'File Sharing'] },
    { icon: Calendar, title: 'Smart Scheduling', description: 'Calendar integration with timezone support, reminders, and flexible booking.', image: 'https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Calendar Sync', 'Reminders'] },
    { icon: CreditCard, title: 'Secure Payments', description: 'Integrated payment system with multiple options, invoicing, and transparent fees.', image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400', tags: ['Secure', 'Multi-Payment'] },
  ];

  const stats = [
    { icon: Users, number: '10,000+', label: 'Active Users' },
    { icon: BookOpen, number: '5,000+', label: 'Expert Tutors' },
    { icon: TrendingUp, number: '95%', label: 'Success Rate' },
  ];

  const footerLinks = {
    Platform: ['How it Works', 'Pricing', 'Success Stories', 'Help Center'],
    Community: ['Find Tutors', 'Become a Tutor', 'Student Resources', 'Tutor Resources'],
    Company: ['About Us', 'Careers', 'Press', 'Blog'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
  ];

  return (
    <div className="homepage">
      <style>{`
        /* General */
        .homepage { font-family: 'Arial', sans-serif; background: #f9fafb; color: #1f2937; margin:0; padding:0; }
        h1,h2,h3,h4,h5,p { margin:0; padding:0; }

        /* Hero Section */
        .hero { background: linear-gradient(135deg, #2563eb, #3b82f6, #1d4ed8); color: white; padding: 4rem 2rem; }
        .hero-content { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; max-width: 1200px; margin:auto; gap:2rem; }
        .hero-text { flex:1 1 300px; text-align: left; }
        .hero-title { font-size: 3rem; font-weight: bold; background: linear-gradient(to right, white, #dbeafe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-subtitle { font-size: 1.5rem; font-weight: 300; margin: 1rem 0; }
        .hero-description { font-size: 1rem; line-height: 1.6; margin-bottom:1rem; }
        .hero-buttons { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary { background: white; color: #2563eb; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2);}
        .btn-secondary { background: transparent; border: 2px solid white; color: white; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px);}
        .hero-visual { flex:1 1 280px; display:flex; justify-content:center; align-items:center; position:relative; min-width:250px; }
        .hero-icon-bg { width: 14rem; height: 14rem; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin:auto; }
        .hero-icon-main { width: 3rem; height: 3rem; }
        .hero-icon-small { position: absolute; top: 1rem; right: 1rem; width: 2.5rem; height: 2.5rem; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; justify-content: center; align-items: center; }

        /* Steps Section */
        .how-it-works { padding: 4rem 2rem; text-align: center; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 2rem; margin-top: 2rem; }
        .step-card { background: white; padding: 2rem 1rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s; }
        .step-card:hover { box-shadow: 0 8px 12px rgba(0,0,0,0.15);}
        .step-icon { width: 4rem; height: 4rem; margin: -2rem auto 1rem auto; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; }
        .step-blue-1 { background-color: #2563eb; }
        .step-blue-2 { background-color: #3b82f6; }
        .step-blue-3 { background-color: #60a5fa; }
        .step-blue-4 { background-color: #93c5fd; }

        /* Features Section */
        .features { padding: 4rem 2rem; text-align: center; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .feature-card { display: flex; flex-direction: column; background: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s; }
        .feature-card:hover { transform: translateY(-5px); }
        .feature-card img { width: 100%; object-fit: cover; max-height:200px; }
        .feature-content { padding: 1rem; flex: 1; }
        .feature-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top:0.5rem; }
        .feature-tag { background: #dbeafe; color: #2563eb; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; }
        .feature-icon { width: 3rem; height: 3rem; background: #2563eb; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 0.5rem; }

        /* Stats & CTA */
        .cta { padding: 4rem 2rem; background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; text-align: center; }
        .stats-grid { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .stat-card { background: rgba(59,130,246,0.3); backdrop-filter: blur(5px); padding: 2rem; border-radius: 1rem; text-align: center; }

        /* Footer */
        .footer { background: #111827; color: white; padding: 4rem 2rem; display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; }
        .footer-inner { display: flex; flex-wrap: wrap; max-width: 1200px; width: 100%; justify-content: space-between; gap: 2rem; }
        .footer-brand { flex: 1 1 250px; min-width: 200px; }
        .footer-links { flex: 1 1 150px; min-width: 120px; }
        .footer-links h4 { font-weight: 600; margin-bottom: 0.5rem; }
        .footer-links ul { list-style:none; padding:0; }
        .footer-links ul li { margin:0.25rem 0; }
        .footer-links ul li a { color: #9ca3af; text-decoration:none; transition: color 0.2s; }
        .footer-links ul li a:hover { color: #3b82f6; }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-title { font-size: 2.5rem; }
          .hero-subtitle { font-size: 1.3rem; }
          .hero-icon-bg { width: 12rem; height: 12rem; }
          .hero-icon-main { width: 2.5rem; height: 2.5rem; }
        }
        @media (max-width: 768px) {
          .hero-content { flex-direction: column; text-align:center; }
          .hero-visual { margin-top:2rem; }
          .features-grid { grid-template-columns: 1fr; }
          .hero-icon-bg { width: 10rem; height: 10rem; }
          .hero-icon-main { width: 2rem; height: 2rem; }
          .hero-icon-small { width: 2rem; height: 2rem; top: 0.5rem; right: 0.5rem; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 2rem; }
          .hero-subtitle { font-size: 1.1rem; }
          .hero-description { font-size: 0.9rem; }
          .btn-primary, .btn-secondary { padding: 0.5rem 1.5rem; }
          .hero-icon-bg { width: 8rem; height: 8rem; }
          .hero-icon-main { width: 1.5rem; height: 1.5rem; }
          .hero-icon-small { width: 1.5rem; height: 1.5rem; }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">LearningXchange</h1>
            <h2 className="hero-subtitle">Connect, Learn, and Grow Together</h2>
            <p className="hero-description">
              Join our smart knowledge exchange platform where learners and tutors connect
              through live sessions, build reputations, and grow together.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary"  onClick={() => navigate('/auth')}>Get Started</button>
              <button className="btn-secondary" onClick={() => navigate('/auth')}>Login</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-icon-bg"><BookOpen className="hero-icon-main"/></div>
            <div className="hero-icon-small"><TrendingUp className="hero-icon-main"/></div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p>Get started with LearningXchange in four simple steps.</p>
        <div className="steps-grid">
          {steps.map((step,i)=> {
            const Icon = step.icon;
            return (
              <div className="step-card" key={i}>
                <div className={`step-icon ${step.colorClass}`}><Icon/></div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Powerful Features</h2>
        <div className="features-grid">
          {features.map((f,i)=> {
            const Icon = f.icon;
            return (
              <div className="feature-card" key={i}>
                <img src={f.image} alt={f.title}/>
                <div className="feature-content">
                  <div className="feature-icon"><Icon/></div>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                  <div className="feature-tags">
                    {f.tags.map(tag=><span className="feature-tag" key={tag}>{tag}</span>)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="stats-grid">
          {stats.map((stat,i)=>{
            const Icon = stat.icon;
            return (
              <div className="stat-card" key={i}>
                <Icon className="hero-icon-main"/>
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            )
          })}
        </div>
        <h2>Ready to Start Learning?</h2>
        <div className="hero-buttons" style={{justifyContent:'center'}}>
          <button className="btn-primary" onClick={() => navigate('/auth')}>Sign Up Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div style={{display:'flex', alignItems:'center', marginBottom:'1rem'}}>
              <BookOpen style={{marginRight:'0.5rem'}}/>
              <h3>LearningXchange</h3>
            </div>
            <p>Empowering learners and tutors worldwide through smart knowledge exchange. Join our community and discover the future of personalized learning.</p>
            <div style={{display:'flex', gap:'0.5rem', marginTop:'1rem'}}>
              {socialLinks.map((s,i)=>{
                const Icon=s.icon;
                return (
                  <a key={i} href={s.href} aria-label={s.label}><Icon/></a>
                )
              })}
            </div>
          </div>
          {Object.entries(footerLinks).map(([cat,links],i)=>(
            <div className="footer-links" key={i}>
              <h4>{cat}</h4>
              <ul>
                {links.map((link,j)=><li key={j}><a href="#">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}
