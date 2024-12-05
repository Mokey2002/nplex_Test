from django.urls import path, include
from rest_framework import routers
from api.views.dataset import DatasetViewSet, UmaPlotPointViewSet, SampleViewSet, MetaDataViewSet,SignalsViewSet

router = routers.DefaultRouter()
router.register(r"dataset", DatasetViewSet, basename="dataset")
router.register(r"UmaPlotPoint", UmaPlotPointViewSet, basename="UmaPlotPoint")
router.register(r"Sample", SampleViewSet, basename="SampleViewSet")
router.register(r"MetaData", MetaDataViewSet, basename="MetaDataViewSet")
router.register(r"Signals", SignalsViewSet, basename="SignalsViewSet")

urlpatterns = [path("api/", include(router.urls))]
