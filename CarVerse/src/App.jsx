import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

// Lazy loading all pages
const HomePage = React.lazy(() => import('./Pages/HomePage'))
const LoginPage = React.lazy(() => import('./Pages/LoginPage'))
const RegisterPage = React.lazy(() => import('./Pages/RegisterPage'))
const AboutPage = React.lazy(() => import('./Pages/AboutPage'))
const FeaturesPage = React.lazy(() => import('./Pages/FeaturesPage'))
const ServicePage = React.lazy(() => import('./Pages/ServicePage'))
const CarsPage = React.lazy(() => import('./Pages/CarsPage'))
const CarDetailsPage = React.lazy(() => import('./Pages/CarDetailsPage'))
const TestimonialPage = React.lazy(() => import('./Pages/TestimonialPage'))
const ContactUsPage = React.lazy(() => import('./Pages/ContactUsPage'))
const PrivacyPolicyPage = React.lazy(() => import('./Pages/PrivacyPolicyPage'))
const TermsAndConditions = React.lazy(() => import('./Pages/TermsAndConditions'))
const ErrorPage = React.lazy(() => import('./Pages/ErrorPage'))
const FaqPage = React.lazy(() => import('./Pages/FaqPage'))

// User Dashboard
const Dashboard = React.lazy(() => import('./Pages/User/Dashboard'))
const MyBookingsPage = React.lazy(() => import('./Pages/User/MyBookingsPage'))
const BookingDetails = React.lazy(() => import('./Pages/User/BookingDetails'))
const MyWishlistPage = React.lazy(() => import('./Pages/User/MyWishlistPage'))

// Admin 
const AdminLoginPage = React.lazy(() => import('./Pages/Admin/AdminLoginPage'))
const AdminHomePage = React.lazy(() => import('./Pages/Admin/AdminHomePage'))
const AdminAnalyticsPage = React.lazy(() => import('./Pages/Admin/AdminAnalyticsPage'))
const AdminUserPage = React.lazy(() => import('./Pages/Admin/User/AdminUserPage'))
const AdminBookingPage = React.lazy(() => import('./Pages/Admin/Booking/AdminBookingPage'))
const AdminPaymentPage = React.lazy(() => import('./Pages/Admin/Payment/AdminPaymentPage'))
const AdminReviewPage = React.lazy(() => import('./Pages/Admin/Review/AdminReviewPage'))

const AdminCategoryPage = React.lazy(() => import('./Pages/Admin/Category/AdminCategoryPage'))
const AdminCreateCategoryPage = React.lazy(() => import('./Pages/Admin/Category/AdminCreateCategoryPage'))
const AdminUpdateCategoryPage = React.lazy(() => import('./Pages/Admin/Category/AdminUpdateCategoryPage'))

const AdminBrandPage = React.lazy(() => import('./Pages/Admin/Brand/AdminBrandPage'))
const AdminCreateBrandPage = React.lazy(() => import('./Pages/Admin/Brand/AdminCreateBrandPage'))
const AdminUpdateBrandPage = React.lazy(() => import('./Pages/Admin/Brand/AdminUpdateBrandPage'))

const AdminFeaturePage = React.lazy(() => import('./Pages/Admin/Feature/AdminFeaturePage'))
const AdminCreateFeaturePage = React.lazy(() => import('./Pages/Admin/Feature/AdminCreateFeaturePage'))
const AdminUpdateFeaturePage = React.lazy(() => import('./Pages/Admin/Feature/AdminUpdateFeaturePage'))

const AdminServicePage = React.lazy(() => import('./Pages/Admin/Service/AdminServicePage'))
const AdminCreateServicePage = React.lazy(() => import('./Pages/Admin/Service/AdminCreateServicePage'))
const AdminUpdateServicePage = React.lazy(() => import('./Pages/Admin/Service/AdminUpdateServicePage'))

const AdminFaqPage = React.lazy(() => import('./Pages/Admin/Faq/AdminFaqPage'))
const AdminCreateFaqPage = React.lazy(() => import('./Pages/Admin/Faq/AdminCreateFaqPage'))
const AdminUpdateFaqPage = React.lazy(() => import('./Pages/Admin/Faq/AdminUpdateFaqPage'))

const AdminSettingPage = React.lazy(() => import('./Pages/Admin/Setting/AdminSettingPage'))

const AdminCarPage = React.lazy(() => import('./Pages/Admin/Car/AdminCarPage'))
const AdminCreateCarPage = React.lazy(() => import('./Pages/Admin/Car/AdminCreateCarPage'))
const AdminUpdateCarPage = React.lazy(() => import('./Pages/Admin/Car/AdminUpdateCarPage'))

import AdminProtectedRoute from './Components/AdminProtectedRoute'
import ErrorBoundary from './Components/ErrorBoundary'

// Global Loading Spinner Component
const LoadingSpinner = () => (
    <div className="container-fluid py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
)

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path='' element={<HomePage />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/register' element={<RegisterPage />} />
                        <Route path='/about' element={<AboutPage />} />
                        <Route path='/feature' element={<FeaturesPage />} />
                        <Route path='/service' element={<ServicePage />} />
                        <Route path='/car' element={<CarsPage />} />
                        <Route path='/car/:id' element={<CarDetailsPage />} />
                        <Route path='/faq' element={<FaqPage />} />
                        <Route path='/testimonial' element={<TestimonialPage />} />
                        <Route path='/contact' element={<ContactUsPage />} />
                        <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
                        <Route path='/tc' element={<TermsAndConditions />} />

                        {/* User Dashboard Routes */}
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/dashboard/settings' element={<Dashboard />} />
                        <Route path='/dashboard/bookings' element={<MyBookingsPage />} />
                        <Route path='/dashboard/bookings/:id' element={<BookingDetails />} />
                        <Route path='/dashboard/wishlist' element={<MyWishlistPage />} />

                        {/* Admin Routes */}
                        <Route path='/admin/login' element={<AdminLoginPage />} />

                        <Route path='/admin' element={<AdminProtectedRoute><AdminHomePage /></AdminProtectedRoute>} />
                        <Route path='/admin/analytics' element={<AdminProtectedRoute><AdminAnalyticsPage /></AdminProtectedRoute>} />

                        <Route path='/admin/user' element={<AdminProtectedRoute><AdminUserPage /></AdminProtectedRoute>} />
                        <Route path='/admin/users' element={<AdminProtectedRoute><AdminUserPage /></AdminProtectedRoute>} />

                        <Route path='/admin/booking' element={<AdminProtectedRoute><AdminBookingPage /></AdminProtectedRoute>} />
                        <Route path='/admin/bookings' element={<AdminProtectedRoute><AdminBookingPage /></AdminProtectedRoute>} />

                        <Route path='/admin/payment' element={<AdminProtectedRoute><AdminPaymentPage /></AdminProtectedRoute>} />
                        <Route path='/admin/payments' element={<AdminProtectedRoute><AdminPaymentPage /></AdminProtectedRoute>} />

                        <Route path='/admin/review' element={<AdminProtectedRoute><AdminReviewPage /></AdminProtectedRoute>} />
                        <Route path='/admin/reviews' element={<AdminProtectedRoute><AdminReviewPage /></AdminProtectedRoute>} />

                        <Route path='/admin/category' element={<AdminProtectedRoute><AdminCategoryPage /></AdminProtectedRoute>} />
                        <Route path='/admin/category/create' element={<AdminProtectedRoute><AdminCreateCategoryPage /></AdminProtectedRoute>} />
                        <Route path='/admin/category/update/:id' element={<AdminProtectedRoute><AdminUpdateCategoryPage /></AdminProtectedRoute>} />

                        <Route path='/admin/brand' element={<AdminProtectedRoute><AdminBrandPage /></AdminProtectedRoute>} />
                        <Route path='/admin/brand/create' element={<AdminProtectedRoute><AdminCreateBrandPage /></AdminProtectedRoute>} />
                        <Route path='/admin/brand/update/:id' element={<AdminProtectedRoute><AdminUpdateBrandPage /></AdminProtectedRoute>} />

                        <Route path='/admin/feature' element={<AdminProtectedRoute><AdminFeaturePage /></AdminProtectedRoute>} />
                        <Route path='/admin/feature/create' element={<AdminProtectedRoute><AdminCreateFeaturePage /></AdminProtectedRoute>} />
                        <Route path='/admin/feature/update/:id' element={<AdminProtectedRoute><AdminUpdateFeaturePage /></AdminProtectedRoute>} />

                        <Route path='/admin/service' element={<AdminProtectedRoute><AdminServicePage /></AdminProtectedRoute>} />
                        <Route path='/admin/service/create' element={<AdminProtectedRoute><AdminCreateServicePage /></AdminProtectedRoute>} />
                        <Route path='/admin/service/update/:id' element={<AdminProtectedRoute><AdminUpdateServicePage /></AdminProtectedRoute>} />

                        <Route path='/admin/faq' element={<AdminProtectedRoute><AdminFaqPage /></AdminProtectedRoute>} />
                        <Route path='/admin/faq/create' element={<AdminProtectedRoute><AdminCreateFaqPage /></AdminProtectedRoute>} />
                        <Route path='/admin/faq/update/:id' element={<AdminProtectedRoute><AdminUpdateFaqPage /></AdminProtectedRoute>} />

                        <Route path='/admin/setting' element={<AdminProtectedRoute><AdminSettingPage /></AdminProtectedRoute>} />

                        <Route path='/admin/car' element={<AdminProtectedRoute><AdminCarPage /></AdminProtectedRoute>} />
                        <Route path='/admin/car/create' element={<AdminProtectedRoute><AdminCreateCarPage /></AdminProtectedRoute>} />
                        <Route path='/admin/car/update/:id' element={<AdminProtectedRoute><AdminUpdateCarPage /></AdminProtectedRoute>} />

                        <Route path='/*' element={<ErrorPage />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
            <Footer />
            <ToastContainer />
        </BrowserRouter>
    )
}