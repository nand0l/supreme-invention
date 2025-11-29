#aws_dynamodb_find_Partition_key_values.py
import boto3
import os
import json
import random
from decimal import Decimal
from botocore.exceptions import ClientError

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

AWS_CLI_profile = 'NLU'
REGION = 'eu-central-1'
table_name = 'QuizTable'
Partition_key = 'ExamID' # (String)
exam_id = 'SAP-C02'
Sort_key = 'QuestionID' # (String)
session = boto3.Session(profile_name=AWS_CLI_profile.lower())   
dynamodb = session.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(table_name)
# I want to do query to find all items with the Partition_key value equal to exam_id
response = table.query(
    KeyConditionExpression=boto3.dynamodb.conditions.Key(Partition_key).eq(exam_id)
)
# I want to save all found items into a textfile in json format
with open(f'{exam_id}_items.json', 'w', encoding='utf-8') as f:
    json.dump(response['Items'], f, indent=4, default=decimal_default)   
    print(f"Saved {len(response['Items'])} items to {exam_id}_items.json")
    # I want to print all found items the questionID to the console
    for item in response['Items']:
        print(item)