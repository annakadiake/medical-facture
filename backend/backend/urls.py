from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from payments.views import PaymentListCreateView, PaymentRetrieveView, GenerateInvoiceView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/payments/', PaymentListCreateView.as_view(), name='payment-list'),
    path('api/payments/<uuid:pk>/', PaymentRetrieveView.as_view(), name='payment-detail'),
    path('api/payments/<uuid:pk>/invoice/', GenerateInvoiceView.as_view(), name='generate-invoice'),
]