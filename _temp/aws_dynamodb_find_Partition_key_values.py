#aws_dynamodb_find_Partition_key_values.py
import boto3
import os
import json
import random
from botocore.exceptions import ClientError

AWS_CLI_profile = 'NLU'
REGION = 'eu-central-1'
table_name = 'QuizTable'
Partition_key = 'ExamID' # (String)
#exam_id = 'SAP-C02'
Sort_key = 'QuestionID' # (String)
# print all unique Partition_key values in the DynamoDB table
session = boto3.Session(profile_name=AWS_CLI_profile.lower())   
dynamodb = session.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(table_name)
response = table.scan(ProjectionExpression=Partition_key)
items = response.get('Items', [])
partition_key_values = set()
for item in items:
    partition_key_values.add(item[Partition_key])
print("Unique Partition Key values:")
for value in partition_key_values:
    print(value)