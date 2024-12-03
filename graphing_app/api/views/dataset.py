from api.models import Dataset, UmapPlotPoint
from api.serializers import DatasetSerializer, UmapPlotPointSerializer
from rest_framework import viewsets


class DatasetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer

class UmaPlotPointViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UmapPlotPoint.objects.all()
    serializer_class = UmapPlotPointSerializer
