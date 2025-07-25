# Generated by Django 5.2.4 on 2025-07-24 19:10

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('birth_date', models.DateField()),
                ('phone_number', models.CharField(max_length=20)),
                ('address', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='MedicalExamination',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('examination_type', models.CharField(max_length=200)),
                ('examination_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('notes', models.TextField(blank=True)),
                ('is_paid', models.BooleanField(default=False)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='examinations', to='payments.patient')),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('payment_method', models.CharField(choices=[('CASH', 'Espèces'), ('CHECK', 'Chèque'), ('CARD', 'Carte Bancaire'), ('MOBILE', 'Mobile Money'), ('TRANSFER', 'Virement Bancaire'), ('OTHER', 'Autre')], default='CASH', max_length=10)),
                ('payment_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('notes', models.TextField(blank=True)),
                ('invoice_number', models.CharField(editable=False, max_length=20, unique=True)),
                ('examination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='payments.medicalexamination')),
            ],
        ),
    ]
