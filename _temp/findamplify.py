import boto3

github_origin = "https://github.com/nand0l/codecademy-bootcamp-AIF-C01.git"
regions = ['eu-central-1', 'eu-west-1', 'us-east-1', 'eu-north-1']  # Frankfurt, Ireland, N. Virginia, Stockholm

profiles = boto3.Session().available_profiles
print(f"Profiles: {', '.join(profiles)}\n")

found = False

for profile in profiles:
    for region in regions:
        try:
            session = boto3.Session(profile_name=profile)
            amplify = session.client('amplify', region_name=region)
            apps = amplify.list_apps()['apps']
            for app in apps:
                if app.get('repository') in [github_origin, github_origin.rstrip('.git')]:
                    print(f"Found: {app['name']} (ID: {app['appId']}) in {region} (profile: {profile})")
                    found = True
        except Exception as e:
            pass

if not found:
    print("Repository not found in any Amplify app")