from rest_framework import serializers
from api.models import Dataset, UmapPlotPoint,Sample


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ["id", "name"]

class UmapPlotPointSerializer(serializers.ModelSerializer):

    class Meta:
        model = UmapPlotPoint
        fields = ["id","x_coor","y_coor","sample_id"]


class SampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sample
        fields = ["id","plate_barcode","dataset_id","well_id","metadata"]
