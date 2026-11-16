import json
import random
import ipaddress

from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

from django.db.models import Count

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Visitor


SAMPLE_IPS = [
    "8.8.8.8",
    "1.1.1.1",
    "114.114.114.114",
    "77.88.8.8",
    "94.140.14.14",
    "208.67.222.222",
]


def get_public_ip():
    """
    Detect the public IP address of the machine
    running the Django backend.
    """
    try:
        url = "https://api.ipify.org?format=json"

        request = Request(
            url,
            headers={"User-Agent": "QuickKart-Analytics/1.0"}
        )

        with urlopen(request, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))

        public_ip = data.get("ip")

        if public_ip:
            address = ipaddress.ip_address(public_ip)

            if address.is_global:
                return str(address)

    except Exception as error:
        print("Public IP detection error:", error)

    return None


def get_ip_location(ip):
    """
    Get country and city information for a public IP.
    """
    try:
        address = ipaddress.ip_address(ip)

        if not address.is_global:
            return "Local Network", "Localhost"

        url = f"https://ipwho.is/{ip}"

        request = Request(
            url,
            headers={"User-Agent": "QuickKart-Analytics/1.0"}
        )

        with urlopen(request, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))

        if data.get("success"):
            return (
                data.get("country", "Unknown"),
                data.get("city", "Unknown")
            )

    except Exception as error:
        print("Geolocation error:", error)

    return "Unknown", "Unknown"


def get_client_ip(request):
    """
    Obtain the visitor IP address.
    """
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")

    if forwarded_for:
        ip = forwarded_for.split(",")[0].strip()
    else:
        ip = request.META.get("REMOTE_ADDR", "127.0.0.1")

    try:
        return str(ipaddress.ip_address(ip))
    except ValueError:
        return "127.0.0.1"


def resolve_visitor_location(ip):
    """
    Resolve visitor IP and location.

    If the incoming IP is private or localhost,
    use the public IP of the Django server's
    internet connection as a fallback.
    """

    try:
        address = ipaddress.ip_address(ip)

        if not address.is_global:
            print("Private IP detected:", ip)

            public_ip = get_public_ip()

            if public_ip:
                ip = public_ip
                print("Using public IP:", ip)
            else:
                return ip, "Local Network", "Localhost"

        country, city = get_ip_location(ip)

        return ip, country, city

    except Exception as error:
        print("Visitor location error:", error)

        return ip, "Unknown", "Unknown"


class TrackVisitView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        # Get incoming visitor IP
        ip = get_client_ip(request)

        # Resolve public IP and geographical location
        ip, country, city = resolve_visitor_location(ip)

        # Save visitor in database
        visitor = Visitor.objects.create(
            ip_address=ip,
            country=country,
            city=city,
            is_simulated=False
        )

        return Response({
            "message": "Real visitor tracked successfully",
            "ip_address": visitor.ip_address,
            "country": visitor.country,
            "city": visitor.city,
            "is_simulated": visitor.is_simulated
        })


class SimulateVisitorsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        selected_ips = random.sample(SAMPLE_IPS, 5)

        for ip in selected_ips:

            country, city = get_ip_location(ip)

            Visitor.objects.create(
                ip_address=ip,
                country=country,
                city=city,
                is_simulated=True
            )

        return Response({
            "message": "5 simulated visitors created successfully"
        })


class VisitorAnalyticsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        total_visitors = Visitor.objects.count()

        real_visitors = Visitor.objects.filter(
            is_simulated=False
        ).count()

        simulated_visitors = Visitor.objects.filter(
            is_simulated=True
        ).count()

        country_stats = (
            Visitor.objects
            .values("country")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        recent_visitors = Visitor.objects.order_by("-visited_at")[:20]

        recent_data = []

        for visitor in recent_visitors:

            recent_data.append({
                "id": visitor.id,
                "ip_address": visitor.ip_address,
                "country": visitor.country,
                "city": visitor.city,
                "visited_at": visitor.visited_at.isoformat(),
                "is_simulated": visitor.is_simulated
            })

        return Response({
            "total_visitors": total_visitors,
            "real_visitors": real_visitors,
            "simulated_visitors": simulated_visitors,
            "country_stats": list(country_stats),
            "recent_visitors": recent_data
        })