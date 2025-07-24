from rest_framework import serializers
from .models import Patient, MedicalExamination, Payment

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class MedicalExaminationSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    
    class Meta:
        model = MedicalExamination
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    examination = MedicalExaminationSerializer()
    
    class Meta:
        model = Payment
        fields = '__all__'

class CreatePaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['examination', 'amount', 'payment_method', 'notes']