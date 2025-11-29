#aws_dynamodb.py
import boto3
import os
import json
import random
from botocore.exceptions import ClientError

AWS_CLI_profile = 'NLU'
REGION = 'eu-central-1'
table_name = 'QuizTable'
Partition_key = 'ExamID' # (String)
exam_id = 'SAP-C02'
Sort_key = 'QuestionID' # (String)
source_folder = r'C:\Users\NOLUTGERINK\Downloads'
processed_folder = os.path.join(source_folder, 'dynamodb_processed')
# Create processed folder if it does not exist in the sourcefolder

# I want to move processed files here, create the folder if it does not exist
if not os.path.exists(processed_folder):
    os.makedirs(processed_folder)
# list al files starting with nova- in the file name if nova- is followed by output ignore the files starting with nova-output
file_prefix = 'nova-'
file_ignore = ['nova-output', 'nova-lambda', 'nova-results']

session = boto3.Session(profile_name=AWS_CLI_profile.lower())
dynamodb = session.resource('dynamodb', region_name=REGION)
table = dynamodb.Table(table_name)

files = [f for f in os.listdir(source_folder) if f.startswith(file_prefix) and not any(ignore in f for ignore in file_ignore)]
print(f"Files found: {files}")

for file_name in files:
    file_path = os.path.join(source_folder, file_name)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        item = json.load(f)
    
    item['ExamID']['S'] = exam_id
    question_id = item['QuestionID']['S']
    
    try:
        table.get_item(Key={Partition_key: exam_id, Sort_key: question_id})
        question_id = str(random.randint(1000, 5000))
        item['QuestionID']['S'] = question_id
        print(f"Duplicate found, new QuestionID: {question_id}")
    except ClientError:
        pass
    
    table.put_item(Item={
        Partition_key: item['ExamID']['S'],
        Sort_key: item['QuestionID']['S'],
        'CorrectAnswerIndices': [int(x['N']) for x in item['CorrectAnswerIndices']['L']],
        'Explanation': item['Explanation']['S'],
        'Identifier': item['Identifier']['S'],
        'Options': [x['S'] for x in item['Options']['L']],
        'QuestionText': item['QuestionText']['S']
    })
    
    # Update filename with new QuestionID
    new_file_name = f"nova-{item['QuestionID']['S']}.md"
    processed_path = os.path.join(processed_folder, new_file_name)
    if os.path.exists(processed_path):
        name, ext = os.path.splitext(new_file_name)
        random_suffix = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=3))
        new_file_name = f"{name}-{random_suffix}{ext}"
        processed_path = os.path.join(processed_folder, new_file_name)
    
    # Save updated item to file
    with open(processed_path, 'w', encoding='utf-8') as f:
        json.dump(item, f, indent=2)
    
    os.remove(file_path)
    print(f"ExamID: {item['ExamID']['S']}, QuestionID: {item['QuestionID']['S']}, File: {new_file_name}")