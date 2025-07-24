from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from io import BytesIO
from .models import Payment, MedicalExamination
from .serializers import PaymentSerializer, CreatePaymentSerializer

class PaymentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreatePaymentSerializer
        return PaymentSerializer
    
    def get_queryset(self):
        return Payment.objects.all().order_by('-payment_date')

class PaymentRetrieveView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class GenerateInvoiceView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Payment.objects.all()
    
    def get(self, request, *args, **kwargs):
        payment = self.get_object()
        
        # Render HTML template
        html_string = render_to_string('invoice_template.html', {
            'payment': payment,
            'examination': payment.examination,
            'patient': payment.examination.patient,
            'clinic_info': {
                'name': "Cabinet d'Imagerie Médicale",
                'address': "123 Rue de la Santé, Ville",
                'phone': "+123 456 7890",
                'email': "contact@clinique.com",
                'tax_id': "123456789",
            }
        })
        
        # Generate PDF
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_bytes = html.write_pdf()
        
        # Create response
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Facture_{payment.invoice_number}.pdf"'
        return response