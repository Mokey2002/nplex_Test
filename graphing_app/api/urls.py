from django.urls import path, include
from rest_framework import routers
from api.views.dataset import DatasetViewSet, UmaPlotPointViewSet, SampleViewSet

router = routers.DefaultRouter()
router.register(r"dataset", DatasetViewSet, basename="dataset")
router.register(r"UmaPlotPoint", UmaPlotPointViewSet, basename="UmaPlotPoint")
router.register(r"Sample", SampleViewSet, basename="SampleViewSet")

urlpatterns = [path("api/", include(router.urls))]
