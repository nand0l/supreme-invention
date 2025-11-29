import boto3
import json
from decimal import Decimal
from botocore.exceptions import ClientError

AWS_CLI_PROFILE = 'NLU'
REGION = 'eu-central-1'
TABLE_NAME = 'QuizTableTest'
JSON_FILE = 'SAP-C09_items.json'  # Change if needed

# Convert floats/ints back to Decimal for DynamoDB
def convert_to_decimal(obj):
    if isinstance(obj, float) or isinstance(obj, int):
        return Decimal(str(obj))
    return obj

def load_items_from_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def import_items_to_dynamodb(items, table):
    for item in items:
        # Convert numeric values to Decimal
        item = {k: convert_to_decimal(v) for k, v in item.items()}
        try:
            table.put_item(Item=item)
            print(f"Inserted item: {item.get('QuestionID', 'Unknown')}")
        except ClientError as e:
            print(f"Error inserting item: {e.response['Error']['Message']}")

def main():
    session = boto3.Session(profile_name=AWS_CLI_PROFILE.lower())
    dynamodb = session.resource('dynamodb', region_name=REGION)
    table = dynamodb.Table(TABLE_NAME)

    items = load_items_from_json(JSON_FILE)
    print(f"Loaded {len(items)} items from {JSON_FILE}")
    import_items_to_dynamodb(items, table)

if __name__ == "__main__":
    main()