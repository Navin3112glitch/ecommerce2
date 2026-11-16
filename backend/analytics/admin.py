from django.contrib import admin
from .models import Visitor


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = (
        'ip_address',
        'country',
        'city',
        'visited_at',
        'is_simulated'
    )

    list_filter = ('country', 'is_simulated')
    search_fields = ('ip_address', 'country', 'city')