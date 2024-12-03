from django.urls import path, include
from rest_framework import routers
from api.views.dataset import DatasetViewSet, UmaPlotPointViewSet

router = routers.DefaultRouter()
router.register(r"dataset", DatasetViewSet, basename="dataset")
router.register(r"UmaPlotPoint", UmaPlotPointViewSet, basename="UmaPlotPoint")

urlpatterns = [path("api/", include(router.urls))]
