from django.db import models

# Create your models here.
class UserModel(models.Model):
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    user_type = models.CharField(max_length=100, default="visitor")

    def __str__(self):
        return self.name

class CarModel(models.Model):
    year = models.CharField(max_length=100)
    name = models.CharField(max_length=100)