# Generated by Django 3.1.2 on 2020-10-24 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('arrhythmias', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermodel',
            name='user_type',
            field=models.CharField(default='visitor', max_length=100),
        ),
    ]
