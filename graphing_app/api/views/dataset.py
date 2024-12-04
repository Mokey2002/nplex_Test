from api.models import Dataset, UmapPlotPoint,Sample
from api.serializers import DatasetSerializer, UmapPlotPointSerializer, SampleSerializer
from rest_framework import viewsets
from rest_framework import response
from rest_framework.decorators import action
from rest_framework.response import Response

class DatasetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer

class UmaPlotPointViewSet(viewsets.ReadOnlyModelViewSet):
    #queryset = UmapPlotPoint.objects.all()
    serializer_class = UmapPlotPointSerializer


    def get_queryset(self):
            """
            Retrieve UMAP points filtered by dataset ID.
            """
            dataset_id = self.request.query_params.get('id')

            if dataset_id is None:
                return UmapPlotPoint.objects.none()

            samples = Sample.objects.filter(dataset_id=dataset_id)
            queryset = UmapPlotPoint.objects.filter(sample__in=samples)
            
            return queryset

class SampleViewSet(viewsets.ReadOnlyModelViewSet):
    #queryset = Sample.objects.all()
    #serializer_class = SampleSerializer
        
    serializer_class = SampleSerializer

    def get_queryset(self):
        # Get query parameters from the request
        id = self.request.query_params.get('id', None)
        #queryset = Sample.objects.all().select_related('dataset')
        queryset = Sample.objects.filter(
            dataset_id=id
        )
        #
        #tb2 = UmapPlotPoint.objects.filter( sample= queryset)
        #print(dataset_id)
        #if dataset_id:
        #    queryset = queryset.filter(dataset_id=dataset_id)

        return queryset
  