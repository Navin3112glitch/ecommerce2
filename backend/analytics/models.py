from django.db import models


class Visitor(models.Model):
    ip_address = models.GenericIPAddressField()
    country = models.CharField(max_length=100, default="Unknown")
    city = models.CharField(max_length=100, blank=True, null=True)
    visited_at = models.DateTimeField(auto_now_add=True)
    is_simulated = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.ip_address} - {self.country}"