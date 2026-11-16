from django.urls import path
from .views import (
    TrackVisitView,
    SimulateVisitorsView,
    VisitorAnalyticsView
)

urlpatterns = [
    path("track/", TrackVisitView.as_view(), name="track-visit"),
    path("simulate/", SimulateVisitorsView.as_view(), name="simulate-visitors"),
    path("stats/", VisitorAnalyticsView.as_view(), name="visitor-stats"),
]