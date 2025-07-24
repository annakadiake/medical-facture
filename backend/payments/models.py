

# Create your models here.
from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
import uuid

class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birth_date = models.DateField()
    phone_number = models.CharField(max_length=20)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class MedicalExamination(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='examinations')
    examination_type = models.CharField(max_length=200)
    examination_date = models.DateTimeField(default=timezone.now)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    notes = models.TextField(blank=True)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.examination_type} - {self.patient}"

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('CASH', 'Espèces'),
        ('CHECK', 'Chèque'),
        ('CARD', 'Carte Bancaire'),
        ('MOBILE', 'Mobile Money'),
        ('TRANSFER', 'Virement Bancaire'),
        ('OTHER', 'Autre'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    examination = models.ForeignKey(MedicalExamination, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='CASH')
    payment_date = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True)
    invoice_number = models.CharField(max_length=20, unique=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # Format: INV-YYYYMMDD-XXXX
            date_part = timezone.now().strftime('%Y%m%d')
            last_invoice = Payment.objects.filter(invoice_number__startswith=f'INV-{date_part}').order_by('invoice_number').last()
            if last_invoice:
                last_seq = int(last_invoice.invoice_number.split('-')[-1])
                new_seq = last_seq + 1
            else:
                new_seq = 1
            self.invoice_number = f'INV-{date_part}-{new_seq:04d}'
        
        super().save(*args, **kwargs)
        
        # Update examination payment status
        total_paid = sum(p.amount for p in self.examination.payments.all())
        if total_paid >= self.examination.price:
            self.examination.is_paid = True
            self.examination.save()

    def __str__(self):
        return f"Payment {self.invoice_number} - {self.amount} {self.get_payment_method_display()}"