# GameDtrsh - Premium Dropshipping Landing Pages

A modern, responsive landing page system for GameDtrsh dropshipping store with 3D animations, interactive world map, and country-specific pages for Egypt, Saudi Arabia, and UAE.

## 🌟 Features

### Global Features
- **3D Product Animations** - Interactive Three.js powered 3D product showcase with rotating geometric shapes
- **Responsive Design** - Fully responsive across all devices (mobile, tablet, desktop)
- **Modern UI** - Beautiful gradient backgrounds with glassmorphism effects
- **Smooth Animations** - CSS and JavaScript animations for enhanced user experience
- **Country Selector** - Easy navigation between regional stores
- **Product Grid** - Showcase of featured products across categories

### Country-Specific Pages
Each country page includes:
- Localized content (Arabic interface)
- Regional color themes
- Local city delivery information
- Country-specific shipping details
- Local payment methods information
- Regional customer support highlights

#### Egypt (🇪🇧)
- **URL**: https://egypt.gamedtrsh.com
- **Theme**: Red gradient (#FF6B6B - #D63031)
- **Cities**: Cairo, Alexandria, Giza, Port Said, Aswan, Luxor
- **Features**: Same-day delivery in select areas, Free shipping for orders 500+ EGP

#### Saudi Arabia (🇸🇦)
- **URL**: https://saudia.gamedtrsh.com
- **Theme**: Green gradient (#1ABC9C - #16A085)
- **Cities**: Riyadh, Jeddah, Medina, Dammam, Diriyah, Taif
- **Features**: Fast delivery, Secure payment options, 24/7 Arabic customer support

#### UAE (🇦🇪)
- **URL**: https://uae.gamedtrsh.com
- **Theme**: Orange gradient (#F39C12 - #E67E22)
- **Cities**: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Umm Al Quwain
- **Features**: Same-day delivery, Premium products, 30-day money-back guarantee

## 📁 File Structure

```
.
├── index.html              # Main global landing page
├── egypt.html              # Egypt-specific page
├── saudia.html             # Saudi Arabia-specific page
├── uae.html                # UAE-specific page
├── js/
│   └── 3d-animation.js     # Three.js 3D animation engine
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL support
- Internet connection (for Three.js CDN)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/megastorages/gamedtrsh.git
cd gamedtrsh
```

2. Deploy to your hosting service or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using Ruby
ruby -run -ehttpd . -p8000
```

3. Open in browser:
- Main: `http://localhost:8000/index.html`
- Egypt: `http://localhost:8000/egypt.html`
- Saudi Arabia: `http://localhost:8000/saudia.html`
- UAE: `http://localhost:8000/uae.html`

## 🎨 Customization

### Color Themes
Each page has its own gradient theme. To customize colors:

1. **Global Landing Page**: Edit the gradient in `index.html` (line ~25)
2. **Egypt Page**: Lines ~25-27 in `egypt.html` (Red theme)
3. **Saudi Page**: Lines ~25-27 in `saudia.html` (Green theme)
4. **UAE Page**: Lines ~25-27 in `uae.html` (Orange theme)

### 3D Animation
Modify the 3D animation in `js/3d-animation.js`:
- **Product shapes**: Edit `productGeometries` array (line ~87)
- **Animation speed**: Adjust `rotationSpeed` object (line ~123)
- **Colors**: Modify `colors` array (line ~113)
- **Particle effects**: Configure particle settings (lines ~130-160)

### Product Categories
Update the featured products section in each HTML file:
```html
<div class="product-card">
    <div class="product-image">EMOJI_HERE</div>
    <div class="product-info">
        <h4>Category Name</h4>
        <p class="product-price">From $XX.XX</p>
    </div>
</div>
```

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, transitions, and animations
- **JavaScript (ES6+)**: Interactive functionality
- **Three.js**: 3D graphics and animations
- **Responsive Design**: Mobile-first approach

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers with WebGL support

## 🎯 Performance Optimization

- Minified CSS and JavaScript (recommended for production)
- CDN for Three.js library
- Optimized animations using requestAnimationFrame
- Lazy loading support for images/products

## 🌐 Deployment

### GitHub Pages
```bash
git push origin landing-page
# Configure GitHub Pages in repository settings
```

### Netlify
```bash
# Deploy from branch in Netlify dashboard
netlify deploy --prod
```

### Vercel
```bash
vercel --prod
```

### Custom Domain Setup
Configure DNS records to point to:
- `egypt.gamedtrsh.com` → Deploy instance
- `saudia.gamedtrsh.com` → Deploy instance
- `uae.gamedtrsh.com` → Deploy instance

## 📊 SEO & Analytics

Add Google Analytics or Matomo for tracking:
```html
<!-- Add to head section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test on multiple devices
4. Submit a pull request

## 📝 License

This project is proprietary software. All rights reserved © 2026 GameDtrsh.

## 📞 Support

For issues or questions:
- Email: support@gamedtrsh.com
- GitHub Issues: Create an issue in this repository

## 🔐 Security

- Always use HTTPS for production
- Validate all user inputs
- Keep dependencies updated
- Use environment variables for sensitive data

## 📈 Future Enhancements

- [ ] Shopping cart functionality
- [ ] User authentication system
- [ ] Product search and filtering
- [ ] Customer reviews section
- [ ] Live chat support
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Advanced 3D product visualization

---

**Last Updated**: May 31, 2026  
**Version**: 1.0.0  
**Maintained by**: megastorages
