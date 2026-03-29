from . import views
from django.urls import path

urlpatterns = [
    path("experience/<int:id>", views.ExperienceView.as_view(), name="experience"),
    path(
        "experience/category/<str:category>/",
        views.ExperienceCategoryView.as_view(),
        name="experience_category",
    ),
    path("location/", views.LocationView.as_view(), name="location"),
    path("experiences/", views.ExperienceListView.as_view(), name="experinence_list"),
    path("booking/create/",views.CreateBookingView.as_view(),name="createbooking"),
    path("payments/create/",views.CreatePaymentView.as_view(),name="createpayment"),# return json file
    path("payments/create/page/",views.CreatePaymentPageView.as_view(),name="paymentpage"), #returns html page
    path("payments/verify/",views.VerifyPaymentView.as_view(), name="verifypayment"),
    path("payments/webhook/", views.RazorpayWebhookView.as_view(), name="razorpay_webhook"),
    path("category/<int:id>", views.CategoryView.as_view(), name="category"),
    path("location/", views.LocationListView.as_view(), name="location"),
    path("location/<int:id>", views.CategoryView.as_view(), name="category"),
    path("experiences/", views.ExperienceListView.as_view(), name="experinence_list"),
    path("signup/", views.SignupView.as_view(), name="signup"),
    path("home/", views.HomeView.as_view(), name="Home_page"),
]
