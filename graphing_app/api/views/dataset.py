from api.models import Dataset, UmapPlotPoint,Sample, SampleSignal, Target
from api.serializers import DatasetSerializer, UmapPlotPointSerializer, SampleSerializer
from django.db.models import F, Q, Value
from rest_framework import viewsets
from rest_framework import response
from rest_framework.decorators import action
from rest_framework.response import Response
import orjson
from django.db.models.functions import Coalesce
from django.db.models import FloatField

from django.db.models import Prefetch


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
  
class MetaDataViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UmapPlotPointSerializer

    def get_queryset(self):
        """
        Retrieve UMAP points filtered by dataset ID and metadata.
        """
        dataset_id = self.request.query_params.get('id')
        metadata_filter = self.request.query_params.get('metadata', None)

        if dataset_id is None:
            return UmapPlotPoint.objects.none()

        # Filter samples based on dataset ID
        samples = Sample.objects.filter(dataset_id=dataset_id)
        #print(metadata_filter)
        # Apply metadata filtering if provided
        if metadata_filter:
            try:
                # Parse metadata filter as JSON
                metadata_filter_dict = orjson.loads(metadata_filter)
                print(metadata_filter)
                # Filter samples manually in Python
                samples = [
                    sample for sample in samples
                    if all(sample.metadata.get(key) == value for key, value in metadata_filter_dict.items())
                ]
                print(samples)
            except orjson.JSONDecodeError:
                return UmapPlotPoint.objects.none() 
        # Get sample IDs after Python-based filtering
        sample_ids = [sample.id for sample in samples]

        # Filter UMAP plot points based on filtered samples
        queryset = UmapPlotPoint.objects.filter(sample_id__in=sample_ids)


        return queryset
    
class SignalsViewSet(viewsets.ReadOnlyModelViewSet):
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

    @action(detail=False, methods=["get"])
    def with_signals(self, request):
        """
        Retrieve UMAP plot points colored by signal levels for a specific target,
        filtered by metadata.
        """
        dataset_id = request.query_params.get('id')
        target_name = request.query_params.get('target')
        metadata_filter = request.query_params.get('metadata')

        if not dataset_id or not target_name:
            return Response({"error": "Both 'id' and 'target' are required."}, status=400)

        # Fetch the target object
        try:
            target = Target.objects.get(name=target_name)
        except Target.DoesNotExist:
            return Response({"error": f"Target '{target_name}' does not exist."}, status=404)

        # Filter samples for the given dataset
        samples = Sample.objects.filter(dataset_id=dataset_id)

        # Apply metadata filtering if provided
        if metadata_filter:
            try:
                metadata_filter_dict = orjson.loads(metadata_filter)
                samples = samples.filter(
                    **{f"metadata__{key}": value for key, value in metadata_filter_dict.items()}
                )
            except orjson.JSONDecodeError:
                return Response({"error": "Invalid metadata filter format."}, status=400)

        # Get signals for the target and the filtered samples
        signals = SampleSignal.objects.filter(target=target, sample__in=samples)

        # Use signals to map signal values to their respective samples
        signal_map = {signal.sample_id: signal.signal for signal in signals}

        # Fetch UMAP points and attach signal values
        umap_points = UmapPlotPoint.objects.filter(sample__in=samples).values("x_coor", "y_coor", "sample_id")
        for point in umap_points:
            point["signal"] = signal_map.get(point["sample_id"], 0.0)

        return Response(list(umap_points), status=200)

            
            
        