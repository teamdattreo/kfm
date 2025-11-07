import React from 'react'
import Header from '../components/Header'
import bghome from '../assets/aboutus.jpg'
import { useState } from 'react'
import featureIcon from '../assets/dilojan.png'; // replace with your actual image path


const Portfolio = () => {
  const [bannerUrl, setBannerUrl] = useState(bghome);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBannerUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Section 1 - Hero Split Screen */}
      <div className="relative w-full h-screen flex flex-col overflow-hidden bg-black">
  {/* Top Half - Image */}
  <div className="w-full h-[60%] relative">
    {bannerUrl ? (
      <div 
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      />
    ) : (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <span className="text-white">No Banner Selected</span>
      </div>
    )}
    {/* Subtle vignette effect */}
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
  </div>

  {/* Bottom Half - Content */}
  <div className="w-full h-[40%] bg-black relative">
    <div className="h-full flex flex-col items-center justify-center p-6 relative z-10">
      <div className="text-center mb-4">
        <p className="text-white text-2xl font-light mb-1">
          Capturing Your
        </p>
        <p className="text-amber-400 text-3xl font-semibold">
          Precious Moments
        </p>
      </div>
      
      {/* Social links/contact */}
      <div className="flex space-x-4 mt-4">
        {['instagram', 'facebook', 'pinterest'].map((social) => (
          <a key={social} href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
            <span className="sr-only">{social}</span>
            {/* Replace with actual icons */}
            <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
          </a>
        ))}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-8 left-8 opacity-20">
        <div className="w-16 h-16 border border-amber-400 rounded-full"></div>
      </div>
      <div className="absolute top-8 right-8 opacity-20">
        <div className="w-10 h-10 border border-white rounded-full"></div>
      </div>
    </div>
    
    {/* Gradient divider */}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
    
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: 'linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }}></div>
  </div>
  
  {/* Centered Circle with Logo */}
  <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
    <div className="relative">
      <div className="w-28 h-28 rounded-full border-4 border-white bg-black flex items-center justify-center shadow-xl hover:shadow-amber-400/30 transition-all duration-300">
        <div className="text-center">
          <div className="text-xl font-extrabold">
            <span style={{ color: '#FFCF40' }}>KFM</span>
          </div>
          <div className="text-xs text-white mt-1">STUDIO</div>
        </div>
      </div>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-amber-400 opacity-0 hover:opacity-20 blur-md transition-opacity duration-300 -z-10"></div>
    </div>
  </div>
  
  {/* Decorative floating dots */}
  <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full opacity-70"></div>
  <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-50"></div>
</div>

      {/* Section 2 - Portfolio */}
      <div className="bg-black py-20 px-4 sm:px-6 lg:px-8 relative z-0">
        <div className="max-w-6xl mx-auto">
          {/* Portfolio Header */}
          <div className="text-center mb-16">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <div className="relative inline-block">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  The Perfect Package for Your <span className="text-amber-400">Precious</span> Moments
                </h1>
                <div className="absolute bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              </div>
            </div>

            <div className="relative z-20 my-10">
              <div className="absolute inset-0 flex justify-center">
                <div className="bg-amber-500/20 blur-3xl w-1/2 h-16 rounded-full"></div>
              </div>

              <div className="flex justify-center px-4">
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-gray-900 px-8 py-5 rounded-xl shadow-2xl border border-amber-300/30 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-amber-500/20 hover:shadow-lg max-w-2xl w-full group">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer pointer-events-none"></div>
                  </div>

                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-amber-200/20 pointer-events-none transition-all duration-500"></div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-3 text-center">
                    <span className="text-4xl font-bold tracking-tighter drop-shadow-md">300+</span>
                    <span className="text-xl font-semibold uppercase tracking-wider text-amber-100 drop-shadow-sm">Successful Orders</span>
                    <div className="hidden md:block ml-4 h-10 w-px bg-gradient-to-b from-transparent via-amber-300/60 to-transparent"></div>
                    <span className="text-sm font-medium text-amber-100/90">Trusted by customers worldwide</span>
                  </div>

                  <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-1 h-1 bg-white/80 rounded-full animate-float"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${i * 2}s`,
                          animationDuration: `${10 + Math.random() * 10}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <section className="mb-24">
  <h2 className="text-3xl font-bold mb-8 text-white">Our Work</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Portfolio Image 1 */}
    <div key={1} className="group relative overflow-hidden rounded-lg h-64">
    
        <img
          src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/520604721_1344334017697522_197131035733168574_n.jpg?stp=c341.0.1366.1366a_dst-jpg_s640x640_tt6&_nc_cat=109&ccb=1-7&_nc_sid=92e838&_nc_eui2=AeFZAOX2CPYHPEtYAHfFhXdlcy2_-ldjOypzLb_6V2M7Kg2g-jWkmnn2R2zONmSyPnumu08_qvQVp9pzGwF0dOk0&_nc_ohc=OErMQeZafbcQ7kNvwFXppfM&_nc_oc=AdmjBM-zgc0OYE3EIm6p7oj_BiVD_jqC17RuCtN6-JcX6Q26PIwz-ETMvBvAVkO4h0c&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=0NxybhG6QOD2WGF66K_35g&oh=00_AfYBWVzRzp4hx-V6bPiPhYRKvP5j-HVsuR45f3Ayk4lejQ&oe=68E15A4B"
          alt="Project 1"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      
    </div>

    {/* Portfolio Image 2 */}
    <div key={2} className="group relative overflow-hidden rounded-lg h-64">

        <img
          src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/506895073_1308050927992498_7929603859618652279_n.jpg?stp=c341.0.1366.1366a_dst-jpg_s640x640_tt6&_nc_cat=107&ccb=1-7&_nc_sid=92e838&_nc_eui2=AeGYl0KgVe3fwblWXd4-sgwzMaGH1sq3o3wxoYfWyrejfDcnu2muLYPHfz25aRmvXlSrZ-wgnxNbVDJi6GFkPVWg&_nc_ohc=X_r5HJLema8Q7kNvwFUioqc&_nc_oc=AdlQj4_B5qMOu6TdzR0PGf97gdI3sKmuEdzA3yxHbJ9DcCAdXR93OdDB4NFOmcGoACw&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=pjocO0TZroXD0Iil8T3UAg&oh=00_Afb3yprBDwgSinRwOedEdGD2ge7wzM9cXeRWf_WhvIbL3w&oe=68E17239"
          alt="Project 2"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
    
    </div>

    {/* Portfolio Image 3 */}
    <div key={3} className="group relative overflow-hidden rounded-lg h-64">
      
        <img
          src="https://z-p3-scontent.fcmb9-1.fna.fbcdn.net/v/t39.30808-6/502725665_1297228379074753_4301454013033470109_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHXPr26v6PxbSDVVFbMWYseiRko01QGMmSJGSjTVAYyZPn8vLIVRdYFzmsDQc81KpAvp90-pv7iDmgb2W8KcXM4&_nc_ohc=4t5W36GwjA8Q7kNvwEBVyx3&_nc_oc=AdlNWn6eW0A187q48gevxxJz4aXYN0XJYV2e3AS5OVS4USPFRVOWzfnbiVAtit4G21I&_nc_pt=1&_nc_zt=23&_nc_ht=z-p3-scontent.fcmb9-1.fna&_nc_gid=mjOUnYCNjRKCHe7HW5ddng&oh=00_AfeGFYKboAed0u4Wnl5oZleRjcDFzgE_Tb7k7DkRL5cw1w&oe=68E92953"
          alt="Project 3"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      
    </div>

    {/* Portfolio Image 4 */}
    <div key={4} className="group relative overflow-hidden rounded-lg h-64">
     
        <img
          src="https://z-p3-scontent.fcmb9-1.fna.fbcdn.net/v/t39.30808-6/500134679_1291869522943972_4867667890431532246_n.jpg?stp=c0.225.1366.1366a_cp6_dst-jpg_s640x640_tt6&_nc_cat=100&ccb=1-7&_nc_sid=92e838&_nc_eui2=AeEjJd9CCIGcJKFhnBS6cQpDVA2mVW31MtRUDaZVbfUy1PQFJyZseQvRBaOCtqerzEov3hNDpuhdEjxtjOFZ2lSq&_nc_ohc=csKZcCJUFGYQ7kNvwF83tXJ&_nc_oc=AdlWaYMrWOzdHD_dpEV_s59UvNkrosuikNI6ebu52ET4CI7cJp_25RF6LzZClQUfZfw&_nc_pt=1&_nc_zt=23&_nc_ht=z-p3-scontent.fcmb9-1.fna&_nc_gid=kM3h5KyjDhUc9AP0vJE2LQ&oh=00_AfcWkJeYfUK4LMgtE6GZjOG7MnbYxXPMvs96xvkT5oi6lA&oe=68E94A24"
          alt="Project 4"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
    
    </div>

    {/* Portfolio Image 5 */}
    <div key={5} className="group relative overflow-hidden rounded-lg h-64">
      
        <img
          src="https://z-p3-scontent.fcmb9-1.fna.fbcdn.net/v/t39.30808-6/497632684_1281690097295248_8782819037703080829_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeHjPsqVYNTNCZcKnFnZuQ3TXdBXk_pmwt9d0FeT-mbC37EkTgF7FM2bXansc_TkBCX3xh-8dv8qe65GOBGqH4S-&_nc_ohc=N4y8mUfKa5QQ7kNvwF63Y0V&_nc_oc=AdkdHO3KujQ8afTLy6nG6WpeP5_GNuR2weSXoEGnySjQss2Ph8_QjxehO3aLbE8JXcY&_nc_pt=1&_nc_zt=23&_nc_ht=z-p3-scontent.fcmb9-1.fna&_nc_gid=3koWjpz3mXAhQHsY0dPOLg&oh=00_Afdze3WfC174a3V7fEVIitxByf4V6sz3XVd4g6xUGmb8qw&oe=68E9394C"
          alt="Project 5"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      
    </div>

    {/* Portfolio Image 6 */}
    <div key={6} className="group relative overflow-hidden rounded-lg h-64">
        
        <img
          src="https://z-p3-scontent.fcmb9-1.fna.fbcdn.net/v/t39.30808-6/491929531_1263827892414802_2552556154320893587_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeE7RxCW1ApVMYNajYiKeBRCo817JVEltlCjzXslUSW2UPrP991JZ9PqKgDKupZY3pNclTbNwloGw6gKoTaymqOg&_nc_ohc=e9DoYeGZQKIQ7kNvwGqFQD2&_nc_oc=Adlk1fTfiCB8NnbBZBZe4yei_hVapPe6ezt-Pst8l6zvvKRxM5zgh4WKEIawZFsQo7I&_nc_pt=1&_nc_zt=23&_nc_ht=z-p3-scontent.fcmb9-1.fna&_nc_gid=XttlsqMmjuRS_Qwn4uk7Wg&oh=00_AfeqCLN5yCx5zjmjD37QKr8yr4RDoEgUqJ-KXtjEcxh_Mg&oe=68E93E5C"
          alt="Project 6"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      
    </div>
  </div>
</section>

        </div>
      </div>

      {/* Section 3 */}
      <div className="bg-[#1a1a1a] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="mb-24 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Let's Create <br />
              <span className="text-amber-400">Something Beautiful</span> Together
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Capturing your most precious moments with artistry and passion
            </p>
          </section>

          {/* Story Section */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-8 text-white">Our Studio Story</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <p className="text-lg leading-relaxed mb-6 text-gray-300">
                  Founded with a passion for authentic storytelling, Studio KFM began as a vision to capture life's unscripted beauty. What started with a single camera has grown into a celebrated studio specializing in weddings, portraits, and editorial work.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                  We believe every photograph should evoke emotion, every session should feel effortless, and every client should receive images they'll treasure for generations.
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 flex flex-col md:flex-row gap-6">
               <div className="w-full md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-amber-500/20 to-amber-600/30 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
  <img 
    src={featureIcon} 
    alt="Feature Icon" 
    className="w-full h-full object-cover rounded-lg" 
  />
</div>

                
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-semibold mb-4 text-white">Our Approach</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start text-gray-300">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>Authentic, emotion-driven photography</span>
                    </li>
                    <li className="flex items-start text-gray-300">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>Tailored experiences for every client</span>
                    </li>
                    <li className="flex items-start text-gray-300">
                      <span className="text-amber-400 mr-2">•</span>
                      <span>Artistic excellence in every frame</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          {/* <section className="mb-24">
            
            <div
            className="absolute opacity-40 rounded-full blur-2xl"
            style={{
              backgroundColor: '#BF9B30',
              width: '250px',
              height: '250px',
              top: '2400px',
              left: '-80px',
              zIndex: 0,
            }}
            ></div>

            <div
            className="absolute opacity-40 rounded-full blur-2xl"
            style={{
              backgroundColor: '#BF9B30',
              width: '250px',
              height: '250px',
              top: '2400px',
              left: '-80px',
              zIndex: 0,
            }}
            ></div>

            
            <div
            className="absolute opacity-70 rounded-full blur-3xl"
            style={{
              backgroundColor: '#BF3030',
              width: '250px',
              height: '250px',
              bottom: '900px',
              right: '-80px',
              zIndex: 0,
            }}
            ></div>

            <div
            className="absolute opacity-70 rounded-full blur-3xl"
            style={{
              backgroundColor: '#BF3030',
              width: '250px',
              height: '250px',
              bottom: '900px',
              right: '-80px',
              zIndex: 0,
            }}
            ></div>

            <h2 className="text-3xl font-bold mb-8 text-white">By The Lens</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
                <p className="text-4xl font-bold text-amber-400 mb-2">500+</p>
                <p className="text-gray-300">Weddings Captured</p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
                <p className="text-4xl font-bold text-amber-400 mb-2">1k+</p>
                <p className="text-gray-300">Portrait Sessions</p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
                <p className="text-4xl font-bold text-amber-400 mb-2">10k+</p>
                <p className="text-gray-300">Photos Delivered</p>
              </div>
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
                <p className="text-4xl font-bold text-amber-400 mb-2">100%</p>
                <p className="text-gray-300">Client Satisfaction</p>
              </div>
            </div>
          </section> */}

          <section className="mb-24 relative overflow-hidden py-16">
          {/* Content container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className='text-center mb-16'>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why choose <span className='text-amber-400'>Us</span>
              </h2>
              <div className="w-24 h-1 bg-amber-400 mx-auto"></div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group relative p-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 overflow-hidden">
                {/* Glow effect container (hidden by default) */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  {/* Glow effect (becomes visible on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  
                  {/* Subtle shimmer animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-700 w-[200%] animate-shimmer"></div>
                </div>
                
                {/* Border glow (appears on hover) */}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-amber-400/30 transition-all duration-500 pointer-events-none"></div>

                <div className="relative z-10">
                  <p className="text-5xl font-bold text-amber-400 mb-4 group-hover:text-amber-300 transition-colors duration-300">300+</p>
                  <p className="text-white text-2xl font-semibold mb-4 group-hover:text-gray-100 transition-colors duration-300">Projects</p>
                  <p className='text-gray-300 text-sm tracking-wider leading-relaxed group-hover:text-gray-200 transition-colors duration-300'>
                    Successfully completed 300+ projects with passion and precision — capturing timeless memories for happy clients.
                  </p>
                </div>
              </div>

              <div className="group relative p-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 overflow-hidden">
                {/* Glow effect container */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  {/* Gradient glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  
                  {/* Shimmer animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-700 w-[200%] animate-shimmer"></div>
                </div>
                
                {/* Border glow */}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-amber-400/30 transition-all duration-500 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                  <p className="text-5xl font-bold text-amber-400 mb-4 group-hover:text-amber-300 transition-colors duration-300">100%</p>
                  <p className="text-white text-2xl font-semibold mb-4 group-hover:text-gray-100 transition-colors duration-300">Client Satisfaction</p>
                  <p className='text-gray-300 text-sm tracking-wider leading-relaxed group-hover:text-gray-200 transition-colors duration-300'>
                    Our top priority is your complete satisfaction — we deliver quality, creativity, and care in every shot.
                  </p>
                </div>
              </div>

              <div className="group relative p-8 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 overflow-hidden">
                {/* Glow effect container */}
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  {/* Gradient glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  
                  {/* Shimmer animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-700 w-[200%] animate-shimmer"></div>
                </div>
                
                {/* Border glow */}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-amber-400/30 transition-all duration-500 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                  <p className="text-5xl font-bold text-amber-400 mb-4 group-hover:text-amber-300 transition-colors duration-300">Premium</p>
                  <p className="text-white text-2xl font-semibold mb-4 group-hover:text-gray-100 transition-colors duration-300">Products</p>
                  <p className='text-gray-300 text-sm tracking-wider leading-relaxed group-hover:text-gray-200 transition-colors duration-300'>
                    We provide only premium quality products — from prints to frames — ensuring vibrant detail that lasts.
                  </p>
                </div>
              </div> 
            </div>
          </div>
        </section>

          {/* Achievement Section */}
          <div className="bg-black py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute opacity-20 rounded-full blur-3xl" style={{
                background: 'radial-gradient(circle, #BF9B30 0%, transparent 70%)',
                width: '500px',
                height: '500px',
                top: '-200px',
                left: '-200px',
              }}></div>
              <div className="absolute opacity-20 rounded-full blur-3xl" style={{
                background: 'radial-gradient(circle, #BF3030 0%, transparent 70%)',
                width: '600px',
                height: '600px',
                bottom: '-300px',
                right: '-200px',
              }}></div>
            </div>

            <div className="text-center mb-12 max-w-4xl mx-auto relative z-10">
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Our <span className="text-amber-400">Cinematic Journey</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg font-light tracking-wider leading-relaxed">
                Celebrating milestones that define our passion for visual storytelling
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative z-10">
              <div className="group relative overflow-hidden rounded-lg border border-gray-800 hover:border-amber-500/30 transition-all">
  <a
    href="https://www.facebook.com/share/v/1ZGLH3tSXY/"
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <img
      src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/539101294_1377222224408701_1072061243269743414_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeG1m3PTR5kpwEBQ8vKDmPW4um30IyNaQDG6bfQjI1pAMbOj6ZYL1OE_5wBEfhqAKrfGKlIb-SwA9yEPsDv6oo7J&_nc_ohc=qMjCLDqx2mcQ7kNvwGtQL5R&_nc_oc=AdmqhZT_dsWmujgQ6_mS5Z0yXfEyK8-KimVhmHzl8NvVpUvs9EVhw1cs6xl_UEtLcZo&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=aLb3tv1biF3UGQT7Adt2-Q&oh=00_AfZzGgcN0xKdJlnQQzsIW3umoSIuQqbzTVTBtiJ1n7Ryaw&oe=68E00AC4"
      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
      alt="Feature Film Production"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3 className="text-white text-xl font-bold mb-1">"𝐑𝐈𝐋𝐀𝐊𝐒𝐇𝐀𝐍 ❤ 𝐊𝐈𝐒𝐇𝐀𝐍𝐔𝐊𝐀"</h3>
      <p className="text-amber-400 text-sm font-medium">2025 Feature Film</p>
      <p className="text-gray-300 text-sm mt-2">
        4K cinematic masterpiece 
      </p>
    </div>
  </a>
</div>


              <div className="group relative overflow-hidden rounded-lg border border-gray-800 hover:border-amber-500/30 transition-all">
  <a
    href="https://www.facebook.com/share/v/1B95szcohs/"
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <img
      src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/492366134_1262544052543186_3958375574042094829_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGLbdSYjeaeeUu83eIUxbWQWzEsrOUHRyRbMSys5QdHJOQFWulDFYa2B_4eqlFX0egrBXNCeq0DefzEXsJ7Fp7N&_nc_ohc=35gbry77Kg8Q7kNvwFvc6aR&_nc_oc=AdlX62-8Jgd8qTyMAt_0uXItVpM-5doIqvDGC1IoPVJTP3HyAuo2QQG-qtgM1UaUEng&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=RqoV0BkTmK1976ISelb0AQ&oh=00_AfaUmRiH7tyz85L-ncBODxbZrO4F3G-npvGRGItoVA7V-Q&oe=68E05A94"
      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
      alt="Feature Film Production"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3 className="text-white text-xl font-bold mb-1">𝓢𝓪𝓷𝓳𝓮𝓮𝓿 ❤ 𝓐𝓷𝓳𝓪𝓵𝓲</h3>
      <p className="text-amber-400 text-sm font-medium">𝗪𝗘𝗗𝗗𝗜𝗡𝗚 𝗣𝗥𝗘 𝗦𝗛𝗢𝗢𝗧</p>
      <p className="text-gray-300 text-sm mt-2">
        𝐊𝐀𝐍𝐆𝐀𝐋 𝐄𝐃𝐇𝐎...
      </p>
    </div>
  </a>
</div>


              <div className="group relative overflow-hidden rounded-lg border border-gray-800 hover:border-amber-500/30 transition-all">
  <a
    href="https://www.facebook.com/share/v/1B95szcohs/"
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <img
      src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/492366134_1262544052543186_3958375574042094829_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGLbdSYjeaeeUu83eIUxbWQWzEsrOUHRyRbMSys5QdHJOQFWulDFYa2B_4eqlFX0egrBXNCeq0DefzEXsJ7Fp7N&_nc_ohc=35gbry77Kg8Q7kNvwFvc6aR&_nc_oc=AdlX62-8Jgd8qTyMAt_0uXItVpM-5doIqvDGC1IoPVJTP3HyAuo2QQG-qtgM1UaUEng&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=RqoV0BkTmK1976ISelb0AQ&oh=00_AfaUmRiH7tyz85L-ncBODxbZrO4F3G-npvGRGItoVA7V-Q&oe=68E05A94"
      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
      alt="Feature Film Production"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3 className="text-white text-xl font-bold mb-1">𝓢𝓪𝓷𝓳𝓮𝓮𝓿 ❤ 𝓐𝓷𝓳𝓪𝓵𝓲</h3>
      <p className="text-amber-400 text-sm font-medium">𝗪𝗘𝗗𝗗𝗜𝗡𝗚 𝗣𝗥𝗘 𝗦𝗛𝗢𝗢𝗧</p>
      <p className="text-gray-300 text-sm mt-2">
        𝐊𝐀𝐍𝐆𝐀𝐋 𝐄𝐃𝐇𝐎...
      </p>
    </div>
  </a>
</div>

               <div className="group relative overflow-hidden rounded-lg border border-gray-800 hover:border-amber-500/30 transition-all">
  <a
    href="https://www.facebook.com/share/v/1B95szcohs/"
    target="_blank"
    rel="noopener noreferrer"
    className="block"
  >
    <img
      src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/492366134_1262544052543186_3958375574042094829_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGLbdSYjeaeeUu83eIUxbWQWzEsrOUHRyRbMSys5QdHJOQFWulDFYa2B_4eqlFX0egrBXNCeq0DefzEXsJ7Fp7N&_nc_ohc=35gbry77Kg8Q7kNvwFvc6aR&_nc_oc=AdlX62-8Jgd8qTyMAt_0uXItVpM-5doIqvDGC1IoPVJTP3HyAuo2QQG-qtgM1UaUEng&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=RqoV0BkTmK1976ISelb0AQ&oh=00_AfaUmRiH7tyz85L-ncBODxbZrO4F3G-npvGRGItoVA7V-Q&oe=68E05A94"
      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
      alt="Feature Film Production"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <h3 className="text-white text-xl font-bold mb-1">𝓢𝓪𝓷𝓳𝓮𝓮𝓿 ❤ 𝓐𝓷𝓳𝓪𝓵𝓲</h3>
      <p className="text-amber-400 text-sm font-medium">𝗪𝗘𝗗𝗗𝗜𝗡𝗚 𝗣𝗥𝗘 𝗦𝗛𝗢𝗢𝗧</p>
      <p className="text-gray-300 text-sm mt-2">
        𝐊𝐀𝐍𝐆𝐀𝐋 𝐄𝐃𝐇𝐎...
      </p>
    </div>
  </a>
</div>
            </div>
          </div>
        </div>
      </div>
      
      <hr className='h-[1px] w-full'/>
      
      {/* Footer */}
      <footer className="bg-black text-white pt-8 pb-12 px-4 sm:px-8 lg:px-16 relative overflow-hidden">  
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold tracking-wider mb-6">
              <span className="text-amber-400">Interested</span> in working together
            </h3>
            
            <div className="flex justify-center md:justify-start mb-6">
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-wider">CONTACT US</h2>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 tracking-wide mb-8">Get in touch with us</p>    
            <button className="px-8 py-3 bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-full font-medium transition-colors">
              Send a Message
            </button>
          </div>

          <div className="flex flex-col items-center justify-between">
            <div className="flex justify-center md:justify-start mb-6">
              <div className="relative">
                <div className="text-center">      
                  <div className="text-3xl font-bold mb-4">
                    <span className="text-amber-400">Studio</span>
                    <span className="text-white">KFM</span>         
                  </div>       
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
              </div>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="space-y-4">
              <div>
                <h4 className="text-amber-400 font-medium mb-1">Email</h4>
                <p className="text-gray-300">StudioKFM@gmail.com</p>
              </div>
              
              <div>
                <h4 className="text-amber-400 font-medium mb-1">Call us</h4>
                <p className="text-gray-300">021 222 2343</p>
              </div>
              
              <div>
                <h4 className="text-amber-400 font-medium mb-1">Follow us</h4>
                <p className="text-gray-300">@StudioKFM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Studio KFM. All rights reserved.
        </div>

        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute top-1/3 right-0 w-24 h-24 bg-red-500 rounded-full opacity-10 blur-xl"></div>
      </footer>
    </div>
  )
}

export default Portfolio