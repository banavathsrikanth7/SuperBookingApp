from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.contrib.auth.models import User
from user.models import User_Data
from booking.models import Booking

from . import serializers as ContentSerializer
from .serializers import UserDataRegisterSerializer
from .paginations import StandardResultsSetPagination
from content import models as ContentModel


class CategoryView(generics.RetrieveAPIView):
    serializer_class = ContentSerializer.CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return ContentModel.Category.objects.filter(id=self.kwargs["id"])


class ExperienceView(generics.RetrieveAPIView):
    serializer_class = ContentSerializer.ExperienceSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return ContentModel.Experience.objects.filter(id=self.kwargs["id"])


class ExperienceListView(generics.ListAPIView):
    serializer_class = ContentSerializer.ExperienceShortSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ContentModel.Experience.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class ExperienceCategoryView(generics.ListAPIView):
    serializer_class = ContentSerializer.ExperienceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_name = self.kwargs["category"]
        return ContentModel.Experience.objects.filter(category_id__name=category_name)


class LocationListView(generics.ListAPIView):
    serializer_class = ContentSerializer.LocationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return ContentModel.Location.objects.all()


class LocationView(generics.ListAPIView):
    serializer_class = ContentSerializer.LocationSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return ContentModel.Location.objects.filter(id=self.kwargs["id"])


class HomeView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]

    def _get_paginated_category_data(
        self, category_name, display_title, request, page_query_param_name
    ):
        page_size = 6
        paginator = StandardResultsSetPagination()
        paginator.page_size = page_size
        paginator.page_query_param = (
            page_query_param_name  # Set the specific query parameter name
        )
        try:
            category = ContentModel.Category.objects.get(name=category_name)
            experiences = category.experiences.filter(deleted_at__isnull=True).order_by(
                "id"
            )

            paginated_experiences = paginator.paginate_queryset(
                experiences, request, view=self
            )
            experiences_serializer = ContentSerializer.ExperienceShortSerializer(
                paginated_experiences, many=True
            )
            return {
                "category": display_title,
                "experiences": experiences_serializer.data,
                "pagination": {
                    "count": paginator.page.paginator.count,
                    "next": paginator.get_next_link(),
                    "previous": paginator.get_previous_link(),
                    "page_size": page_size,
                    "current_page": paginator.page.number,
                },
            }
        except ContentModel.Category.DoesNotExist:
            current_page = int(request.query_params.get(page_query_param_name, 1))
            return {
                "category": display_title,
                "experiences": [],
                "pagination": {
                    "count": 0,
                    "next": None,
                    "previous": None,
                    "page_size": page_size,
                    "current_page": current_page,
                },
            }

    def get(self, request):
        # 1. Continue Booking (for authenticated users)
        if request.user.is_authenticated:
            user_data = User_Data.objects.get(user=request.user)
            pending_bookings = Booking.objects.filter(
                user=user_data, status="pending", deleted_at__isnull=True
            ).order_by("-created_at")
            bookings_serializer = ContentSerializer.BookingSerializer(
                pending_bookings, many=True
            )
            continue_booking = bookings_serializer.data
        else:
            continue_booking = {}

        # 2. Get all locations
        locations = ContentModel.Location.objects.all()
        locations_serializer = ContentSerializer.LocationSerializer(
            locations, many=True
        )

        # 3. Get featured categories experiences with pagination
        featured_categories_config = [
            {"name": "Museum", "title": "Explore Museums"},
            {"name": "Amusement Park", "title": "Explore Amusement Parks"},
        ]
        featured_categories_data = [
            self._get_paginated_category_data(
                config["name"],
                config["title"],
                request,
                f"{config['name'].lower().replace(' ', '_')}_page",
            )
            for config in featured_categories_config
        ]

        # 4. Get all categories with links
        all_categories = ContentModel.Category.objects.all().order_by("name")
        categories_data = []
        for category in all_categories:
            categories_data.append(
                {
                    "id": category.id,
                    "name": category.name,
                    "icon_url": category.icon_url,
                }
            )

        response_data = {
            "continue_booking": continue_booking,
            "explore_locations": {
                "label": "Explore Locations",
                "data": locations_serializer.data,
                "link": reverse("location", request=request),
            },
            "featured_categories": featured_categories_data,
            "all_categories": categories_data,
        }

        return Response(response_data)


class SignupView(generics.CreateAPIView):
    serializer_class = UserDataRegisterSerializer
    permission_classes = [AllowAny]
    queryset = User_Data.objects.all()
