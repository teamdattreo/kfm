import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import VerificationSuccess from './pages/VerificationSuccess';
import VerificationFailed from './pages/VerificationFailed';
import ExpenseManagement from './admin/ExpenseManagement';
import Banners from './admin/Banners';
import { GoogleOAuthProvider } from "@react-oauth/google";
import ContactUs from './pages/contactUs';
import Addform from './Packages/Addform';
import PackagesPage from './Packages/PackagesPage';
import EditPackagePage from './Packages/EditPackagePage';
import ClientPackagesPage from './Packages/ClientPackagesPage';
import ProductsPage from './Packages/ProductsPage';
import EditProductPage from './Packages/EditProductPage';
import ClientProductsPage from './Packages/ClientProductsPage';
import AddBannerPage from './Banner/AddBanner';
import BannerShowPage from './Banner/BannerShowPage';
import AdminBannerPage from './Banner/AdminBannerPage';
import EditBanner from './Banner/EditBanner';
import Portfolio from './Portfolio/Portfolio';
import UserHomePage from './UserView/UserHomePage';
import Booking from './pages/Booking'
import Gallery from './pages/Gallery'
import AdminGalleryUpload from './pages/AdminGalleryUpload';
import AdminGalleryUploadTable from './pages/AdminGalleryTable';
import AdminProfile from './admin/AdminProfile';
import AdminUsersPage from './admin/AdminUserPage';
import UserHomeBannerUpload from './admin/UserHomeBannerUpload';
import AddPromotion from './Promotion/AddPromotion';
import Promotions from './Promotion/Promotions';
import Apps from './Promotion/app';
import AdminPromotions from './Promotion/AdminPromotions';
import BookingDetailsPage from './Booking/BookingDetailsPage';
import BookingDetailsPageLanding from './Booking/BookingDetailsPageLanding ';
import UpdateBookingPage from './Booking/UpdateBookingPage';
import UserBookingsPage from './Booking/UserBookingPage';
import WeddingBookingForm from './Booking/WeddingBookingForm';
import BirthdayBookingForm from './Booking/BirthdayBookingForm';
import PubertyBookingForm from './Booking/PubertyBookingForm';
import Contact from './pages/Contact';

function App() {
  // Vite uses import.meta.env instead of process.env
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Add error handling in case the ID is missing
  if (!googleClientId) {
    console.error("Google Client ID is missing - check your .env file");
    return <div>Configuration Error: Missing Google Client ID</div>;
  }

  return (
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
<BrowserRouter>
        <Routes>    

            <Route path='/' element={<Home />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/Profile' element={<Profile />} />
           
            <Route path="/verification-success" element={<VerificationSuccess />} />
            <Route path="/verification-failed" element={<VerificationFailed />} />   
           
               
            <Route path='/Packages'element={<ClientPackagesPage/>}/>     
            


            <Route path='/EditProduct/:id'element={<EditProductPage/>}/>  

            <Route path='/AdminBannerPage'element={<AdminBannerPage/>}/> 
            <Route path='/Gallery' element={<Gallery/>} />
            <Route path='/AdminGallery' element={<AdminGalleryUpload/>} />
            <Route path='/AdminGalleryUpload' element={<AdminGalleryUpload/>} />
            <Route path='/AdminGalleryUploadTable' element={<AdminGalleryUploadTable/>} />
            <Route path="/Promotions" element={<Promotions />} /> 
            <Route path="/promo" element={<Apps />} /> 
            <Route path="/AdminProfile" element={<AdminProfile />} />  
            <Route path="/AdminUsersPage" element={<AdminUsersPage />} /> 
            <Route path="/AdminPromo" element={<AdminPromotions />} />     
            <Route path='/Addform'element={<Addform/>}/>
            <Route path='/ProductsPage'element={<ProductsPage/>}/> 
            <Route path='/Products'element={<ClientProductsPage/>}/> 
            <Route path='/AddBannerPage'element={<AddBannerPage/>}/> 
            <Route path='/BannerShowPage'element={<BannerShowPage/>}/>                 
            <Route path="/Editbanner/:id" element={<EditBanner />} /> 
            <Route path="/verification-failed" element={<VerificationFailed />} />
            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/ExpenseManagement" element={<ExpenseManagement/>} />
            <Route path='/PackagesPage'element={<PackagesPage/>}/>   

            <Route path="/Portfolio" element={<Portfolio />} />


            <Route path="/UserHomePage" element={<UserHomePage />} />
            <Route path="/verification-failed" element={<VerificationFailed />} />
            <Route path="/contactUs" element={<ContactUs />} />
             <Route path="/contact" element={<Contact />} />


            <Route path='/Booking' element={<Booking />}/>
            <Route path="/AddPromotion" element={<AddPromotion />} />


          
                   
            <Route path="/verification-failed" element={<VerificationFailed />} />
            <Route path="/contactUs" element={<ContactUs />} />
               
           


        
             
              
            
        
            <Route path='/EditPackage/:id'element={<EditPackagePage/>}/> 
            <Route path="/Banners" element={<Banners />} />
            <Route path="/UserHomeBannerUpload" element={<UserHomeBannerUpload />} /> 
            <Route path="/BookingHistory" element={<UserBookingsPage />} /> 
            <Route path="/BookingDetailsPage" element={<BookingDetailsPageLanding />} />
            <Route path="/BookingDetailsPage/:eventType" element={<BookingDetailsPage />} />
            <Route path="/BookingDetailsPage/:eventType/:bookingId" element={<BookingDetailsPage />} />
            <Route path="/updateBooking/:eventType/:bookingId" element={<UpdateBookingPage />} />
            <Route path="/WeddingBookingForm" element={<WeddingBookingForm />} />
            <Route path="/BirthdayBookingForm" element={<BirthdayBookingForm />} />
            <Route path="/PubertyBookingForm" element={<PubertyBookingForm />} />
            <Route path="/Contact" element={<Contact />} />
          </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
    
  );
}

export default App;